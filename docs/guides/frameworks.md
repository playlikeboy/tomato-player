# Frameworks

Every binding is a thin wrapper (≤ 0.6 KB gz) around `createPlayer`. No binding touches the DOM during SSR.

## React and Next.js

```sh
npm i @tomato-player/react @tomato-player/skin-minimal
```

```tsx
'use client';
import { useRef } from 'react';
import { TomatoPlayer, usePlayerState, type Player } from '@tomato-player/react';
import { minimal } from '@tomato-player/skin-minimal';
import { hotkeys } from '@tomato-player/plugin-hotkeys';

const skin = minimal(); // create once, outside render, or memoize
const plugins = [hotkeys()];

export function Video({ src }: { src: string }) {
  const ref = useRef<Player>(null);
  const time = usePlayerState(ref.current, (s) => Math.floor(s.currentTime), 0);
  return (
    <>
      <TomatoPlayer ref={ref} src={src} skin={skin} plugins={plugins} className="video" />
      <p>{time}s · <button onClick={() => ref.current?.seek(0)}>Restart</button></p>
    </>
  );
}
```

- The player is created in `useEffect`, so the server renders an empty `<div>` and hydration never mismatches.
- Changing `src` calls `setSource()` instead of recreating the player. Changing `skin` calls `setSkin()`.
- Under Strict Mode the double mount/unmount destroys the first instance cleanly. The test suite covers this.
- Memoize `skin` and `plugins`. A new skin object on every render re-mounts the skin.

## Vue 3 and Nuxt

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { TomatoPlayer, usePlayerState, type Player } from '@tomato-player/vue';
import { minimal } from '@tomato-player/skin-minimal';

const player = shallowRef<Player>();
const paused = usePlayerState(player, (s) => s.paused);
const skin = minimal();
</script>

<template>
  <TomatoPlayer src="/movie.mp4" :skin="skin" @ready="(p) => (player = p)" />
  <p>{{ paused ? 'Paused' : 'Playing' }}</p>
</template>
```

In Nuxt it works as is because the player mounts in `onMounted`. Wrap it in `<ClientOnly>` only if you want to skip the placeholder `<div>`.

## Svelte and SvelteKit

```svelte
<script lang="ts">
  import { tomato, playerState } from '@tomato-player/svelte';
  import { minimal } from '@tomato-player/skin-minimal';
  let player;
  $: paused = player && playerState(player, (s) => s.paused);
</script>

<div use:tomato={{ src: '/movie.mp4', skin: minimal(), onReady: (p) => (player = p) }} />
{#if paused}<p>{$paused ? 'Paused' : 'Playing'}</p>{/if}
```

Actions only run in the browser, so this is SSR-safe by construction.

## Angular, Astro, Solid, Lit, Qwik, plain HTML

Use the web component:

```ts
import 'tomato-player/element';
```

```html
<tomato-player src="/movie.mp4" skin="learn" chapters="/chapters.vtt" thumbnails="/thumbs.vtt"></tomato-player>
```

Attributes: `src`, `poster`, `title`, `skin`, `accent`, `chapters`, `thumbnails`, `autoplay`, `muted`, `loop`, `no-hotkeys`, `no-gestures`. Child `<source>` and `<track>` elements are honored. Get the instance from `element.player` or from the `ready` event (`event.detail`).

Angular needs `CUSTOM_ELEMENTS_SCHEMA` in the component.
