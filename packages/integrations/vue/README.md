# @tomato-player/vue

Vue 3 component for Tomato Player. SSR-safe (Nuxt ready).

## Install

```sh
npm i @tomato-player/core @tomato-player/vue
```

## Usage

```vue
<script setup lang="ts">
import { TomatoPlayer } from '@tomato-player/vue';
import { minimal } from '@tomato-player/skin-minimal';
const skin = minimal();
</script>

<template>
  <TomatoPlayer src="movie.mp4" :skin="skin" @ready="(p) => console.log(p)" />
</template>
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
