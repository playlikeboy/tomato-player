/**
 * Unofficial, streaming-service-inspired skin. Recreates familiar interaction
 * patterns only. No logos, fonts or assets of any company are used, and this
 * project is not affiliated with or endorsed by Netflix, Inc.
 */
import {
  bigPlayButton, button, captionsButton, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, h,
  playButton, remainingTime, seekButton, settingsMenu, spacer, spinner, timeSlider, title, volumeControl,
} from '@tomato-player/ui';
import css from './style.css';
import { streamIcons } from './icons';

export interface StreamOptions {
  /** Show "Next episode" and call this on click. */
  onNext?: () => void;
  nextLabel?: string;
  /** Show a back arrow in the top-left and call this on click. */
  onBack?: () => void;
  /** Small line under the title, e.g. "S1:E3 The Pilot". */
  subtitle?: string;
}

export const stream = createSkin<StreamOptions>({
  name: 'stream',
  css,
  icons: streamIcons,
  tokens: { accent: '#e50914' },
  build(p, _root, o) {
    const back = o.onBack ? button(p, { icon: 'previous', label: 'Back', className: 'tp-back', onClick: o.onBack }) : null;
    const next = o.onNext ? button(p, { icon: 'next', label: o.nextLabel ?? 'Next episode', className: 'tp-next', onClick: o.onNext }) : null;
    const center = group('tp-stream-title', title(p), o.subtitle ? h('span', { class: 'tp-stream-sub' }, o.subtitle) : null);
    return [
      gestureLayer(p),
      spinner(),
      bigPlayButton(p),
      errorOverlay(p),
      back && group('tp-stream-top tp-autohide', back),
      group(
        'tp-controls tp-autohide tp-hide-unstarted',
        group('tp-row', timeSlider(p), remainingTime(p)),
        group('tp-row', playButton(p), seekButton(p, -10), seekButton(p, 10), volumeControl(p), spacer(), center, spacer(), next, captionsButton(p), settingsMenu(p), fullscreenButton(p)),
      ),
    ];
  },
});

export default stream;
