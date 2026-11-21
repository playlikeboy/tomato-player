# @tomato-player/skin-campus

CampusLoop's paper-sticker skin: sticker control strip, sticker captions, tap-to-unmute.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-campus
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { campus } from '@tomato-player/skin-campus';

createPlayer('#player', { src: 'movie.mp4', skin: campus() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-campus/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `campus({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
