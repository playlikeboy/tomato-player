'use client';

// Live Tomato Player used across the site. Skins, plugins and engines load on demand,
// so a page only downloads the pieces its demo needs.
import { useEffect, useRef } from 'react';
import type { Player as TomatoPlayer, PlayerOptions, Plugin } from '@tomato-player/core';
import { MEDIA, asset, type PluginSlug, type SkinSlug } from '@/lib/site';

const skinLoaders: Record<SkinSlug, (o: any) => Promise<PlayerOptions['skin']>> = {
  minimal: (o) => import('@tomato-player/skin-minimal').then((m) => m.minimal(o)),
  cinema: (o) => import('@tomato-player/skin-cinema').then((m) => m.cinema({ eyebrow: 'A Tomato Original', ...o })),
  studio: (o) => import('@tomato-player/skin-studio').then((m) => m.studio({ fps: 24, ...o })),
  creator: (o) => import('@tomato-player/skin-creator').then((m) => m.creator(o)),
  learn: (o) => import('@tomato-player/skin-learn').then((m) => m.learn(o)),
  campus: (o) => import('@tomato-player/skin-campus').then((m) => m.campus({ autoplayInView: false, ...o })),
  stream: (o) => import('@tomato-player/skin-stream').then((m) => m.stream({ subtitle: 'S1:E1 · Spring', onNext() {}, ...o })),
  tube: (o) => import('@tomato-player/skin-tube').then((m) => m.tube({ onNext() {}, onTheater() {}, ...o })),
  feed: (o) => import('@tomato-player/skin-feed').then((m) => m.feed({ autoplayInView: false, ...o })),
};

const pluginLoaders: Record<PluginSlug, (o: any) => Promise<Plugin<any>>> = {
  hotkeys: (o) => import('@tomato-player/plugin-hotkeys').then((m) => m.hotkeys(o)),
  gestures: (o) => import('@tomato-player/plugin-gestures').then((m) => m.gestures(o)),
  chapters: (o) =>
    import('@tomato-player/plugin-chapters').then((m) => m.chapters({ chapters: asset('/media/chapters.vtt'), ...o })),
  thumbnails: (o) => import('@tomato-player/plugin-thumbnails').then((m) => m.thumbnails(o)),
  playlist: (o) => import('@tomato-player/plugin-playlist').then((m) => m.playlist(o)),
  analytics: (o) => import('@tomato-player/plugin-analytics').then((m) => m.analytics(o)),
  'media-session': (o) =>
    import('@tomato-player/plugin-media-session').then((m) => m.mediaSession({ artist: 'Blender Foundation', ...o })),
  persist: (o) => import('@tomato-player/plugin-persist').then((m) => m.persist(o)),
};

export type SourceKind = 'mp4' | 'hls' | 'dash' | 'tears';

export interface PlayerProps {
  skin?: SkinSlug;
  skinOptions?: Record<string, unknown>;
  source?: SourceKind | string;
  plugins?: PluginSlug[];
  pluginOptions?: Partial<Record<PluginSlug, Record<string, unknown>>>;
  tokens?: Record<string, string>;
  captions?: boolean;
  title?: string;
  /** Extra createPlayer options. */
  options?: Partial<PlayerOptions>;
  label?: string;
  /** Wait until the player scrolls near the viewport before loading anything. */
  lazy?: boolean;
  onReady?: (player: TomatoPlayer) => void | (() => void);
}

export const tracks = () => [
  { src: asset('/media/captions.en.vtt'), label: 'English', srclang: 'en' },
  { src: asset('/media/captions.es.vtt'), label: 'Español', srclang: 'es' },
];

export function resolveSource(source: SourceKind | string) {
  return source in MEDIA ? (MEDIA as Record<string, string>)[source] : source;
}

export function Player({
  skin = 'minimal',
  skinOptions,
  source = 'mp4',
  plugins = ['hotkeys', 'gestures'],
  pluginOptions,
  tokens,
  captions = true,
  title = MEDIA.title,
  options,
  label,
  lazy = false,
  onReady,
}: PlayerProps) {
  const host = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TomatoPlayer | null>(null);
  const key = JSON.stringify([skin, skinOptions, source, plugins, pluginOptions, captions, title, options]);

  useEffect(() => {
    let cancelled = false;
    let cleanup: void | (() => void);
    const mount = host.current;
    const visible = () =>
      new Promise<void>((resolve) => {
        if (!lazy || !mount || !('IntersectionObserver' in window)) return resolve();
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io.disconnect();
              resolve();
            }
          },
          { rootMargin: '200px' },
        );
        io.observe(mount);
      });
    (async () => {
      await visible();
      if (cancelled) return;
      const src = resolveSource(source);
      const needsHls = /\.m3u8/.test(src);
      const needsDash = /\.mpd/.test(src);
      const [{ createPlayer }, skinImpl, loadedPlugins, providers] = await Promise.all([
        import('@tomato-player/core'),
        skinLoaders[skin](skinOptions ?? {}),
        Promise.all(plugins.map((p) => pluginLoaders[p](pluginOptions?.[p] ?? {}))),
        Promise.all([
          needsHls ? import('@tomato-player/provider-hls').then((m) => m.hls()) : null,
          needsDash ? import('@tomato-player/provider-dash').then((m) => m.dash()) : null,
        ]),
      ]);
      if (cancelled || !mount) return;
      const player = createPlayer(mount, {
        src,
        title,
        poster: MEDIA.poster,
        tracks: captions ? tracks() : [],
        crossOrigin: 'anonymous',
        playsInline: true,
        preload: 'metadata',
        providers: providers.filter((p) => p !== null),
        plugins: loadedPlugins,
        skin: skinImpl,
        tokens,
        ...options,
      });
      playerRef.current = player;
      cleanup = onReady?.(player);
    })().catch((error) => console.error('[tomato-player]', error));
    return () => {
      cancelled = true;
      if (typeof cleanup === 'function') cleanup();
      playerRef.current?.destroy();
      playerRef.current = null;
      mount?.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Token changes apply live, without rebuilding the player.
  useEffect(() => {
    const el = playerRef.current?.el;
    if (!el || !tokens) return;
    for (const [name, value] of Object.entries(tokens)) el.style.setProperty(name.startsWith("--") ? name : `--tp-${name}`, value);
  }, [tokens]);

  return <div ref={host} role="region" aria-label={label ?? `${title} video player`} className="tp-host" data-portrait={skin === 'campus' || undefined} />;
}
