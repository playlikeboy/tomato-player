import {
  button, createSkin, errorOverlay, fullscreenButton, group, h, playButton, settingsMenu, spacer, speedSection,
  spinner, timeSlider, volumeControl, captionsSection, qualitySection, Scope, type Control,
} from '@tomato-player/ui';
import type { Player } from '@tomato-player/core';
import css from './style.css';

export interface StudioOptions {
  /** Frames per second used for timecode and frame stepping (default 30). */
  fps?: number;
}

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
/** SMPTE-style `HH:MM:SS:FF`. */
export function timecode(seconds: number, fps: number): string {
  const s = Math.max(0, seconds);
  return `${pad(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}:${pad((s % 1) * fps)}`;
}

function timecodeDisplay(p: Player, fps: number): Control {
  const scope = new Scope();
  const cur = h('span', { class: 'tp-tc-current' });
  const dur = h('span', { class: 'tp-tc-duration' });
  const el = h('div', { class: 'tp-timecode', 'aria-live': 'off' }, cur, h('span', { class: 'tp-tc-sep' }, ' / '), dur);
  scope.add(p.store.select((s) => s.currentTime, (t) => (cur.textContent = timecode(t, fps))));
  scope.add(p.store.select((s) => s.duration, (d) => (dur.textContent = timecode(d, fps))));
  return { el, destroy: () => (scope.dispose(), el.remove()) };
}

/** A-B loop: first click sets A, second sets B, third clears. */
function abLoop(p: Player): Control {
  let a: number | null = null;
  let b: number | null = null;
  const c = button(p, { label: 'A-B loop', text: 'A-B', className: 'tp-ab', onClick: () => {
    if (a === null) a = p.state.currentTime;
    else if (b === null) b = Math.max(a + 0.1, p.state.currentTime);
    else a = b = null;
    c.el.dataset.state = a === null ? '' : b === null ? 'a' : 'ab';
    c.el.setAttribute('aria-pressed', String(b !== null));
  } });
  const off = p.on('timeupdate', (t) => {
    if (a !== null && b !== null && t >= b) p.seek(a);
  });
  return { el: c.el, destroy: () => (off(), c.destroy()) };
}

/** Professional skin: always-visible toolbar, SMPTE timecode, frame stepping, A-B loop. */
export const studio = createSkin<StudioOptions>({
  name: 'studio',
  css,
  tokens: { accent: '#38bdf8' },
  build(p, root, o) {
    const fps = o.fps ?? 30;
    const frame = (dir: 1 | -1) => () => {
      p.pause();
      p.seekBy(dir / fps);
    };
    const surface = h('div', { class: 'tp-studio-surface' });
    surface.addEventListener('click', () => void p.togglePlay());
    root.append(surface);
    return [
      spinner(),
      errorOverlay(p),
      group(
        'tp-controls',
        timeSlider(p, { liveScrub: true }),
        group(
          'tp-row',
          button(p, { icon: 'previous', label: 'Previous frame', className: 'tp-frame', onClick: frame(-1) }),
          playButton(p),
          button(p, { icon: 'next', label: 'Next frame', className: 'tp-frame', onClick: frame(1) }),
          timecodeDisplay(p, fps),
          spacer(),
          abLoop(p),
          volumeControl(p),
          settingsMenu(p, [speedSection(p, [0.1, 0.25, 0.5, 1, 1.5, 2, 4]), qualitySection(p), captionsSection(p)]),
          fullscreenButton(p),
        ),
      ),
      { el: surface, destroy: () => surface.remove() },
    ];
  },
});

export default studio;
