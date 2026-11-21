# @tomato-player/skin-minimal

Clean, lightweight controls. The default Tomato Player skin.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-minimal
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { minimal } from '@tomato-player/skin-minimal';

createPlayer('#player', { src: 'movie.mp4', skin: minimal() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-minimal/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `minimal({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
