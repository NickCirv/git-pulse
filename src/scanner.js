import { execFileSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function isGitRepo(repoPath) {
  try {
    const result = git(['rev-parse', '--git-dir'], repoPath);
    return result.length > 0;
  } catch {
    return false;
  }
}

function getTotalCommits(repoPath) {
  const out = git(['rev-list', '--count', 'HEAD'], repoPath);
  return parseInt(out, 10) || 0;
}

function getContributorCount(repoPath) {
  const out = git(['shortlog', '-s', 'HEAD'], repoPath);
  if (!out) return 0;
  return out.split('\n').filter(Boolean).length;
}

function getBranches(repoPath) {
  const out = git(['branch', '-a'], repoPath);
  if (!out) return { local: 0, remote: 0, total: 0 };
  const lines = out.split('\n').filter(Boolean);
  const remote = lines.filter(l => l.includes('remotes/')).length;
  const local = lines.filter(l => !l.includes('remotes/')).length;
  return { local, remote, total: lines.length };
}

function getTags(repoPath) {
  const out = git(['tag'], repoPath);
  if (!out) return 0;
  return out.split('\n').filter(Boolean).length;
}

function getLatestTag(repoPath) {
  const out = git(['describe', '--tags', '--abbrev=0'], repoPath);
  return out || null;
}

function getCommitFrequency(repoPath) {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString().split('T')[0];
  const out = git(['rev-list', '--count', '--after', sinceStr, 'HEAD'], repoPath);
  return parseInt(out, 10) || 0;
}

function getFirstCommitDate(repoPath) {
  const out = git(['log', '--reverse', '--format=%aI', 'HEAD'], repoPath);
  if (!out) return null;
  const first = out.split('\n')[0];
  return first ? new Date(first) : null;
}

function getLastCommitDate(repoPath) {
  const out = git(['log', '-1', '--format=%aI', 'HEAD'], repoPath);
  return out ? new Date(out) : null;
}

function getUncommittedChanges(repoPath) {
  const staged = git(['diff', '--cached', '--name-only'], repoPath);
  const unstaged = git(['diff', '--name-only'], repoPath);
  const untracked = git(['ls-files', '--others', '--exclude-standard'], repoPath);

  const count = (s) => s ? s.split('\n').filter(Boolean).length : 0;
  return {
    staged: count(staged),
    unstaged: count(unstaged),
    untracked: count(untracked),
    total: count(staged) + count(unstaged) + count(untracked),
  };
}

function getFileCount(repoPath) {
  const out = git(['ls-files'], repoPath);
  if (!out) return 0;
  return out.split('\n').filter(Boolean).length;
}

function getAverageCommitsPerDay(repoPath, totalCommits, firstDate) {
  if (!firstDate || totalCommits === 0) return 0;
  const now = new Date();
  const diffMs = now - firstDate;
  const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return (totalCommits / diffDays).toFixed(2);
}

function getCurrentBranch(repoPath) {
  return git(['rev-parse', '--abbrev-ref', 'HEAD'], repoPath) || 'unknown';
}

function getRepoName(repoPath) {
  const out = git(['rev-parse', '--show-toplevel'], repoPath);
  if (out) {
    const parts = out.split('/');
    return parts[parts.length - 1];
  }
  return repoPath.split('/').pop() || 'repo';
}

function scanRepo(repoPath) {
  if (!isGitRepo(repoPath)) {
    throw new Error(`Not a git repository: ${repoPath}`);
  }

  const hasCommits = git(['rev-parse', 'HEAD'], repoPath).length > 0;
  if (!hasCommits) {
    throw new Error('Repository has no commits yet.');
  }

  const totalCommits = getTotalCommits(repoPath);
  const firstDate = getFirstCommitDate(repoPath);
  const lastDate = getLastCommitDate(repoPath);
  const branches = getBranches(repoPath);

  return {
    repoName: getRepoName(repoPath),
    currentBranch: getCurrentBranch(repoPath),
    totalCommits,
    contributors: getContributorCount(repoPath),
    branches,
    tags: getTags(repoPath),
    latestTag: getLatestTag(repoPath),
    commitsLast30Days: getCommitFrequency(repoPath),
    fileCount: getFileCount(repoPath),
    firstCommitDate: firstDate,
    lastCommitDate: lastDate,
    uncommittedChanges: getUncommittedChanges(repoPath),
    avgCommitsPerDay: getAverageCommitsPerDay(repoPath, totalCommits, firstDate),
  };
}

export { scanRepo, git };
