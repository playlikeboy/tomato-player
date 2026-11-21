# Roadmap

Priorities come from the [research collection](./research/README.md). P0 items ship first.

## 0.1 (this release)

- [x] Core engine: store, typed events, providers, skins, plugins, i18n, SSR-safe, AbortSignal lifecycle
- [x] UI primitives, base CSS, design tokens, container-query responsive layout
- [x] 9 skins: Minimal, Cinema, Studio, Creator, Learn, Campus, plus the unofficial Stream, Tube and Feed
- [x] 8 plugins: hotkeys, gestures, chapters, thumbnails, playlist, analytics, media session, persist
- [x] HLS (hls.js) and DASH (dash.js) providers, lazy-loaded
- [x] React, Vue and Svelte bindings, `<tomato-player>` web component, CDN/IIFE build
- [x] Skin and plugin scaffolder, manifest validator, size budgets

## Next (P0)

- [ ] `provider-shaka` with a unified DRM schema (Widevine, PlayReady, FairPlay)
- [ ] Plyr compatibility shim (`@tomato-player/compat-plyr`) and codemod
- [ ] Docs website with live examples, generated from `docs/` (Markdown remains the source)
- [ ] Skin gallery: searchable catalog of `tomato-player-skin` packages with live previews
- [ ] Playwright visual and a11y regression matrix (Chrome, Firefox, WebKit, iOS)
- [ ] Memory-leak harness: 1,000 create/destroy cycles per provider in CI

## Later (P1)

- [ ] Ads: VAST/VMAP plugin, plus a Google IMA adapter loaded at runtime (never redistributed)
- [ ] Google Cast sender plugin (runtime-loaded SDK)
- [ ] YouTube, Vimeo and Mux embed providers
- [ ] CMCD/CMSD reporting through providers
- [ ] ASS/SSA subtitles via an opt-in JASSUB plugin (LGPL, kept out of core)
- [ ] Transcript panel and searchable captions (Learn skin)
- [ ] Solid and Angular bindings

## Exploring (P2)

- [ ] AI-generated chapters and summaries as an optional plugin
- [ ] WebCodecs frame-accurate scrubbing for the Studio skin
- [ ] View Transitions between inline, theater and fullscreen
