import chalk from 'chalk';
import { scanRepo } from './scanner.js';
import { showActivity } from './activity.js';
import { showHealth } from './health.js';

function formatDate(date) {
  if (!date) return 'unknown';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function miniBar(value, max, width = 12) {
  if (max === 0) return chalk.gray('░'.repeat(width));
  const filled = Math.min(width, Math.round((value / max) * width));
  return chalk.hex('#22c55e')('█'.repeat(filled)) + chalk.gray('░'.repeat(width - filled));
}

function header(text, width = 60) {
  const pad = Math.max(0, width - text.length - 4);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return (
    chalk.gray('  ╭' + '─'.repeat(width - 2) + '╮') + '\n' +
    chalk.gray('  │ ') + chalk.hex('#22c55e').bold('  ' + ' '.repeat(left) + text + ' '.repeat(right) + '  ') + chalk.gray(' │') + '\n' +
    chalk.gray('  ╰' + '─'.repeat(width - 2) + '╯')
  );
}

function sectionTitle(text) {
  return '\n' + chalk.hex('#22c55e').bold(`  ${text}`) + '\n' + chalk.gray('  ' + '─'.repeat(50));
}

function row(label, value, extra = '') {
  const labelStr = chalk.gray(label.padEnd(26));
  const valueStr = chalk.white(String(value));
  const extraStr = extra ? chalk.gray('  ' + extra) : '';
  return `  ${labelStr}${valueStr}${extraStr}`;
}

function divider() {
  return chalk.gray('  ' + '─'.repeat(50));
}

function runDashboard(repoPath) {
  let stats;
  try {
    stats = scanRepo(repoPath);
  } catch (err) {
    console.error(chalk.red(`\n  Error: ${err.message}\n`));
    process.exit(1);
  }

  console.log();
  console.log(header(`git-pulse · ${stats.repoName}`, 60));
  console.log();

  console.log(sectionTitle('Overview'));
  console.log(row('Repository', stats.repoName));
  console.log(row('Current Branch', stats.currentBranch));
  console.log(row('Total Commits', stats.totalCommits.toLocaleString()));
  console.log(row('Contributors', stats.contributors));
  console.log(row('Tracked Files', stats.fileCount.toLocaleString()));
  console.log(row('Tags / Releases', stats.tags + (stats.latestTag ? `  (latest: ${stats.latestTag})` : '')));
  console.log();

  console.log(sectionTitle('Branches'));
  console.log(row('Local', stats.branches.local));
  console.log(row('Remote', stats.branches.remote));
  console.log(row('Total', stats.branches.total));
  console.log();

  console.log(sectionTitle('Commit Activity'));
  console.log(row('First Commit', formatDate(stats.firstCommitDate)));
  console.log(row('Last Commit', formatDate(stats.lastCommitDate)));
  console.log(row('Commits (last 30d)', stats.commitsLast30Days));
  console.log(row('Avg Commits / Day', stats.avgCommitsPerDay));

  const max30 = Math.max(stats.commitsLast30Days, 1);
  console.log(`\n  Last 30 days  ${miniBar(stats.commitsLast30Days, Math.max(max30, 50))} ${chalk.hex('#22c55e')(stats.commitsLast30Days)} commits`);
  console.log();

  console.log(sectionTitle('Working Tree'));
  const wc = stats.uncommittedChanges;
  if (wc.total === 0) {
    console.log(`  ${chalk.green('✔')} ${chalk.gray('Clean working tree — nothing to commit')}`);
  } else {
    console.log(row('Staged', wc.staged, wc.staged > 0 ? chalk.green('ready to commit') : ''));
    console.log(row('Unstaged', wc.unstaged, wc.unstaged > 0 ? chalk.yellow('modified') : ''));
    console.log(row('Untracked', wc.untracked, wc.untracked > 0 ? chalk.gray('new files') : ''));
  }
  console.log();

  showActivity(repoPath);
  showHealth(repoPath);

  console.log(chalk.gray('  Run `git-pulse contributors` for full contributor breakdown'));
  console.log(chalk.gray('  Run `git-pulse activity` for the heatmap only'));
  console.log(chalk.gray('  Run `git-pulse health` for health score only'));
  console.log();
}

export { runDashboard };
