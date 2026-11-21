import {
  bigPlayButton, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, pipButton,
  playButton, settingsMenu, spinner, timeDisplay, timeSlider, title, volumeControl, castButton,
} from '@tomato-player/ui';
import css from './style.css';

export interface CreatorOptions {
  /** Two-stop accent gradient. */
  gradient?: [string, string];
}

/** Expressive, modern skin: floating glass pill controls with a vivid gradient. */
export const creator = createSkin<CreatorOptions>({
  name: 'creator',
  css,
  tokens: { accent: '#a855f7' },
  build: (p, root, o) => {
    if (o.gradient) {
      root.parentElement?.style.setProperty('--tp-grad-a', o.gradient[0]);
      root.parentElement?.style.setProperty('--tp-grad-b', o.gradient[1]);
    }
    return [
      gestureLayer(p),
      spinner(),
      bigPlayButton(p),
      errorOverlay(p),
      group('tp-creator-title tp-autohide', title(p)),
      group(
        'tp-controls tp-autohide tp-hide-unstarted',
        playButton(p),
        group('tp-creator-seek', timeSlider(p)),
        timeDisplay(p),
        volumeControl(p),
        captionsButton(p),
        settingsMenu(p),
        castButton(p),
        pipButton(p),
        fullscreenButton(p),
      ),
    ];
  },
});

export default creator;
