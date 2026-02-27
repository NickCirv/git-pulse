import chalk from 'chalk';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { git } from './scanner.js';

const CI_FILES = [
  '.github/workflows',
  '.gitlab-ci.yml',
  '.circleci/config.yml',
  'Jenkinsfile',
  '.travis.yml',
  'bitbucket-pipelines.yml',
  '.drone.yml',
];

const TEST_INDICATORS = [
  'test',
  'tests',
  '__tests__',
  'spec',
  'specs',
  '__specs__',
];

const TEST_CONFIG_FILES = [
  'jest.config.js',
  'jest.config.ts',
  'vitest.config.js',
  'vitest.config.ts',
  'mocha.opts',
  '.mocharc.js',
  '.mocharc.yml',
  'pytest.ini',
  'setup.cfg',
  'phpunit.xml',
  'phpunit.xml.dist',
];

function checkHasReadme(repoPath) {
  const candidates = ['README.md', 'README.rst', 'README.txt', 'README', 'readme.md'];
  return candidates.some(f => existsSync(join(repoPath, f)));
}

function checkHasLicense(repoPath) {
  const candidates = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE', 'COPYING'];
  return candidates.some(f => existsSync(join(repoPath, f)));
}

function checkHasTests(repoPath) {
  for (const dir of TEST_INDICATORS) {
    if (existsSync(join(repoPath, dir))) return true;
  }
  for (const file of TEST_CONFIG_FILES) {
    if (existsSync(join(repoPath, file))) return true;
  }
  try {
    const tracked = git(['ls-files'], repoPath);
    if (tracked) {
      const files = tracked.split('\n').filter(Boolean);
      return files.some(f =>
        f.includes('.test.') || f.includes('.spec.') || f.includes('_test.') || f.includes('_spec.')
      );
    }
  } catch {
    // ignore
  }
  return false;
}

function checkHasCI(repoPath) {
  return CI_FILES.some(f => existsSync(join(repoPath, f)));
}

function checkCommitRecency(repoPath) {
  const out = git(['log', '-1', '--format=%aI', 'HEAD'], repoPath);
  if (!out) return 0;
  const lastDate = new Date(out);
  const now = new Date();
  const daysSince = (now - lastDate) / (1000 * 60 * 60 * 24);

  if (daysSince <= 7) return 15;
  if (daysSince <= 30) return 12;
  if (daysSince <= 90) return 8;
  if (daysSince <= 180) return 4;
  return 0;
}

function checkContributorCount(repoPath) {
  const out = git(['shortlog', '-s', 'HEAD'], repoPath);
  if (!out) return 0;
  const count = out.split('\n').filter(Boolean).length;
  if (count >= 5) return 10;
  if (count >= 2) return 7;
  return 3;
}

function checkBranchHygiene(repoPath) {
  const local = git(['branch'], repoPath);
  const merged = git(['branch', '--merged'], repoPath);
  if (!local) return 10;

  const localCount = local.split('\n').filter(Boolean).length;
  const mergedCount = merged ? merged.split('\n').filter(Boolean).filter(l => !l.includes('*')).length : 0;

  if (mergedCount > 5) return 3;
  if (localCount <= 10) return 10;
  if (localCount <= 20) return 7;
  return 4;
}

function checkTagReleases(repoPath) {
  const out = git(['tag'], repoPath);
  if (!out) return 0;
  const count = out.split('\n').filter(Boolean).length;
  if (count >= 3) return 10;
  if (count >= 1) return 6;
  return 0;
}

function checkNoLargeFiles(repoPath) {
  try {
    const out = git(['ls-files'], repoPath);
    if (!out) return 10;

    const files = out.split('\n').filter(Boolean);
    const LARGE_THRESHOLD = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      const fullPath = join(repoPath, file);
      try {
        const st = statSync(fullPath);
        if (st.size > LARGE_THRESHOLD) return 2;
      } catch {
        // file might not exist on disk
      }
    }
    return 10;
  } catch {
    return 10;
  }
}

function scoreBar(score, max = 100, width = 30) {
  const filled = Math.round((score / max) * width);
  const pct = score / max;
  const color = pct >= 0.8 ? '#22c55e' : pct >= 0.6 ? '#eab308' : '#ef4444';
  return chalk.hex(color)('█'.repeat(filled)) + chalk.gray('░'.repeat(width - filled));
}

function checkLabel(pass) {
  return pass ? chalk.green('✔') : chalk.red('✖');
}

function showHealth(repoPath) {
  console.log();
  console.log(chalk.hex('#22c55e').bold('  Repository Health Score'));
  console.log(chalk.gray('  ' + '─'.repeat(55)));

  const checks = {
    hasReadme:       { label: 'Has README',          points: 10, pass: checkHasReadme(repoPath) },
    hasLicense:      { label: 'Has LICENSE',          points: 10, pass: checkHasLicense(repoPath) },
    hasTests:        { label: 'Has tests',            points: 15, pass: checkHasTests(repoPath) },
    hasCI:           { label: 'Has CI config',        points: 10, pass: checkHasCI(repoPath) },
  };

  const recencyScore   = checkCommitRecency(repoPath);
  const contribScore   = checkContributorCount(repoPath);
  const branchScore    = checkBranchHygiene(repoPath);
  const tagScore       = checkTagReleases(repoPath);
  const largeFileScore = checkNoLargeFiles(repoPath);

  let total = 0;
  const maxTotal = 100;

  for (const [, check] of Object.entries(checks)) {
    const earned = check.pass ? check.points : 0;
    total += earned;
    console.log(
      `  ${checkLabel(check.pass)}  ${check.label.padEnd(28)}` +
      chalk.gray(`${earned}/${check.points} pts`)
    );
  }

  const dynamicChecks = [
    { label: 'Commit recency',       score: recencyScore,   max: 15 },
    { label: 'Contributor count',    score: contribScore,   max: 10 },
    { label: 'Branch hygiene',       score: branchScore,    max: 10 },
    { label: 'Tagged releases',      score: tagScore,       max: 10 },
    { label: 'No large files',       score: largeFileScore, max: 10 },
  ];

  for (const c of dynamicChecks) {
    total += c.score;
    const pass = c.score >= c.max * 0.6;
    const ptsLabel = `${c.score}/${c.max} pts`;
    console.log(
      `  ${checkLabel(pass)}  ${c.label.padEnd(28)}` + chalk.gray(ptsLabel)
    );
  }

  console.log(chalk.gray('  ' + '─'.repeat(55)));

  const pct = total / maxTotal;
  const grade = pct >= 0.9 ? 'A+' : pct >= 0.8 ? 'A' : pct >= 0.7 ? 'B' : pct >= 0.6 ? 'C' : 'D';
  const gradeColor = pct >= 0.8 ? '#22c55e' : pct >= 0.6 ? '#eab308' : '#ef4444';

  console.log();
  console.log(`  ${scoreBar(total, maxTotal)} ${chalk.white.bold(total + '/100')} ${chalk.hex(gradeColor).bold(grade)}`);
  console.log();

  if (total < 50) {
    console.log(chalk.yellow('  Suggestions:'));
    if (!checks.hasReadme.pass)  console.log(chalk.gray('   · Add a README.md to document your project'));
    if (!checks.hasLicense.pass) console.log(chalk.gray('   · Add a LICENSE file to clarify usage rights'));
    if (!checks.hasTests.pass)   console.log(chalk.gray('   · Add tests (jest, vitest, pytest, etc.)'));
    if (!checks.hasCI.pass)      console.log(chalk.gray('   · Set up CI (GitHub Actions, CircleCI, etc.)'));
    if (tagScore === 0)          console.log(chalk.gray('   · Tag your releases (git tag v1.0.0)'));
    console.log();
  }
}

export { showHealth };
