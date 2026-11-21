# @tomato-player/skin-creator

Expressive floating glass controls with a vivid gradient accent.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-creator
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { creator } from '@tomato-player/skin-creator';

createPlayer('#player', { src: 'movie.mp4', skin: creator() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-creator/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `creator({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
