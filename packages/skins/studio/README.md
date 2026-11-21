# @tomato-player/skin-studio

Professional playback skin with SMPTE timecode, frame stepping and A-B loop.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-studio
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { studio } from '@tomato-player/skin-studio';

createPlayer('#player', { src: 'movie.mp4', skin: studio() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-studio/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `studio({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
