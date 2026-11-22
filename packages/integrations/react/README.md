# @tomato-player/react

React bindings for Tomato Player. SSR-safe, React 18/19, Strict Mode friendly.

## Install

```sh
npm i @tomato-player/core @tomato-player/react
```

## Usage

```tsx
import { TomatoPlayer } from '@tomato-player/react';
import { minimal } from '@tomato-player/skin-minimal';

export default function Video() {
  return <TomatoPlayer src="movie.mp4" skin={minimal()} onReady={(p) => p.play()} />;
}
```

Works in Next.js App Router (ships `"use client"`).

## Icons

`icons` replaces control icons by name. Values can be React nodes, so animated icon libraries work as-is:

```tsx
import { PlayIcon, PauseIcon } from '@animateicons/react/lucide';

<TomatoPlayer src="movie.mp4" skin={minimal()} icons={{ play: <PlayIcon size={24} />, pause: <PauseIcon size={24} /> }} />;
```

Creating the player yourself? `useIconPortals(set)` returns `icons` for `createPlayer` and `portals` to render. See the [icons guide](../../../docs/guides/icons.md).

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
