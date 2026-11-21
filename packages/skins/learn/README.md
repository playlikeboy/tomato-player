# @tomato-player/skin-learn

Education-focused skin: chapter list, prominent speed control, skip buttons and transcripts.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-learn
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { learn } from '@tomato-player/skin-learn';

createPlayer('#player', { src: 'movie.mp4', skin: learn() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-learn/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `learn({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
