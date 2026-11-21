# Changelog

## 0.1.0 (2026-11-21)

First public release.

- **core:** player engine with immutable store, typed events, provider selection, runtime skin swapping, plugins with `provide`/`inject`, i18n, AbortSignal-scoped lifecycle, SSR-safe imports, autoplay fallback to muted, iPhone pseudo-fullscreen fallback.
- **ui:** accessible primitives (buttons, sliders, settings menu, time and live displays, overlays, caption overlay, cast, in-view autoplay), original icon set, base stylesheet with design tokens and container queries, `createSkin()`.
- **skins:** Minimal, Cinema, Studio, Creator, Learn, Campus (from the CampusLoop landing page), and the unofficial Stream, Tube and Feed.
- **plugins:** hotkeys, gestures, chapters, thumbnails, playlist, analytics, media-session, persist.
- **providers:** HLS (hls.js) and DASH (dash.js), lazy-loaded optional peers.
- **integrations:** React, Vue, Svelte, `<tomato-player>` web component, CDN/IIFE bundle.
- **tooling:** scaffolder, manifest validator, size budgets, playground, llms.txt.
