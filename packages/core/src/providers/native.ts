import type { Provider } from '../types';
import { isDashType, isHlsType } from '../utils';

/**
 * Plays anything the browser supports natively: progressive MP4/WebM and,
 * on Safari/iOS, HLS. Always registered as the last fallback.
 */
export const nativeProvider: Provider = {
  name: 'native',
  canPlay(source, media) {
    const { type } = source;
    if (!type) return true; // let the browser try
    if (isDashType(type)) return false;
    if (isHlsType(type)) return media.canPlayType('application/vnd.apple.mpegurl') !== '';
    return media.canPlayType(type) !== '' || type.startsWith('video/') || type.startsWith('audio/');
  },
  create({ media }) {
    return {
      load(source) {
        media.src = source.src;
        media.load();
      },
      destroy() {
        media.removeAttribute('src');
        try {
          media.load();
        } catch {
          /* happy-dom / detached element */
        }
      },
    };
  },
};
