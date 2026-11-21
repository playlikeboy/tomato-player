# @tomato-player/plugin-thumbnails

Seek-bar preview thumbnails for Tomato Player from WebVTT sprite sheets.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-thumbnails
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { thumbnails } from '@tomato-player/plugin-thumbnails';

createPlayer('#player', { src: 'movie.mp4', plugins: [thumbnails({ src: 'thumbs.vtt' })] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
