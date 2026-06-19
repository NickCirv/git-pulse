<div align="center">

# git-pulse

**Terminal dashboard for any git repo — commits, contributors, heatmap, and health score in one shot.**

[![License](https://img.shields.io/github/license/NickCirv/git-pulse?style=flat-square&labelColor=0B0A09&color=22c55e)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-22c55e?style=flat-square&labelColor=0B0A09)](package.json)

</div>

## Install

```bash
npx github:NickCirv/git-pulse
```

> The `git-pulse` name on npm is taken by an unrelated package. Install directly from GitHub as shown above.

## Usage

```bash
# Full dashboard (default) — run inside any git repo
npx github:NickCirv/git-pulse

# Or point at a specific path
npx github:NickCirv/git-pulse --path /path/to/repo
```

| Command | Description |
|---------|-------------|
| `git-pulse` | Full dashboard overview |
| `git-pulse contributors` | Ranked contributor table with lines added/removed |
| `git-pulse contributors -n 5` | Show top N contributors |
| `git-pulse activity` | ASCII heatmap — last 52 weeks |
| `git-pulse health` | Health score across 9 checks (0–100) |
| `--path <dir>` | Run on a repo at a specific path |
| `--version` | Show version |
| `--help` | Show help |

## What it does

git-pulse reads your local git history via `execFileSync('git', [...])` — no API keys, no network calls. It renders a full terminal dashboard with commit stats, a GitHub-style activity heatmap (chalk-coloured), a contributor table ranked by commit count, and a 0–100 repository health score across nine checks (README, LICENSE, tests, CI config, commit recency, contributor count, branch hygiene, tagged releases, no large files).

---

<sub>Node >=18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
