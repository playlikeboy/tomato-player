# @tomato-player/skin-stream

Unofficial streaming-service-inspired skin (Netflix-like patterns). Not affiliated with Netflix.

> **Unofficial design.** This skin recreates familiar interaction patterns only. It uses no logos, fonts or assets of any company and is not affiliated with or endorsed by the platform that inspired it.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-stream
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { stream } from '@tomato-player/skin-stream';

createPlayer('#player', { src: 'movie.mp4', skin: stream() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-stream/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `stream({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
