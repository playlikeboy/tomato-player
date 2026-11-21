# @tomato-player/skin-tube

Unofficial video-platform-inspired skin (YouTube-like patterns). Not affiliated with YouTube or Google.

> **Unofficial design.** This skin recreates familiar interaction patterns only. It uses no logos, fonts or assets of any company and is not affiliated with or endorsed by the platform that inspired it.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-tube
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { tube } from '@tomato-player/skin-tube';

createPlayer('#player', { src: 'movie.mp4', skin: tube() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-tube/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `tube({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
