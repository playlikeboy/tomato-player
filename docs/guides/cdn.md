# Use Tomato Player from a CDN (jsDelivr)

Tomato Player runs from a `<script>` tag with no build step. jsDelivr serves it straight from the GitHub repository, so this works today, before the npm packages are published.

Every push to `main` that touches `packages/` rebuilds the player and publishes the browser-ready files to the [`cdn` branch](https://github.com/playlikeboy/tomato-player/tree/cdn). jsDelivr serves that branch at:

```
https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/
```

## Option 1: one script, everything included

`tomato-player.global.js` contains the core, the UI primitives, all nine skins, all eight plugins and the `<tomato-player>` element. It exposes a global `TomatoPlayer` and registers the element.

```html
<script src="https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/tomato-player.global.js"></script>

<!-- Declarative -->
<tomato-player src="movie.mp4" poster="poster.jpg" title="My film" skin="cinema" accent="#e5402c">
  <track kind="captions" src="captions.en.vtt" srclang="en" label="English" />
</tomato-player>

<!-- Imperative -->
<div id="player"></div>
<script>
  const { createPlayer, minimal, hotkeys } = window.TomatoPlayer;
  createPlayer('#player', {
    src: 'movie.mp4',
    title: 'My film',
    skin: minimal(),
    plugins: [hotkeys()],
  });
</script>
```

### HLS and DASH

The bundle does not include hls.js or dash.js. Point the provider at the library and it is fetched only when a stream needs it:

```html
<script>
  const { createPlayer, hls, dash, tube } = window.TomatoPlayer;
  createPlayer('#player', {
    src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    providers: [hls({ library: 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js' })],
    skin: tube(),
  });
</script>
```

Safari plays HLS natively, so hls.js is never downloaded there.

## Option 2: ES modules with an import map

Load only the packages you use. Each package is published under `esm/<name>/index.js`, and the branch includes a ready-made [`importmap.json`](https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/importmap.json) that maps every package name, plus `hls.js` and `dashjs`.

```html
<script type="importmap">
  {
    "imports": {
      "@tomato-player/core": "https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/core/index.js",
      "@tomato-player/ui": "https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/ui/index.js",
      "@tomato-player/skin-stream": "https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/skin-stream/index.js",
      "@tomato-player/provider-hls": "https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/provider-hls/index.js",
      "@tomato-player/plugin-hotkeys": "https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/plugin-hotkeys/index.js",
      "hls.js": "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.mjs"
    }
  }
</script>

<div id="player"></div>
<script type="module">
  import { createPlayer } from '@tomato-player/core';
  import { stream } from '@tomato-player/skin-stream';
  import { hls } from '@tomato-player/provider-hls';
  import { hotkeys } from '@tomato-player/plugin-hotkeys';

  createPlayer('#player', {
    src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    providers: [hls()],
    skin: stream({ subtitle: 'S1:E1' }),
    plugins: [hotkeys()],
  });
</script>
```

A skin imports `@tomato-player/ui`, which imports `@tomato-player/core`, so keep both in the map whenever you load a skin. Package names follow the npm names: `@tomato-player/skin-<name>`, `@tomato-player/plugin-<name>`, `@tomato-player/provider-hls`, `@tomato-player/provider-dash`.

The React, Vue and Svelte bindings are not on the CDN branch: they need your framework and a bundler. Use npm for those once the packages are published.

## Pinning a version

`@cdn` always points at the latest build of `main`, and jsDelivr caches a branch for up to 12 hours. For production, pin the exact build with a commit hash from the [`cdn` branch history](https://github.com/playlikeboy/tomato-player/commits/cdn):

```
https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@<commit>/tomato-player.global.js
```

A pinned URL never changes, so it is cached for a long time and is safe to use with Subresource Integrity. jsDelivr shows the `integrity` hash for any file at `https://www.jsdelivr.com/package/gh/playlikeboy/tomato-player`.

## After the npm release

Once the packages are on npm, jsDelivr serves them from the npm registry too, with semver ranges:

```html
<script src="https://cdn.jsdelivr.net/npm/tomato-player@0/dist/tomato-player.global.js"></script>
```

and `https://cdn.jsdelivr.net/npm/@tomato-player/core@0/+esm` for single packages. Until then, `npm i tomato-player` and `npm i @tomato-player/...` return `404 Not Found`; use the GitHub URLs above.

## Content Security Policy

Allow the CDN in `script-src`, and in `connect-src` and `media-src` for your streams:

```
script-src 'self' https://cdn.jsdelivr.net;
```

The player injects its CSS in a `<style>` element. If your `style-src` forbids inline styles, pass `injectStyles: false` and link the stylesheets from the CDN instead, base first:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/ui/base.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/esm/skin-stream/style.css" />
```

```js
createPlayer('#player', { src: 'movie.mp4', skin: stream(), injectStyles: false });
```
