import chalk from 'chalk';
import { git } from './scanner.js';

const WEEKS = 52;
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getCommitDates(repoPath) {
  const since = new Date();
  since.setDate(since.getDate() - WEEKS * 7);
  const sinceStr = since.toISOString().split('T')[0];

  const out = git(['log', '--format=%aI', '--after', sinceStr, 'HEAD'], repoPath);
  if (!out) return {};

  const counts = {};
  for (const line of out.split('\n').filter(Boolean)) {
    const date = line.split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  }
  return counts;
}

function buildGrid(counts) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - (WEEKS * 7 - 1));

  const grid = [];
  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + w * 7 + d);
      const key = date.toISOString().split('T')[0];
      week.push({ date: key, count: counts[key] || 0, month: date.getMonth(), day: date.getDay() });
    }
    grid.push(week);
  }
  return grid;
}

function getColor(count) {
  if (count === 0) return chalk.hex('#1a1a2e')('█');
  if (count <= 2) return chalk.hex('#166534')('█');
  if (count <= 5) return chalk.hex('#16a34a')('█');
  if (count <= 10) return chalk.hex('#22c55e')('█');
  return chalk.hex('#86efac')('█');
}

function renderMonthLabels(grid) {
  let label = '     ';
  let lastMonth = -1;
  for (let w = 0; w < grid.length; w++) {
    const month = grid[w][0].month;
    if (month !== lastMonth) {
      label += MONTH_LABELS[month].padEnd(4);
      lastMonth = month;
    } else {
      label += '  ';
    }
  }
  return label;
}

function showActivity(repoPath) {
  console.log();
  console.log(chalk.hex('#22c55e').bold('  Activity Heatmap') + chalk.gray('  — last 52 weeks'));
  console.log(chalk.gray('  ' + '─'.repeat(60)));

  let counts;
  try {
    counts = getCommitDates(repoPath);
  } catch (err) {
    console.log(chalk.red(`  Error reading git log: ${err.message}`));
    return;
  }

  const totalCommits = Object.values(counts).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(counts).filter(c => c > 0).length;

  const grid = buildGrid(counts);

  console.log(chalk.gray(renderMonthLabels(grid)));

  for (let d = 0; d < DAYS_PER_WEEK; d++) {
    const dayLabel = d % 2 === 1 ? DAY_LABELS[d] : '   ';
    let row = chalk.gray(`  ${dayLabel} `);
    for (let w = 0; w < WEEKS; w++) {
      row += getColor(grid[w][d].count);
    }
    console.log(row);
  }

  console.log();
  console.log(chalk.gray('  Legend: ') +
    chalk.hex('#1a1a2e')('█') + chalk.gray(' none  ') +
    chalk.hex('#166534')('█') + chalk.gray(' low  ') +
    chalk.hex('#16a34a')('█') + chalk.gray(' mid  ') +
    chalk.hex('#22c55e')('█') + chalk.gray(' high  ') +
    chalk.hex('#86efac')('█') + chalk.gray(' peak'));
  console.log();
  console.log(chalk.gray(`  ${totalCommits} commits across ${activeDays} active days in the last year`));
  console.log();
}

export { showActivity };
