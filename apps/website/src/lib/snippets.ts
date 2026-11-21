// Code samples shown across the site.
import type { CodeTab } from '@/components/blocks';

export const INSTALL = 'npm i @tomato-player/core @tomato-player/skin-minimal';

export const FRAMEWORK_TABS: CodeTab[] = [
  {
    id: 'js',
    label: 'JavaScript',
    language: 'ts',
    title: 'main.ts',
    code: `import { createPlayer } from '@tomato-player/core';
import { minimal } from '@tomato-player/skin-minimal';
import { hotkeys } from '@tomato-player/plugin-hotkeys';

const player = createPlayer('#player', {
  src: 'movie.mp4',
  title: 'Big Buck Bunny',
  skin: minimal(),
  plugins: [hotkeys()],
  tokens: { accent: '#e5372a' },
});

player.on('ended', () => console.log('done'));`,
  },
  {
    id: 'react',
    label: 'React',
    language: 'tsx',
    title: 'Video.tsx',
    code: `'use client';
import { TomatoPlayer, usePlayer, usePlayerState } from '@tomato-player/react';
import { cinema } from '@tomato-player/skin-cinema';

export function Video() {
  const [ref, player] = usePlayer();
  const time = usePlayerState(player, (s) => s.currentTime, 0);
  return (
    <>
      <TomatoPlayer ref={ref} src="movie.mp4" skin={cinema()} />
      <p>{time?.toFixed(0)} s watched</p>
    </>
  );
}`,
  },
  {
    id: 'vue',
    label: 'Vue',
    language: 'html',
    title: 'Video.vue',
    code: `<script setup lang="ts">
import { TomatoPlayer } from '@tomato-player/vue';
import { minimal } from '@tomato-player/skin-minimal';
const skin = minimal();
const onEnded = () => console.log('done');
</script>

<template>
  <TomatoPlayer src="movie.mp4" :skin="skin" @ready="(p) => p.on('ended', onEnded)" />
</template>`,
  },
  {
    id: 'svelte',
    label: 'Svelte',
    language: 'html',
    title: 'Video.svelte',
    code: `<script lang="ts">
  import { tomato } from '@tomato-player/svelte';
  import { minimal } from '@tomato-player/skin-minimal';
</script>

<div use:tomato={{ src: 'movie.mp4', skin: minimal() }}></div>`,
  },
  {
    id: 'html',
    label: 'HTML / CDN',
    language: 'html',
    title: 'index.html',
    code: `<script src="https://cdn.jsdelivr.net/npm/tomato-player@0"></script>

<tomato-player
  src="https://example.com/stream.m3u8"
  skin="cinema"
  accent="#e5372a"
  title="Big Buck Bunny"
></tomato-player>`,
  },
];

export const skinUsage = (slug: string, factory: string) => `import { createPlayer } from '@tomato-player/core';
import { ${slug} } from '@tomato-player/skin-${slug}';

createPlayer('#player', {
  src: 'movie.mp4',
  skin: ${factory},
});`;

export const pluginUsage = (slug: string, importName: string, usage: string) => `import { createPlayer } from '@tomato-player/core';
import { minimal } from '@tomato-player/skin-minimal';
import { ${importName} } from '@tomato-player/plugin-${slug}';

createPlayer('#player', {
  src: 'movie.mp4',
  skin: minimal(),
  plugins: [${usage}],
});`;
