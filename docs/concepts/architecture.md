# Architecture

```
                ┌──────────────────────────── your app ─────────────────────────────┐
                │  React / Vue / Svelte binding   or   <tomato-player>   or   JS API │
                └───────────────────────────────┬───────────────────────────────────┘
                                                │ createPlayer(target, options)
┌───────────────────────────────────────────────▼───────────────────────────────────────────────┐
│ @tomato-player/core  (~5.7 KB gz)                                                               │
│  store (state)  ·  typed events  ·  provider selection  ·  skin host  ·  plugin host  ·  i18n   │
│  data-* attributes mirror state on the root element, so skins can be pure CSS                   │
└──────┬───────────────────────────────┬───────────────────────────────┬────────────────────────┘
       │ Provider                      │ Skin                          │ Plugin
┌──────▼──────────┐           ┌────────▼─────────┐            ┌────────▼──────────┐
│ native (always) │           │ @tomato-player/ui │            │ hotkeys, chapters, │
│ hls  → hls.js   │ lazy      │ primitives + base │            │ thumbnails, …      │
│ dash → dash.js  │ import()  │ CSS → 9 skins     │            │ provide()/inject() │
└─────────────────┘           └──────────────────┘            └────────────────────┘
```

## Principles

1. **The `<video>` element is the source of truth.** Core listens to native media events and mirrors them into a small immutable store. There is no second playback state machine to drift out of sync.
2. **Zero work at import time.** No package touches `window` or `document` until `createPlayer()` runs. That makes every package safe for SSR (Next.js, Nuxt, SvelteKit, Astro).
3. **Pay for what you use.** Engines (hls.js 174 KB gz, dash.js 234 KB gz) are optional peer dependencies loaded with `import()` only when a matching source plays.
4. **Everything is destroyable.** All listeners are bound to an `AbortSignal`, and plugins and skins return cleanups. `destroy()` restores the DOM exactly as it found it, which matters in SPAs where players mount and unmount constantly.
5. **Skins are data plus CSS.** State is reflected as `data-paused`, `data-waiting`, `data-fullscreen`, `data-idle`… attributes, so most skin behavior is a stylesheet.

## State

`player.state` is a frozen snapshot (`PlayerState`). Subscribe with:

- `player.store.subscribe((state, prev) => …)`: every change.
- `player.store.select(selector, (value, prev) => …)`: one derived value, fired immediately and on change.
- `player.on('statechange', ({ state, prev }) => …)`

## Providers

A provider decides **whether** it can play a source and **how** to attach an engine:

```ts
interface Provider {
  name: string;
  canPlay(source, media): boolean;
  create(ctx): ProviderInstance | Promise<ProviderInstance>; // async → code-split
}
```

Core tries `options.providers` in order and falls back to the native provider. Providers report qualities, audio tracks, live status and errors through `ctx.update(patch)`.

## Skins

A skin is `{ name, css, tokens, mount(player, root) }`. `@tomato-player/ui` provides accessible primitives (buttons, sliders, menus, overlays) and the `createSkin()` helper, so a typical skin is about 40 lines of TS plus a stylesheet. Skins can be swapped at runtime with `player.setSkin()`.

## Plugins

A plugin is `{ name, setup(player) → { api?, destroy? } }`. Plugins communicate through:

- events (`player.emit('plugin:chapters', …)`),
- capabilities (`player.provide('thumbnails', api)` / `player.inject('thumbnails')`). The time slider uses this to show thumbnails and chapter titles without depending on those plugins.

## Package map

| Package | Purpose |
| --- | --- |
| `@tomato-player/core` | Engine, types, store, events |
| `@tomato-player/ui` | Control primitives, icons, base CSS, `createSkin` |
| `@tomato-player/skin-*` | Installable skins |
| `@tomato-player/plugin-*` | Installable plugins |
| `@tomato-player/provider-*` | Streaming engine adapters |
| `@tomato-player/react` · `vue` · `svelte` | Framework bindings |
| `tomato-player` | Batteries-included bundle, `<tomato-player>` element, CDN build |
