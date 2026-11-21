# Migration guides

Plyr is deprecated, Vidstack is in security-only maintenance until January 2028, and Media Chrome points new projects elsewhere (see [research](../research/landscape.md)). These guides map familiar APIs to Tomato Player.

## From Plyr

| Plyr | Tomato Player |
| --- | --- |
| `new Plyr('#player', { controls: [...] })` | `createPlayer('#player', { skin: minimal() })`. Pick or compose a skin instead of listing controls. |
| `player.play()` / `pause()` / `togglePlay()` | same |
| `player.currentTime = 10` | `player.seek(10)` |
| `player.volume = 0.5` / `player.muted = true` | `player.setVolume(0.5)` / `player.setMuted(true)` |
| `player.speed = 1.5` | `player.setPlaybackRate(1.5)` |
| `player.source = { type: 'video', sources: [...] }` | `player.setSource([...], { poster, title, tracks })` |
| `player.fullscreen.enter()` | `player.enterFullscreen()` |
| `player.pip = true` | `player.togglePip()` |
| `player.on('ready', fn)` | `player.on('ready', fn)` |
| `keyboard: { global: true }` | `plugins: [hotkeys({ scope: 'global' })]` |
| `previewThumbnails: { src }` | `plugins: [thumbnails({ src })]` |
| `markers: { points }` | `plugins: [chapters({ chapters })]` |
| `storage: { enabled: true }` | `plugins: [persist()]` |
| `i18n: {...}` | `i18n: {...}` (see `defaultStrings` keys) |
| `--plyr-color-main` | `--tp-accent` |
| HLS via `hls.js` + manual wiring | `providers: [hls()]` |
| `player.destroy()` | `player.destroy()` |

## From Video.js (v7/v8)

| Video.js | Tomato Player |
| --- | --- |
| `videojs('id', options)` | `createPlayer('#id', options)` |
| `player.src({ src, type })` | `player.setSource({ src, type })` |
| `player.currentTime(10)` | `player.seek(10)`. Read with `player.state.currentTime`. |
| `player.volume(0.5)` | `player.setVolume(0.5)` |
| `player.paused()` | `player.state.paused` |
| `videojs.registerPlugin('x', fn)` | `definePlugin({ name: 'x', setup(player) {...} })` |
| `videojs.registerComponent` | A `{ el, destroy }` control inside a skin |
| `player.dispose()` | `player.destroy()` |
| `videojs-contrib-quality-levels` | Built in: `state.qualities` and `setQuality()` |
| `.vjs-theme-*` CSS | Skins plus design tokens |

## From Vidstack / Media Chrome

Concepts map almost one-to-one: a store with data attributes, unstyled primitives and layouts.

| Vidstack | Tomato Player |
| --- | --- |
| `<media-player src>` | `<tomato-player src>` or `createPlayer()` |
| `useMediaState('paused')` | `usePlayerState(player, s => s.paused)` |
| `data-paused`, `data-waiting` | Same attribute names on `.tp` |
| Default / Plyr layouts | Skins (`minimal`, `tube`, …) |
| Providers (HLS/DASH) | `provider-hls`, `provider-dash` |

## From ReactPlayer

| ReactPlayer | Tomato Player |
| --- | --- |
| `<ReactPlayer url={u} playing controls />` | `<TomatoPlayer src={u} autoplay skin={minimal()} />` |
| `onEnded={fn}` | `onReady={(p) => p.on('ended', fn)}` |
| `ref.current.seekTo(10)` | `ref.current.seek(10)` |
| `light` (poster mode) | `poster`. Skins show a big play button before start. |

ReactPlayer's YouTube, Vimeo and similar embeds are not providers yet. They are on the [roadmap](../roadmap.md).
