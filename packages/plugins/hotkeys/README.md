# @tomato-player/plugin-hotkeys

Keyboard shortcuts for Tomato Player (YouTube-style defaults, fully remappable).

## Install

```sh
npm i @tomato-player/core @tomato-player/plugin-hotkeys
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { hotkeys } from '@tomato-player/plugin-hotkeys';

createPlayer('#player', { src: 'movie.mp4', plugins: [hotkeys()] });
```

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
