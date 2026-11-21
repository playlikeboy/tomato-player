# Create a skin

Skins are the heart of Tomato Player, and anyone can publish one.

## 1. Scaffold

```sh
pnpm new skin aurora "Northern-lights inspired skin with soft gradients"
pnpm install
```

This creates `packages/skins/aurora` with `src/index.ts`, `src/style.css`, a README and a validated `package.json`.

## 2. Compose controls

```ts
import { createSkin, group, playButton, timeSlider, timeDisplay, spacer, fullscreenButton, bigPlayButton, spinner, gestureLayer } from '@tomato-player/ui';
import css from './style.css';

export const aurora = createSkin<{ glow?: boolean }>({
  name: 'aurora',
  css,
  tokens: { accent: '#34d399' },
  build: (p, root, o) => [
    gestureLayer(p),
    spinner(),
    bigPlayButton(p),
    group('tp-controls tp-autohide tp-hide-unstarted',
      timeSlider(p),
      group('tp-row', playButton(p), timeDisplay(p), spacer(), fullscreenButton(p)),
    ),
  ],
});
```

- `tp-autohide` fades the element out while playing and idle.
- `tp-hide-unstarted` hides it until the first play.
- Return a `{ controls, cleanup }` object if you set up observers or timers.

## 3. Style

Scope **every** selector to your skin. `pnpm validate` enforces it, so skins never leak into each other:

```css
.tp[data-skin='aurora'] { --tp-radius: 16px; }
.tp[data-skin='aurora'] .tp-controls { position: absolute; inset: auto 0 0 0; padding: 32px 12px 8px; }
.tp[data-skin='aurora'][data-waiting] .tp-slider-fill { animation: pulse 1s infinite; }
```

Use state attributes (`data-paused`, `data-idle`, `data-size`…) and `@container` queries rather than JS for visual behavior.

## 4. Custom controls

Any `{ el, destroy }` object is a control:

```ts
function sleepTimer(p: Player): Control {
  const el = h('button', { type: 'button', class: 'tp-button', 'aria-label': 'Sleep in 15 minutes' }, '15m');
  let t: ReturnType<typeof setTimeout>;
  el.onclick = () => { clearTimeout(t); t = setTimeout(() => p.pause(), 15 * 60_000); };
  return { el, destroy: () => { clearTimeout(t); el.remove(); } };
}
```

## 5. Checklist

- [ ] Every button has an accessible name (tests check this).
- [ ] Works at 320 px wide (`data-size="sm"`) and in fullscreen.
- [ ] Touch targets ≥ 44 px on `pointer: coarse`.
- [ ] Focus ring visible on every control.
- [ ] No third-party logos, fonts or trademarks. Inspired designs must be labeled "unofficial".
- [ ] `pnpm validate && pnpm test && pnpm size` pass.

## 6. Publish

Inside this monorepo, open a PR using the **New skin** template. Outside it, publish as `tomato-player-skin-<name>` with the `tomato-player-skin` keyword so the gallery can discover it.
