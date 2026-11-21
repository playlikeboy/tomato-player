# Create a plugin

```sh
pnpm new plugin sleep-timer "Pause playback after a chosen number of minutes"
```

## Anatomy

```ts
import { definePlugin } from '@tomato-player/core';

export interface SleepTimerAPI { start(minutes: number): void; cancel(): void }

export const sleepTimer = (opts: { defaultMinutes?: number } = {}) =>
  definePlugin<SleepTimerAPI>({
    name: 'sleep-timer',
    setup(player) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const api: SleepTimerAPI = {
        start(min) { clearTimeout(timer); timer = setTimeout(() => player.pause(), min * 60_000); },
        cancel() { clearTimeout(timer); },
      };
      const off = player.on('sourcechange', api.cancel);
      return { api, destroy: () => { off(); api.cancel(); } };
    },
  });
```

## Rules

1. **Clean up everything** in `destroy()`: listeners, timers, DOM, observers. Players are created and destroyed constantly in SPAs.
2. **No work at import time.** Touch `window` and `document` only inside `setup`.
3. **Be SSR-safe and feature-detect.** Return early if an API is missing.
4. **Talk through the player**, not to other plugins: `player.emit('plugin:my-event', data)`, `player.provide(key, api)`, `player.inject(key)`.
5. **Stay small.** The budget is 1.5 KB gzip. Lazy-load heavy SDKs with `import()`.
6. **Never break playback.** Event handlers run inside try/catch, but async errors are yours to handle.

## Testing

```ts
const player = createPlayer(document.body.appendChild(document.createElement('div')), { plugins: [sleepTimer()] });
player.plugin<SleepTimerAPI>('sleep-timer')!.start(1);
```

Run `pnpm test`. Tests use Vitest and happy-dom against source files, so no build is needed.
