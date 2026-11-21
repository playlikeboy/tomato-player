# Web Video Player Landscape (snapshot: 2026-11-21)

How data was gathered:
- **Version / release date / license / peer deps**: npm registry API (`https://registry.npmjs.org/<pkg>`), fetched 2026-11-21.
- **Stars / last push / archived / open issues**: GitHub REST API (`https://api.github.com/repos/<owner>/<repo>`), fetched 2026-11-21. GitHub "open issues" includes PRs.
- **Size**: bundlephobia API (`https://bundlephobia.com/api/size?package=<pkg>`). This measures the **full default entry, minified + gzipped, without tree-shaking**. Treat it as an upper bound for "import everything", not as what a tree-shaken app ships. Link pattern: `https://bundlephobia.com/package/<pkg>`.
- Where a project publishes its own size numbers, they are quoted separately and attributed.

## 1. The big structural change: Video.js v10 absorbed Plyr, Vidstack and Media Chrome

| Fact | Evidence |
|---|---|
| The teams behind Plyr, Vidstack, Media Chrome and Mux Player are building Video.js v10 together. It is a ground-up rewrite, not a codebase merge. | [Mux blog, 2026-01-27](https://www.mux.com/blog/five-players-one-future-how-we-re-building-video-js-v10), [v10 beta post](https://videojs.org/blog/videojs-v10-beta-hello-world-again) |
| Mux replaced Brightcove as Video.js "corporate shepherd". | [Mux blog](https://www.mux.com/blog/videojs) (via search summary) |
| `@videojs/html` 10.0.0 shipped 2026-10-01. Six minor releases followed in 7 weeks (10.6.0 on 2026-11-20). | npm registry `@videojs/html` |
| The `video.js` npm package at `latest` (10.6.0) "contains no player". v10 ships as `@videojs/html` and `@videojs/react`. `video.js@8` is the legacy line (8.24.2, 2026-10-06). | [videojs.org/llms.txt](https://videojs.org/llms.txt), npm |
| Video.js 8 gets bug fixes and security patches only. From 2027 it gets security patches only. | [v10 roadmap](https://videojs.org/docs/framework/html/concepts/v10-roadmap) |
| **Vidstack is in security-only maintenance until January 2028.** It is succeeded by Video.js 10. | npm README of `vidstack` |
| **Plyr is deprecated.** It receives security updates only. | npm README of `plyr` |
| Media Chrome README points new projects to Video.js 10. It does not say deprecated. | npm README of `media-chrome` |
| ReactPlayer maintenance moved to Mux. | npm README of `react-player` |
| v10 roadmap after 10.0: ads, analytics parity with v8 contrib, plugin ecosystem migration, lightweight adaptive streaming, MoQ. | [v10 roadmap](https://videojs.org/docs/framework/html/concepts/v10-roadmap) |
| v10 frameworks: native React and HTML/Web Components. Vue/Nuxt and Svelte/SvelteKit use the custom elements, with `isCustomElement` config. React Native APIs are in progress. | [v10 docs index](https://videojs.org/docs/framework/html/llms.txt), [Vue guide](https://videojs.org/docs/framework/html/guides/vue.md), [PR #9741](https://github.com/videojs/video.js/pull/9741) |

### v10 architecture (direct competitor to the Tomato thesis)

Source: [v10 beta post](https://videojs.org/blog/videojs-v10-beta-hello-world-again).

- State, UI and Media are separate, swappable parts that talk through API contracts.
- State is built from "features", similar to Zustand slices. `createPlayer([...features])` excludes code you do not use.
- SPF is a streaming engine composed from functional parts. Its "simple" on-demand ABR engine is 12.1 kB gz, versus hls.js-light at 103.4 kB, as measured by Video.js.
- UI primitives are unstyled, Radix/Base UI style, and render one element each. Skins can be ejected as source through the `shadcn` CLI.
- Presets: video, audio, background video, live.
- Docs ship `llms.txt`, `llms-full.txt`, and an agent skill ([videojs/skills](https://github.com/videojs/skills)).

**Self-reported v10 sizes** (min+gz, from the beta post; methodology only partly disclosed):

| Player (no ABR) | gz kB |
|---|---|
| Video.js v8 core | 75.2 |
| Vidstack | 74.1 |
| Media Chrome | 41.3 |
| Plyr | 32.6 |
| v10 Video (HTML) | 25.1 |
| v10 Video (React) | 18.0 |
| v10 Background Video (React) | 3.5 |

With ABR: v8 + VHS is 202.7 kB. v10 + SPF is 38.7 kB (HTML) and 31.6 kB (React).

**Implication for Tomato:** a "tiny modular core + skins + adapters" pitch is no longer novel. Video.js v10 already does it, with Mux funding and the former Plyr/Vidstack/Media Chrome maintainers. Tomato must win on specific gaps; see [opportunities.md](./opportunities.md).

## 2. Comparison table

Sizes are from bundlephobia (full entry, min+gz) unless marked otherwise.

| Project | Purpose | License | Latest (npm) | Maintenance signal | Size min / gz | Frameworks | Strengths | Weaknesses |
|---|---|---|---|---|---|---|---|---|
| [hls.js](https://github.com/video-dev/hls.js) | HLS over MSE engine | Apache-2.0 | 1.7.4 (2026-10-28) | Pushed 2026-11-17. Canary builds daily. 17.1k stars. | 565.5 / 174.3 kB. A `hls.js/light` export exists (Video.js measures it at 103.4 kB gz). | Agnostic | De facto HLS engine. `ManagedMediaSource` for iOS 17.1+. CMCD v1, and v2 with event mode in master docs ([API.md](https://github.com/video-dev/hls.js/blob/master/docs/API.md)). Zero runtime deps. | Large. HLS only. Live-edge and DVR edge cases ([#6998](https://github.com/video-dev/hls.js/issues/6998), [#3598](https://github.com/video-dev/hls.js/issues/3598)). Historic leaks with multiple instances ([#1220](https://github.com/video-dev/hls.js/issues/1220)). |
| [Shaka Player](https://github.com/shaka-project/shaka-player) | DASH + HLS engine, DRM, offline, optional UI | Apache-2.0 | 5.3.6 (2026-11-20) | Pushed 2026-11-20. Many maintained branches. 8.3k stars, 43 open. | 855.9 / 282.3 kB | Agnostic (Closure-compiled) | Best DRM story (Widevine, PlayReady, FairPlay). DASH and HLS in one engine. Offline storage. Built-in UI. | Heaviest. Closure build is hard to tree-shake. FairPlay pain over the years ([#382](https://github.com/shaka-project/shaka-player/issues/382), [#4211](https://github.com/shaka-project/shaka-player/issues/4211)). |
| [dash.js](https://github.com/Dash-Industry-Forum/dash.js) | DASH reference player | BSD-3-Clause | 5.3.0 (2026-11-04) | Pushed 2026-11-18. 5.6k stars, 185 open. | 800.7 / 233.8 kB | Agnostic | Reference implementation for DASH-IF. Ships CMCD and CMSD through SVTA `@svta/cml-*` packages. Strong low-latency DASH. | 13 runtime deps (incl. `localforage`, `imsc`). Large. Subtitle memory leaks ([#4290](https://github.com/Dash-Industry-Forum/dash.js/issues/4290), [PR #5042](https://github.com/Dash-Industry-Forum/dash.js/pull/5042)). |
| [Video.js](https://github.com/videojs/video.js) v10 | Full player: state + UI + media + SPF engine | Apache-2.0 | `@videojs/html` 10.6.0 (2026-11-20) | Pushed 2026-11-21. Releases weekly. 40.2k stars. | `@videojs/html` 285.5 / 80.8 kB. `@videojs/core` 72.5 / 19.6 kB. `@videojs/react` 284.6 / 88.5 kB. Self-reported: 25.1 kB gz default HTML player. | React, HTML/WC. Vue and Svelte via custom elements. | Consolidated ecosystem with funding. Ejectable skins. llms.txt and agent skill. Casting, thumbnails, live/DVR, i18n, CSP guides. | Ads not shipped yet (roadmap). v8 plugin ecosystem does not carry over. No native Vue/Svelte components. The v10 rewrite repo [videojs/v10](https://github.com/videojs/v10) is archived and work moved to the main repo. |
| Video.js v8 | Legacy player + VHS | Apache-2.0 | 8.24.2 (2026-10-06) | Fixes only, then security only from 2027 | 75.2 kB gz core (self-reported) | Agnostic | Large plugin ecosystem (IMA, Chromecast, etc.) | Monolithic. React Strict Mode friction ([#7746](https://github.com/videojs/video.js/issues/7746)). |
| [Vidstack](https://github.com/vidstack/player) | Headless-ish player + layouts | MIT | 1.15.7 (2026-10-06) | **Security-only until Jan 2028** | 192.9 / 56.9 kB | React, WC | Good DX and typed API. Heavily informs v10. | Deprecated. SSR and module-resolution issues ([#717](https://github.com/vidstack/player/issues/717), [#1634](https://github.com/vidstack/player/issues/1634)). CSP inline-style issue ([#878](https://github.com/vidstack/player/issues/878)). |
| [Media Chrome](https://github.com/muxinc/media-chrome) | Web-component controls for any media element | MIT | 4.19.5 (2026-11-12) | Active. README steers new projects to v10. | 174.0 / 41.2 kB | Any (custom elements), React wrappers | Plain-CSS styling. `media-*` element contract works with any `<video>`-like element. | Future is v10. Many small elements raise the cost of customization. |
| [Plyr](https://github.com/sampotts/plyr) | Polished simple player | MIT | 3.8.5 (2026-10-06) | **Deprecated, security only** | 110.3 / 32.4 kB | Agnostic | Good default UI | No SSR safety ([#2770](https://github.com/sampotts/plyr/issues/2770), [#2853](https://github.com/sampotts/plyr/issues/2853)). A11y issues ([#905](https://github.com/sampotts/plyr/issues/905)). |
| [Artplayer](https://github.com/zhw2590582/ArtPlayer) | Feature-rich player | MIT | 5.4.0 (2026-03-12) | Pushed 2026-10-21. Single main maintainer. 4.2k stars. | 138.1 / 35.5 kB | Agnostic | Many built-ins: danmaku, thumbnails, plugins | Bus factor of one. Mostly Chinese-language community. |
| [Fluid Player](https://github.com/fluid-player/fluid-player) | Player with built-in VAST/VPAID ads | MIT | 3.61.0 (2026-10-21) | Pushed 2026-11-16. 961 stars. | bundlephobia build error (unverified) | Agnostic | Native VAST ads without IMA | Niche. 9 deps. |
| [MediaElement.js](https://github.com/mediaelement/mediaelement) | Legacy unified player (Flash-era) | MIT | 7.1.0 (2025-11-12) | Last push 2026-05-12. 228 open. | 144.6 / 35.2 kB | Agnostic, jQuery-era API | Used widely through WordPress | Legacy architecture. Slow cadence. |
| [ReactPlayer](https://github.com/cookpete/react-player) | React wrapper for URLs (YouTube, Vimeo, HLS, ...) | MIT | 3.4.0 (2025-11-13) | Now maintained by Mux. Last npm release one year ago. | 5.4 / 2.2 kB entry (lazy-loads providers) | React | Many sources behind one API. Lazy players. | No UI. Hydration errors ([#1474](https://github.com/cookpete/react-player/issues/1474)). v3 breaks v2. |
| [xgplayer](https://github.com/bytedance/xgplayer) | ByteDance player + FLV/HLS plugins | MIT | 3.0.27 (2026-10-29) | Active. 9.3k stars. | 429.1 / 119.6 kB | Agnostic | Battle-tested at scale. Mobile focus. | `core-js` peer dep. Docs and issues are mostly Chinese. |
| [Clappr](https://github.com/clappr/clappr) | Plugin-oriented player (Globo) | BSD-3-Clause | `@clappr/player` 0.14.10 (2026-11-12) | Active. [clappr-core](https://github.com/clappr/clappr-core) is archived. | 848.3 / 242.7 kB | Agnostic | Plugin architecture | Heavy. Small community. Old `clappr` package frozen since 2020. |
| [OvenPlayer](https://github.com/OvenMediaLabs/OvenPlayer) | Low-latency player for OvenMediaEngine (WebRTC, LL-HLS) | MIT | 0.10.55 (2026-11-03) | Active. 593 stars. | 538.4 / 166.7 kB | Agnostic | WebRTC playback | Tied to its media server. Pre-1.0. |

## 3. Smaller and overlooked building blocks

| Project | Purpose | License | Latest | Signal | Size | Notes for Tomato |
|---|---|---|---|---|---|---|
| [Mux Elements](https://github.com/muxinc/elements) (`@mux/mux-player`, `hls-video-element`, `dash-video-element`) | Custom elements that implement the `HTMLMediaElement` API on top of engines | MIT | mux-player 3.14.1; hls-video-element 1.5.12 (2026-10-22) | Active | mux-player 306.2 kB gz; hls-video-element 177.7 kB gz (mostly hls.js) | The "media element shim" pattern: a custom element exposing the native media API. Useful prior art for Tomato's provider contract. |
| [media-captions](https://github.com/vidstack/media-captions) | VTT/SRT/SSA parser + renderer | MIT | `next` 1.0.4 (2024-07-29); `latest` 0.0.18 | Stale since 2024. The repo now redirects. | 16.0 / 6.4 kB | Small. Learn from it or fork it. Do not depend on it. |
| [mpegts.js](https://github.com/xqq/mpegts.js) | MPEG-TS/FLV over MSE, live latency chasing | Apache-2.0 | 1.8.2 (2026-08-14) | Active, 189 open | 266.3 / 60.2 kB | Optional adapter for low-latency TS/FLV. It succeeds [flv.js](https://github.com/bilibili/flv.js), which has not been pushed since 2024-07. |
| [SVTA common-media-library](https://github.com/streaming-video-technology-alliance/common-media-library) | CMCD, CMSD, ID3, 608, DASH, request utilities | Apache-2.0 | split into `@svta/cml-*`; `@svta/cml-cmcd` 2.8.4 | Pushed 2026-11-21 | `@svta/cml-cmcd` 36.3 / 12.5 kB | Reuse for CMCD/CMSD. dash.js already depends on it. |
| [JASSUB](https://github.com/ThaUnknown/jassub) | libass in WASM (ASS/SSA rendering) | MIT wrapper + LGPL-2.1+ and other bundled components | 2.5.38 (2026-11-16) | Active | JS 5.3 kB gz; **WASM worker ~926 kB gz**, plus a default woff2 font of ~145 kB | Opt-in plugin only, loaded on demand. The LGPL parts drive licensing; see the integration strategy. |
| [JavascriptSubtitlesOctopus](https://github.com/libass/JavascriptSubtitlesOctopus) / `libass-wasm` | Older libass port | MIT/LGPL mix | 4.1.0 (2022-12-04) | Last push 2024-09 | n/a | Avoid. Use JASSUB instead. |
| [Google IMA HTML5 SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) | VAST/VMAP/DAI ads | Proprietary (Google terms) | Loaded from `imasdk.googleapis.com` | Google-maintained | Not on npm. Types in `@types/google_interactive_media_ads_types`. | Adapter only, loaded at runtime. Never bundle. |
| [videojs-ima](https://github.com/googleads/videojs-ima) | IMA plugin for Video.js v8 | Apache-2.0 | n/a | Pushed 2026-08 | n/a | Read it to learn iOS and autoplay ad pitfalls ([#341](https://github.com/googleads/videojs-ima/issues/341), [#803](https://github.com/googleads/videojs-ima/issues/803)). |
| [Google Cast Web Sender](https://developers.google.com/cast/docs/web_sender) | Chromecast sender | Proprietary SDK | Loaded from gstatic | Google-maintained | n/a | Adapter. [castable-video](https://github.com/muxinc/castable-video) (MIT) is archived, so learn from it only. |
| [@silvermine/videojs-chromecast](https://github.com/silvermine/videojs-chromecast) | Chromecast for Video.js | MIT | 1.5.0 (2023-11-07) | Stale | n/a | Avoid |
| [media-tracks](https://www.npmjs.com/package/media-tracks) | Polyfill for `videoTracks` and `audioTracks` | MIT | 0.3.5 (2026-03-19) | Mux-maintained | n/a | Candidate for a unified track API across providers |
| `webvtt-parser` (CC0), `subtitles-parser-vtt` | VTT parsing | CC0 / MIT | 2.2.0 (2022) / 0.1.0 (2021) | Stale | n/a | Low value. Build a small parser in-house, or use media-captions as a reference. |
| `@eyevinn/cmcd` | CMCD helper | MIT | 0.2.0 (2022) | Stale | n/a | Avoid. Use SVTA instead. |

## 4. Takeaways

1. **Engines are a solved problem.** hls.js, Shaka and dash.js are active, permissively licensed and large (174-282 kB gz full entry). Wrap them as lazy adapters. Do not compete with them.
2. **The UI-layer market consolidated in 2026.** Plyr is deprecated. Vidstack is security-only. Media Chrome points to v10. Former users of these three are now **migrating**. That is an opening, but Video.js v10 is the default destination.
3. **v10 sets the bar:** about 25 kB gz HTML player, about 18 kB React, ejectable skins and llms.txt. Tomato's core plus default skin should land at or below these numbers, measured by the same method and published in CI.
4. **v10 gaps today:** no native Vue/Svelte bindings (custom elements only), ads not shipped, no documented DRM guide (none found in its docs index on 2026-11-21), and a new, still-moving API.
