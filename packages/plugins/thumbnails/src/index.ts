import { definePlugin, parseVtt } from '@tomato-player/core';

export interface Thumbnail {
  start: number;
  end: number;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ThumbnailsOptions {
  /** URL of a WebVTT thumbnails track (`sprite.jpg#xywh=0,0,160,90` cues). */
  src: string;
}

export interface ThumbnailsAPI {
  get(time: number): Thumbnail | null;
  load(src: string): Promise<void>;
  readonly ready: boolean;
}

/** Parse thumbnail VTT text. Relative image URLs resolve against `base`. */
export function parseThumbnails(text: string, base: string): Thumbnail[] {
  return parseVtt(text).map((cue) => {
    const [path, hash] = cue.text.split('#xywh=');
    const [x = 0, y = 0, width = 160, height = 90] = (hash ?? '').split(',').map(Number);
    return { start: cue.start, end: cue.end, url: new URL(path!.trim(), base).href, x, y, width, height };
  });
}

export const thumbnails = (options: ThumbnailsOptions) =>
  definePlugin<ThumbnailsAPI>({
    name: 'thumbnails',
    setup(player) {
      let cues: Thumbnail[] = [];
      let ready = false;
      const api: ThumbnailsAPI = {
        get ready() {
          return ready;
        },
        get(time) {
          // Binary search: cues are sorted by start.
          let lo = 0;
          let hi = cues.length - 1;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            const c = cues[mid]!;
            if (time < c.start) hi = mid - 1;
            else if (time >= c.end) lo = mid + 1;
            else return c;
          }
          return null;
        },
        async load(src) {
          const url = new URL(src, document.baseURI).href;
          cues = parseThumbnails(await (await fetch(url)).text(), url).sort((a, b) => a.start - b.start);
          ready = true;
          // Warm the sprite cache so the first hover is instant.
          for (const u of new Set(cues.map((c) => c.url))) new Image().src = u;
        },
      };
      player.provide('thumbnails', api);
      void api.load(options.src).catch((e) => console.warn('[tomato-player] thumbnails failed to load', e));
      return { api };
    },
  });
