import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runDashboard } from './formatter.js';
import { showContributors } from './contributors.js';
import { showActivity } from './activity.js';
import { showHealth } from './health.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

program
  .name('git-pulse')
  .description('Beautiful terminal dashboard for any git repo')
  .version(pkg.version)
  .option('-p, --path <path>', 'path to git repository', process.cwd())
  .action((options) => {
    runDashboard(options.path);
  });

program
  .command('contributors')
  .description('Show top contributors with stats')
  .option('-p, --path <path>', 'path to git repository', process.cwd())
  .option('-n, --num <number>', 'number of contributors to show', '10')
  .action((options) => {
    showContributors(options.path, parseInt(options.num, 10));
  });

program
  .command('activity')
  .description('Show ASCII activity heatmap for last 52 weeks')
  .option('-p, --path <path>', 'path to git repository', process.cwd())
  .action((options) => {
    showActivity(options.path);
  });

program
  .command('health')
  .description('Show repository health score')
  .option('-p, --path <path>', 'path to git repository', process.cwd())
  .action((options) => {
    showHealth(options.path);
  });

program.parse();
