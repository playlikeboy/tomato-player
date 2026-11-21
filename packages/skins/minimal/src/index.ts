import {
  bigPlayButton, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, pipButton,
  playButton, settingsMenu, spacer, spinner, timeDisplay, timeSlider, volumeControl,
} from '@tomato-player/ui';
import css from './style.css';

export interface MinimalOptions {
  pip?: boolean;
  settings?: boolean;
}

/** Clean, lightweight controls. The default Tomato Player skin. */
export const minimal = createSkin<MinimalOptions>({
  name: 'minimal',
  css,
  build: (p, _root, o) => [
    gestureLayer(p),
    spinner(),
    bigPlayButton(p),
    errorOverlay(p),
    group(
      'tp-controls tp-autohide tp-hide-unstarted',
      timeSlider(p),
      group('tp-row', playButton(p), volumeControl(p), timeDisplay(p), spacer(), captionsButton(p), o.settings !== false && settingsMenu(p), o.pip !== false && pipButton(p), fullscreenButton(p)),
    ),
  ],
});

export default minimal;
