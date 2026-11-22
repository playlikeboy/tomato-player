import {
  Fragment, createElement, forwardRef, isValidElement, useEffect, useImperativeHandle, useMemo, useRef, useState, useSyncExternalStore,
  type CSSProperties, type ForwardedRef, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { createPlayer, type IconSource, type Player, type PlayerOptions, type PlayerState } from '@tomato-player/core';

/** Icon overrides by name: SVG markup, an element factory, or any React node (for example an animated icon component). */
export type ReactIconSet = Partial<Record<string, IconSource | ReactNode>>;

interface IconHost {
  el: HTMLElement;
  name: string;
}

/**
 * Render React components as player icons. Returns `icons` to pass to `createPlayer` and `portals`
 * to render next to the player. Works with any component library, including animated icons:
 *
 * ```tsx
 * const { icons, portals } = useIconPortals({ play: <PlayIcon size={22} />, pause: <PauseIcon size={22} /> });
 * useEffect(() => { const p = createPlayer(el, { src, skin, icons }); return () => p.destroy(); }, []);
 * return <>{portals}<div ref={el} /></>;
 * ```
 *
 * Each time a control shows an icon, the player asks for a fresh host element; the matching React
 * node is portalled into it. Hosts removed by the player are dropped on the next render.
 */
export function useIconPortals(set: ReactIconSet | undefined): { icons: PlayerOptions['icons']; portals: ReactNode } {
  const latest = useRef(set);
  latest.current = set;
  const hosts = useRef(new Set<IconHost>());
  const [, bump] = useState(0);
  const scheduled = useRef(false);

  const names = set ? Object.keys(set).sort().join(',') : '';
  const icons = useMemo(() => {
    if (!latest.current) return undefined;
    const out: NonNullable<PlayerOptions['icons']> = {};
    for (const [name, value] of Object.entries(latest.current)) {
      if (typeof value === 'string' || typeof value === 'function') out[name] = value as IconSource;
      else if (isValidElement(value) || (value !== null && value !== undefined && typeof value !== 'boolean')) {
        out[name] = () => {
          const el = document.createElement('span');
          hosts.current.add({ el, name });
          if (!scheduled.current) {
            scheduled.current = true;
            queueMicrotask(() => {
              scheduled.current = false;
              bump((n) => n + 1);
            });
          }
          return el;
        };
      }
    }
    return out;
    // Re-create only when the set of names changes; node changes are read from `latest` at render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names]);

  for (const h of hosts.current) if (!h.el.isConnected) hosts.current.delete(h);
  const portals = Array.from(hosts.current, (h, i) => {
    const node = latest.current?.[h.name];
    return typeof node === 'string' || typeof node === 'function' ? null : createPortal(node as ReactNode, h.el, `${h.name}-${i}`);
  });
  return { icons, portals };
}

export interface TomatoPlayerProps extends Omit<PlayerOptions, 'icons'> {
  /** Replace control icons. Values may be React nodes, so animated icon components work as-is. */
  icons?: ReactIconSet;
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
  const { className, style, onReady, icons: iconSet, ...rest } = props;
  const { icons, portals } = useIconPortals(iconSet);
  const options: PlayerOptions = { ...rest, icons };
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

  return createElement(Fragment, null, createElement('div', { ref: host, className, style }), portals);
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
