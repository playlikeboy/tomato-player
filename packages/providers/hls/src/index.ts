import { defineProvider, isHlsType, supportsMSE, type Provider, type Quality } from '@tomato-player/core';
import type Hls from 'hls.js';
import type { HlsConfig } from 'hls.js';

export interface HlsProviderOptions {
  /** Passed straight to `new Hls(config)`. */
  config?: Partial<HlsConfig>;
  /**
   * How to obtain hls.js. Defaults to a dynamic `import('hls.js')` so it is
   * code-split and only downloaded for HLS sources. Pass a function returning
   * the constructor (or a CDN URL string) to control loading yourself.
   */
  library?: (() => Promise<typeof Hls | { default: typeof Hls }>) | string;
  /** Prefer Safari's native HLS when available (default `true`, saves ~100 KB on iOS). */
  preferNative?: boolean;
  /** Called with the Hls instance right after creation, for advanced use. */
  onInstance?(hls: Hls): void;
}

const label = (height?: number, bitrate?: number) => (height ? `${height}p` : bitrate ? `${Math.round(bitrate / 1000)} kbps` : 'Unknown');

export function hls(options: HlsProviderOptions = {}): Provider {
  const preferNative = options.preferNative ?? true;
  return defineProvider({
    name: 'hls',
    canPlay(source, media) {
      if (!isHlsType(source.type)) return false;
      const native = media.canPlayType('application/vnd.apple.mpegurl') !== '';
      if (native && preferNative) return false; // native provider handles it
      return supportsMSE();
    },
    async create({ media, player, update }) {
      const mod = await loadLibrary(options.library);
      const HlsCtor = ('default' in mod ? mod.default : mod) as typeof Hls;
      const engine = new HlsCtor({ ...options.config });
      options.onInstance?.(engine);
      const E = HlsCtor.Events;

      engine.on(E.MANIFEST_PARSED, (_e, data) => {
        const qualities: Quality[] = data.levels.map((l, id) => ({ id, height: l.height, width: l.width, bitrate: l.bitrate, label: label(l.height, l.bitrate) }));
        update({ qualities, quality: -1 });
      });
      engine.on(E.LEVEL_LOADED, (_e, data) => {
        if (data.details.live) update({ live: true });
      });
      engine.on(E.AUDIO_TRACKS_UPDATED, (_e, data) => {
        update({ audioTracks: data.audioTracks.map((t, id) => ({ id, label: t.name || t.lang || `Audio ${id + 1}`, language: t.lang })), audioTrack: engine.audioTrack });
      });
      engine.on(E.ERROR, (_e, data) => {
        if (!data.fatal) return;
        // Standard hls.js recovery: retry network errors, recover media errors once, then give up.
        if (data.type === HlsCtor.ErrorTypes.NETWORK_ERROR) return engine.startLoad();
        if (data.type === HlsCtor.ErrorTypes.MEDIA_ERROR && !recovered) {
          recovered = true;
          return engine.recoverMediaError();
        }
        const error = { code: 'PROVIDER' as const, message: `HLS: ${data.details}`, fatal: true, cause: data };
        update({ error });
        player.emit('error', error);
      });
      let recovered = false;

      return {
        load(source) {
          recovered = false;
          engine.attachMedia(media);
          engine.loadSource(source.src);
        },
        setQuality(id) {
          engine.currentLevel = id; // -1 = auto
        },
        setAudioTrack(id) {
          engine.audioTrack = id;
        },
        destroy() {
          engine.destroy();
        },
      };
    },
  });
}

async function loadLibrary(library: HlsProviderOptions['library']) {
  if (typeof library === 'function') return library();
  if (typeof library === 'string') return loadScriptGlobal(library, 'Hls');
  return import('hls.js');
}

/** Load a UMD build from a URL and read its global. Used for CDN setups without a bundler. */
export function loadScriptGlobal<T = any>(url: string, globalName: string): Promise<T> {
  const w = window as any;
  if (w[globalName]) return Promise.resolve(w[globalName]);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve(w[globalName]);
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.append(script);
  });
}
