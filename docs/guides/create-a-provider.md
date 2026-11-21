# Create a provider

Providers adapt a playback engine or a media platform (Shaka, mpegts.js, WebRTC/WHEP, an iframe API…) to the player.

```ts
import { defineProvider, type Provider } from '@tomato-player/core';

export const mpegts = (): Provider =>
  defineProvider({
    name: 'mpegts',
    canPlay: (source) => source.type === 'video/mp2t' || /\.flv($|\?)/.test(source.src),
    async create({ media, update, player }) {
      const { default: mpegtsjs } = await import('mpegts.js'); // lazy, code-split
      let engine: any;
      return {
        load(source) {
          engine = mpegtsjs.createPlayer({ type: 'flv', url: source.src, isLive: true });
          engine.attachMediaElement(media);
          engine.load();
          update({ live: true });
        },
        destroy() {
          engine?.destroy();
        },
      };
    },
  });
```

Guidelines:

- `canPlay` must be cheap and synchronous. Check MIME type, extension and browser support (`supportsMSE()`).
- Declare the engine as an **optional peer dependency**, never as a dependency.
- Report qualities, audio tracks, live state and fatal errors through `update()` and `player.emit('error', …)`.
- `destroy()` must release the MediaSource and every network request.
