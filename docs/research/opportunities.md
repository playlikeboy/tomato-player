# Opportunities and Differentiators

Context: Video.js v10 already ships a modular store, unstyled primitives, ejectable skins (shadcn), presets, casting, thumbnails, live/DVR, i18n, llms.txt and an agent skill ([docs index](https://videojs.org/docs/framework/html/llms.txt)). Plain "modular and small" is **table stakes**. Tomato's differentiators should target the gaps.

Priority key:
- **P0**: must have for launch or positioning.
- **P1**: within 2-3 releases.
- **P2**: later or exploratory.

## 1. Positioning gaps vs Video.js v10

| Gap | Evidence | Opportunity | Value | Cost | Priority |
|---|---|---|---|---|---|
| No native Vue/Svelte components. v10 uses custom elements plus `isCustomElement` config. | [Vue guide](https://videojs.org/docs/framework/html/guides/vue.md), [Svelte guide](https://videojs.org/docs/framework/html/guides/svelte.md) | First-class `@tomato/vue` (composables, typed props and emits, Nuxt module) and `@tomato/svelte` (runes, SvelteKit SSR) | High: large underserved audiences | Med | **P0** |
| Ads not shipped (roadmap) | [v10 roadmap](https://videojs.org/docs/framework/html/concepts/v10-roadmap) | Ads slice plus IMA and VAST adapters with a watchdog | High for publishers | High | P1 |
| No DRM guide in the v10 docs index (as of 2026-11-21) | [docs index](https://videojs.org/docs/framework/html/llms.txt) | Unified `drm` schema across Shaka, dash.js and hls.js, plus a `drmSupport()` probe | High for OTT | Med | P1 |
| Orphaned Plyr and Vidstack users (deprecated or security-only) | npm READMEs | Codemods and API-compat shims (`@tomato/compat-plyr`): a near drop-in for `new Plyr(el, opts)` | High: fast adoption | Med | **P0** |
| v10 sits close to one vendor (Mux) | [Mux blog](https://www.mux.com/blog/five-players-one-future-how-we-re-building-video-js-v10) | Vendor-neutral governance, with no default analytics vendor | Med (trust) | Low | P0 |

## 2. Product and technical ideas

| Idea | What | Value | Cost | Priority | Ref |
|---|---|---|---|---|---|
| **Accessibility-first defaults** | WCAG 2.2 AA release gate, caption-settings panel, scoped shortcuts, live-region announcements, published per-skin a11y report | High: public a11y issues exist in rivals (e.g. Plyr #905) | Med | **P0** | [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/), [Plyr #905](https://github.com/sampotts/plyr/issues/905) |
| **Design tokens** | Skins consume DTCG-format tokens that compile to CSS custom properties. Theme in one JSON file and share themes. | High: kills CSS override wars | Low | **P0** | [DTCG format draft](https://www.designtokens.org/tr/drafts/format/) |
| **Container queries for responsive controls** | Controls adapt to the player's size, not the viewport. Fits embeds, cards and PiP. | High | Low | **P0** | [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) |
| **Public size budgets in CI** | Per-package `size-limit`, with an auto-generated table using the same method as competitors | High: credibility | Low | **P0** | [bundlephobia](https://bundlephobia.com) |
| **Media Session API by default** | Lock screen and hardware keys, artwork, chapter titles, seek handlers | Med | Low | **P0** | [MDN Media Session](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API) |
| **llms.txt + agent skill + MCP docs server** | Table stakes now (v10 has llms.txt and [videojs/skills](https://github.com/videojs/skills)). Go further: typed API JSON, copy-paste recipes, and docs examples type-checked in CI. | Med (parity) | Low | P0 (parity) | [llmstxt.org](https://llmstxt.org/) |
| **Skin marketplace mechanics** | `tomato add skin <name>` registry, compatible with the shadcn registry format. Skins declare `requires: ['captions','quality']`, a size, a11y score and a screenshot. Community skins get CI-validated badges. | High: ecosystem moat | Med-High (registry, moderation) | P1 | [v10 shadcn install](https://videojs.org/docs/guides/installation/shadcn.md) |
| **CMCD v2 / CMSD plugin** | One config across native, hls.js and dash.js. hls.js master docs already describe v2 event mode; dash.js uses `@svta/cml-cmcd`. | Med-High: CDN QoE, ties into Fastly-style edges | Low (wrap SVTA) | P1 | [hls.js API.md](https://github.com/video-dev/hls.js/blob/master/docs/API.md), [Fastly CMCDv2](https://www.fastly.com/blog/cmcdv2-leveling-up-your-video-streaming-telemetry) |
| **Vendor-neutral QoE events** | Typed, normalized playback events (startup, rebuffer, error, bitrate) that any analytics sink can subscribe to. OpenTelemetry exporter as a plugin. | Med | Low | P1 | n/a |
| **Pseudo-fullscreen + iOS strategy** | Keep custom UI on iPhone through a CSS fixed overlay when the Fullscreen API on containers is unavailable | High: a top iOS complaint | Low | **P0** | [Apple forums](https://developer.apple.com/forums/thread/133248) |
| **Document Picture-in-Picture** | PiP window with full custom controls (Chromium) | Med | Low | P1 | [MDN Document PiP](https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API) |
| **View Transitions** | Smooth inline-to-expanded or mini-player transitions, for example between SPA routes | Low-Med (delight) | Low | P2 | [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) |
| **WebCodecs** | Frame-accurate thumbnails and scrubbing previews generated on the client. Clip export. Low-latency custom pipelines. | Med (niche, powerful) | High | P2 | [MDN WebCodecs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) |
| **Thumbnail tooling** | `@tomato/cli thumbnails` generates sprite sheets and VTT storyboards with ffmpeg | Med | Low | P1 | n/a |
| **AI-generated chapters plugin** | Server-side or BYO-model transcript to chapters (VTT `kind="chapters"`). The player only consumes chapters. Ship the generator as a separate CLI with a pluggable LLM provider. | Med (buzz plus real value for long-form) | Med | P2 | n/a |
| **Auto transcripts panel** | Searchable, interactive transcript from caption tracks. This is an a11y and SEO win. | Med | Low | P1 | [WAI media](https://www.w3.org/WAI/media/av/) |
| **Background/ambient preset** | Under 4 kB player for hero videos (no UI, `prefers-reduced-motion` aware) | Med: v10 already has one at 3.5 kB React | Low | P1 | [v10 beta post](https://videojs.org/blog/videojs-v10-beta-hello-world-again) |
| **Accept any HTMLMediaElement-like element** | Skins work over `<video>`, `<audio>`, `<hls-video>`, `<mux-video>` and `<youtube-video>` through one contract | High: reuses the Mux elements ecosystem | Low | P1 | [muxinc/elements](https://github.com/muxinc/elements) |
| **Leak and SSR conformance suite (public)** | Publish the harness that mounts and unmounts 100 players and runs SSR in 5 frameworks. Invite other players to run it. | Med (credibility) | Med | P1 | See [pain points](./developer-pain-points.md) |
| **MoQ (Media over QUIC)** | Watch only. v10 lists it on its roadmap. | Low now | High | P2 | [v10 roadmap](https://videojs.org/docs/framework/html/concepts/v10-roadmap) |

## 3. Recommended P0 launch set

1. Native React, Vue and Svelte bindings over one store.
2. SSR-safe packages, verified by a public conformance suite.
3. Core ≤ 10 kB gz, skin ≤ 15 kB gz, published size table.
4. Token-driven, container-query-responsive, a11y-gated default skin.
5. iOS fullscreen strategy, Media Session, and a typed autoplay result.
6. hls.js adapter, with Shaka and dash.js adapters close behind.
7. Plyr and Vidstack migration codemods and compat shims.
8. llms.txt and agent skill (parity).
