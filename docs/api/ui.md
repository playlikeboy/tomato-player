# UI primitives (`@tomato-player/ui`)

Framework-agnostic, accessible controls. Each factory takes the player and returns `{ el, destroy() }`.

| Control | Notes |
| --- | --- |
| `playButton` · `muteButton` · `fullscreenButton` · `pipButton` · `captionsButton` | Labels and `aria-pressed` follow state. PiP hides itself when unsupported. Captions hides itself without tracks. |
| `seekButton(p, ±seconds)` · `rateButton(p, rates)` · `castButton(p)` | Cast uses the Remote Playback API (Chromecast on Chrome, AirPlay on Safari) and hides itself when unavailable. |
| `button(p, { icon, label, text, onClick })` | Generic button. |
| `timeSlider(p, { liveScrub })` | Buffered bar, hover preview (time, thumbnail, chapter), chapter markers, keyboard support. |
| `volumeSlider` · `volumeControl` · `slider(opts)` | `role="slider"` with full keyboard support (arrows, PageUp/Down, Home/End). |
| `timeDisplay` · `currentTime` · `duration` · `remainingTime` · `liveBadge` · `title` | |
| `settingsMenu(p, sections?)` | Drill-down menu. Sections: `qualitySection`, `speedSection`, `captionsSection`, `audioSection`, or your own `MenuSection`. |
| `bigPlayButton` · `spinner` · `errorOverlay` · `gestureLayer` | Overlays. The gesture layer handles click to play, double-click for fullscreen, and tap to reveal on touch. |
| `captionOverlay(p)` | Renders cues as styleable HTML instead of the limited `::cue`. |
| `unmuteButton(p)` · `autoplayInView(p, opts)` | Social-feed behaviors: muted autoplay in view, tap to unmute. |
| `group(className, ...controls)` · `spacer()` · `h()` · `svg()` · `icons` · `Scope` | Layout and DOM helpers. |
| `createSkin({ name, css, tokens, build })` | Turns a `build()` function into a configurable skin factory. |

### Cross-extension contracts

The time slider reads optional capabilities:

```ts
player.provide('thumbnails', { get(time) { return { url, x, y, width, height } } });
player.provide('chapters', { list() { return [{ start, end, title }] } });
```

Any plugin can implement them, so your own thumbnails source works with every skin.
