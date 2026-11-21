# @tomato-player/core

Tiny, framework-agnostic, SSR-safe video player engine for Tomato Player.

## Install

```sh
npm i @tomato-player/core
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';

const player = createPlayer('#player', { src: 'movie.mp4' });
player.on('ended', () => console.log('done'));
```

The core is headless: pair it with a skin such as `@tomato-player/skin-minimal`, or build your own UI with `@tomato-player/ui`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../docs/README.md) · MIT License
