# Player API

```ts
import { createPlayer } from '@tomato-player/core';
const player = createPlayer(target, options);
```

`target`: a CSS selector, a container element, or a `<video>` element.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `Source \| Source[]` | – | URL or `{ src, type }`. With an array, the first source a provider can play wins. |
| `poster` | `string` | – | Poster image. |
| `title` | `string` | – | Title shown by skins and used as the accessible name and Media Session title. |
| `tracks` | `TextTrackInit[]` | – | `{ src, kind, label, srclang, default }` captions and subtitles. |
| `autoplay` | `boolean` | `false` | Tries to autoplay. If the browser blocks unmuted autoplay, it retries muted. |
| `muted` · `loop` | `boolean` | `false` | |
| `playsInline` | `boolean` | `true` | Needed for inline playback on iOS. |
| `preload` | `'none' \| 'metadata' \| 'auto'` | browser | |
| `crossOrigin` | `'' \| 'anonymous' \| 'use-credentials'` | – | Needed for cross-origin captions and thumbnails. |
| `volume` · `playbackRate` | `number` | `1` | Initial values. |
| `providers` | `Provider[]` | `[]` | Tried in order. Native is always the fallback. |
| `plugins` | `Plugin[]` | `[]` | |
| `skin` | `Skin \| null` | `null` | `null` = headless. |
| `tokens` | `Record<string,string>` | – | Design token overrides: `{ accent: '#0af' }` → `--tp-accent`. |
| `injectStyles` | `boolean` | `true` | Set to `false` for strict CSP, then import `style.css` files yourself. |
| `idleTimeout` | `number` | `2500` | ms of inactivity before `state.idle`. |
| `i18n` | `Record<string,string>` | English | UI strings, see `defaultStrings`. |
| `label` | `string` | title | Accessible name of the player region. |
| `aspectRatio` | `string \| false` | `'16/9'` | |
| `fullscreenFallback` | `'native' \| 'pseudo'` | `'native'` | iPhone has no element fullscreen. `'pseudo'` keeps your skin by pinning the player to the viewport. |

## State (`player.state`)

| Key | Type | Notes |
| --- | --- | --- |
| `source` · `provider` | `SourceObject \| null` · `string \| null` | Active source and provider name. |
| `ready` · `started` · `paused` · `ended` · `waiting` · `seeking` | `boolean` | |
| `currentTime` · `duration` | `number` | Seconds. For live streams, `duration` is the end of the seekable range. |
| `buffered` · `seekable` | `TimeRange[]` · `TimeRange \| null` | |
| `live` | `boolean` | |
| `volume` · `muted` · `playbackRate` | | |
| `fullscreen` · `pip` · `idle` | `boolean` | |
| `qualities` · `quality` | `Quality[]` · `number` | `-1` = auto (ABR). |
| `audioTracks` · `audioTrack` | `TrackInfo[]` · `number` | |
| `textTracks` · `textTrack` | `TrackInfo[]` · `number` | `-1` = off. |
| `poster` · `title` | `string \| null` | |
| `error` | `PlayerError \| null` | `{ code, message, fatal, cause }` |
| `width` | `number` | Container width (drives `data-size="sm\|md\|lg"`). |

Every boolean flag is also mirrored as a `data-*` attribute on `player.el`, for example `data-paused`, `data-playing`, `data-waiting`, `data-fullscreen`, `data-idle`, `data-captions`, `data-error` and `data-size`.

## Methods

| Method | Description |
| --- | --- |
| `play(): Promise<void>` | Swallows `AbortError` (play interrupted by pause/load). Rethrows `NotAllowedError`. |
| `pause()` · `togglePlay()` | |
| `seek(seconds)` · `seekBy(delta)` | Clamped to the duration, or to the seekable window for live streams. |
| `setVolume(0..1)` · `setMuted(bool)` · `toggleMute()` | Raising the volume unmutes. |
| `setPlaybackRate(rate)` | |
| `setQuality(id)` | `-1` = auto. |
| `setAudioTrack(id)` · `setTextTrack(index)` | `-1` turns captions off. |
| `setSource(src, { poster, title, tracks })` | Swaps the source and tears down the previous engine. Race-safe. |
| `enterFullscreen()` · `exitFullscreen()` · `toggleFullscreen()` | Container fullscreen, with fallbacks for iOS. |
| `togglePip()` | Standard PiP or WebKit presentation mode. |
| `setSkin(skin \| null)` | Runtime skin swap. |
| `use(plugin)` · `plugin(name)` | Add a plugin later, or get its API. |
| `provide(key, value)` · `inject(key)` | Share capabilities between extensions. |
| `t(key, vars)` | Translate a UI string. |
| `activity()` | Reset the idle timer. |
| `on` · `once` · `off` · `emit` | Typed events, see below. |
| `destroy()` | Idempotent. Restores the DOM. |

## Events

`ready`, `play`, `pause`, `ended`, `seeking (time)`, `seeked (time)`, `timeupdate (time)`, `error (PlayerError)`, `sourcechange (SourceObject)`, `qualitychange (id)`, `ratechange (rate)`, `volumechange ({ volume, muted })`, `fullscreenchange (bool)`, `pipchange (bool)`, `statechange ({ state, prev })`, `destroy`, plus any `plugin:*` event.

```ts
const off = player.on('timeupdate', (t) => console.log(t));
off();
```

## Error codes

| Code | Meaning |
| --- | --- |
| `NO_PROVIDER` | No provider can play the source (for example, DASH without `dash()`). |
| `SRC_NOT_SUPPORTED` | The browser can't decode the format or codec, or the URL 404s. |
| `NETWORK` · `DECODE` · `MEDIA_ABORTED` | Native `MediaError` codes. |
| `PROVIDER` | Fatal engine error (hls.js/dash.js). See `error.cause`. |

## Helpers

`formatTime(seconds)`, `normalizeSource(src)`, `guessType(url)`, `parseVtt(text)`, `createStore(initial)`, `Emitter`, `definePlugin`, `defineSkin`, `defineProvider`, `supportsMSE()`, `defaultStrings`.
