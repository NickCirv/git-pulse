# git-pulse — research record

## Revision and scope

- Repository: [NickCirv/git-pulse](https://github.com/NickCirv/git-pulse)
- Commit: `646da247f3ee9f2614173c2411cb66766c41eb4e`
- Tree: `b1261501215d0f940937b3417981d0cbc1cf1520`
- Captured: 12 of 12 eligible text files (all eligible text files).
- Recursive tree truncated: `False`.
- Runtime verification: **unverified**; no repository code, installation or test command was executed.

The captured file inventory is broader than the semantic review. Authoring inspected package metadata, entrypoint/argument handling and implementation paths relevant to the claims below, plus test declarations. This is documentation research, not a line-by-line security audit. Generated/binary artifacts, lockfiles and file types outside the acquisition filter were not inspected.

## Claim and evidence

| Claim | Pinned evidence | Status |
| --- | --- | --- |
| Runtime requirement and executable mapping | [package.json](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/package.json) | verified in manifest; installation unverified |
| Inspect a local repository dashboard with activity, contributors and maintenance signals. | [implementation](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/bin/pulse.js) | partially verified by static implementation review |
| Operational limits and side effects | [implementation](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/bin/pulse.js) and source map in [reference](REFERENCE.md) | partially verified; runtime unverified |
| Test command definition | [package.json](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/package.json) | verified as a declaration only |

## Findings carried into the rewrite

The health score checks structural signals and does not run tests, inspect CI results or certify security. Historical counts are limited to locally available Git data.

No runtime checks were executed for this documentation review. The committed smoke test checks entrypoint JavaScript syntax; it does not exercise the command behavior.

## Documentation inventory and disposition

| Existing document | Disposition |
| --- | --- |
| [README.md](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/README.md) | Rewritten overview; historical copy remains at this pinned URL. |

New supporting documents: `docs/REFERENCE.md` and `docs/RESEARCH.md`. No original source or protected legal/security file was changed.

## Protected-file evidence

- `LICENSE` SHA-256 `8edf13ba2a2e443fa49e42493414f6952a4a14b6c407983a7c95162ab37f6265`.

## Remaining verification

Clean installation, useful-command execution, malformed input, side-effect boundaries, platform compatibility and end-to-end tests remain unverified. Package-registry availability and live API destinations were not checked. No performance, customer-adoption, compliance or production-readiness claim is made.

## Captured evidence index

- [LICENSE](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/LICENSE) · blob `481c289c06c96c07330f8c7dedd847c5c07ca384`.
- [README.md](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/README.md) · blob `28c5af896eb8882be94995eb184ebeb51f3b3ca6`.
- [package.json](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/package.json) · blob `e1fb4a36dca993d1ef9d652ae4f830e9f131c9a7`.
- [.github/workflows/ci.yml](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/.github/workflows/ci.yml) · blob `44515034a394670de44454a7a1bd2c7ef0c9836e`.
- [bin/pulse.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/bin/pulse.js) · blob `d171ae5a090ef56819a24581c86cf9615620b92a`.
- [src/activity.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/activity.js) · blob `572d53deae3ab978f95a6c54bb809f6c8adc2734`.
- [src/contributors.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/contributors.js) · blob `6bd821c1789a4f6d9af300509139e98153da7845`.
- [src/formatter.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/formatter.js) · blob `64d5d4a28ecd57600f10113184293ba3a9bedf99`.
- [src/health.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/health.js) · blob `1044b1cd7a01b7a553bf4f9f9764b0451ca85642`.
- [src/index.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/index.js) · blob `d293715e7b0c9428f0c697c2a6483cd40f998879`.
- [src/scanner.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/src/scanner.js) · blob `11bd0bc1bbea2d4821fcfe9b3d45959af62d995c`.
- [test/smoke.test.js](https://github.com/NickCirv/git-pulse/blob/646da247f3ee9f2614173c2411cb66766c41eb4e/test/smoke.test.js) · blob `2c3dbd33c0028efb3036c17fdff0ac008315e4fa`.

## Tree files outside the captured text set

These paths were mapped but their contents were not acquired in this research pass:

- `banner.svg`
