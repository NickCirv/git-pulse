import chalk from 'chalk';
import { git } from './scanner.js';

function getContributorStats(repoPath) {
  const shortlog = git(['shortlog', '-sn', 'HEAD'], repoPath);
  if (!shortlog) return [];

  const lines = shortlog.split('\n').filter(Boolean);
  const totalCommits = lines.reduce((sum, line) => {
    const match = line.trim().match(/^(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const contributors = [];

  for (const line of lines) {
    const match = line.trim().match(/^(\d+)\s+(.+)$/);
    if (!match) continue;

    const commits = parseInt(match[1], 10);
    const name = match[2].trim();

    const linesOut = git(['log', '--author', name, '--pretty=tformat:', '--numstat', 'HEAD'], repoPath);
    let added = 0;
    let removed = 0;

    if (linesOut) {
      for (const l of linesOut.split('\n').filter(Boolean)) {
        const parts = l.split('\t');
        if (parts.length >= 2) {
          added += parseInt(parts[0], 10) || 0;
          removed += parseInt(parts[1], 10) || 0;
        }
      }
    }

    const lastActive = git(['log', '--author', name, '-1', '--format=%ar', 'HEAD'], repoPath) || 'unknown';

    contributors.push({
      name,
      commits,
      added,
      removed,
      lastActive,
      percentage: ((commits / totalCommits) * 100).toFixed(1),
    });
  }

  return { contributors, totalCommits };
}

function barChart(value, max, width = 20) {
  const filled = Math.round((value / max) * width);
  const empty = width - filled;
  return chalk.hex('#22c55e')('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function showContributors(repoPath, topN = 10) {
  console.log();
  console.log(chalk.hex('#22c55e').bold('  Contributors') + chalk.gray('  — ranked by commits'));
  console.log(chalk.gray('  ' + '─'.repeat(70)));

  let data;
  try {
    data = getContributorStats(repoPath);
  } catch (err) {
    console.log(chalk.red(`  Error: ${err.message}`));
    return;
  }

  const { contributors, totalCommits } = data;
  const shown = contributors.slice(0, topN);
  const maxCommits = shown[0]?.commits || 1;

  const rankWidth = 4;
  const nameWidth = 22;
  const barWidth = 20;
  const numWidth = 7;

  console.log(
    chalk.gray('  ' +
      '#'.padEnd(rankWidth) +
      'Name'.padEnd(nameWidth) +
      'Commits'.padEnd(numWidth) +
      'Bar'.padEnd(barWidth + 2) +
      '+Lines'.padEnd(numWidth) +
      '-Lines'.padEnd(numWidth) +
      '%'.padEnd(7) +
      'Last Active'
    )
  );
  console.log(chalk.gray('  ' + '─'.repeat(88)));

  for (let i = 0; i < shown.length; i++) {
    const c = shown[i];
    const rank = chalk.gray(`${i + 1}.`.padEnd(rankWidth));
    const name = chalk.white(c.name.slice(0, nameWidth - 1).padEnd(nameWidth));
    const commits = chalk.hex('#22c55e')(String(c.commits).padEnd(numWidth));
    const bar = barChart(c.commits, maxCommits, barWidth) + '  ';
    const added = chalk.green(('+' + formatNumber(c.added)).padEnd(numWidth));
    const removed = chalk.red(('-' + formatNumber(c.removed)).padEnd(numWidth));
    const pct = chalk.yellow((c.percentage + '%').padEnd(7));
    const last = chalk.gray(c.lastActive);

    console.log(`  ${rank}${name}${commits}${bar}${added}${removed}${pct}${last}`);
  }

  console.log(chalk.gray('  ' + '─'.repeat(88)));
  console.log(chalk.gray(`  ${contributors.length} total contributors · ${totalCommits} total commits`));
  console.log();
}

export { showContributors };
