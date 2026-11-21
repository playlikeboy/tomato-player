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

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
