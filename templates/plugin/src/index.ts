import { definePlugin } from '@tomato-player/core';

export interface __Pascal__Options {
  /** Example option. */
  message?: string;
}

export interface __Pascal__API {
  /** Example API method exposed via `player.plugin('__name__')`. */
  count(): number;
}

/** __DESCRIPTION__ */
export const __camel__ = (options: __Pascal__Options = {}) =>
  definePlugin<__Pascal__API>({
    name: '__name__',
    setup(player) {
      let plays = 0;
      const off = player.on('play', () => {
        plays++;
        if (options.message) console.info(options.message);
      });
      return {
        api: { count: () => plays },
        // Always undo everything you did. Players are created and destroyed constantly in SPAs.
        destroy: off,
      };
    },
  });
