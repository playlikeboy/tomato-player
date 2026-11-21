# @tomato-player/skin-feed

Unofficial social-feed-inspired skin (Facebook-like patterns). Not affiliated with Meta.

> **Unofficial design.** This skin recreates familiar interaction patterns only. It uses no logos, fonts or assets of any company and is not affiliated with or endorsed by the platform that inspired it.

## Install

```sh
npm i @tomato-player/core @tomato-player/skin-feed
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { feed } from '@tomato-player/skin-feed';

createPlayer('#player', { src: 'movie.mp4', skin: feed() });
```

CSS is injected automatically. Prefer a static stylesheet (strict CSP)? Pass `injectStyles: false` and import `@tomato-player/skin-feed/style.css` together with `@tomato-player/ui/base.css`.

Theme it with tokens: `feed({ tokens: { accent: '#22c55e', radius: '12px' } })`.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
