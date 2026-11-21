# @tomato-player/plugin-chapters

Chapters for Tomato Player from arrays or WebVTT, with seek-bar markers.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-chapters
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { chapters } from '@tomato-player/plugin-chapters';

createPlayer('#player', { src: 'movie.mp4', plugins: [chapters()] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
