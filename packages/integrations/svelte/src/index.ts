import { createPlayer, type Player, type PlayerOptions, type PlayerState } from '@tomato-player/core';

export interface TomatoActionOptions extends PlayerOptions {
  onReady?(player: Player): void;
}

/**
 * Svelte action. Actions only run in the browser, so this is SSR-safe by design.
 *
 * ```svelte
 * <div use:tomato={{ src, skin: minimal(), onReady: (p) => (player = p) }} />
 * ```
 */
export function tomato(node: HTMLElement, options: TomatoActionOptions = {}) {
  const { onReady, ...opts } = options;
  const player = createPlayer(node, opts);
  onReady?.(player);
  let current = JSON.stringify(opts.src ?? null);
  return {
    update(next: TomatoActionOptions) {
      const key = JSON.stringify(next.src ?? null);
      if (next.src && key !== current) {
        current = key;
        void player.setSource(next.src, { poster: next.poster, title: next.title, tracks: next.tracks });
      }
      if (next.skin !== undefined && next.skin !== opts.skin) {
        opts.skin = next.skin;
        player.setSkin(next.skin);
      }
    },
    destroy: () => player.destroy(),
  };
}

/**
 * Svelte store contract (`subscribe`) for a slice of player state.
 * `$paused` works in templates: `const paused = playerState(player, (s) => s.paused)`.
 */
export function playerState<T>(player: Player, selector: (s: Readonly<PlayerState>) => T) {
  return {
    subscribe(run: (value: T) => void) {
      return player.store.select(selector, (v) => run(v));
    },
  };
}

export type { Player, PlayerOptions } from '@tomato-player/core';
