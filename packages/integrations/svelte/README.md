# @tomato-player/svelte

Svelte action and store for Tomato Player (Svelte 4 and 5, SvelteKit SSR-safe).

## Install

```sh
npm i @tomato-player/core @tomato-player/svelte
```

## Usage

```svelte
<script>
  import { tomato } from '@tomato-player/svelte';
  import { minimal } from '@tomato-player/skin-minimal';
</script>

<div use:tomato={{ src: 'movie.mp4', skin: minimal() }} />
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
