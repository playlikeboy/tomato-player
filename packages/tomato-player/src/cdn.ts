// Entry for the CDN / <script> build (window.TomatoPlayer).
import { hls } from '@tomato-player/provider-hls';
import { defineTomatoElement } from './element-define';

export * from './index';
export { hls };
export { defineTomatoElement };

/** HLS via hls.js from jsDelivr, loaded only when an .m3u8 needs it (Safari uses native HLS). */
const cdnHls = hls({ library: 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js' });
defineTomatoElement('tomato-player', { providers: [cdnHls] });
