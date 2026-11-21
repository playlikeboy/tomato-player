# Third-party notices

Tomato Player's own source code is MIT licensed. It does **not** bundle any
third-party runtime code. Streaming engines are loaded only when you install
and opt into the matching provider package; they are declared as
`peerDependencies` and keep their own licenses:

| Package | Used by | License | Notes |
| --- | --- | --- | --- |
| [hls.js](https://github.com/video-dev/hls.js) | `@tomato-player/provider-hls` | Apache-2.0 | Ships its own LICENSE; Apache-2.0 §4 requires you to keep its notices when you redistribute it. |
| [dash.js](https://github.com/Dash-Industry-Forum/dash.js) | `@tomato-player/provider-dash` | BSD-3-Clause | Keep the copyright notice and disclaimer when redistributing. |

Development-only tools (TypeScript, tsup, Vitest, happy-dom) are not shipped.

## Trademarks

The `stream`, `tube` and `feed` skins are **unofficial, platform-inspired**
designs. They reproduce common interaction patterns only. They contain no
logos, fonts, icons or other assets owned by Netflix, Inc., Google LLC
(YouTube) or Meta Platforms, Inc. (Facebook), and Tomato Player is not
affiliated with, endorsed by or sponsored by any of these companies. All
trademarks belong to their respective owners.
