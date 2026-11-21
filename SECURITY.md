# Security policy

## Supported versions

While Tomato Player is in 0.x, security fixes land on the latest minor release.

## Reporting a vulnerability

Please **do not** open a public issue. Report privately through [GitHub security advisories](https://github.com/playlikeboy/tomato-player/security/advisories/new). We aim to acknowledge reports within 72 hours.

## Scope notes

- The UI never renders media metadata as HTML (titles and captions are set with `textContent`).
- Skins inject CSS only. Use `injectStyles: false` under a strict CSP.
- Streaming engines (hls.js, dash.js) are peer dependencies. Report engine bugs upstream as well.
