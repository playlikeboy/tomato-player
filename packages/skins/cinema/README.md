# @tomato-player/skin-cinema

Premium cinematic skin with letterboxed titles and gold accents.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-cinema
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { cinema } from '@tomato-player/skin-cinema';

createPlayer('#player', { src: 'movie.mp4', skin: cinema() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-cinema/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `cinema({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
