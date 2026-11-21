import { defineProvider, isDashType, supportsMSE, type Provider } from '@tomato-player/core';

/** Minimal structural type of the dash.js MediaPlayer API we use (keeps dashjs an optional peer). */
interface DashPlayer {
  initialize(view: HTMLMediaElement, url: string, autoPlay: boolean): void;
  updateSettings(settings: Record<string, unknown>): void;
  on(type: string, fn: (e: any) => void): void;
  getBitrateInfoListFor?(type: 'video'): { qualityIndex: number; height: number; width: number; bitrate: number }[];
  getRepresentationsByType?(type: 'video'): { index?: number; absoluteIndex?: number; height: number; width: number; bandwidth: number }[];
  setQualityFor?(type: 'video', index: number): void;
  setRepresentationForTypeByIndex?(type: 'video', index: number): void;
  isDynamic(): boolean;
  reset(): void;
}

export interface DashProviderOptions {
  /** `player.updateSettings(settings)` — see dash.js docs. */
  settings?: Record<string, unknown>;
  /** Protection data for EME/DRM, passed to `setProtectionData`. */
  protectionData?: Record<string, unknown>;
  /** Defaults to dynamic `import('dashjs')`. */
  library?: () => Promise<any>;
  onInstance?(player: DashPlayer): void;
}

export function dash(options: DashProviderOptions = {}): Provider {
  return defineProvider({
    name: 'dash',
    canPlay: (source) => isDashType(source.type) && supportsMSE(),
    async create({ media, player, update }) {
      const mod = options.library ? await options.library() : await import(/* @vite-ignore */ 'dashjs' as string);
      const dashjs = mod.default ?? mod;
      const engine: DashPlayer = dashjs.MediaPlayer().create();
      if (options.settings) engine.updateSettings(options.settings);
      if (options.protectionData) (engine as any).setProtectionData(options.protectionData);
      options.onInstance?.(engine);
      const E = dashjs.MediaPlayer.events;

      engine.on(E.STREAM_INITIALIZED, () => {
        const reps = engine.getRepresentationsByType?.('video');
        const list = reps
          ? reps.map((r, i) => ({ id: r.absoluteIndex ?? r.index ?? i, height: r.height, width: r.width, bitrate: r.bandwidth }))
          : (engine.getBitrateInfoListFor?.('video') ?? []).map((b) => ({ id: b.qualityIndex, height: b.height, width: b.width, bitrate: b.bitrate }));
        update({ qualities: list.map((q) => ({ ...q, label: q.height ? `${q.height}p` : `${Math.round(q.bitrate / 1000)} kbps` })), quality: -1, live: engine.isDynamic() });
      });
      engine.on(E.ERROR, (e) => {
        const error = { code: 'PROVIDER' as const, message: `DASH: ${e?.error?.message ?? 'error'}`, fatal: true, cause: e };
        update({ error });
        player.emit('error', error);
      });

      return {
        load(source) {
          engine.initialize(media, source.src, false);
        },
        setQuality(id) {
          const auto = id < 0;
          engine.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: auto } } } });
          if (auto) return;
          if (engine.setRepresentationForTypeByIndex) engine.setRepresentationForTypeByIndex('video', id);
          else engine.setQualityFor?.('video', id);
        },
        destroy() {
          engine.reset();
        },
      };
    },
  });
}
