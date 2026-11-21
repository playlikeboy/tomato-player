import type { Store } from './store';
import type { Emitter } from './emitter';

export interface SourceObject {
  src: string;
  /** MIME type, e.g. `video/mp4`, `application/x-mpegurl`, `application/dash+xml`. */
  type?: string;
  /** Optional label for source switchers. */
  label?: string;
}
export type Source = string | SourceObject;

export interface TextTrackInit {
  src: string;
  kind?: 'subtitles' | 'captions' | 'chapters' | 'descriptions' | 'metadata';
  label?: string;
  srclang?: string;
  default?: boolean;
}

export interface Quality {
  id: number;
  height?: number;
  width?: number;
  bitrate?: number;
  label: string;
}

export interface TrackInfo {
  id: number;
  label: string;
  language?: string;
  kind?: string;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface PlayerState {
  source: SourceObject | null;
  provider: string | null;
  ready: boolean;
  paused: boolean;
  /** `true` once playback has started at least once for this source. */
  started: boolean;
  ended: boolean;
  /** Waiting for data (show a spinner). */
  waiting: boolean;
  seeking: boolean;
  currentTime: number;
  duration: number;
  buffered: TimeRange[];
  seekable: TimeRange | null;
  live: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  fullscreen: boolean;
  pip: boolean;
  /** `true` when the user has been inactive for `idleTimeout` ms during playback. */
  idle: boolean;
  qualities: Quality[];
  /** Selected quality id, `-1` = automatic (ABR). */
  quality: number;
  audioTracks: TrackInfo[];
  audioTrack: number;
  textTracks: TrackInfo[];
  /** Index into `textTracks` that is showing, `-1` = off. */
  textTrack: number;
  poster: string | null;
  title: string | null;
  error: PlayerError | null;
  width: number;
}

export interface PlayerError {
  code: 'MEDIA_ABORTED' | 'NETWORK' | 'DECODE' | 'SRC_NOT_SUPPORTED' | 'NO_PROVIDER' | 'PROVIDER' | 'UNKNOWN';
  message: string;
  fatal: boolean;
  cause?: unknown;
}

export interface PlayerEvents {
  ready: void;
  play: void;
  pause: void;
  ended: void;
  seeking: number;
  seeked: number;
  timeupdate: number;
  error: PlayerError;
  sourcechange: SourceObject;
  qualitychange: number;
  ratechange: number;
  volumechange: { volume: number; muted: boolean };
  fullscreenchange: boolean;
  pipchange: boolean;
  statechange: { state: Readonly<PlayerState>; prev: Readonly<PlayerState> };
  destroy: void;
  /** Free-form channel for plugins: `player.emit('plugin:name', data)`. */
  [custom: `plugin:${string}`]: unknown;
}

export interface Player {
  /** Root container element. Skins render into it. */
  readonly el: HTMLElement;
  /** The underlying `<video>` element. */
  readonly media: HTMLVideoElement;
  readonly store: Store<PlayerState>;
  readonly state: Readonly<PlayerState>;
  readonly options: Readonly<PlayerOptions>;
  readonly destroyed: boolean;

  play(): Promise<void>;
  pause(): void;
  togglePlay(): Promise<void>;
  seek(time: number): void;
  seekBy(delta: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  toggleMute(): void;
  setPlaybackRate(rate: number): void;
  setQuality(id: number): void;
  setAudioTrack(id: number): void;
  setTextTrack(index: number): void;
  setSource(source: Source | Source[], options?: { poster?: string; title?: string; tracks?: TextTrackInit[] }): Promise<void>;
  enterFullscreen(): Promise<void>;
  exitFullscreen(): Promise<void>;
  toggleFullscreen(): Promise<void>;
  togglePip(): Promise<void>;
  setSkin(skin: Skin | null): void;
  use<API>(plugin: Plugin<API>): API | undefined;
  plugin<API = unknown>(name: string): API | undefined;
  /** Share a capability with other extensions (e.g. `thumbnails`, `chapters`). */
  provide<T>(key: string, value: T): void;
  inject<T>(key: string): T | undefined;
  /** Translate a UI string. */
  t(key: string, vars?: Record<string, string | number>): string;
  /** Mark the user as active (resets idle timer). */
  activity(): void;

  on: Emitter<PlayerEvents>['on'];
  once: Emitter<PlayerEvents>['once'];
  off: Emitter<PlayerEvents>['off'];
  emit: Emitter<PlayerEvents>['emit'];

  destroy(): void;
}

export interface ProviderContext {
  media: HTMLVideoElement;
  player: Player;
  /** Update state (qualities, audio tracks, live, errors...). */
  update(patch: Partial<PlayerState>): void;
}

export interface ProviderInstance {
  load(source: SourceObject): void | Promise<void>;
  setQuality?(id: number): void;
  setAudioTrack?(id: number): void;
  destroy(): void;
}

export interface Provider {
  name: string;
  /** Return `true` if this provider can play the source in the current browser. */
  canPlay(source: SourceObject, media: HTMLVideoElement): boolean;
  /** May be async so heavy engines can be code-split with `import()`. */
  create(ctx: ProviderContext): ProviderInstance | Promise<ProviderInstance>;
}

export interface PluginInstance<API = unknown> {
  api?: API;
  destroy?(): void;
}

export interface Plugin<API = unknown> {
  name: string;
  setup(player: Player): PluginInstance<API> | void;
}

export interface Skin {
  name: string;
  /** CSS injected once per document (skip with `injectStyles: false`). */
  css?: string;
  /** Design tokens applied as CSS custom properties, e.g. `{ accent: '#e11d48' }` -> `--tp-accent`. */
  tokens?: Record<string, string>;
  /** Build the UI inside `root`. Return a cleanup function. */
  mount(player: Player, root: HTMLElement): void | (() => void);
}

export interface PlayerOptions {
  src?: Source | Source[];
  poster?: string;
  title?: string;
  tracks?: TextTrackInit[];
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** Defaults to `true` (required for inline playback on iOS). */
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  volume?: number;
  playbackRate?: number;
  /** Providers tried in order. The native provider is always the fallback. */
  providers?: Provider[];
  plugins?: Plugin<any>[];
  skin?: Skin | null;
  /** Override design tokens of the active skin. */
  tokens?: Record<string, string>;
  /** Inject skin CSS automatically. Set `false` if you import the skin's `style.css`. */
  injectStyles?: boolean;
  /** Inactivity delay before `state.idle` becomes `true`. Default 2500ms. */
  idleTimeout?: number;
  /** Strings for i18n. Merged over English defaults. */
  i18n?: Record<string, string>;
  /** Accessible name for the player region. */
  label?: string;
  /**
   * What to do where the element Fullscreen API is missing (iPhone Safari).
   * `'native'` (default) uses the system video player (custom UI disappears);
   * `'pseudo'` pins the player to the viewport with CSS and keeps your skin.
   */
  fullscreenFallback?: 'native' | 'pseudo';
  /** Aspect ratio for the container, e.g. `"16/9"`. `false` to let CSS decide. */
  aspectRatio?: string | false;
}
