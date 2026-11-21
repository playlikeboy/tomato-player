# Plugins

| Plugin | Size (gz) | What it does |
| --- | --- | --- |
| [`plugin-hotkeys`](#hotkeys) | 0.9 KB | Space/K, J/L, arrows, M, F, C, I, 0–9, `<` `>`, `,` `.` frame step. Scoped to the focused player by default. |
| [`plugin-gestures`](#gestures) | 0.8 KB | Double-tap left or right to seek, with accumulating ripples. |
| [`plugin-chapters`](#chapters) | 0.5 KB | Chapters from an array or WebVTT. Seek-bar markers, preview titles, `chapterchange`. |
| [`plugin-thumbnails`](#thumbnails) | 0.5 KB | Seek preview from WebVTT sprite sheets (`#xywh=`), with binary-search lookup. |
| [`plugin-playlist`](#playlist) | 0.5 KB | Items, next/previous, auto-advance, loop. |
| [`plugin-analytics`](#analytics) | 0.8 KB | Vendor-neutral QoE: startup time, rebuffering, watch time, quartiles, heartbeats. |
| [`plugin-media-session`](#media-session) | 0.6 KB | Lock-screen and notification controls, hardware media keys. |
| [`plugin-persist`](#persist) | 0.7 KB | Remembers volume, speed and caption language, and resumes position per video. |

## Hotkeys

```ts
hotkeys({ scope: 'global', seekStep: 5, bindings: { n: (p) => playlist.next(), i: null } });
```

Typing in inputs is never hijacked, and focused buttons and sliders keep their own keys.

## Gestures

```ts
gestures({ seekStep: 10, zone: 0.35 });
```

## Chapters

```ts
const player = createPlayer(el, { plugins: [chapters({ chapters: '/chapters.vtt' })] });
const api = player.plugin<ChaptersAPI>('chapters');
api.goTo(2);
player.on('plugin:chapterchange', (c) => console.log(c?.title));
```

## Thumbnails

```ts
thumbnails({ src: '/thumbs.vtt' });
```

```
WEBVTT

00:00.000 --> 00:05.000
sprite.jpg#xywh=0,0,160,90
```

Generate sprites with `ffmpeg -i in.mp4 -vf "fps=1/5,scale=160:-1,tile=10x10" sprite.jpg`.

## Playlist

```ts
const list = playlist({ items: [{ src: 'a.mp4', title: 'A' }, { src: 'b.mp4', title: 'B' }], loop: true });
createPlayer(el, { plugins: [list, mediaSession({ onNext: () => player.plugin('playlist').next() })] });
```

## Analytics

```ts
analytics({
  heartbeat: 30_000,
  onEvent: (e) => navigator.sendBeacon('/qoe', JSON.stringify(e)),
});
```

Events: `view_start` (with `startupTime`), `play`, `pause`, `seek`, `quartile`, `rebuffer_start`, `rebuffer_end`, `quality_change`, `error`, `heartbeat`, `view_end`.

## Media Session

```ts
mediaSession({ artist: 'Blender Foundation', artwork: [{ src: '/cover-512.png', sizes: '512x512' }] });
```

## Persist

```ts
persist({ key: 'my-site', resume: true });
```

Fails silently when storage is unavailable (private mode, sandboxed iframes).

## Writing your own

See [Create a plugin](./create-a-plugin.md).
