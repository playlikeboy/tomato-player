import { definePlugin, parseVtt } from '@tomato-player/core';

export interface Chapter {
  start: number;
  /** Defaults to the next chapter's start (or the duration). */
  end?: number;
  title: string;
}

export interface ChaptersOptions {
  /** Inline chapters or a URL to a WebVTT chapters file. */
  chapters?: Chapter[] | string;
}

export interface ChaptersAPI {
  list(): Required<Chapter>[];
  current(): Required<Chapter> | undefined;
  set(chapters: Chapter[] | string): Promise<void>;
  goTo(index: number): void;
}

export const chapters = (options: ChaptersOptions = {}) =>
  definePlugin<ChaptersAPI>({
    name: 'chapters',
    setup(player) {
      let raw: Chapter[] = [];
      let lastIndex = -1;
      const list = (): Required<Chapter>[] => {
        const duration = player.state.duration || Infinity;
        const sorted = [...raw].sort((a, b) => a.start - b.start);
        return sorted.map((c, i) => ({ ...c, end: c.end ?? sorted[i + 1]?.start ?? duration }));
      };
      const current = () => {
        const t = player.state.currentTime;
        return list().find((c) => t >= c.start && t < c.end);
      };
      const api: ChaptersAPI = {
        list,
        current,
        async set(input) {
          raw = typeof input === 'string' ? parseVtt(await (await fetch(input)).text()).map((c) => ({ start: c.start, end: c.end, title: c.text })) : input;
          player.emit('plugin:chapters', list());
        },
        goTo(index) {
          const c = list()[index];
          if (c) player.seek(c.start);
        },
      };
      player.provide('chapters', api);
      const off = player.on('timeupdate', () => {
        const all = list();
        const idx = all.findIndex((c) => player.state.currentTime >= c.start && player.state.currentTime < c.end);
        if (idx !== lastIndex) {
          lastIndex = idx;
          player.emit('plugin:chapterchange', all[idx]);
        }
      });
      if (options.chapters) void api.set(options.chapters).catch((e) => console.warn('[tomato-player] chapters failed to load', e));
      return { api, destroy: off };
    },
  });
