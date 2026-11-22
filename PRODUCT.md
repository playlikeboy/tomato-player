# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: media, OTT and learning-platform teams (streaming services, course and LMS products, video platforms) choosing a web video player for a product they ship. They evaluate on streaming (HLS/DASH, quality switching), captions and accessibility, analytics, and how far the player's interface can be made their own.

Secondary: product frontend developers adding video to React, Vue or Svelte apps, and indie builders who want a good-looking player fast.

## Product Purpose

Tomato Player is an open-source (MIT) web video player: a small dependency-free core with swappable skins, plugins and lazy-loaded streaming engines, plus React, Vue, Svelte, web-component and CDN builds. Success is a team shipping a player that looks like their product, not like a stock player, without forking the engine.

## Positioning

Skins are the product. One engine runs many complete, swappable interfaces (nine today, including the CampusLoop sticker skin and three unofficial platform-inspired ones), switchable at runtime and themed with `--tp-*` design tokens. Competing players offer one UI plus theming; Tomato Player treats the whole interface as a replaceable layer.

## Operating Context

Visitors evaluate in the browser: they watch the live players, switch skins, compare streams, read docs and copy code. The website (`apps/website`) is a Next.js static export on GitHub Pages, built with the Astryx design system. The player packages live in `packages/` (core, ui, skins, plugins, providers, integrations).

## Capabilities and Constraints

- Core under 6 KB gzip; skins, plugins and engines are separate packages.
- HLS (hls.js, native on Safari) and DASH (dash.js), both lazy-loaded.
- WebVTT captions, chapters, seek thumbnails, playlists, analytics events, hotkeys, gestures, Media Session, persisted settings.
- SSR-safe; React, Vue, Svelte bindings; `<tomato-player>` element; IIFE CDN build.
- Stream, Tube and Feed skins are unofficial, platform-inspired: no third-party logos, fonts or assets, and no implied affiliation.
- npm packages are not yet published (v0.1.0).

## Brand Commitments

- Name: Tomato Player; the tomato logo (`.github/assets/logo.svg`) and a tomato-red identity stay.
- The website is built with Astryx components (`@astryxdesign/core`), themed through an Astryx theme.
- The website is dark-first.

## Evidence on Hand

- Live players with Big Buck Bunny (Blender Foundation, CC BY 3.0), Mux and Akamai test streams, Tears of Steel (Unified Streaming demo).
- Skin screenshots in `.github/assets/skin-*.png`; measured package sizes at build time.
- No customers, testimonials, benchmarks, download counts or GitHub-star figures exist; none may be invented.

## Product Principles

1. The interface is a layer you own: every surface should show the skin system working, not describe it.
2. Prove with live players and real measurements, never with claims.
3. Ship only what is used: small core, lazy engines, opt-in plugins.
4. Accessible by default: real controls, visible focus, captions and keyboard support in every skin.

## Accessibility & Inclusion

Every official skin targets WCAG 2.2 AA: labelled buttons and sliders, visible focus, controls kept visible while focus is inside, captions, keyboard shortcuts, reduced-motion respect.
