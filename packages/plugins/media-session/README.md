# @tomato-player/plugin-media-session

Media Session API integration (lock screen, hardware keys) for Tomato Player.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-media-session
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { mediaSession } from '@tomato-player/plugin-media-session';

createPlayer('#player', { src: 'movie.mp4', plugins: [mediaSession()] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
