# Third-Party Integration Strategy

Principle: **the core depends on nothing.** Every third-party engine or SDK sits behind a Tomato provider or plugin interface. It is installed by the user as a **peer dependency** and loaded with dynamic `import()` only when needed.

## 1. Decisions per library

| Library | Decision | Rationale | Packaging | Lazy-load trigger |
|---|---|---|---|---|
| hls.js (Apache-2.0) | **Reuse: optional adapter** `@tomato/provider-hls` | De facto HLS engine. Supports ManagedMediaSource and CMCD v1/v2 ([API.md](https://github.com/video-dev/hls.js/blob/master/docs/API.md)). Zero deps. | `peerDependencies: { "hls.js": "^1.6" }` (range TBD), marked `peerDependenciesMeta.optional`. Offer `hls.js/light` as an option. | Source is `.m3u8` or `application/vnd.apple.mpegurl`, and native HLS is not preferred or not available |
| Shaka Player (Apache-2.0) | **Reuse: optional adapter** `@tomato/provider-shaka` | Best DRM, offline storage, and DASH+HLS in one engine | Optional peer. Use the compiled build without Shaka UI. | DRM config present, or the user picks Shaka for DASH |
| dash.js (BSD-3-Clause) | **Reuse: optional adapter** `@tomato/provider-dash` | DASH-IF reference with strong LL-DASH and CMCD/CMSD | Optional peer | `.mpd` source, when the user picks dash.js over Shaka |
| mpegts.js (Apache-2.0) | **Reuse: optional adapter** (P2) | Low-latency TS/FLV live | Optional peer | `.flv` or `.ts` live source |
| SVTA `@svta/cml-cmcd`, `cml-cmsd` (Apache-2.0) | **Reuse** inside `@tomato/plugin-cmcd` for native playback | A standard implementation already used by dash.js | Regular dependency of the plugin only | Plugin import |
| JASSUB (MIT wrapper with LGPL-2.1+ components) | **Reuse: opt-in plugin** `@tomato/plugin-ass` | Only viable ASS/SSA renderer. Active. | Optional peer. Never bundled into a CDN "all" build. | `.ass` or `.ssa` track selected |
| Google IMA SDK (proprietary) | **Reuse: adapter, loaded at runtime** | Market default for VAST/VMAP/DAI | Inject the script from Google's URL `//imasdk.googleapis.com/js/sdkloader/ima3.js` as the [setup guide](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) shows. Types come from `@types/google_interactive_media_ads_types`. Never vendor the SDK; no self-host permission was found. | Ads plugin `requestAds()` |
| Google Cast Web Sender (proprietary) | **Reuse: adapter, loaded at runtime** | Only path to Chromecast | Load from Google's CDN per [docs](https://developers.google.com/cast/docs/web_sender) | Cast button visible and Cast available |
| Video.js v10 | **Learn from**, and stay interoperable | Same architecture thesis. Do not fork. Study its feature-slice store, presets and shadcn eject ([beta post](https://videojs.org/blog/videojs-v10-beta-hello-world-again)). | n/a | n/a |
| Media Chrome / Mux Elements | **Learn from** the "custom element implements HTMLMediaElement" pattern. Consider supporting any element that implements this contract, e.g. `<hls-video>` and `<mux-video>`. | Lets Tomato skins wrap third-party media elements for free | n/a. Optional compatibility: accept any `HTMLMediaElement`-like element. | n/a |
| Vidstack, Plyr | **Learn from, then target for migration** | Deprecated. Their users need a home. Write codemods and API maps. | n/a | n/a |
| media-captions | **Learn from** or fork under MIT with attribution | Stale since 2024 | Vendor only with its MIT notice kept | n/a |
| ReactPlayer | **Learn from** its lazy per-provider loading | Good pattern for YouTube, Vimeo and other embed providers | n/a | n/a |
| Clappr, OvenPlayer, xgplayer, Artplayer, Fluid Player, MediaElement.js | **Avoid as deps.** Mine for features: danmaku and thumbnails from Artplayer, VAST without IMA from Fluid. | Monolithic or heavy, or tied to one vendor or server | n/a | n/a |
| flv.js, libass-wasm, @eyevinn/cmcd, @silvermine/videojs-chromecast, castable-video | **Avoid** | Stale or archived (see [landscape.md](./landscape.md)) | n/a | n/a |

## 2. Peer dependency vs bundled

| Option | Use when | Tomato default |
|---|---|---|
| **Optional peer dep** | Large engines users may already have, or need to pin for security or DRM fixes | hls.js, Shaka, dash.js, mpegts.js, JASSUB |
| Regular dependency | Small, internal-only, version-locked utilities | `@svta/cml-*` inside the CMCD plugin |
| Runtime script injection | Proprietary SDKs that are not on npm, or must come from the vendor | IMA, Cast |
| Bundled in CDN build | CDN users want one URL | CDN "core+skin" only. Engines stay separate CDN files (`tomato.hls.js`) loaded on demand by URL. |

Rules:
- Never pin an exact engine version in a peer range.
- Publish a tested compatibility matrix per release.
- Adapters type-import the engine (`import type Hls from 'hls.js'`) and load the runtime through `import('hls.js')`. Bundlers then code-split it automatically.
- The CDN build lets the user override the engine URL so they can pin or self-host it.

## 3. Lazy-loading flow

1. `player.src = { src, type? }`. Sniff the type from the extension or MIME, or call a `canPlay` probe on each registered provider.
2. Pick a provider from the priority list:
   - native (`video.canPlayType`),
   - then the registered adapters in user order.
   - Safari rule: prefer native HLS unless the requested features need MSE.
3. Dynamically import the provider package, then the engine, with `<link rel="modulepreload">` hints available via `player.preconnect()` / `preload()`.
4. Prefetch on intent: hover or viewport intersection triggers `import()` with `fetchpriority=low`.
5. Plugins such as ads, cast, ASS and thumbnails register lazily and load on first use.

## 4. Licenses and attribution obligations

> Not legal advice. Have counsel review before the 1.0 release.

| License | Libraries | What Tomato must do | Source |
|---|---|---|---|
| **Apache-2.0** | hls.js, Shaka, mpegts.js, SVTA CML, Video.js (if code is borrowed), videojs-ima | When **redistributing** (CDN bundles that include the engine, or vendored code): include a copy of the license; keep copyright, patent and attribution notices; mark modified files; and **if the upstream ships a `NOTICE` file, reproduce its attribution notices** (§4(d)). On 2026-11-21 there was no root `NOTICE` file in hls.js (master), Shaka (main), Video.js (main) or mpegts.js (master): these URLs return 404. hls.js's `LICENSE` includes copyrights from Dailymotion and Brightcove (derived from videojs-contrib-hls), so keep it verbatim. | [Apache-2.0 §4](https://www.apache.org/licenses/LICENSE-2.0), [hls.js LICENSE](https://github.com/video-dev/hls.js/blob/master/LICENSE) |
| **BSD-3-Clause** | dash.js, Clappr | Binary redistribution must reproduce the copyright notice, conditions and disclaimer in the docs or other materials. **No-endorsement clause:** do not use "Dash Industry Forum" to promote Tomato without permission. dash.js itself has 13 deps; audit their licenses (e.g. `localforage`, `imsc`, `codem-isoboxer`) before CDN bundling. | [dash.js LICENSE.md](https://github.com/Dash-Industry-Forum/dash.js/blob/development/LICENSE.md) |
| **MIT** | Media Chrome, Vidstack, Plyr, media-captions, mux elements, JASSUB wrapper | Keep the copyright and permission notice in all copies or substantial portions, including vendored or forked code. | Each repo's LICENSE |
| **LGPL-2.1+ (plus FTL/GPL-2.0+, ISC, Zlib, BSL-1.0 ...)** | JASSUB and libass WASM components (npm `license` field) | Keep the plugin a separate, user-replaceable module. Do not statically merge the WASM into Tomato bundles. Ship the license texts and point to the corresponding source. Prefer opt-in installs only. Get a legal review before any CDN distribution of the WASM. | npm `jassub` metadata |
| **Proprietary** | Google IMA, Cast SDK | Do not redistribute. Load from Google. The user accepts Google's terms. Document this in the plugin README. | [IMA setup](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) |

Operational:
- Generate `THIRD_PARTY_NOTICES.md` per CDN artifact at build time, for example with `rollup-plugin-license` or a similar tool.
- Preserve `/*! ... */` license comments in minified output.
- npm packages that only list peers need no notice, because Tomato does not redistribute the code.
- Add a CI license allowlist with `license-checker` or a similar tool. It fails on GPL or AGPL in core packages. LGPL is allowed only in `plugin-ass`.
