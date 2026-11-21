# Developer Pain Points with Web Video Players

Each entry lists:
- the problem,
- evidence (issues, threads, docs),
- **how Tomato answers it** with a concrete design decision.

Issue comment counts were read from the GitHub search API on 2026-11-21.

## Summary

| # | Pain point | Severity | Tomato answer (short) |
|---|---|---|---|
| 1 | SSR / hydration crashes | High | Zero DOM access at import time. SSR-renderable markup. CI runs an SSR smoke test. |
| 2 | Bundle size | High | Per-feature packages. Engines lazy-loaded. Size budgets enforced in CI. |
| 3 | Styling and customization | High | CSS custom properties, `data-*` state, ejectable skins, no Shadow DOM by default |
| 4 | iOS Safari fullscreen and inline playback | High | Explicit fullscreen strategy object. `playsinline` on by default. Documented fallback. |
| 5 | Autoplay policies | High | `autoplay` returns a typed result. Muted-autoplay fallback. Never rejects silently. |
| 6 | Memory leaks / destroy in SPAs | High | Single `destroy()` contract, `AbortController` for all listeners, leak test harness |
| 7 | React re-render / Strict Mode | Med | Idempotent mount. External store with `useSyncExternalStore`. |
| 8 | Captions styling and rendering | Med | Custom cue renderer with token styling. Native `::cue` fallback in native fullscreen. |
| 9 | Accessibility gaps | High | WCAG 2.2 AA as a release gate. Axe tests and keyboard maps per skin. |
| 10 | Abandoned libraries | High | Thin adapters, stable provider contract, governance doc |
| 11 | TypeScript types | Med | TS-first. Typed events and state. Types tested with `tsd` or `expect-type`. |
| 12 | Ad integration | High | Ads as a provider-level plugin with a pause/resume contract. IMA loaded at runtime. |
| 13 | DRM complexity | Med | DRM is a config schema mapped to each engine. Shaka recommended for DRM. |
| 14 | Live / DVR edge cases | Med | Unified `live` state slice: `liveEdge`, `seekableWindow`, `atLiveEdge`, latency |

## 1. SSR / hydration

- **Problem:** many players touch `window`, `document` or `customElements` when imported. They crash Next.js, Nuxt and SvelteKit builds or cause hydration mismatches.
- **Evidence:**
  - Plyr: "doesn't work on next.js 14" ([#2770](https://github.com/sampotts/plyr/issues/2770)).
  - Plyr: static import breaks in Node >= 21 ([#2853](https://github.com/sampotts/plyr/issues/2853)).
  - Plyr: Angular Universal ([#1443](https://github.com/sampotts/plyr/issues/1443)).
  - ReactPlayer: Next.js / React 18 hydration error, 24 comments ([#1474](https://github.com/cookpete/react-player/issues/1474)).
  - Vidstack: "Cannot find module react-dom/server" ([#717](https://github.com/vidstack/player/issues/717)).
  - Video.js v10 needs a dedicated [Vue guide](https://videojs.org/docs/framework/html/guides/vue.md) for custom-element config. Its i18n guide covers "server rendering".
- **Tomato answer:**
  - Core and skins have no side effects at import (`"sideEffects": false` except CSS).
  - Custom-element registration happens in an explicit `define()` entry.
  - Framework bindings render real markup on the server: poster, controls skeleton and aspect-ratio box. This gives zero layout shift.
  - The engine attaches in `onMounted` / `useEffect`.
  - CI runs SSR smoke tests on Next (App Router), Nuxt, SvelteKit, Astro and Node 22/24.

## 2. Bundle size

- **Problem:** engines are 174-282 kB gz for the full entry. Players often bundle an engine even for MP4. "Import everything" APIs defeat tree-shaking.
- **Evidence:**
  - bundlephobia (2026-11-21), min+gz full entry: hls.js 174.3 kB, Shaka 282.3 kB, dash.js 233.8 kB, mux-player 306.2 kB, @clappr/player 242.7 kB.
  - Video.js says unbundling ABR was the main driver of v10's size cut ([beta post](https://videojs.org/blog/videojs-v10-beta-hello-world-again)).
- **Tomato answer:**
  - `@tomato/core` targets ≤ 10 kB gz. Default skin targets ≤ 15 kB gz. Both use native playback only.
  - Engines load through `import()` only when the source type needs them, and are skipped on Safari when native HLS is preferred.
  - Size budgets run per package in CI with `size-limit`. A public size table regenerates each release, using bundlephobia-compatible numbers and stating the method.

## 3. Styling and customization

- **Problem:** players fall into two traps:
  - Opaque class soup with high specificity (v8, Plyr).
  - Shadow DOM that blocks styling (web-component players).
  The result is CSS override wars, CSP issues from inline styles, and forks.
- **Evidence:**
  - Vidstack: CSP issue from inline styling ([#878](https://github.com/vidstack/player/issues/878)).
  - Vidstack: theming bug in SvelteKit ([#1102](https://github.com/vidstack/player/issues/1102)).
  - xgplayer: local CSS gives a black player ([#992](https://github.com/bytedance/xgplayer/issues/992)).
  - The industry answer is now ejectable skins: v10 integrates the `shadcn` CLI and unstyled single-element primitives ([beta post](https://videojs.org/blog/videojs-v10-beta-hello-world-again)).
- **Tomato answer:**
  - Light DOM by default.
  - State is exposed as `data-*` attributes, such as `data-paused` and `data-fullscreen`.
  - Theming uses design tokens as CSS custom properties, plus `@layer tomato` so user CSS always wins without `!important`.
  - No inline `style` writes except CSS variables, which keeps strict CSP clean.
  - `npx tomato eject <skin>` copies the skin source into the app.

## 4. iOS Safari: fullscreen, inline playback, native HLS

- **Problem:**
  - iPhone Safari supports fullscreen only on the `<video>` element (`webkitEnterFullscreen`), not on a container div. Custom controls and overlays disappear in native fullscreen.
  - Without `playsinline`, video takes over the screen.
  - iOS has native HLS. MSE arrived on iPhone only as `ManagedMediaSource` (Safari 17.1).
- **Evidence:**
  - [Apple forums: Fullscreen API on non-video element](https://developer.apple.com/forums/thread/133248).
  - [WebKit bug 240312](https://bugs.webkit.org/show_bug.cgi?id=240312).
  - [web.dev mobile playback guide](https://web.dev/articles/media-mobile-web-video-playback).
  - [WebKit: video policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/).
  - [Safari 17.1 features (ManagedMediaSource)](https://webkit.org/blog/14735/webkit-features-in-safari-17-1/).
  - hls.js `preferManagedMediaSource` and AirPlay detach behaviour ([API.md](https://github.com/video-dev/hls.js/blob/master/docs/API.md)).
  - Plyr "Fullscreen on iPad", 22 comments ([#768](https://github.com/sampotts/plyr/issues/768)).
  - hls.js AirPlay issue on iOS ([#6482](https://github.com/video-dev/hls.js/issues/6482)).
- **Tomato answer:**
  - `fullscreen` is a strategy: `container` (Fullscreen API), then `native-video` (iOS fallback), then `pseudo` (CSS fixed overlay that keeps custom UI). The order is configurable.
  - State reports which mode is active, so the skin can adapt.
  - `playsinline` is on by default.
  - The provider selection matrix is documented and testable. On Safari, prefer native HLS unless the user needs features native HLS lacks (CMCD, custom ABR). In that case use hls.js with `ManagedMediaSource`.
  - A real-device test lane covers iOS through BrowserStack or a similar service.

## 5. Autoplay policies

- **Problem:** `play()` rejects under the browser autoplay policy. Libraries often swallow the rejection, or users see a frozen poster. Ad SDKs compound this.
- **Evidence:**
  - [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay).
  - [WebKit iOS policies](https://webkit.org/blog/6784/new-video-policies-for-ios/).
  - Video.js "Autoplay not working on chrome", 44 comments ([#4720](https://github.com/videojs/video.js/issues/4720)).
  - videojs-ima "robust support for autoplay", 27 comments ([#341](https://github.com/googleads/videojs-ima/issues/341)).
  - Chrome 66 preroll hang ([#635](https://github.com/googleads/videojs-ima/issues/635)).
- **Tomato answer:**
  - `autoplay: 'muted-fallback' | 'strict' | false`.
  - `player.play()` resolves to a typed result: `{ ok: true } | { ok: false, reason: 'not-allowed' | 'aborted' | 'source-error' }`.
  - A built-in "tap to unmute" affordance appears when autoplay falls back to muted.
  - A `canAutoplay()` probe is available.

## 6. Memory leaks and destroy in SPAs

- **Problem:** engines and UIs leak listeners, workers, MSE buffers, `ResizeObserver` instances and text-track cues across route changes. Many players lack an idempotent destroy.
- **Evidence:**
  - hls.js "Possible memory leak w/ multiple Hls players", 68 comments ([#1220](https://github.com/video-dev/hls.js/issues/1220)).
  - hls.js live VTT cues never cleaned up ([PR #2309](https://github.com/video-dev/hls.js/pull/2309)).
  - dash.js subtitles leak of about 20 MB/hour ([#4290](https://github.com/Dash-Industry-Forum/dash.js/issues/4290)).
  - dash.js 608 parser and `ResizeObserver` leaks fixed 2026-06 ([PR #5042](https://github.com/Dash-Industry-Forum/dash.js/pull/5042)).
  - Shaka ABR leak on destroy ([PR #5149](https://github.com/shaka-project/shaka-player/pull/5149)).
  - Plyr "Destroy Method" ([#77](https://github.com/sampotts/plyr/issues/77)).
  - Video.js "m3u8 not release memory" ([#5567](https://github.com/videojs/video.js/issues/5567)).
- **Tomato answer:**
  - Every module receives an `AbortSignal` scoped to the player. All listeners, observers and timers register through it.
  - `destroy()` is async, idempotent, and awaits provider teardown: `hls.destroy()`, `shaka.destroy()`, and clearing `src` plus `load()`.
  - The test suite mounts and unmounts 100 players and asserts heap and listener counts in Playwright with CDP.

## 7. React re-render and Strict Mode

- **Problem:** imperative players inside React break under Strict Mode double-mount. Props changes re-create the player. High-frequency `timeupdate` state re-renders the whole tree.
- **Evidence:**
  - Video.js "React 18 StrictMode does not work with typical usage" ([#7746](https://github.com/videojs/video.js/issues/7746)).
  - The official guide needs ref guards and an `isDisposed()` check ([legacy guide](https://legacy.videojs.org/guides/react/)).
  - Plyr + React, 21 comments ([#254](https://github.com/sampotts/plyr/issues/254)).
  - Vidstack initial `volume`/`muted` props not respected, 21 comments ([#1416](https://github.com/vidstack/player/issues/1416)).
- **Tomato answer:**
  - The player is an external store. React reads it with `useSyncExternalStore` and selectors: `usePlayer(s => s.paused)`.
  - Time display components subscribe directly, not through React state.
  - Mount is idempotent and survives Strict Mode.
  - Initial props become initial state; later prop changes become commands, so the player is never re-created.
  - Vue (`shallowRef` + composables) and Svelte (stores/runes) follow the same pattern.

## 8. Captions styling and rendering

- **Problem:** `::cue` styling is limited and inconsistent across browsers. Custom renderers do not apply in iOS native fullscreen. Users need caption settings (size, background) for accessibility. ASS/SSA needs a heavy WASM renderer.
- **Evidence:**
  - [MDN `::cue`](https://developer.mozilla.org/en-US/docs/Web/CSS/::cue).
  - Video.js "Styling texttracks" ([#4852](https://github.com/videojs/video.js/issues/4852)).
  - Video.js "Text track font looks too small on audios" ([#6223](https://github.com/videojs/video.js/issues/6223)).
  - Video.js "Handle switching between sets of text tracks", 50 comments ([#2369](https://github.com/videojs/video.js/issues/2369)).
  - Video.js browser lock while parsing VTT ([#1913](https://github.com/videojs/video.js/issues/1913)).
  - JASSUB WASM worker is about 926 kB gz (bundlephobia).
- **Tomato answer:**
  - A DOM cue renderer styled by tokens, with a persisted user caption-settings panel.
  - Native tracks are kept in sync, so iOS native fullscreen still shows captions through `::cue`.
  - VTT parsing runs off the main thread for large files.
  - ASS/SSA is an opt-in `@tomato/plugin-ass` plugin using JASSUB, lazy-loaded.

## 9. Accessibility gaps

- **Problem:** players ship controls without proper roles, labels, focus order, or keyboard support. Screen readers do not hear announcements. Audits fail WCAG AA.
- **Evidence:**
  - Plyr "Multiple Issues making player invalid for WCAG 2.0 AA", 48 comments ([#905](https://github.com/sampotts/plyr/issues/905)).
  - Plyr follow-ups [#1794](https://github.com/sampotts/plyr/issues/1794) and [#2834](https://github.com/sampotts/plyr/issues/2834).
  - Video.js captions dialog labelling ([PR #3281](https://github.com/videojs/video.js/pull/3281)).
  - [W3C WAI media guide](https://www.w3.org/WAI/media/av/).
- **Tomato answer:**
  - WCAG 2.2 AA is a release gate for every official skin. CI runs axe-core, and a manual screen-reader checklist (VoiceOver and NVDA) runs per release.
  - Keyboard shortcuts are scoped to the focused player, never to the global page.
  - A live region announces seek, volume and caption changes.
  - `prefers-reduced-motion` is respected.
  - The skin contract requires a documented keyboard map.

## 10. Abandoned or deprecated libraries

- **Problem:** teams bet on a UI layer that then dies.
- **Evidence:**
  - Plyr is deprecated. Vidstack is security-only until Jan 2028 (npm READMEs).
  - flv.js has not been pushed since 2024-07, with 450 open issues.
  - clappr-core and castable-video are archived. libass-wasm has had no release since 2022.
  - The `video.js` npm `latest` tag now ships no player, which surprises v8 users ([llms.txt](https://videojs.org/llms.txt)).
- **Tomato answer:**
  - Keep the dependency surface small and swappable. Each third-party library sits behind a provider or plugin interface. Replacing one is a one-package change.
  - Publish `GOVERNANCE.md`, a support/LTS policy, and migration codemods from Plyr, Vidstack and v8 to win orphaned users.

## 11. TypeScript types

- **Problem:** types are missing, hand-written, or loose: `any` events, untyped plugin options.
- **Evidence:**
  - Plyr typings arrived as a community PR ([#1521](https://github.com/sampotts/plyr/pull/1521)).
  - IMA types live in DefinitelyTyped `@types/google_interactive_media_ads_types` ([Google guide](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side)).
  - Video.js v10 needs a dedicated TS module-resolution guide ([index](https://videojs.org/docs/framework/html/llms.txt)).
- **Tomato answer:**
  - Written in strict TS.
  - Typed event map: `player.on('qualitychange', e => e.detail.level)`.
  - Plugin options are inferred through declaration merging.
  - Types are tested.
  - Ships ESM only with an `exports` map and `types` conditions.

## 12. Ad integration

- **Problem:** IMA needs its own ad container, conflicts with custom controls, and has iOS and autoplay failures. Error paths leave the player hung.
- **Evidence:**
  - videojs-ima "[iOS/Safari] AdError 400 ... 1205", 23 comments ([#803](https://github.com/googleads/videojs-ima/issues/803)).
  - "Ad freezes in Safari after start" ([#428](https://github.com/googleads/videojs-ima/issues/428)).
  - DAI `onAddTrack` errors, 2025 ([#1184](https://github.com/googleads/videojs-ima/issues/1184)).
  - Shaka A/V sync regression after dynamic ad break, 47 comments ([#4589](https://github.com/shaka-project/shaka-player/issues/4589)).
  - Video.js v10 has not shipped ads yet ([roadmap](https://videojs.org/docs/framework/html/concepts/v10-roadmap)).
- **Tomato answer:**
  - An `ads` state slice: `adPlaying`, `adBreak`, `skippableIn`. The skin switches to ad mode from this state.
  - A plugin contract (`requestAds`, `onContentPauseRequested`, `onContentResumeRequested`) has adapters for IMA (loaded at runtime from Google's URL) and VAST-only.
  - A watchdog timeout always resumes content after an ad error.

## 13. DRM complexity

- **Problem:** each engine has a different DRM config. FairPlay on Safari needs certificates and custom license request and response handling. Native HLS and MSE paths differ.
- **Evidence:**
  - Shaka "Safari Fairplay MediaKeys Polyfill", 79 comments ([#382](https://github.com/shaka-project/shaka-player/issues/382)).
  - "HLS FAIRPLAY with DRM not working with v4.0.0", 51 comments ([#4211](https://github.com/shaka-project/shaka-player/issues/4211)).
  - Modern EME FairPlay ([PR #3776](https://github.com/shaka-project/shaka-player/pull/3776)).
  - Video.js "Cannot play SAMPLE-AES", 29 comments ([#6893](https://github.com/videojs/video.js/issues/6893)).
- **Tomato answer:**
  - A single `drm` schema (`{ widevine, playready, fairplay: { certificateUrl, licenseUrl, prepareLicenseRequest } }`), translated by each adapter.
  - Shaka is the recommended DRM adapter.
  - A `drmSupport()` probe uses `requestMediaKeySystemAccess`.
  - A test matrix lives in the docs.
  - Tomato does not implement EME itself.

## 14. Live / DVR edge cases

- **Problem:** behaviour differs by engine:
  - live-edge snapping,
  - seeking in an unbuffered DVR window,
  - `duration = Infinity`,
  - "Live" badge state,
  - low-latency catch-up.
- **Evidence:**
  - hls.js "Unnecessary snapping to live edge during startup" ([#6998](https://github.com/video-dev/hls.js/issues/6998)).
  - hls.js "Not possible to seek in unbuffered live range (LL-HLS)" ([#3598](https://github.com/video-dev/hls.js/issues/3598)).
  - hls.js "Time-shifting functionality with live streams?" ([#4004](https://github.com/video-dev/hls.js/issues/4004)).
  - mpegts.js latency chasing through `playbackRate` ([PR #54](https://github.com/xqq/mpegts.js/pull/54)).
- **Tomato answer:**
  - A normalized `live` slice: `streamType: 'on-demand' | 'live' | 'live-dvr'`, `seekableStart`, `liveEdge`, `atLiveEdge` (with tolerance), `latency`, `targetLatency`.
  - The timeline component renders the DVR window, not `duration`.
  - Each adapter maps its engine to the same slice. Conformance tests use the same test streams for every adapter.
