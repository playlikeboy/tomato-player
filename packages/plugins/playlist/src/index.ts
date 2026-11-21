import { definePlugin, type Source, type TextTrackInit } from '@tomato-player/core';

export interface PlaylistItem {
  src: Source | Source[];
  title?: string;
  poster?: string;
  tracks?: TextTrackInit[];
  [meta: string]: unknown;
}

export interface PlaylistOptions {
  items: PlaylistItem[];
  /** Start index (default 0). */
  start?: number;
  /** Advance on `ended` (default true). */
  autoAdvance?: boolean;
  loop?: boolean;
}

export interface PlaylistAPI {
  readonly items: PlaylistItem[];
  readonly index: number;
  play(index: number): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
  hasNext(): boolean;
  hasPrevious(): boolean;
  setItems(items: PlaylistItem[], start?: number): Promise<void>;
}

export const playlist = (options: PlaylistOptions) =>
  definePlugin<PlaylistAPI>({
    name: 'playlist',
    setup(player) {
      let items = [...options.items];
      let index = -1;
      const load = async (i: number, autoplay: boolean) => {
        const item = items[i];
        if (!item) return;
        index = i;
        await player.setSource(item.src, { title: item.title, poster: item.poster, tracks: item.tracks });
        player.emit('plugin:playlistchange', { index, item });
        if (autoplay) await player.play().catch(() => {});
      };
      const api: PlaylistAPI = {
        get items() {
          return items;
        },
        get index() {
          return index;
        },
        play: (i) => load(i, true),
        hasNext: () => index < items.length - 1 || !!options.loop,
        hasPrevious: () => index > 0 || !!options.loop,
        next: () => (api.hasNext() ? load((index + 1) % items.length, true) : Promise.resolve()),
        previous: () => {
          // Restart current item if we are more than 3s in, like most music/video apps.
          if (player.state.currentTime > 3) return Promise.resolve(player.seek(0));
          return api.hasPrevious() ? load((index - 1 + items.length) % items.length, true) : Promise.resolve();
        },
        async setItems(next, start = 0) {
          items = [...next];
          await load(start, false);
        },
      };
      const off = player.on('ended', () => {
        if (options.autoAdvance !== false && api.hasNext()) void api.next();
      });
      void load(options.start ?? 0, !!player.options.autoplay);
      return { api, destroy: off };
    },
  });
