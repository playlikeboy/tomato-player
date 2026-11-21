/**
 * CampusLoop skin — ported from the CampusLoop (campusloop.space) landing-page
 * launch video player: a paper "sticker" control strip, sticker play pill,
 * tap-to-unmute sticker, sticker-label captions and a cycling speed button.
 */
import {
  autoplayInView, captionOverlay, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group,
  h, pipButton, playButton, rateButton, spinner, svg, icons, timeDisplay, timeSlider, unmuteButton, volumeControl,
  type Control,
} from '@tomato-player/ui';
import type { Player } from '@tomato-player/core';
import css from './style.css';

export interface CampusOptions {
  /** Label on the poster play pill (default "Play the video"). */
  playLabel?: string;
  /** Muted autoplay once 60% visible; pauses below 20% (default true). Respects reduced-motion and Save-Data. */
  autoplayInView?: boolean;
  /** Message shown when the video fails (default "The video is on its way. Check back soon."). */
  errorMessage?: string;
  /** Light or dark paper. `auto` follows `prefers-color-scheme` (default). */
  theme?: 'light' | 'dark' | 'auto';
}

function playPill(p: Player, label: string): Control {
  const el = h(
    'button',
    { type: 'button', class: 'tp-campus-play' },
    h('span', { class: 'tp-campus-play-pill' }, h('span', { class: 'tp-campus-play-dot' }, svg(icons.play)), h('span', { class: 'tp-campus-play-text' }, label), h('span', { class: 'tp-sr' }, ', with sound')),
  );
  const onClick = () => {
    p.setMuted(false);
    p.el.removeAttribute('data-muted-autoplay');
    p.el.focus({ preventScroll: true });
    void p.play();
  };
  el.addEventListener('click', onClick);
  return { el, destroy: () => el.remove() };
}

function campusError(p: Player, message: string): Control {
  const base = errorOverlay(p);
  base.el.classList.add('tp-campus-error');
  const msg = base.el.querySelector('.tp-error-message')!;
  const off = p.store.select((s) => s.error, (e) => e && (msg.textContent = message));
  return { el: base.el, destroy: () => (off(), base.destroy()) };
}

export const campus = createSkin<CampusOptions>({
  name: 'campus',
  css,
  tokens: { accent: '#6b3df5' },
  build(p, root, o) {
    const theme = o.theme ?? 'auto';
    if (theme !== 'auto') root.parentElement?.setAttribute('data-theme', theme);
    const stop = o.autoplayInView !== false ? autoplayInView(p, { playAt: 0.6, pauseAt: 0.2, once: true }) : undefined;
    const unmute = unmuteButton(p, { restart: true, label: 'Unmute' });
    unmute.el.classList.add('tp-campus-unmute');
    return {
      controls: [
        gestureLayer(p),
        spinner(),
        playPill(p, o.playLabel ?? 'Play the video'),
        unmute,
        captionOverlay(p),
        campusError(p, o.errorMessage ?? 'The video is on its way. Check back soon.'),
        group(
          'tp-controls tp-autohide tp-hide-unstarted',
          group('tp-campus-strip', group('tp-campus-seek', timeSlider(p)), playButton(p), timeDisplay(p), h('span', { class: 'tp-campus-flex' }), volumeControl(p), captionsButton(p), rateButton(p), pipButton(p), fullscreenButton(p)),
        ),
      ],
      cleanup: stop,
    };
  },
});

export default campus;
