# @tomato-player/ui

Accessible, framework-agnostic control primitives for building Tomato Player skins.

## Install

```sh
npm i @tomato-player/core @tomato-player/ui
```

## Usage

```ts
import { createSkin, playButton, timeSlider, group } from '@tomato-player/ui';

export const mySkin = createSkin({
  name: 'my-skin',
  css: '',
  build: (player) => [group('tp-controls', playButton(player), timeSlider(player))],
});
```

See the [skin authoring guide](../../docs/guides/create-a-skin.md).

Part of [Tomato Player](https://github.com/playlikeboy/tomato-player) · [Docs](../../docs/README.md) · MIT License
