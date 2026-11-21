import { definePlugin } from '@tomato-player/core';

export interface PersistOptions {
  /** Storage key prefix (default `tomato`). */
  key?: string;
  /** What to remember. All default to `true`. */
  volume?: boolean;
  rate?: boolean;
  captions?: boolean;
  /** Resume position per source URL. Ignores the first/last 5 seconds and live streams. */
  resume?: boolean;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
}

interface Saved {
  volume?: number;
  muted?: boolean;
  rate?: number;
  captions?: string | null;
}

export const persist = (options: PersistOptions = {}) =>
  definePlugin({
    name: 'persist',
    setup(player) {
      let storage: PersistOptions['storage'];
      try {
        storage = options.storage ?? window.localStorage;
      } catch {
        return; // storage disabled (privacy mode, sandboxed iframe)
      }
      const prefix = options.key ?? 'tomato';
      const read = <T>(k: string): T | undefined => {
        try {
          const v = storage!.getItem(`${prefix}:${k}`);
          return v ? (JSON.parse(v) as T) : undefined;
        } catch {
          return undefined;
        }
      };
      const write = (k: string, v: unknown) => {
        try {
          storage!.setItem(`${prefix}:${k}`, JSON.stringify(v));
        } catch {
          /* quota */
        }
      };
      const saved = read<Saved>('prefs') ?? {};
      if (options.volume !== false && saved.volume !== undefined) {
        player.media.volume = saved.volume;
        player.media.muted = !!saved.muted && !player.options.autoplay ? saved.muted : player.media.muted;
      }
      if (options.rate !== false && saved.rate) player.media.playbackRate = saved.rate;

      const offs: (() => void)[] = [];
      offs.push(
        player.store.subscribe((s, p) => {
          if (s.volume === p.volume && s.muted === p.muted && s.playbackRate === p.playbackRate && s.textTrack === p.textTrack) return;
          write('prefs', {
            volume: s.volume,
            muted: s.muted,
            rate: s.playbackRate,
            captions: s.textTrack >= 0 ? s.textTracks[s.textTrack]?.language ?? s.textTracks[s.textTrack]?.label ?? null : null,
          } satisfies Saved);
        }),
      );
      if (options.captions !== false && saved.captions) {
        offs.push(
          player.store.select(
            (s) => s.textTracks,
            (tracks) => {
              const idx = tracks.findIndex((t) => t.language === saved.captions || t.label === saved.captions);
              if (idx >= 0 && player.state.textTrack !== idx) player.setTextTrack(idx);
            },
          ),
        );
      }
      if (options.resume !== false) {
        const posKey = () => `pos:${player.state.source?.src ?? ''}`;
        let lastWrite = 0;
        offs.push(
          player.on('ready', () => {
            const t = read<number>(posKey());
            if (t && !player.state.live && t > 5 && t < player.state.duration - 5) player.seek(t);
          }),
          player.on('timeupdate', (t) => {
            if (player.state.live || Date.now() - lastWrite < 2000) return;
            lastWrite = Date.now();
            write(posKey(), Math.floor(t));
          }),
          player.on('ended', () => storage!.removeItem(`${prefix}:${posKey()}`)),
        );
      }
      return { destroy: () => offs.forEach((off) => off()) };
    },
  });
