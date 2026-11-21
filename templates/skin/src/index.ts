import {
  bigPlayButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, playButton, settingsMenu,
  spacer, spinner, timeDisplay, timeSlider, volumeControl,
} from '@tomato-player/ui';
import css from './style.css';

export interface __Pascal__Options {
  /** Example option: hide the settings menu. */
  settings?: boolean;
}

/** __DESCRIPTION__ */
export const __camel__ = createSkin<__Pascal__Options>({
  name: '__name__',
  css,
  tokens: { accent: '#f97316' },
  build: (p, _root, o) => [
    gestureLayer(p),
    spinner(),
    bigPlayButton(p),
    errorOverlay(p),
    group(
      'tp-controls tp-autohide tp-hide-unstarted',
      timeSlider(p),
      group('tp-row', playButton(p), volumeControl(p), timeDisplay(p), spacer(), o.settings !== false && settingsMenu(p), fullscreenButton(p)),
    ),
  ],
});

export default __camel__;
