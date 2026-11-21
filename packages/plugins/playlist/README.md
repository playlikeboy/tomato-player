# @tomato-player/plugin-playlist

Playlists with next/previous and auto-advance for Tomato Player.

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-playlist
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { playlist } from '@tomato-player/plugin-playlist';

createPlayer('#player', { src: 'movie.mp4', plugins: [playlist({ items: [{ src: "a.mp4" }, { src: "b.mp4" }] })] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
