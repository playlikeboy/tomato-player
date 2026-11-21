# @tomato-player/provider-hls

HLS provider for Tomato Player, powered by hls.js (lazy-loaded). Falls back to native HLS on Safari/iOS.

## Install

```sh
npm i @tomato-player/core @tomato-player/provider-hls
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { hls } from '@tomato-player/provider-hls';

createPlayer('#player', { src: 'stream.m3u8', providers: [hls()] });
```

Install the engine too: `npm i hls.js`. It is a peer dependency, code-split with `import()` and downloaded only when a HLS source is played.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
