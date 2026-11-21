# @tomato-player/plugin-persist

Remember volume, speed, captions and resume position for Tomato Player.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-persist
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { persist } from '@tomato-player/plugin-persist';

createPlayer('#player', { src: 'movie.mp4', plugins: [persist()] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
