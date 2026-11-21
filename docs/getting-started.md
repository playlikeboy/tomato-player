# Getting started

## 1. Install

```sh
npm i @tomato-player/core @tomato-player/skin-minimal
# pnpm add …  /  yarn add …  /  bun add …
```

Or install the batteries-included bundle (core, UI, every official skin and plugin):

```sh
npm i tomato-player
```

## 2. Create a player

```html
<div id="player"></div>
```

```ts
import { createPlayer } from '@tomato-player/core';
import { minimal } from '@tomato-player/skin-minimal';

const player = createPlayer('#player', {
  src: 'https://example.com/movie.mp4',
  poster: 'https://example.com/poster.jpg',
  title: 'My movie',
  skin: minimal(),
});
```

`createPlayer` accepts a selector, a container element or an existing `<video>` (which gets wrapped and is restored on `destroy()`).

## 3. Add what you need

```ts
import { hls } from '@tomato-player/provider-hls'; // npm i hls.js
import { hotkeys } from '@tomato-player/plugin-hotkeys';
import { chapters } from '@tomato-player/plugin-chapters';

createPlayer('#player', {
  src: 'https://example.com/stream.m3u8',
  providers: [hls()],
  plugins: [hotkeys(), chapters({ chapters: '/chapters.vtt' })],
  tracks: [{ src: '/en.vtt', srclang: 'en', label: 'English', kind: 'captions' }],
  skin: minimal(),
});
```

Nothing you don't import is shipped. hls.js is downloaded only when an HLS source actually plays, and never on Safari, which plays HLS natively.

## 4. No bundler? Use the CDN

```html
<script src="https://cdn.jsdelivr.net/npm/tomato-player@0/dist/tomato-player.global.js"></script>

<tomato-player src="movie.mp4" poster="poster.jpg" title="My movie" skin="cinema" accent="#f59e0b">
  <track kind="captions" src="en.vtt" srclang="en" label="English" default />
</tomato-player>
```

The same file is available from unpkg: `https://unpkg.com/tomato-player`. The global `window.TomatoPlayer` exposes the full API (`TomatoPlayer.createPlayer`, `TomatoPlayer.skins`, `TomatoPlayer.hls`…).

Browser ESM without a bundler works too:

```html
<script type="module">
  import { createPlayer, minimal } from 'https://esm.sh/tomato-player';
  createPlayer('#player', { src: 'movie.mp4', skin: minimal() });
</script>
```

## 5. Frameworks

```tsx
// React / Next.js
import { TomatoPlayer } from '@tomato-player/react';
<TomatoPlayer src="movie.mp4" skin={minimal()} />;
```

```vue
<!-- Vue / Nuxt -->
<TomatoPlayer src="movie.mp4" :skin="minimal()" />
```

```svelte
<!-- Svelte / SvelteKit -->
<div use:tomato={{ src: 'movie.mp4', skin: minimal() }} />
```

See [Frameworks](./guides/frameworks.md) for details on SSR, refs and state hooks.

## 6. Control it

```ts
await player.play();
player.seek(90);
player.setPlaybackRate(1.5);
player.setSkin(cinema()); // swap skins at runtime

player.on('ended', () => console.log('finished'));
player.store.select((s) => s.currentTime, (t) => console.log(t));

player.destroy(); // removes every listener, timer, element and engine
```

Next: the [Player API reference](./api/player.md).
