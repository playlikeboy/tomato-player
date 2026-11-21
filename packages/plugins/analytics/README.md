# @tomato-player/plugin-analytics

Vendor-neutral playback analytics (QoE, watch time, quartiles) for Tomato Player.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-analytics
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { analytics } from '@tomato-player/plugin-analytics';

createPlayer('#player', { src: 'movie.mp4', plugins: [analytics({ onEvent: console.log })] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
