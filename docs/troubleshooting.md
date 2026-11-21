# Troubleshooting

### Autoplay doesn't start

Browsers block autoplay **with sound**. `autoplay: true` tries unmuted playback first and falls back to muted. To always autoplay, pass `muted: true` and show an unmute control (`unmuteButton()`, or the Feed and Campus skins). Autoplay also needs `playsInline` on iOS, which is on by default.

### `NotAllowedError: play() failed because the user didn't interact`

Call `player.play()` from a user gesture (click or keydown), or play muted.

### My custom controls disappear in fullscreen on iPhone

iPhone Safari only supports fullscreen on the `<video>` element, which shows the native UI. Use `fullscreenFallback: 'pseudo'` to keep your skin by pinning the player to the viewport. iPadOS supports element fullscreen and is unaffected.

### `NO_PROVIDER` error

You passed a `.mpd` (DASH) without `providers: [dash()]`, or an `.m3u8` on a browser without native HLS and without `providers: [hls()]`. If the URL has no extension, set the type: `{ src, type: 'application/x-mpegurl' }`.

### `SRC_NOT_SUPPORTED`

The URL returned an error (403/404), or the browser can't decode the codec (for example HEVC on Firefox, or H.264 in some Chromium builds). Open the URL directly and check the Network panel.

### Captions or thumbnails don't load from another domain

Text tracks and fetches are subject to CORS. Serve them with `Access-Control-Allow-Origin` and set `crossOrigin: 'anonymous'` on the player.

### `window is not defined` / hydration mismatch (Next.js, Nuxt, SvelteKit)

No Tomato Player package touches the DOM at import time. If you see this, you are calling `createPlayer()` during render. Use the framework bindings, or call it inside `useEffect` / `onMounted` / an action.

### The player is re-created on every React render

You are passing a new `skin()` or `plugins` array on each render. Create them once (module scope or `useMemo`).

### Memory keeps growing in my SPA

Call `player.destroy()` when the view unmounts (the bindings do this for you). It releases engines, listeners, timers and observers. If a third-party plugin leaks, check its `destroy()`.

### Controls don't hide

They hide only while playing, after `idleTimeout` (2500 ms) without pointer or keyboard activity, and never while a menu is open or a control has keyboard focus.

### Styles are missing under a strict Content-Security-Policy

Pass `injectStyles: false` and import `@tomato-player/ui/base.css` plus your skin's `style.css`.

### Still stuck?

Open an issue with a minimal reproduction (the [playground](../examples/playground) is a good starting point), plus your browser, OS and package versions.
