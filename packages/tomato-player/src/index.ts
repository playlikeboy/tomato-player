export * from '@tomato-player/core';
export * as ui from '@tomato-player/ui';

export { minimal } from '@tomato-player/skin-minimal';
export { cinema } from '@tomato-player/skin-cinema';
export { studio } from '@tomato-player/skin-studio';
export { creator } from '@tomato-player/skin-creator';
export { learn } from '@tomato-player/skin-learn';
export { stream } from '@tomato-player/skin-stream';
export { tube } from '@tomato-player/skin-tube';
export { feed } from '@tomato-player/skin-feed';
export { campus } from '@tomato-player/skin-campus';

export { hotkeys } from '@tomato-player/plugin-hotkeys';
export { gestures } from '@tomato-player/plugin-gestures';
export { chapters } from '@tomato-player/plugin-chapters';
export { thumbnails } from '@tomato-player/plugin-thumbnails';
export { playlist } from '@tomato-player/plugin-playlist';
export { analytics } from '@tomato-player/plugin-analytics';
export { mediaSession } from '@tomato-player/plugin-media-session';
export { persist } from '@tomato-player/plugin-persist';

export { skins, type SkinName } from './registry';
export { defineTomatoElement, type TomatoElementConfig } from './element-define';
