import { Emitter } from './emitter';
import { en, translate } from './i18n';
import { nativeProvider } from './providers/native';
import { createStore } from './store';
import type {
  Player,
  PlayerError,
  PlayerEvents,
  PlayerOptions,
  PlayerState,
  Plugin,
  PluginInstance,
  ProviderInstance,
  Skin,
  Source,
  SourceObject,
  TextTrackInit,
  TrackInfo,
} from './types';
import { clamp, injectStyle, isBrowser, normalizeSource, rangesFrom } from './utils';

const VISIBLE_TEXT_KINDS = new Set(['subtitles', 'captions']);

export const initialState = (): PlayerState => ({
  source: null,
  provider: null,
  ready: false,
  paused: true,
  started: false,
  ended: false,
  waiting: false,
  seeking: false,
  currentTime: 0,
  duration: 0,
  buffered: [],
  seekable: null,
  live: false,
  volume: 1,
  muted: false,
  playbackRate: 1,
  fullscreen: false,
  pip: false,
  idle: false,
  qualities: [],
  quality: -1,
  audioTracks: [],
  audioTrack: -1,
  textTracks: [],
  textTrack: -1,
  poster: null,
  title: null,
  error: null,
  width: 0,
});

const MEDIA_ERRORS: Record<number, PlayerError['code']> = {
  1: 'MEDIA_ABORTED',
  2: 'NETWORK',
  3: 'DECODE',
  4: 'SRC_NOT_SUPPORTED',
};

function resolveTarget(target: string | HTMLElement): HTMLElement {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) throw new Error(`[tomato-player] target "${String(target)}" not found`);
  return el;
}

/**
 * Create a player.
 *
 * ```ts
 * const player = createPlayer('#app', { src: 'movie.mp4', skin: minimal() });
 * ```
 *
 * `target` may be a `<video>` (it gets wrapped) or any container element
 * (a `<video>` is created inside it).
 */
export function createPlayer(target: string | HTMLElement, options: PlayerOptions = {}): Player {
  if (!isBrowser) throw new Error('[tomato-player] createPlayer() must run in the browser. Call it inside onMount/useEffect.');

  const host = resolveTarget(target);
  const opts: PlayerOptions = { playsInline: true, injectStyles: true, idleTimeout: 2500, aspectRatio: '16/9', ...options };
  const controller = new AbortController();
  const { signal } = controller;
  const listen = (el: EventTarget, type: string, fn: (e: any) => void) => el.addEventListener(type, fn, { signal });

  // ---- DOM ---------------------------------------------------------------
  let root: HTMLElement;
  let media: HTMLVideoElement;
  let createdRoot = false;
  let createdMedia = false;
  if (host instanceof HTMLVideoElement) {
    media = host;
    root = document.createElement('div');
    host.parentNode?.insertBefore(root, host);
    root.appendChild(host);
    createdRoot = true;
  } else {
    root = host;
    media = (host.querySelector('video') as HTMLVideoElement | null) ?? document.createElement('video');
    if (!media.isConnected) {
      root.appendChild(media);
      createdMedia = true;
    }
  }
  root.classList.add('tp');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', opts.label ?? opts.title ?? translate(opts.i18n ?? en, 'player'));
  if (!root.hasAttribute('tabindex')) root.tabIndex = 0;
  if (opts.aspectRatio) root.style.setProperty('--tp-aspect-ratio', opts.aspectRatio);
  media.classList.add('tp-media');
  media.controls = false;
  media.playsInline = !!opts.playsInline;
  if (opts.playsInline) media.setAttribute('webkit-playsinline', '');
  if (opts.preload) media.preload = opts.preload;
  if (opts.crossOrigin !== undefined) media.crossOrigin = opts.crossOrigin;
  if (opts.loop) media.loop = true;
  if (opts.muted) media.muted = true;
  if (opts.volume !== undefined) media.volume = clamp(opts.volume, 0, 1);
  if (opts.playbackRate) media.playbackRate = opts.playbackRate;

  // ---- State -------------------------------------------------------------
  const store = createStore<PlayerState>({
    ...initialState(),
    volume: media.volume,
    muted: media.muted,
    playbackRate: media.playbackRate,
  });
  const emitter = new Emitter<PlayerEvents>();
  const set = (patch: Partial<PlayerState>) => store.set(patch);
  store.subscribe((state, prev) => emitter.emit('statechange', { state, prev }));

  // Reflect state as data attributes so skins style with pure CSS.
  const FLAGS: (keyof PlayerState)[] = ['paused', 'started', 'ended', 'waiting', 'seeking', 'fullscreen', 'pip', 'idle', 'live', 'muted', 'ready'];
  store.subscribe((s, p) => syncAttrs(s, p));
  function syncAttrs(s: Readonly<PlayerState>, p?: Readonly<PlayerState>) {
    for (const key of FLAGS) {
      if (p && s[key] === p[key]) continue;
      root.toggleAttribute(`data-${key}`, !!s[key]);
    }
    root.toggleAttribute('data-playing', !s.paused);
    root.toggleAttribute('data-error', !!s.error);
    root.toggleAttribute('data-captions', s.textTrack >= 0);
    const size = s.width === 0 ? 'md' : s.width < 480 ? 'sm' : s.width < 960 ? 'md' : 'lg';
    if (root.dataset.size !== size) root.dataset.size = size;
  }
  syncAttrs(store.get());

  // ---- Media events --------------------------------------------------------
  const timeSync = () => {
    const seekable = media.seekable?.length ? { start: media.seekable.start(0), end: media.seekable.end(media.seekable.length - 1) } : null;
    set({
      currentTime: media.currentTime,
      duration: Number.isFinite(media.duration) ? media.duration : seekable?.end ?? 0,
      buffered: rangesFrom(media.buffered),
      seekable,
      live: media.duration === Infinity || store.get().live,
    });
  };
  listen(media, 'loadedmetadata', () => {
    timeSync();
    set({ ready: true, error: null });
    syncTextTracks();
    emitter.emit('ready', undefined);
  });
  listen(media, 'durationchange', timeSync);
  listen(media, 'progress', () => set({ buffered: rangesFrom(media.buffered) }));
  listen(media, 'timeupdate', () => {
    timeSync();
    emitter.emit('timeupdate', media.currentTime);
  });
  listen(media, 'play', () => {
    set({ paused: false, ended: false, started: true });
    emitter.emit('play', undefined);
    activity();
  });
  listen(media, 'playing', () => set({ waiting: false, paused: false }));
  listen(media, 'pause', () => {
    set({ paused: true, idle: false });
    emitter.emit('pause', undefined);
  });
  listen(media, 'waiting', () => set({ waiting: true }));
  listen(media, 'canplay', () => set({ waiting: false }));
  listen(media, 'seeking', () => {
    set({ seeking: true, currentTime: media.currentTime });
    emitter.emit('seeking', media.currentTime);
  });
  listen(media, 'seeked', () => {
    set({ seeking: false });
    emitter.emit('seeked', media.currentTime);
  });
  listen(media, 'ended', () => {
    set({ ended: true, paused: true, idle: false });
    emitter.emit('ended', undefined);
  });
  listen(media, 'volumechange', () => {
    set({ volume: media.volume, muted: media.muted });
    emitter.emit('volumechange', { volume: media.volume, muted: media.muted });
  });
  listen(media, 'ratechange', () => {
    set({ playbackRate: media.playbackRate });
    emitter.emit('ratechange', media.playbackRate);
  });
  listen(media, 'error', () => {
    const err = media.error;
    if (!err || !store.get().source) return;
    fail({ code: MEDIA_ERRORS[err.code] ?? 'UNKNOWN', message: err.message || translate(dict, 'error'), fatal: true, cause: err });
  });
  listen(media, 'enterpictureinpicture', () => setPip(true));
  listen(media, 'leavepictureinpicture', () => setPip(false));
  listen(media, 'webkitpresentationmodechanged', () => setPip((media as any).webkitPresentationMode === 'picture-in-picture'));
  listen(media, 'webkitbeginfullscreen', () => setFullscreen(true));
  listen(media, 'webkitendfullscreen', () => setFullscreen(false));
  listen(document, 'fullscreenchange', () => setFullscreen(fullscreenElement() === root));
  listen(document, 'webkitfullscreenchange', () => setFullscreen(fullscreenElement() === root));

  const tracks = media.textTracks;
  if (tracks) {
    listen(tracks, 'addtrack', () => syncTextTracks());
    listen(tracks, 'removetrack', () => syncTextTracks());
    listen(tracks, 'change', () => syncTextTracks());
  }

  function visibleTextTracks(): TextTrack[] {
    return Array.from(media.textTracks ?? []).filter((t) => VISIBLE_TEXT_KINDS.has(t.kind));
  }
  function syncTextTracks() {
    const list = visibleTextTracks();
    const info: TrackInfo[] = list.map((t, id) => ({ id, label: t.label || t.language || `Track ${id + 1}`, language: t.language, kind: t.kind }));
    const showing = list.findIndex((t) => t.mode === 'showing');
    const prev = store.get().textTracks;
    const same = prev.length === info.length && prev.every((t, i) => t.label === info[i]?.label);
    set({ textTracks: same ? prev : info, textTrack: showing });
  }

  function setPip(pip: boolean) {
    set({ pip });
    emitter.emit('pipchange', pip);
  }
  function setFullscreen(fullscreen: boolean) {
    if (store.get().fullscreen === fullscreen) return;
    set({ fullscreen });
    emitter.emit('fullscreenchange', fullscreen);
  }
  function fullscreenElement(): Element | null {
    const d = document as any;
    return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
  }
  function fail(error: PlayerError) {
    set({ error, waiting: false });
    emitter.emit('error', error);
  }

  // ---- Size ---------------------------------------------------------------
  let resizeObserver: ResizeObserver | undefined;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? 0);
      set({ width });
    });
    resizeObserver.observe(root);
  }

  // ---- Idle ---------------------------------------------------------------
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  function activity() {
    if (store.get().idle) set({ idle: false });
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!store.get().paused) set({ idle: true });
    }, opts.idleTimeout);
  }
  for (const type of ['pointermove', 'pointerdown', 'keydown', 'focusin']) listen(root, type, activity);
  listen(root, 'pointerleave', () => {
    if (!store.get().paused) set({ idle: true });
  });

  // ---- Providers ----------------------------------------------------------
  const providers = [...(opts.providers ?? []), nativeProvider];
  let providerInstance: ProviderInstance | null = null;
  let loadToken = 0;
  let addedTrackEls: HTMLTrackElement[] = [];

  async function setSource(input: Source | Source[], extra: { poster?: string; title?: string; tracks?: TextTrackInit[] } = {}) {
    const token = ++loadToken;
    const sources = (Array.isArray(input) ? input : [input]).map(normalizeSource);
    providerInstance?.destroy();
    providerInstance = null;
    for (const el of addedTrackEls) el.remove();
    addedTrackEls = [];

    const keep = store.get();
    set({
      ...initialState(),
      volume: keep.volume,
      muted: keep.muted,
      playbackRate: keep.playbackRate,
      fullscreen: keep.fullscreen,
      pip: keep.pip,
      width: keep.width,
      poster: extra.poster ?? null,
      title: extra.title ?? null,
    });
    if (extra.poster) media.poster = extra.poster;
    else media.removeAttribute('poster');

    for (const t of extra.tracks ?? []) {
      const el = document.createElement('track');
      el.src = t.src;
      el.kind = t.kind ?? 'subtitles';
      if (t.label) el.label = t.label;
      if (t.srclang) el.srclang = t.srclang;
      if (t.default) el.default = true;
      media.appendChild(el);
      addedTrackEls.push(el);
    }

    let chosen: { source: SourceObject; provider: (typeof providers)[number] } | undefined;
    for (const source of sources) {
      const provider = providers.find((p) => p.canPlay(source, media));
      if (provider) {
        chosen = { source, provider };
        break;
      }
    }
    if (!chosen) {
      fail({ code: 'NO_PROVIDER', message: 'No provider can play this source. Did you forget a provider such as hls() or dash()?', fatal: true });
      return;
    }

    try {
      const instance = await chosen.provider.create({ media, player, update: set });
      if (token !== loadToken || destroyed) {
        instance.destroy();
        return;
      }
      providerInstance = instance;
      set({ source: chosen.source, provider: chosen.provider.name });
      emitter.emit('sourcechange', chosen.source);
      await instance.load(chosen.source);
      syncTextTracks();
    } catch (cause) {
      if (token === loadToken) fail({ code: 'PROVIDER', message: (cause as Error)?.message ?? 'Provider failed', fatal: true, cause });
    }
  }

  // ---- Skins ---------------------------------------------------------------
  let skinCleanup: (() => void) | void;
  let skinRoot: HTMLElement | null = null;
  let tokenKeys: string[] = [];
  function setSkin(skin: Skin | null) {
    skinCleanup?.();
    skinCleanup = undefined;
    skinRoot?.remove();
    skinRoot = null;
    for (const key of tokenKeys) root.style.removeProperty(key);
    tokenKeys = [];
    delete root.dataset.skin;
    if (!skin) return;
    if (skin.css && opts.injectStyles) injectStyle(`skin-${skin.name}`, skin.css, root.ownerDocument);
    root.dataset.skin = skin.name;
    const tokens = { ...skin.tokens, ...opts.tokens };
    for (const key in tokens) {
      const prop = key.startsWith('--') ? key : `--tp-${key}`;
      root.style.setProperty(prop, tokens[key]!);
      tokenKeys.push(prop);
    }
    skinRoot = document.createElement('div');
    skinRoot.className = 'tp-skin';
    root.appendChild(skinRoot);
    skinCleanup = skin.mount(player, skinRoot);
  }

  // ---- Plugins ------------------------------------------------------------
  const plugins = new Map<string, PluginInstance<any>>();
  const provided = new Map<string, unknown>();

  // ---- Public API ---------------------------------------------------------
  let destroyed = false;
  const dict = { ...en, ...opts.i18n };

  const player: Player = {
    el: root,
    media,
    store,
    get state() {
      return store.get();
    },
    options: opts,
    get destroyed() {
      return destroyed;
    },
    async play() {
      try {
        await media.play();
      } catch (error) {
        const name = (error as DOMException)?.name;
        if (name === 'AbortError') return;
        throw error;
      }
    },
    pause: () => media.pause(),
    togglePlay() {
      if (media.paused || media.ended) return player.play();
      media.pause();
      return Promise.resolve();
    },
    seek(time) {
      const s = store.get();
      const max = s.live && s.seekable ? s.seekable.end : s.duration || Infinity;
      const min = s.live && s.seekable ? s.seekable.start : 0;
      media.currentTime = clamp(time, min, max);
      set({ currentTime: media.currentTime });
    },
    seekBy: (delta) => player.seek(media.currentTime + delta),
    setVolume(volume) {
      media.volume = clamp(volume, 0, 1);
      if (volume > 0 && media.muted) media.muted = false;
    },
    setMuted: (muted) => {
      media.muted = muted;
    },
    toggleMute: () => {
      media.muted = !media.muted;
      if (!media.muted && media.volume === 0) media.volume = 0.5;
    },
    setPlaybackRate: (rate) => {
      media.playbackRate = rate;
    },
    setQuality(id) {
      providerInstance?.setQuality?.(id);
      set({ quality: id });
      emitter.emit('qualitychange', id);
    },
    setAudioTrack(id) {
      providerInstance?.setAudioTrack?.(id);
      set({ audioTrack: id });
    },
    setTextTrack(index) {
      visibleTextTracks().forEach((t, i) => {
        t.mode = i === index ? 'showing' : 'disabled';
      });
      set({ textTrack: index });
    },
    setSource,
    async enterFullscreen() {
      const el = root as any;
      if (el.requestFullscreen) return el.requestFullscreen();
      if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
      // iOS Safari only supports fullscreen on the <video> itself.
      (media as any).webkitEnterFullscreen?.();
    },
    async exitFullscreen() {
      const d = document as any;
      if (fullscreenElement()) return (d.exitFullscreen ?? d.webkitExitFullscreen)?.call(d);
      (media as any).webkitExitFullscreen?.();
    },
    toggleFullscreen: () => (store.get().fullscreen ? player.exitFullscreen() : player.enterFullscreen()),
    async togglePip() {
      const d = document as any;
      const m = media as any;
      if (d.pictureInPictureElement === media) return d.exitPictureInPicture();
      if (m.requestPictureInPicture) return void (await m.requestPictureInPicture());
      if (m.webkitSetPresentationMode) m.webkitSetPresentationMode(m.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
    },
    setSkin,
    use(plugin: Plugin<any>) {
      if (plugins.has(plugin.name)) return plugins.get(plugin.name)!.api;
      const instance = plugin.setup(player) ?? {};
      plugins.set(plugin.name, instance);
      return instance.api;
    },
    plugin: (name) => plugins.get(name)?.api,
    provide: (key, value) => void provided.set(key, value),
    inject: <T>(key: string) => provided.get(key) as T | undefined,
    t: (key, vars) => translate(dict, key, vars),
    activity,
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    off: emitter.off.bind(emitter),
    emit: emitter.emit.bind(emitter),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      emitter.emit('destroy', undefined);
      for (const instance of [...plugins.values()].reverse()) instance.destroy?.();
      plugins.clear();
      setSkin(null);
      providerInstance?.destroy();
      providerInstance = null;
      controller.abort();
      resizeObserver?.disconnect();
      clearTimeout(idleTimer);
      for (const el of addedTrackEls) el.remove();
      emitter.clear();
      root.classList.remove('tp');
      for (const attr of [...root.attributes]) if (attr.name.startsWith('data-')) root.removeAttribute(attr.name);
      if (createdMedia) media.remove();
      if (createdRoot) {
        root.parentNode?.insertBefore(media, root);
        root.remove();
      }
    },
  };

  if (opts.title) set({ title: opts.title });
  if (opts.poster) {
    media.poster = opts.poster;
    set({ poster: opts.poster });
  }
  for (const plugin of opts.plugins ?? []) player.use(plugin);
  if (opts.skin) setSkin(opts.skin);

  if (opts.src) {
    const initial = setSource(opts.src, { poster: opts.poster, title: opts.title, tracks: opts.tracks });
    if (opts.autoplay) {
      initial.then(() => autoplay());
    }
  }

  /** Try to autoplay; browsers block unmuted autoplay, so retry muted. */
  async function autoplay() {
    try {
      await media.play();
    } catch (error) {
      if ((error as DOMException)?.name !== 'NotAllowedError' || media.muted) return;
      media.muted = true;
      await media.play().catch(() => {});
    }
  }

  return player;
}
