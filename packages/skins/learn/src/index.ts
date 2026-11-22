import {
  bigPlayButton, button, captionOverlay, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer,
  group, h, playButton, Scope, seekButton, settingsMenu, spacer, spinner, timeDisplay, timeSlider, title,
  volumeControl, type ChaptersProvider, type Control,
} from '@tomato-player/ui';
import { formatTime, type Player } from '@tomato-player/core';
import css from './style.css';
import { learnIcons } from './icons';

export interface LearnOptions {
  /** Speeds shown as one-tap chips (default 0.75–2). */
  rates?: number[];
  /** Seconds for the rewind/forward buttons (default 10). */
  seekStep?: number;
  /** Show the chapter panel toggle when chapters exist (default true). */
  chapterPanel?: boolean;
}

function rateChips(p: Player, rates: number[]): Control {
  const scope = new Scope();
  const el = h('div', { class: 'tp-rate-chips', role: 'radiogroup', 'aria-label': p.t('speed') });
  const chips = rates.map((r) => {
    const b = h('button', { type: 'button', class: 'tp-chip', role: 'radio' }, `${r}×`);
    scope.listen(b, 'click', () => p.setPlaybackRate(r));
    el.append(b);
    return [r, b] as const;
  });
  scope.add(p.store.select((s) => s.playbackRate, (rate) => {
    for (const [r, b] of chips) b.setAttribute('aria-checked', String(r === rate));
  }));
  return { el, destroy: () => (scope.dispose(), el.remove()) };
}

function chapterPanel(p: Player): { panel: Control; toggle: Control } {
  const scope = new Scope();
  const list = h('ol', { class: 'tp-chapter-list' });
  const panel = h('aside', { class: 'tp-chapter-panel', 'aria-label': p.t('chapters'), hidden: true }, h('h3', {}, p.t('chapters')), list);
  const toggle = button(p, { icon: 'chapters', label: p.t('chapters'), className: 'tp-chapters-toggle', onClick: () => {
    panel.hidden = !panel.hidden;
    toggle.el.setAttribute('aria-pressed', String(!panel.hidden));
  } });
  toggle.el.hidden = true;
  const render = () => {
    const chapters = p.inject<ChaptersProvider>('chapters')?.list() ?? [];
    toggle.el.hidden = chapters.length === 0;
    list.replaceChildren(...chapters.map((c, i) => {
      const b = h('button', { type: 'button', class: 'tp-chapter-item', 'data-index': i }, h('span', { class: 'tp-chapter-time' }, formatTime(c.start)), h('span', {}, c.title));
      b.addEventListener('click', () => p.seek(c.start));
      return h('li', {}, b);
    }));
  };
  scope.add(p.on('plugin:chapters', render));
  scope.add(p.on('ready', render));
  scope.add(p.on('plugin:chapterchange', (c) => {
    const chapters = p.inject<ChaptersProvider>('chapters')?.list() ?? [];
    const idx = chapters.findIndex((x) => x === c || (c && x.start === (c as { start: number }).start));
    list.querySelectorAll('.tp-chapter-item').forEach((el, i) => el.toggleAttribute('data-active', i === idx));
  }));
  render();
  return { panel: { el: panel, destroy: () => (scope.dispose(), panel.remove()) }, toggle };
}

/** Learning-focused skin: speed chips, skip buttons, chapter panel, readable captions. */
export const learn = createSkin<LearnOptions>({
  name: 'learn',
  css,
  icons: learnIcons,
  tokens: { accent: '#10b981' },
  build(p, _root, o) {
    const step = o.seekStep ?? 10;
    const chapters = o.chapterPanel !== false ? chapterPanel(p) : null;
    return [
      gestureLayer(p),
      spinner(),
      bigPlayButton(p),
      errorOverlay(p),
      captionOverlay(p),
      group('tp-learn-top tp-autohide', title(p)),
      chapters?.panel,
      group(
        'tp-controls tp-autohide tp-hide-unstarted',
        timeSlider(p),
        group(
          'tp-row',
          seekButton(p, -step),
          playButton(p),
          seekButton(p, step),
          timeDisplay(p),
          spacer(),
          rateChips(p, o.rates ?? [0.75, 1, 1.25, 1.5, 2]),
          volumeControl(p),
          captionsButton(p),
          chapters?.toggle,
          settingsMenu(p),
          fullscreenButton(p),
        ),
      ),
    ];
  },
});

export default learn;
