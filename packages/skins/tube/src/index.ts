/**
 * Unofficial, video-platform-inspired skin. Recreates familiar interaction
 * patterns only. No logos, fonts or assets of any company are used, and this
 * project is not affiliated with or endorsed by YouTube or Google LLC.
 */
import {
  button, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, pipButton, playButton,
  settingsMenu, spacer, spinner, timeDisplay, timeSlider, title, volumeControl, bigPlayButton,
} from '@tomato-player/ui';
import css from './style.css';
import { tubeIcons } from './icons';

export interface TubeOptions {
  onNext?: () => void;
  /** Show a theater-mode toggle; receives the new state. */
  onTheater?: (on: boolean) => void;
}

export const tube = createSkin<TubeOptions>({
  name: 'tube',
  css,
  icons: tubeIcons,
  tokens: { accent: '#ff0033' },
  build(p, root, o) {
    let theater = false;
    const theaterBtn = o.onTheater
      ? button(p, { icon: 'theater', label: 'Theater mode', className: 'tp-theater', onClick: () => {
          theater = !theater;
          root.parentElement?.toggleAttribute('data-theater', theater);
          theaterBtn!.el.setAttribute('aria-pressed', String(theater));
          o.onTheater!(theater);
        } })
      : null;
    return [
      gestureLayer(p),
      spinner(),
      bigPlayButton(p),
      errorOverlay(p),
      group('tp-tube-top tp-autohide', title(p)),
      group(
        'tp-controls tp-autohide tp-hide-unstarted',
        timeSlider(p),
        group(
          'tp-row',
          playButton(p),
          o.onNext && button(p, { icon: 'next', label: p.t('next'), className: 'tp-next', onClick: o.onNext }),
          volumeControl(p),
          timeDisplay(p),
          spacer(),
          captionsButton(p),
          settingsMenu(p),
          pipButton(p),
          theaterBtn,
          fullscreenButton(p),
        ),
      ),
    ];
  },
});

export default tube;
