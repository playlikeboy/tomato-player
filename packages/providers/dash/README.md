# @tomato-player/provider-dash

MPEG-DASH provider for Tomato Player, powered by dash.js (lazy-loaded).

## Install

```sh
npm i @tomato-player/core @tomato-player/provider-dash
```

## Usage

```ts
import { createPlayer } from '@tomato-player/core';
import { dash } from '@tomato-player/provider-dash';

createPlayer('#player', { src: 'stream.mpd', providers: [dash()] });
```

Install the engine too: `npm i dashjs`. It is a peer dependency, code-split with `import()` and downloaded only when a DASH source is played.

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../../docs/README.md) · MIT License
