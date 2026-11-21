# Streaming: HLS, DASH, live and DRM

## HLS

```sh
npm i @tomato-player/provider-hls hls.js
```

```ts
import { hls } from '@tomato-player/provider-hls';

createPlayer(el, {
  src: 'https://example.com/master.m3u8',
  providers: [hls({ config: { lowLatencyMode: true }, onInstance: (engine) => (window.hls = engine) })],
});
```

- **Safari and iOS** play HLS natively, so hls.js is never downloaded there (`preferNative: true`). Set `preferNative: false` to force hls.js on macOS Safari.
- **Code splitting:** hls.js loads via `import('hls.js')` the first time an HLS source plays.
- **No bundler:** `hls({ library: 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js' })`.
- **Error recovery:** fatal network errors call `startLoad()`, a first fatal media error calls `recoverMediaError()`, and anything else surfaces as `PROVIDER`.
- Qualities and audio tracks fill `state.qualities` and `state.audioTracks`. The settings menu picks them up automatically.

## DASH

```sh
npm i @tomato-player/provider-dash dashjs
```

```ts
import { dash } from '@tomato-player/provider-dash';
createPlayer(el, { src: 'https://example.com/manifest.mpd', providers: [dash()] });
```

## Multiple sources

```ts
createPlayer(el, {
  src: [
    { src: '/video.mpd', type: 'application/dash+xml' },
    { src: '/video.m3u8', type: 'application/x-mpegurl' },
    { src: '/video.mp4', type: 'video/mp4' },
  ],
  providers: [dash(), hls()],
});
```

The first source that some provider can play in the current browser wins.

## Live and DVR

For live streams, `state.live` is `true`, `seekable` describes the DVR window, and the time slider maps onto that window. `liveBadge()` turns accent-colored at the live edge, and clicking it jumps to live.

## DRM

DRM runs through the engine:

```ts
// Widevine / PlayReady with dash.js
dash({
  protectionData: {
    'com.widevine.alpha': { serverURL: 'https://license.example.com/widevine' },
    'com.microsoft.playready': { serverURL: 'https://license.example.com/playready' },
  },
});

// Widevine with hls.js (CMAF/fMP4)
hls({
  config: {
    emeEnabled: true,
    drmSystems: { 'com.widevine.alpha': { licenseUrl: 'https://license.example.com/widevine' } },
  },
});
```

FairPlay on Safari uses native HLS plus EME. A dedicated `provider-shaka` with a unified DRM schema is on the [roadmap](../roadmap.md).

## Licensing

Engines are **peer dependencies** with their own licenses (hls.js: Apache-2.0, dash.js: BSD-3-Clause). If you redistribute them, keep their LICENSE files. See [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
