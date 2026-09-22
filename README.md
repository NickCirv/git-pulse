![git-pulse — Nicholas Ashkar repository collection](assets/nicholas-ashkar/banner.png)

# git-pulse

Inspect a local repository dashboard with activity, contributors and maintenance signals.


<a id="usage"></a>

## What it does

Offers a summary dashboard and dedicated activity, contributors and health views. Health checks look for files, CI configuration, tests, commit recency and branch/tag hygiene. See the pinned [implementation](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/bin/pulse.js).


<a id="install"></a>

## Quickstart

Node requirement from the inspected manifest: **`>=20`**. Requires Git and a local repository with the relevant history. Commands are source-inspected, not executed in this review.

The following example is **source-inspected, not executed**. It uses a pinned checkout; npm package publication is not assumed. Replace project paths or provide the stated input fixtures before running it.

```bash
git clone https://github.com/NickCirv/git-pulse.git
cd git-pulse
git checkout 646da247f3ee9f2614173c2411cb66766c41eb4e
npm install --ignore-scripts
node bin/pulse.js --path ../your-project
```

Dependencies are installed with lifecycle scripts disabled in this recipe. Read the package scripts before enabling any lifecycle step required by your environment.

## Usage and reference

`git-pulse` are the executable names declared by the package. [Command reference](docs/REFERENCE.md) covers source-backed options and entry points.

| Control | Behavior in the inspected implementation |
| --- | --- |
| `--path PATH` | Choose the Git repository |
| `contributors` | Show recorded contributor activity |
| `activity` | Render activity history |
| `health` | Inspect structural maintenance signals |

## Limits and operational notes

The health score checks structural signals and does not run tests, inspect CI results or certify security. Historical counts are limited to locally available Git data.

## Development

No runtime checks were executed for this documentation review. The committed smoke test checks entrypoint JavaScript syntax; it does not exercise the command behavior.

| Script | Declared command |
| --- | --- |
| `start` | `node bin/pulse.js` |
| `test` | `node --test` |

Work from the pinned source, keep changes focused, and reproduce the affected behavior with a small fixture before proposing a change. Existing contribution and security policies remain authoritative where present.

## Research and status

[Research record](docs/RESEARCH.md) identifies the inspected revision, source evidence, documentation disposition and verification gaps. Static inspection supports the descriptions here; runtime behavior, dependency installation and current hosted services remain unverified.

## License and author

[License](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/LICENSE)

[Nicholas Ashkar](https://nicholashkar.com) · Applied AI, systems and consulting.
