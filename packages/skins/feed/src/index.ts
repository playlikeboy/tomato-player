/**
 * Unofficial, social-feed-inspired skin. Recreates familiar interaction
 * patterns only. No logos, fonts or assets of any company are used, and this
 * project is not affiliated with or endorsed by Meta Platforms, Inc.
 */
import {
  autoplayInView, createSkin, errorOverlay, fullscreenButton, gestureLayer, group, muteButton, playButton,
  spacer, spinner, timeDisplay, timeSlider, unmuteButton, settingsMenu, speedSection, captionsSection,
} from '@tomato-player/ui';
import css from './style.css';

export interface FeedOptions {
  /** Muted autoplay when scrolled into view, pause when scrolled away (default true). */
  autoplayInView?: boolean;
}

export const feed = createSkin<FeedOptions>({
  name: 'feed',
  css,
  tokens: { accent: '#0866ff' },
  build(p, _root, o) {
    const stop = o.autoplayInView !== false ? autoplayInView(p, { once: false }) : undefined;
    return {
      controls: [
        gestureLayer(p),
        spinner(),
        errorOverlay(p),
        group('tp-feed-unmute', unmuteButton(p, { restart: false })),
        group(
          'tp-controls tp-autohide',
          group('tp-row', playButton(p), timeDisplay(p), spacer(), settingsMenu(p, [speedSection(p), captionsSection(p)]), muteButton(p), fullscreenButton(p)),
          timeSlider(p),
        ),
      ],
      cleanup: stop,
    };
  },
});

export default feed;
