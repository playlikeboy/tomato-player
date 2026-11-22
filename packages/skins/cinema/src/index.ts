import {
  bigPlayButton, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, h, playButton,
  remainingTime, seekButton, settingsMenu, spacer, spinner, timeSlider, title, volumeControl,
} from '@tomato-player/ui';
import css from './style.css';
import { cinemaIcons } from './icons';

export interface CinemaOptions {
  /** Small label above the title, e.g. a studio or series name. */
  eyebrow?: string;
  seekStep?: number;
}

/** Premium cinematic skin: letterboxed title, gold accents, remaining-time display. */
export const cinema = createSkin<CinemaOptions>({
  name: 'cinema',
  css,
  icons: cinemaIcons,
  tokens: { accent: '#e8b04b' },
  build(p, _root, o) {
    const step = o.seekStep ?? 10;
    const eyebrow = o.eyebrow ? h('div', { class: 'tp-eyebrow' }, o.eyebrow) : null;
    return [
      gestureLayer(p),
      spinner(),
      group('tp-cinema-top tp-autohide', eyebrow, title(p)),
      bigPlayButton(p),
      errorOverlay(p),
      group(
        'tp-controls tp-autohide tp-hide-unstarted',
        group('tp-row tp-cinema-progress', timeSlider(p), remainingTime(p)),
        group('tp-row', playButton(p), seekButton(p, -step), seekButton(p, step), volumeControl(p), spacer(), captionsButton(p), settingsMenu(p), fullscreenButton(p)),
      ),
    ];
  },
});

export default cinema;
