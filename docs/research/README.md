# Tomato Player: Research Collection

Snapshot date: **2026-11-21**. All data comes from npm registry, GitHub API, bundlephobia, official docs and issue trackers, with sources linked inline. Re-run the checks before making release decisions.

| File | Contents |
|---|---|
| [landscape.md](./landscape.md) | Comparison of 14 major players and engines plus 12 smaller building blocks: license, version, maintenance and size |
| [developer-pain-points.md](./developer-pain-points.md) | 14 pain points, each with linked evidence and a concrete Tomato design decision |
| [integration-strategy.md](./integration-strategy.md) | Reuse / learn / avoid per library, peer vs bundled, lazy-loading, license obligations |
| [opportunities.md](./opportunities.md) | Differentiators with value, cost and priority, and a recommended P0 launch set |

## Executive summary: top 10 findings

1. **Video.js v10 (GA 2026-10-01) is the direct competitor.** It has a modular store, unstyled primitives, ejectable skins and a self-reported ~25 kB gz player. "Small and modular" alone does not differentiate. [landscape §1](./landscape.md#1-the-big-structural-change-videojs-v10-absorbed-plyr-vidstack-and-media-chrome)
2. **Plyr is deprecated and Vidstack is security-only until Jan 2028.** Their users are migrating now, so compat shims and codemods are a P0 acquisition channel. [landscape §2](./landscape.md#2-comparison-table), [opportunities §1](./opportunities.md#1-positioning-gaps-vs-videojs-v10)
3. **v10 has no native Vue or Svelte components.** It relies on custom elements plus compiler config, so first-class Vue and Svelte bindings are Tomato's clearest gap to fill. [opportunities §1](./opportunities.md#1-positioning-gaps-vs-videojs-v10)
4. **v10 has not shipped ads yet, and no DRM guide was found in its docs.** Unified ads and DRM schemas over Shaka, dash.js and IMA are P1 differentiators for publishers and OTT. [opportunities §1](./opportunities.md#1-positioning-gaps-vs-videojs-v10)
5. **Engines are huge and solved.** Full-entry min+gz sizes are hls.js 174 kB, dash.js 234 kB and Shaka 282 kB. Use them as optional peer-dep adapters, lazy-loaded, and never inside the core. [integration §1](./integration-strategy.md#1-decisions-per-library)
6. **SSR and hydration breakage is the most common integration failure.** Evidence: Plyr on Next 14 and Node 21+, ReactPlayer hydration, Vidstack react-dom/server. Make import-time side effects zero and run SSR CI on 5 frameworks. [pain #1](./developer-pain-points.md#1-ssr--hydration)
7. **SPA memory leaks recur in every engine:** hls.js #1220, dash.js subtitles at 20 MB/h, Shaka ABR. An `AbortSignal`-scoped lifecycle plus a public leak harness is cheap credibility. [pain #6](./developer-pain-points.md#6-memory-leaks-and-destroy-in-spas)
8. **iPhone fullscreen works only on `<video>`.** Custom UI disappears in native fullscreen. A three-mode fullscreen strategy that includes pseudo-fullscreen is a P0 UX fix. [pain #4](./developer-pain-points.md#4-ios-safari-fullscreen-inline-playback-native-hls)
9. **Accessibility is a public weak spot of rivals.** Plyr's WCAG AA issue has 48 comments. Make WCAG 2.2 AA a release gate plus a published per-skin a11y report. [pain #9](./developer-pain-points.md#9-accessibility-gaps)
10. **License hygiene is manageable:**
    - hls.js and Shaka have no `NOTICE` file, but keep the hls.js LICENSE with its Dailymotion and Brightcove attribution.
    - dash.js is BSD-3 with a no-endorsement clause.
    - JASSUB is LGPL, so it must stay an opt-in plugin.
    - Google IMA and Cast are proprietary: load them at runtime and never redistribute.

    [integration §4](./integration-strategy.md#4-licenses-and-attribution-obligations)

## Method notes and caveats

- Bundlephobia sizes measure the full default entry without tree-shaking. Vendor-reported sizes (Video.js v10) use their own method and are labelled as such.
- GitHub "open issues" counts include PRs. Star counts are a weak signal.
- Spec dates for CMCD v2 (CTA-5004-B) conflict between sources, so they are not stated as fact.
- No Reddit threads surfaced in the searches. Pain-point evidence relies on GitHub issues and official docs.
