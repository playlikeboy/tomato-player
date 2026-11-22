# Custom skins: the complete guide

A Tomato Player skin is the player's whole interface, not a color scheme. It decides which controls exist, where they go and how they look, while one shared engine (`@tomato-player/core`) handles playback, streaming, captions and state. You can use one of the nine built-in skins as is, theme it with `--tp-*` design tokens, override its CSS, or write your own skin in TypeScript and CSS and publish it as an npm package.

This guide covers all four, in that order. It is written for media, OTT and learning-platform teams who want a player that looks like their product, and for frontend developers adding video to a React, Vue or Svelte app.

> **Status.** Tomato Player is v0.1.0. The `@tomato-player/*` packages are not on npm yet, so every `npm i` command below works once they are published. Until then, build from the [GitHub repository](https://github.com/playlikeboy/tomato-player) (`pnpm install && pnpm build`) and link the packages, or use the CDN bundle the website serves.

**On this page**

1. [How skins work](#1-how-skins-work)
2. [Use a built-in skin](#2-use-a-built-in-skin)
3. [Switch skins at runtime](#3-switch-skins-at-runtime)
4. [Theme with design tokens](#4-theme-with-design-tokens)
5. [Override a skin's CSS safely](#5-override-a-skins-css-safely)
6. [Build a skin from scratch](#6-build-a-skin-from-scratch)
7. [Worked example: the Aurora skin](#7-worked-example-the-aurora-skin)
8. [Accessibility checklist](#8-accessibility-checklist)
9. [Test your skin](#9-test-your-skin)
10. [Package and publish](#10-package-and-publish)
11. [Use your skin from React, Vue, Svelte and HTML](#11-use-your-skin-from-react-vue-svelte-and-html)
12. [Reference: classes, state attributes and tokens](#12-reference)

## 1. How skins work

The core creates a root element with the class `.tp`, puts the `<video class="tp-media">` inside it, and exposes a `Player` object with state and methods. It has no UI of its own. A skin is a plain object that the core mounts into that root:

```ts
// From @tomato-player/core
interface Skin {
  name: string;                        // becomes data-skin="<name>" on the root
  css?: string;                        // injected once per document
  tokens?: Record<string, string>;     // { accent: '#e11d48' } -> --tp-accent
  mount(player: Player, root: HTMLElement): void | (() => void);
}
```

When you call `createPlayer(el, { skin })` or `player.setSkin(skin)`, the core:

1. Unmounts the previous skin (calls its cleanup, removes its element and its token properties).
2. Injects `skin.css` into a `<style data-tomato="skin-<name>">` tag, unless `injectStyles: false`.
3. Sets `data-skin="<name>"` on the root.
4. Writes each token as an inline custom property on the root: `accent` becomes `--tp-accent`. Keys that already start with `--` are used as they are. Tokens from `createPlayer({ tokens })` are applied after the skin's own tokens, so they win.
5. Creates `<div class="tp-skin">` inside the root and calls `skin.mount(player, thatDiv)`.

You rarely write `mount()` by hand. `@tomato-player/ui` gives you `createSkin()`, which turns a list of accessible controls into a configurable skin factory, plus every control the official skins use. All nine official skins are built this way, with no private APIs.

The core also mirrors player state onto the root as data attributes (`data-paused`, `data-playing`, `data-idle`, `data-size="sm|md|lg"` and more, listed in the [reference](#state-attributes)). Most visual behavior in a skin is CSS reacting to those attributes, not JavaScript.

## 2. Use a built-in skin

| Skin | Package | Factory and main options | Good for |
| --- | --- | --- | --- |
| Minimal | `@tomato-player/skin-minimal` | `minimal({ pip, settings })` | Product pages, docs, SaaS apps. The default. |
| Cinema | `@tomato-player/skin-cinema` | `cinema({ eyebrow, seekStep })` | Trailers, launches, brand stories. |
| Studio | `@tomato-player/skin-studio` | `studio({ fps })` | Review tools: SMPTE timecode, frame step, A-B loop. |
| Creator | `@tomato-player/skin-creator` | `creator({ gradient: [a, b] })` | Creator portfolios, social-first brands. |
| Learn | `@tomato-player/skin-learn` | `learn({ rates, seekStep, chapterPanel })` | Courses, LMS platforms, lectures. |
| Campus | `@tomato-player/skin-campus` | `campus({ playLabel, autoplayInView, errorMessage, theme })` | Playful brands, launch videos, portrait. |
| Stream *(unofficial)* | `@tomato-player/skin-stream` | `stream({ subtitle, onNext, nextLabel, onBack })` | Episodic catalogs. |
| Tube *(unofficial)* | `@tomato-player/skin-tube` | `tube({ onNext, onTheater })` | Video-platform layouts with theater mode. |
| Feed *(unofficial)* | `@tomato-player/skin-feed` | `feed({ autoplayInView })` | Social feeds with muted autoplay. |

Stream, Tube and Feed are unofficial, platform-inspired designs. They contain no logos, fonts or assets of any company and imply no affiliation. See [Skins and theming](skins.md) for screenshots and every option.

### With npm and a bundler

```sh
npm i @tomato-player/core @tomato-player/skin-cinema
```

```ts
import { createPlayer } from '@tomato-player/core';
import { cinema } from '@tomato-player/skin-cinema';

const player = createPlayer('#player', {
  src: '/media/trailer.mp4',
  title: 'Launch trailer',
  skin: cinema({ eyebrow: 'Original', tokens: { accent: '#38bdf8' } }),
});
```

Every skin package exports a factory, a default export of the same factory and a `./style.css` file. Call the factory: `skin: cinema()`, not `skin: cinema`.

### With the CDN bundle (no build step)

The `tomato-player` bundle contains the core, the UI primitives, all nine skins and the official plugins, and registers the `<tomato-player>` element:

```html
<script src="https://cdn.jsdelivr.net/npm/tomato-player@0/dist/tomato-player.global.js"></script>

<tomato-player src="/media/trailer.mp4" title="Launch trailer" skin="cinema" accent="#38bdf8"></tomato-player>
```

The `skin` attribute accepts `minimal`, `cinema`, `studio`, `creator`, `learn`, `stream`, `tube`, `feed`, `campus` or `none`. An unknown name falls back to `minimal`. To pass options, use the global API instead:

```html
<div id="player"></div>
<script>
  TomatoPlayer.createPlayer('#player', {
    src: '/media/lecture.mp4',
    skin: TomatoPlayer.learn({ rates: [1, 1.5, 2] }),
  });
</script>
```

`window.TomatoPlayer` exposes everything the `tomato-player` package exports: `createPlayer`, each skin factory (`TomatoPlayer.cinema`), the `TomatoPlayer.skins` registry, the plugins, `TomatoPlayer.hls`, and the UI primitives under `TomatoPlayer.ui`.

### Strict Content Security Policy

Skins inject their CSS with a `<style>` tag by default. If your CSP forbids inline styles, turn injection off and import the stylesheets yourself, base first:

```ts
import '@tomato-player/ui/base.css';
import '@tomato-player/skin-cinema/style.css';

createPlayer('#player', { src, skin: cinema(), injectStyles: false });
```

`injectStyles: false` skips both the shared base stylesheet and the skin's own CSS, so you must import both.

## 3. Switch skins at runtime

A skin can be replaced at any time without reloading the video. Playback position, volume, captions and plugins are kept.

```ts
import { cinema } from '@tomato-player/skin-cinema';
import { learn } from '@tomato-player/skin-learn';

player.setSkin(learn());   // swap the whole interface
player.setSkin(cinema());  // and back
player.setSkin(null);      // headless: no UI, bring your own
```

What happens on a switch:

- The old skin's cleanup runs, its controls are destroyed and its `<div class="tp-skin">` is removed.
- Tokens that came from the old skin are removed from the root. Tokens you passed to `createPlayer({ tokens })` are re-applied to every skin.
- Each skin's CSS is injected only once per document and stays in the page, which is harmless because every rule is scoped to its own `data-skin` value.

A common pattern is a skin picker driven by data:

```ts
import { skins, type SkinName } from 'tomato-player'; // { minimal, cinema, studio, ... }

select.addEventListener('change', () => player.setSkin(skins[select.value as SkinName]()));
```

In React, pass a different `skin` prop. In Vue, change the bound `:skin`. In Svelte, update the action options. All three call `setSkin()` for you (see [section 11](#11-use-your-skin-from-react-vue-svelte-and-html)). With the web component, change the `skin` attribute.

## 4. Theme with design tokens

Design tokens are CSS custom properties on the player root. They are the safest way to brand a skin because every official skin reads them. The defaults live in `@tomato-player/ui/base.css`:

| Token | Default | Used for |
| --- | --- | --- |
| `--tp-accent` | `#f0472e` | Progress fill, focus ring, pressed buttons, live dot, spinner, big play button on hover. |
| `--tp-fg` | `#fff` | Text and icon color. |
| `--tp-muted-fg` | `rgba(255, 255, 255, 0.7)` | Secondary text: duration, time separator, menu hints. |
| `--tp-bg` | `#000` | Player and letterbox background, inner ring of the focus outline. |
| `--tp-surface` | `rgba(20, 18, 17, 0.86)` | Menus and seek-preview labels. |
| `--tp-border` | `rgba(255, 255, 255, 0.09)` | Hairline borders on menus and preview labels. |
| `--tp-hover` | `rgba(255, 255, 255, 0.13)` | Button and menu-item hover background. |
| `--tp-track` | `rgba(255, 255, 255, 0.24)` | Slider track. |
| `--tp-buffer` | `rgba(255, 255, 255, 0.42)` | Buffered range on the time slider. |
| `--tp-thumb` | `#fff` | Slider thumb. |
| `--tp-thumb-size` | `13px` | Slider thumb diameter. |
| `--tp-radius` | `8px` | Menu, preview and menu-item corners. |
| `--tp-button-radius` | `999px` | Button corners (round by default). |
| `--tp-font` | `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` | All player text and native cues. |
| `--tp-control-size` | `40px` | Button width and height. |
| `--tp-icon-size` | `22px` | Icon size inside buttons. |
| `--tp-gap` | `2px` | Gap between controls in a `.tp-row`. |
| `--tp-slider-height` | `4px` | Slider track thickness. |
| `--tp-slider-hover-height` | `6px` | Time slider track thickness on hover and while dragging. |
| `--tp-scrim` | bottom-up black gradient | Background under a bottom control bar (used by the official skins). |
| `--tp-scrim-top` | top-down black gradient | Background under a top title bar. |
| `--tp-shadow` | `0 18px 48px -14px rgba(0, 0, 0, 0.75), …` | Menu and preview shadow. |
| `--tp-icon-shadow` | `drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))` | `filter` on icons, so they stay legible over bright video. |
| `--tp-focus` | `0 0 0 2px var(--tp-bg), 0 0 0 4px var(--tp-accent)` | Focus ring (a `box-shadow` value). |
| `--tp-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Transition easing. |
| `--tp-duration` | `180ms` | Transition duration. |
| `--tp-aspect-ratio` | *(set inline from the `aspectRatio` option, default `16/9`)* | Player aspect ratio. |
| `--tp-cue-size` | *(unset: `1em`, `1.25em` at `data-size="lg"`)* | Native `::cue` font size. |
| `--tp-caption-offset` | *(unset: `72px`, `24px` while playing and idle)* | Distance of `captionOverlay()` text from the bottom. |

The defaults above are copied from `packages/ui/src/base.css` in version 0.1.0. That file is the source of truth: if a value here disagrees with it, the file wins.

Individual skins can add their own tokens or redefine shared ones. Campus, for example, adds `--tp-sticker` and `--tp-sticker-fg` and sets its own `--tp-shadow`. Read a skin's `style.css` to find them.

Under `prefers-reduced-motion: reduce`, base CSS forces every transition and animation inside the player to `0ms`, whatever `--tp-duration` says.

### Three ways to set tokens

```ts
// 1. Per skin instance, through the factory. Removed when the skin is replaced.
cinema({ tokens: { accent: '#38bdf8', radius: '0' } });

// 2. Per player, through createPlayer. Re-applied to every skin you switch to.
createPlayer('#player', { skin: minimal(), tokens: { accent: '#38bdf8', 'control-size': '44px' } });

// 3. Custom property names work too, including a skin's own tokens.
campus({ tokens: { '--tp-sticker': '#fff7ed' } });
```

```css
/* 4. In CSS. See the specificity note below. */
.my-app .tp { --tp-font: 'Inter', sans-serif; }
```

### Precedence

From weakest to strongest:

1. `base.css` defaults on `.tp`.
2. The skin's stylesheet, on `.tp[data-skin='<name>']`.
3. Your own stylesheet, if its selector is more specific than the skin's (or equal and loaded later).
4. Inline tokens: the factory's `tokens`, then `createPlayer({ tokens })`. They are written to the root's `style` attribute, so they beat any stylesheet rule that is not `!important`.

Two consequences:

- The `tokens` option always wins. Use it for brand colors you set from JavaScript, for example per tenant.
- A token a skin sets through its own `tokens` field cannot be changed from a stylesheet without `!important`. Every official skin except Minimal sets `accent` this way, so change the accent with the `tokens` option.

Injected `<style>` tags are appended to `<head>` when the first player mounts, which is usually after your app's CSS. So a rule like `.tp[data-skin='minimal'] { --tp-accent: hotpink; }` in your stylesheet has the same specificity as the skin's rule and loses. Add one more class or attribute to win, as in the next section.

### Contrast

Keep `--tp-accent` at 3:1 or more against the control background (WCAG 2.2 non-text contrast), because it draws the progress bar and the focus ring. Keep `--tp-fg` at 4.5:1 or more against whatever sits behind the controls, including the video itself, which is why most skins put a gradient scrim under the control bar.

## 5. Override a skin's CSS safely

Tokens cover color, shape, density and motion. For layout changes (hide a button, move the title, change the scrim), write CSS against the skin's class names.

Rules for overrides that survive upgrades and never leak:

1. **Scope to the skin.** Start every selector with `.tp[data-skin='<name>']`, so your change only applies while that skin is active and never touches other players on the page.
2. **Add one level of specificity.** Prefix with a class of your own (`.course-player .tp[data-skin='learn'] …`) or repeat the class (`.tp.tp[data-skin='learn'] …`). That wins over the skin's rules regardless of stylesheet order.
3. **Use the public class names** listed in the [reference](#classes). They are the contract official skins and the UI primitives share. Class names that start with a skin prefix (`.tp-campus-*`, `.tp-studio-*`) are that skin's internals and may change between versions.
4. **React to state with attributes,** not with JavaScript: `[data-paused]`, `[data-idle]`, `[data-size='sm']`, `[data-fullscreen]`.
5. **Hide controls with `display: none`** rather than forking the skin to remove them. Keyboard shortcuts from `plugin-hotkeys` keep working either way, because they call the player API, not the buttons.

```css
/* Brand the Learn skin for a course platform. */
.course-player .tp[data-skin='learn'] {
  --tp-font: 'Source Sans 3', system-ui, sans-serif;
}

/* Hide picture-in-picture on small players only. */
.course-player .tp[data-skin='learn'][data-size='sm'] .tp-pip { display: none; }

/* Taller progress bar while hovering. */
.course-player .tp[data-skin='learn'] { --tp-slider-hover-height: 8px; }

/* A darker scrim under the controls in fullscreen. */
.course-player .tp[data-skin='learn'][data-fullscreen] .tp-controls {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
}
```

If an override grows past a dozen rules, you are building a new skin. Copy the official skin's `src/index.ts` and `src/style.css` as a starting point and follow the next section.

## 6. Build a skin from scratch

### 6.1 The skin contract: `createSkin()`

```ts
import { createSkin } from '@tomato-player/ui';

interface SkinDefinition<O> {
  name: string;                       // data-skin value, and the CSS scope
  css: string;                        // your stylesheet as a string ('' if you load CSS yourself)
  tokens?: Record<string, string>;    // default tokens for this skin
  build(player: Player, root: HTMLElement, options: O):
    | (Control | null | undefined | false)[]
    | { controls: (Control | null | undefined | false)[]; cleanup?(): void };
}

createSkin<O>(def: SkinDefinition<O>): (options?: O & { tokens?: Record<string, string> }) => Skin;
```

`createSkin()` returns a **factory**. Each call returns a fresh `Skin` object, so one factory can drive many players with different options. When the skin mounts, `createSkin()`:

- injects the shared base stylesheet (`@tomato-player/ui/base.css`) once per document, unless `injectStyles: false`;
- calls your `build(player, root, options)`, where `root` is the `<div class="tp-skin">` and `player.el` is the `.tp` root;
- appends every returned control that is not already in the DOM to `root`, in order, skipping `null`, `undefined` and `false` (so `o.pip !== false && pipButton(p)` works);
- on unmount, runs your `cleanup()` first, then calls `destroy()` on every returned control.

Factory `tokens` are merged over the definition's `tokens`, so users can override yours.

### 6.2 Controls

A control is any object with an element and a destroy function:

```ts
interface Control {
  el: HTMLElement;
  destroy(): void;
}
```

Every factory in `@tomato-player/ui` takes the player and returns a `Control` that keeps itself in sync with player state and cleans up its own listeners:

| Group | Factories |
| --- | --- |
| Buttons | `playButton(p)`, `muteButton(p)`, `fullscreenButton(p)`, `pipButton(p)`, `captionsButton(p)`, `seekButton(p, seconds)`, `rateButton(p, rates?)`, `castButton(p)`, `unmuteButton(p, { restart?, label? })`, `button(p, { icon?, label, text?, className?, onClick })` |
| Sliders | `timeSlider(p, { liveScrub? })`, `volumeSlider(p)`, `volumeControl(p)` (mute button plus slider that expands on hover), `slider(opts)` |
| Text | `timeDisplay(p)`, `currentTime(p)`, `duration(p)`, `remainingTime(p)`, `liveBadge(p)`, `title(p)` |
| Overlays | `bigPlayButton(p)`, `spinner()`, `errorOverlay(p)`, `gestureLayer(p)`, `captionOverlay(p)` |
| Menus | `settingsMenu(p, sections?)` with `qualitySection(p)`, `speedSection(p, rates?)`, `captionsSection(p)`, `audioSection(p)` or your own `MenuSection` |
| Layout | `group(className, ...children)`, `spacer()`, `mountAll(root, controls)` |
| Behaviors | `autoplayInView(p, { playAt?, pauseAt?, respectQuiet?, once? })` returns a cleanup function, not a control |
| DOM helpers | `h(tag, attrs, ...children)`, `svg(markup)`, `icons`, `Scope` |

Built-in behavior you get for free:

- `pipButton` hides itself when picture-in-picture is unsupported, `captionsButton` when there are no text tracks, `castButton` when no remote playback device is available, `liveBadge` for on-demand video.
- Button labels come from `player.t()`, so they follow the `i18n` option.
- `timeSlider` shows a hover preview with time, and with a chapter title and thumbnail when a plugin provides `chapters` or `thumbnails` (see [UI primitives](../api/ui.md)).
- `gestureLayer` toggles play on click, fullscreen on double-click, and on touch the first tap reveals the controls.

### 6.3 Layout

`group(className, ...children)` wraps controls in a `<div>` with the classes you give it and destroys its children with itself. Base CSS provides three layout helpers:

- `.tp-row`: a flex row with `gap: var(--tp-gap)`.
- `.tp-spacer` (from `spacer()`): pushes the following controls to the far end of a row.
- `.tp-controls`: **not styled by base CSS.** It is the conventional class for the control bar, and every skin positions it itself.

A typical bottom bar:

```ts
group(
  'tp-controls tp-autohide tp-hide-unstarted',
  timeSlider(p),
  group('tp-row', playButton(p), volumeControl(p), timeDisplay(p), spacer(), captionsButton(p), settingsMenu(p), fullscreenButton(p)),
);
```

```css
.tp[data-skin='aurora'] .tp-controls {
  position: absolute;
  inset: auto 0 0 0;
  padding: 32px 12px 8px;
  background: var(--tp-scrim);
}
```

`.tp-skin` has `pointer-events: none`, so clicks reach the gesture layer underneath. Its direct children, every `button`, every slider and every menu get `pointer-events: auto` back. If you add a clickable element that is neither a direct child of the skin root nor a button, set `pointer-events: auto` on it.

Order matters: return `gestureLayer(p)` first so it sits under everything else.

### 6.4 CSS

Write the stylesheet as a normal `.css` file and pass it to `createSkin()` as a string. With tsup or esbuild, load CSS as text (`--loader .css=text`) and declare the module type:

```ts
// src/css.d.ts
declare module '*.css' {
  const css: string;
  export default css;
}
```

With Vite you can write `import css from './style.css?raw'` instead. If the skin lives inside your app rather than in a package, you can also pass `css: ''` and import the stylesheet through your app's own CSS pipeline. Base CSS is still injected.

Stylesheet rules:

- **Scope every selector** to `.tp[data-skin='<name>']`, including selectors inside `@media` and `@container`. The monorepo's `pnpm validate` rejects unscoped selectors, and the same rule keeps two skins on one page from interfering.
- **Don't rely on stylesheet order.** On the first mount the skin's `<style>` is injected before the base `<style>`. Your `.tp[data-skin='x']` prefix already makes your rules more specific than base rules such as `.tp-big-play` or `.tp-button:hover`, which is enough. Base rules that include state attributes, such as `.tp[data-playing][data-idle] .tp-caption` or `.tp[data-started] .tp-big-play`, need a selector at least as specific as theirs.
- **Use tokens for values users may want to change** (accent, radius, sizes), and set your skin's defaults on `.tp[data-skin='x']` or in the `tokens` field. Prefer the stylesheet: tokens in the `tokens` field are inline and can only be overridden through the `tokens` option.
- **Use `@container`** for layout that depends on the player's width. The root is an inline-size container.

### 6.5 Auto-hide

Two utility classes from base CSS handle visibility:

- `.tp-autohide` fades the element out (`opacity: 0; visibility: hidden`, over 360 ms) while the video is playing and the user is idle. It never hides while the settings menu is open (`data-menu-open`), while paused, or while keyboard focus is inside the player.
- `.tp-hide-unstarted` hides the element (`display: none`) until playback has started once, so the poster shows only the big play button.

Idle is driven by the core: `pointermove`, `pointerdown`, `keydown` and `focusin` on the root reset a timer (`idleTimeout`, default 2500 ms), and leaving the player with the pointer sets idle right away during playback. To animate differently, target the same state:

```css
.tp[data-skin='aurora'][data-playing][data-idle]:not([data-menu-open]) .tp-controls { transform: translateY(8px); }
```

Call `player.activity()` from a custom control if it needs to keep the controls visible.

### 6.6 Sizes and `data-size`

The core measures the root with a `ResizeObserver` and sets `data-size`:

| Value | Player width |
| --- | --- |
| `sm` | under 480 px |
| `md` | 480 to 959 px (also before the first measurement) |
| `lg` | 960 px and up |

Base CSS already hides the volume slider at `sm` and enlarges native cues at `lg`. Use the attribute to drop secondary controls on small players and to scale up in fullscreen or on TVs:

```css
.tp[data-skin='aurora'][data-size='sm'] .tp-seek,
.tp[data-skin='aurora'][data-size='sm'] .tp-pip { display: none; }
.tp[data-skin='aurora'][data-size='lg'] { --tp-control-size: 48px; --tp-icon-size: 26px; }
@media (pointer: coarse) { .tp[data-skin='aurora'] { --tp-control-size: 44px; } }
```

For finer steps, use `@container (min-width: …)` queries.

### 6.7 Menus

`settingsMenu(p)` renders a gear button and a drill-down popover with the Quality, Speed, Captions and Audio sections. Sections with nothing to choose hide themselves (Quality with fewer than two renditions, Audio with fewer than two tracks, Captions without tracks). Pass your own list to reorder, remove or add sections:

```ts
import { settingsMenu, speedSection, captionsSection, type MenuSection } from '@tomato-player/ui';

const loopSection = (p: Player): MenuSection => ({
  id: 'loop',
  label: 'Loop',
  items: () => ({ items: [{ label: 'Off', value: 0 }, { label: 'On', value: 1 }], selected: p.media.loop ? 1 : 0 }),
  select: (v) => { p.media.loop = v === 1; },
});

settingsMenu(p, [speedSection(p, [0.75, 1, 1.25, 1.5, 2]), captionsSection(p), loopSection(p)]);
```

`items(state)` returns the options and the selected value, or `null` to hide the section. The menu handles focus, arrow keys, Escape, `role="menu"` and `menuitemradio` with `aria-checked`, closes on outside click and when the player goes idle, and sets `data-menu-open` on the root while open. Style it through `.tp-menu`, `.tp-menu-item`, `.tp-menu-label`, `.tp-menu-hint` and `.tp-menu-back`.

### 6.8 Captions

You have two options:

- **Native cues (default).** Without extra code, captions render through the browser's `::cue`. Base CSS sets the font, a translucent background and `--tp-cue-size`. Operating-system caption preferences apply, but `::cue` styling is limited, especially in Safari.
- **HTML captions.** Add `captionOverlay(p)` to the controls. It hides native rendering (the track stays in `hidden` mode so cues keep firing) and renders the active cue as `<div class="tp-caption"><p class="tp-caption-text">`, which you can style freely. Base CSS moves it up to clear the control bar (`--tp-caption-offset: 72px`) and down when the controls hide (`24px`).

```css
.tp[data-skin='aurora'] .tp-caption { --tp-caption-offset: 96px; }
.tp[data-skin='aurora'][data-playing][data-idle] .tp-caption { --tp-caption-offset: 24px; }
.tp[data-skin='aurora'] .tp-caption-text { font-size: clamp(15px, 2.6cqw, 28px); background: rgba(4, 10, 20, 0.85); }
```

`captionsButton(p)` toggles the last used track, and `captionsSection(p)` lets viewers pick a language. The root gets `data-captions` while a track is showing.

### 6.9 Portrait and vertical video

The player's height comes from `aspect-ratio: var(--tp-aspect-ratio)`, and the core writes `--tp-aspect-ratio` inline from the `aspectRatio` option (default `'16/9'`). Because the inline value wins over stylesheets, you have two choices:

- **Fixed ratio per player:** `createPlayer(el, { aspectRatio: '9 / 16', skin })`. Simple and reliable for reels and shorts.
- **Responsive ratio owned by the skin:** the user passes `aspectRatio: false`, and your CSS sets the ratio, for example 16:9 by default and 9:16 on portrait phones:

```css
.tp[data-skin='aurora'] { --tp-aspect-ratio: 16 / 9; }
@media (max-width: 639px) and (orientation: portrait) {
  .tp[data-skin='aurora'][data-aurora-portrait] { --tp-aspect-ratio: 9 / 16; max-width: calc(78svh * 9 / 16); margin-inline: auto; }
  .tp[data-skin='aurora'][data-aurora-portrait] .tp-media { object-fit: cover; }
}
```

For feed-style vertical video, combine `autoplayInView(p)` (muted autoplay at 60% visibility, pause below 20%, skipped under reduced motion and Save-Data) with `unmuteButton(p)`, which is shown only while `data-muted-autoplay` is set. On iPhone, set `fullscreenFallback: 'pseudo'` on the player if your skin must stay visible in fullscreen. It then gets `data-pseudo-fullscreen` and is pinned to the viewport.

### 6.10 Custom controls

Build custom controls from `button()` or `h()`, and subscribe to state with `player.store.select(selector, callback)`. The callback fires immediately and then only when the selected value changes. It returns an unsubscribe function to call in `destroy()`.

```ts
import { button, type Control } from '@tomato-player/ui';
import type { Player } from '@tomato-player/core';

function skipIntro(p: Player, range: { start: number; end: number }, label: string): Control {
  const c = button(p, { label, text: label, className: 'tp-aurora-skip', onClick: () => p.seek(range.end) });
  const off = p.store.select(
    (s) => s.currentTime >= range.start && s.currentTime < range.end,
    (inside) => (c.el.hidden = !inside),
  );
  return { el: c.el, destroy: () => (off(), c.destroy()) };
}
```

Guidelines:

- Use a real `<button type="button">` with an `aria-label` (`button()` does both), and `aria-pressed` for toggles.
- Use the `hidden` attribute to hide. Base CSS makes `.tp [hidden]` `display: none !important`.
- Put every listener, timer and observer in `destroy()` or in the skin's `cleanup()`. `Scope` collects them: `scope.listen(el, 'click', fn)`, `scope.add(off)`, `scope.dispose()`.
- Reach the root with `player.el` and the video with `player.media`. Prefix any attribute you set on the root (`data-aurora-portrait`) and remove it in `cleanup()`.
- `player.t(key)` returns the key itself when no string exists, so take visible labels as skin options or ask users to add keys through `i18n`.
- Inline icons with `svg(icons.play)` or pass an icon name to `button({ icon: 'chapters' })`. `icons` contains: `play`, `pause`, `replay`, `volumeHigh`, `volumeLow`, `volumeMuted`, `fullscreen`, `fullscreenExit`, `pip`, `captions`, `settings`, `forward`, `backward`, `next`, `previous`, `cast`, `chapters`, `check`, `chevron`, `theater`, `tomato`.

## 7. Worked example: the Aurora skin

Aurora is a complete skin for streaming and course platforms: a title bar, ±10 s buttons, a settings menu with a custom Loop section, a "Skip intro" button, HTML captions, size rules and an opt-in portrait mode. It compiles and passes the same tests as the official skins against the current API.

### `src/index.ts`

```ts
import {
  audioSection, bigPlayButton, button, captionOverlay, captionsButton, captionsSection, createSkin, errorOverlay,
  fullscreenButton, gestureLayer, group, pipButton, playButton, qualitySection, seekButton, settingsMenu, spacer,
  speedSection, spinner, timeDisplay, timeSlider, title, volumeControl,
  type Control, type MenuSection,
} from '@tomato-player/ui';
import type { Player } from '@tomato-player/core';
import css from './style.css';

export interface AuroraOptions {
  /** Seconds for the back/forward buttons (default 10). `0` hides them. */
  seekStep?: number;
  /** Playback rates in the settings menu. */
  rates?: number[];
  /** Show a "Skip intro" button while `currentTime` is inside this range. */
  intro?: { start: number; end: number };
  /** Label of the skip button (default "Skip intro"). */
  skipLabel?: string;
  /** Render captions as styleable HTML instead of native ::cue (default true). */
  htmlCaptions?: boolean;
  /** Use a 9:16 frame on portrait phones. Needs `aspectRatio: false` on the player. */
  portrait?: boolean;
}

/** A custom control: any `{ el, destroy }` object works. */
function skipIntro(p: Player, range: { start: number; end: number }, label: string): Control {
  const c = button(p, { label, text: label, className: 'tp-aurora-skip', onClick: () => p.seek(range.end) });
  const off = p.store.select(
    (s) => s.currentTime >= range.start && s.currentTime < range.end,
    (inside) => (c.el.hidden = !inside),
  );
  return { el: c.el, destroy: () => (off(), c.destroy()) };
}

/** A custom settings-menu section. */
const loopSection = (p: Player): MenuSection => ({
  id: 'loop',
  label: 'Loop',
  items: () => ({ items: [{ label: 'Off', value: 0 }, { label: 'On', value: 1 }], selected: p.media.loop ? 1 : 0 }),
  select: (v) => {
    p.media.loop = v === 1;
  },
});

/** Aurora: a streaming/LMS skin with a title bar, skip buttons, skip-intro and HTML captions. */
export const aurora = createSkin<AuroraOptions>({
  name: 'aurora',
  css,
  build(p, _root, o) {
    const step = o.seekStep ?? 10;
    if (o.portrait) p.el.setAttribute('data-aurora-portrait', '');
    return {
      controls: [
        gestureLayer(p),
        spinner(),
        bigPlayButton(p),
        errorOverlay(p),
        o.htmlCaptions !== false && captionOverlay(p),
        o.intro && skipIntro(p, o.intro, o.skipLabel ?? 'Skip intro'),
        group('tp-aurora-top tp-autohide', title(p)),
        group(
          'tp-controls tp-autohide tp-hide-unstarted',
          timeSlider(p),
          group(
            'tp-row',
            playButton(p),
            step > 0 && seekButton(p, -step),
            step > 0 && seekButton(p, step),
            volumeControl(p),
            timeDisplay(p),
            spacer(),
            captionsButton(p),
            settingsMenu(p, [qualitySection(p), speedSection(p, o.rates), captionsSection(p), audioSection(p), loopSection(p)]),
            pipButton(p),
            fullscreenButton(p),
          ),
        ),
      ],
      cleanup: () => p.el.removeAttribute('data-aurora-portrait'),
    };
  },
});

export default aurora;
```

### `src/style.css`

```css
/* Aurora skin. Every selector is scoped to .tp[data-skin='aurora']. */
.tp[data-skin='aurora'] {
  --tp-accent: #34d399;
  --tp-surface: rgba(8, 14, 26, 0.92);
  --tp-track: rgba(255, 255, 255, 0.24);
  --tp-radius: 14px;
  --tp-slider-height: 5px;
  --tp-slider-hover-height: 8px;
  --tp-aspect-ratio: 16 / 9;
  border-radius: var(--tp-radius);
}
.tp[data-skin='aurora'][data-fullscreen] { border-radius: 0; }

/* Title bar */
.tp[data-skin='aurora'] .tp-aurora-top {
  position: absolute; inset: 0 0 auto 0; display: flex; align-items: center;
  padding: 14px 16px 36px;
  background: var(--tp-scrim-top);
}
.tp[data-skin='aurora'] .tp-aurora-top .tp-title { font-size: 16px; }
.tp[data-skin='aurora']:not([data-started]) .tp-aurora-top { background: none; }

/* Control bar */
.tp[data-skin='aurora'] .tp-controls {
  position: absolute; inset: auto 0 0 0; display: grid; gap: 2px;
  padding: 44px 12px 8px;
  background: var(--tp-scrim);
}
.tp[data-skin='aurora'][data-playing][data-idle]:not([data-menu-open]) .tp-controls { transform: translateY(8px); }
.tp[data-skin='aurora'] .tp-time-slider { margin: 0 6px; }
.tp[data-skin='aurora'] .tp-slider-fill { background: linear-gradient(90deg, #22d3ee, var(--tp-accent)); }
.tp[data-skin='aurora'] .tp-menu { border: 1px solid rgba(255, 255, 255, 0.12); }

/* Big play button */
.tp[data-skin='aurora'] .tp-big-play { --tp-control-size: 76px; background: var(--tp-accent); color: #04241a; }
.tp[data-skin='aurora'] .tp-big-play:hover { background: #6ee7b7; }

/* Skip intro (custom control) */
.tp[data-skin='aurora'] .tp-aurora-skip {
  position: absolute; right: 16px; bottom: 104px; padding: 0 18px;
  background: var(--tp-surface); border: 1px solid rgba(255, 255, 255, 0.32); font-weight: 600;
}
.tp[data-skin='aurora'] .tp-aurora-skip .tp-button-text { margin: 0; }
.tp[data-skin='aurora'] .tp-aurora-skip:hover { background: var(--tp-accent); color: #04241a; }

/* HTML captions (captionOverlay) */
.tp[data-skin='aurora'] .tp-caption { --tp-caption-offset: 96px; }
.tp[data-skin='aurora'][data-playing][data-idle] .tp-caption { --tp-caption-offset: 24px; }
.tp[data-skin='aurora'] .tp-caption-text { background: rgba(4, 10, 20, 0.85); border-radius: 8px; font-size: clamp(15px, 2.6cqw, 28px); }

/* Sizes: data-size is sm < 480 px, md < 960 px, lg >= 960 px */
.tp[data-skin='aurora'][data-size='sm'] .tp-seek,
.tp[data-skin='aurora'][data-size='sm'] .tp-pip { display: none; }
.tp[data-skin='aurora'][data-size='sm'] .tp-aurora-top { padding: 8px 10px 24px; }
.tp[data-skin='aurora'][data-size='sm'] .tp-aurora-skip { bottom: 84px; right: 10px; }
.tp[data-skin='aurora'][data-size='lg'] { --tp-control-size: 48px; --tp-icon-size: 26px; }

/* Touch: 44 px minimum targets */
@media (pointer: coarse) {
  .tp[data-skin='aurora'] { --tp-control-size: 44px; }
}

/* Portrait phones (opt-in with portrait: true and aspectRatio: false) */
@media (max-width: 639px) and (orientation: portrait) {
  .tp[data-skin='aurora'][data-aurora-portrait] { --tp-aspect-ratio: 9 / 16; max-width: calc(78svh * 9 / 16); margin-inline: auto; }
  .tp[data-skin='aurora'][data-aurora-portrait] .tp-media { object-fit: cover; }
}
```

### Use it

```ts
import { createPlayer } from '@tomato-player/core';
import { hls } from '@tomato-player/provider-hls';
import { hotkeys } from '@tomato-player/plugin-hotkeys';
import { aurora } from 'tomato-player-skin-aurora';

createPlayer('#player', {
  src: 'https://example.com/episode-3/master.m3u8',
  title: 'Episode 3: The Harbour',
  tracks: [{ src: '/captions/ep3.en.vtt', kind: 'captions', label: 'English', srclang: 'en', default: true }],
  providers: [hls()],
  plugins: [hotkeys()],
  skin: aurora({ intro: { start: 5, end: 62 }, rates: [1, 1.25, 1.5, 2], tokens: { accent: '#38bdf8' } }),
});
```

## 8. Accessibility checklist

Every official skin targets WCAG 2.2 AA. Hold your skin to the same bar:

- [ ] Every interactive element is a real `<button>` or uses a primitive with a role (`role="slider"`, `role="menu"`). No clickable `<div>`s, except the gesture layer, which is `aria-hidden` and duplicates the play button.
- [ ] Every button has an accessible name (`aria-label` or visible text). Toggles expose `aria-pressed`.
- [ ] Focus is visible on every control. Keep `box-shadow: var(--tp-focus)` on `:focus-visible`, or replace it with something at least as visible. Never `outline: none` without a replacement.
- [ ] Tab order follows the visual order. Don't reorder controls with CSS `order` or absolute positioning in a way that breaks it.
- [ ] Controls stay visible while keyboard focus is inside the player. This is automatic as long as you hide them with `.tp-autohide` and don't add your own timers.
- [ ] Touch targets are at least 44 × 44 px on `pointer: coarse` (WCAG 2.5.8 requires 24 px; 44 px is the official skins' bar).
- [ ] `--tp-accent` has at least 3:1 contrast against the control background, and text at least 4.5:1 against its background, including over bright video.
- [ ] Captions are readable: `captionOverlay` text or native cues, not covered by the control bar, at least 14 px on small players.
- [ ] Motion respects `prefers-reduced-motion`. Base CSS zeroes transitions, but check any JavaScript animation you add.
- [ ] Sliders stay visible in `forced-colors: active` (Windows High Contrast). Don't draw essential UI with `background-image` only.
- [ ] The skin works at 320 px wide (`data-size="sm"`), in fullscreen and in pseudo-fullscreen on iPhone.
- [ ] No autoplay with sound. Muted autoplay only through `autoplayInView` or the `muted` option.
- [ ] No third-party logos, fonts or trademarks. A design inspired by another platform is labeled "unofficial".

## 9. Test your skin

### Automated tests

The official skins are tested with [Vitest](https://vitest.dev) and [happy-dom](https://github.com/capricorn86/happy-dom). The same test works for a community skin:

```ts
// test/aurora.test.ts
import { afterEach, expect, it } from 'vitest';
import { createPlayer } from '@tomato-player/core';
import { aurora } from '../src';

afterEach(() => {
  document.body.innerHTML = '';
});

it('mounts accessible controls and cleans up', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const player = createPlayer(host, { skin: aurora({ intro: { start: 0, end: 30 } }), title: 'Demo' });
  expect(player.el.dataset.skin).toBe('aurora');

  const buttons = [...player.el.querySelectorAll('button')];
  expect(buttons.length).toBeGreaterThan(2);
  for (const b of buttons) expect(b.getAttribute('aria-label') || b.textContent?.trim(), b.className).toBeTruthy();
  expect(player.el.querySelector('[role="slider"]')).not.toBeNull();

  player.setSkin(null);
  expect(player.el.querySelector('.tp-skin')).toBeNull();
  player.destroy();
});

it('applies tokens as inline custom properties', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const player = createPlayer(host, { skin: aurora({ tokens: { accent: '#0ea5e9' } }) });
  expect(player.el.style.getPropertyValue('--tp-accent')).toBe('#0ea5e9');
  player.destroy();
});
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'happy-dom' } });
```

happy-dom has no real media pipeline, so these tests cover structure, accessible names and cleanup, not playback. Vitest does not process CSS by default, so the `./style.css` import resolves without a loader.

### Manual checks

Run through these in a real browser with a real stream:

1. **Keyboard only:** Tab through every control, operate sliders with the arrow keys, Home and End, open the settings menu, move with the arrow keys and close it with Escape.
2. **Screen reader:** VoiceOver or NVDA announces each button's name and state, and the time slider reads "1:05 of 10:00".
3. **States:** poster (not started), playing, paused, buffering (throttle the network), ended (replay icon), error (use a broken URL), live (an HLS live stream shows the LIVE badge).
4. **Sizes:** 320 px, 640 px, 1280 px, fullscreen, and a portrait phone.
5. **Captions:** on, off, switching languages, and position while the controls hide.
6. **Preferences:** `prefers-reduced-motion`, `forced-colors`, and 200% browser zoom.
7. **Skin switching:** `player.setSkin(other())` and back leaves no stray elements or attributes.

Inside the monorepo, `pnpm playground` builds everything and serves a page where you can try your skin, and `pnpm validate && pnpm test && pnpm size` must pass before a pull request.

## 10. Package and publish

### Inside the Tomato Player monorepo

```sh
pnpm new skin aurora "Streaming and course skin with skip intro and HTML captions"
pnpm install
pnpm --filter @tomato-player/skin-aurora build
pnpm validate && pnpm test
```

This scaffolds `packages/skins/aurora` from `templates/skin` with a validated `package.json`. Open a pull request with the **New skin** template. See [Create a skin](create-a-skin.md) for the short version.

### As your own npm package

Name community skins `tomato-player-skin-<name>` and add the `tomato-player-skin` keyword so they are easy to find. Layout:

```
tomato-player-skin-aurora/
├── src/
│   ├── index.ts
│   ├── style.css
│   └── css.d.ts
├── test/aurora.test.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

`package.json`:

```json
{
  "name": "tomato-player-skin-aurora",
  "version": "0.1.0",
  "description": "Aurora: a Tomato Player skin for streaming and course platforms.",
  "license": "MIT",
  "type": "module",
  "sideEffects": ["*.css"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist", "LICENSE"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean --minify --loader .css=text && cp src/style.css dist/style.css",
    "test": "vitest run",
    "prepublishOnly": "npm run build && npm test"
  },
  "peerDependencies": {
    "@tomato-player/core": "^0.1.0",
    "@tomato-player/ui": "^0.1.0"
  },
  "devDependencies": {
    "@tomato-player/core": "^0.1.0",
    "@tomato-player/ui": "^0.1.0",
    "happy-dom": "^20.0.0",
    "tsup": "^8.3.5",
    "typescript": "^5.6.3",
    "vitest": "^3.0.0"
  },
  "keywords": ["tomato-player", "tomato-player-skin", "video", "player", "skin"]
}
```

Why this shape:

- **`@tomato-player/core` is a peer dependency.** The app owns the player. Your skin must use the same core instance and types, not a second copy. List `@tomato-player/ui` as a peer too, so the controls and base stylesheet come from the same version the app's other skins use. tsup leaves peer dependencies out of the bundle automatically.
- **The CSS is shipped twice:** inlined as a string in the JavaScript, for automatic injection, and as `dist/style.css`, for strict-CSP users who set `injectStyles: false` and import it themselves.
- **`sideEffects: ["*.css"]`** lets bundlers tree-shake the JavaScript but keep CSS imports.
- **ESM, CJS and types** match the official packages, so the skin works in Vite, webpack, Next.js and Node-based test runners.

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "declaration": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Then:

```sh
npm run build
npm publish --access public
```

In your README, include a screenshot, the install command, every option with its default, the tokens your skin reads or adds, and the class names you consider public. Follow semver: renaming a public class or removing an option is a breaking change.

## 11. Use your skin from React, Vue, Svelte and HTML

A skin from a package works exactly like an official skin. Every binding accepts a `Skin` object and calls `setSkin()` when it changes.

### React and Next.js

```tsx
'use client';
import { TomatoPlayer } from '@tomato-player/react';
import { aurora } from 'tomato-player-skin-aurora';

const skin = aurora({ intro: { start: 5, end: 62 } }); // create once, outside render

export function Episode({ src }: { src: string }) {
  return <TomatoPlayer src={src} title="Episode 3" skin={skin} tokens={{ accent: '#38bdf8' }} />;
}
```

Create the skin outside the component or in `useMemo`. A new skin object on every render remounts the skin. `TomatoPlayer` accepts every `createPlayer` option as a prop. Changing `src` or `skin` updates the live player. Other options, such as `tokens`, are read once when the player is created.

### Vue 3 and Nuxt

```vue
<script setup lang="ts">
import { TomatoPlayer } from '@tomato-player/vue';
import { aurora } from 'tomato-player-skin-aurora';

const skin = aurora({ rates: [1, 1.5, 2] });
</script>

<template>
  <TomatoPlayer src="/media/lecture.mp4" title="Lecture 4" :skin="skin" :options="{ tokens: { accent: '#16a34a' } }" />
</template>
```

### Svelte and SvelteKit

```svelte
<script lang="ts">
  import { tomato } from '@tomato-player/svelte';
  import { aurora } from 'tomato-player-skin-aurora';
  const skin = aurora();
</script>

<div use:tomato={{ src: '/media/lecture.mp4', skin, tokens: { accent: '#16a34a' } }} />
```

### Web component and plain HTML

The `<tomato-player>` element's `skin` attribute only knows the nine official skins. For a custom skin, start with `skin="none"` and set it from script:

```html
<tomato-player id="ep3" src="/media/episode-3.mp4" title="Episode 3" skin="none"></tomato-player>

<script type="module">
  import 'tomato-player/element';
  import { aurora } from 'tomato-player-skin-aurora';

  const el = document.getElementById('ep3');
  const apply = (player) => player.setSkin(aurora());
  el.player ? apply(el.player) : el.addEventListener('ready', (e) => apply(e.detail), { once: true });
</script>
```

Don't change the `skin` attribute afterwards. It switches back to an official skin.

Without a bundler, the CDN bundle exposes the UI primitives as `TomatoPlayer.ui`, so a small skin can be written inline:

```html
<script src="https://cdn.jsdelivr.net/npm/tomato-player@0/dist/tomato-player.global.js"></script>
<div id="player"></div>
<script>
  const { createSkin, gestureLayer, spinner, bigPlayButton, group, timeSlider, playButton, timeDisplay, spacer, fullscreenButton } = TomatoPlayer.ui;
  const tiny = createSkin({
    name: 'tiny',
    css: ".tp[data-skin='tiny'] .tp-controls { position: absolute; inset: auto 0 0 0; padding: 8px; background: rgba(0, 0, 0, 0.6); }",
    build: (p) => [
      gestureLayer(p),
      spinner(),
      bigPlayButton(p),
      group('tp-controls tp-autohide tp-hide-unstarted', timeSlider(p), group('tp-row', playButton(p), timeDisplay(p), spacer(), fullscreenButton(p))),
    ],
  });
  TomatoPlayer.createPlayer('#player', { src: '/media/movie.mp4', skin: tiny() });
</script>
```

## 12. Reference

### Classes

Public class names from `@tomato-player/ui`. Style these freely, scoped to your skin.

| Element | Classes |
| --- | --- |
| Root and media | `.tp`, `.tp-media` (the `<video>`), `.tp-skin` (skin container) |
| Layout | `.tp-row`, `.tp-spacer`, `.tp-autohide`, `.tp-hide-unstarted`, `.tp-controls` (convention only, not styled by base) |
| Buttons | `.tp-button`, `.tp-icon`, `.tp-button-text`, `.tp-play`, `.tp-mute`, `.tp-fullscreen`, `.tp-pip`, `.tp-captions`, `.tp-settings`, `.tp-cast`, `.tp-rate`, `.tp-unmute`, `.tp-seek` with `.tp-seek-back` or `.tp-seek-forward`, `.tp-seek-amount` |
| Sliders | `.tp-slider`, `.tp-slider-track`, `.tp-slider-buffer`, `.tp-slider-fill`, `.tp-slider-thumb`, `.tp-time-slider`, `.tp-volume`, `.tp-volume-slider` |
| Seek preview | `.tp-preview`, `.tp-preview-thumb`, `.tp-preview-chapter`, `.tp-preview-time`, `.tp-chapter-markers`, `.tp-chapter-marker` |
| Text | `.tp-time-display`, `.tp-time`, `.tp-time-current`, `.tp-time-duration`, `.tp-time-remaining`, `.tp-time-sep`, `.tp-title`, `.tp-live`, `.tp-live-dot` |
| Overlays | `.tp-gesture-layer`, `.tp-big-play`, `.tp-spinner`, `.tp-spinner-ring`, `.tp-error`, `.tp-error-message`, `.tp-caption`, `.tp-caption-text` |
| Menu | `.tp-menu-wrap`, `.tp-menu`, `.tp-menu-item`, `.tp-menu-label`, `.tp-menu-hint`, `.tp-menu-back` |

Element-level attributes: `.tp-slider[data-dragging]` while dragging, `.tp-preview[data-visible]` while hovering the time slider, `.tp-live[data-edge]` within 10 s of the live edge, `.tp-time-display[data-live]` on live streams.

### State attributes

Set on the `.tp` root:

| Attribute | Present when |
| --- | --- |
| `data-skin="<name>"` | A skin is mounted. |
| `data-ready` | Metadata has loaded. |
| `data-started` | Playback has started at least once for this source. |
| `data-paused` / `data-playing` | Paused / playing (exactly one is set). |
| `data-ended` | Playback reached the end. |
| `data-waiting` | Buffering. Show a spinner. |
| `data-seeking` | A seek is in progress. |
| `data-idle` | No user activity for `idleTimeout` ms during playback. |
| `data-muted` | Muted. |
| `data-live` | Live stream. |
| `data-captions` | A text track is showing. |
| `data-error` | A playback error occurred. |
| `data-fullscreen` | In fullscreen, including pseudo-fullscreen. |
| `data-pseudo-fullscreen` | Pinned to the viewport by `fullscreenFallback: 'pseudo'`. |
| `data-pip` | In picture-in-picture. |
| `data-size="sm\|md\|lg"` | Always. Width under 480 px, under 960 px, or larger. |
| `data-menu-open` | The settings menu is open. |
| `data-muted-autoplay` | Playing muted after `autoplayInView` started it. |

The root is also a size container (`container-type: inline-size`), so `@container` queries and `cqw` units work inside skins.

### Tokens

See the [token table](#4-theme-with-design-tokens) above. Internal properties you should read but not set: `--tp-slider-value` and `--tp-slider-buffer` (0 to 1, set on each slider) and `--tp-preview-x` (preview position).

## Related

- [Skins and theming](skins.md): the built-in skins and their options.
- [Create a skin](create-a-skin.md): the short monorepo workflow.
- [UI primitives](../api/ui.md): the control API reference.
- [Player API](../api/player.md): state, methods and events for custom controls.
- [Accessibility](accessibility.md): what every skin gets by default.
