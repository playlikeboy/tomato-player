import {
  createElement, forwardRef, useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore,
  type CSSProperties, type ForwardedRef,
} from 'react';
import { createPlayer, type Player, type PlayerOptions, type PlayerState } from '@tomato-player/core';

export interface TomatoPlayerProps extends PlayerOptions {
  className?: string;
  style?: CSSProperties;
  /** Called once with the player instance after mount. */
  onReady?(player: Player): void;
}

const sourceKey = (src: PlayerOptions['src']) => (src === undefined ? '' : JSON.stringify(src));

/**
 * `<TomatoPlayer src="movie.mp4" skin={minimal()} plugins={[hotkeys()]} />`
 *
 * The player is created in an effect, so it renders nothing on the server and
 * never causes a hydration mismatch. Changing `src`, `skin` or `poster` updates
 * the existing player instead of re-creating it.
 */
export const TomatoPlayer = forwardRef(function TomatoPlayer(props: TomatoPlayerProps, ref: ForwardedRef<Player | null>) {
  const { className, style, onReady, ...options } = props;
  const host = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const latest = useRef(options);
  latest.current = options;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const key = sourceKey(options.src);
  const mountedKey = useRef(key);

  useEffect(() => {
    const instance = createPlayer(host.current!, latest.current);
    mountedKey.current = sourceKey(latest.current.src);
    setPlayer(instance);
    onReadyRef.current?.(instance);
    return () => {
      instance.destroy();
      setPlayer(null);
    };
  }, []);

  useEffect(() => {
    if (!player || key === mountedKey.current) return;
    mountedKey.current = key;
    const o = latest.current;
    if (o.src) void player.setSource(o.src, { poster: o.poster, title: o.title, tracks: o.tracks });
  }, [player, key]);

  const skin = options.skin;
  const firstSkin = useRef(true);
  useEffect(() => {
    if (!player) return;
    if (firstSkin.current) return void (firstSkin.current = false);
    player.setSkin(skin ?? null);
  }, [player, skin]);

  useImperativeHandle(ref, () => player as Player, [player]);

  return createElement('div', { ref: host, className, style });
});

/**
 * Subscribe a component to a slice of player state. Re-renders only when the
 * selected value changes.
 *
 * ```ts
 * const paused = usePlayerState(player, (s) => s.paused);
 * ```
 */
export function usePlayerState<T>(player: Player | null, selector: (state: Readonly<PlayerState>) => T, fallback?: T): T | undefined {
  return useSyncExternalStore(
    (notify) => (player ? player.store.subscribe(notify) : () => {}),
    () => (player ? selector(player.state) : fallback),
    () => fallback,
  );
}

/** Imperative handle helper: `const [ref, player] = usePlayer()` then `<TomatoPlayer ref={ref} />`. */
export function usePlayer(): [(p: Player | null) => void, Player | null] {
  const [player, setPlayer] = useState<Player | null>(null);
  return [setPlayer, player];
}

export type { Player, PlayerOptions, PlayerState } from '@tomato-player/core';
