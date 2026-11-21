# @tomato-player/plugin-gestures

Touch gestures for Tomato Player: double-tap to seek, with visual feedback.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-gestures
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { gestures } from '@tomato-player/plugin-gestures';

createPlayer('#player', { src: 'movie.mp4', plugins: [gestures()] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
