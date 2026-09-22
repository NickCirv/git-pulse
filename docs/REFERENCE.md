# git-pulse — command reference

[Overview](../README.md) · [Research record](RESEARCH.md)

Describes revision `646da247f3ee9f2614173c2411cb66766c41eb4e`. Commands are source-inspected; no execution results are asserted.

## Workflow

Offers a summary dashboard and dedicated activity, contributors and health views. Health checks look for files, CI configuration, tests, commit recency and branch/tag hygiene.

Requires Git and a local repository with the relevant history. Commands are source-inspected, not executed in this review.

```bash
node bin/pulse.js --path ../your-project
```

## Commands and controls

| Control | Behavior in the inspected implementation |
| --- | --- |
| `--path PATH` | Choose the Git repository |
| `contributors` | Show recorded contributor activity |
| `activity` | Render activity history |
| `health` | Inspect structural maintenance signals |

## Interpretation and side effects

The health score checks structural signals and does not run tests, inspect CI results or certify security. Historical counts are limited to locally available Git data.

## Implementation reference

- [package.json](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/package.json)
- [bin/pulse.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/bin/pulse.js)
- [src/index.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/index.js)
- [test/smoke.test.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/test/smoke.test.js)
