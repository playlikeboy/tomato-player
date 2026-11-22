// Search and answer-engine copy for each route: <title> text (under 45 characters, so the
// " · Tomato Player" suffix keeps it within 60) and an answer-first description (120 to 160
// characters) that states plainly what the page is about. Facts mirror site.ts and the docs.
import type { PluginSlug, SkinSlug } from './site';

export interface RouteMeta {
  title: string;
  description: string;
}

export const PAGE_META = {
  home: {
    title: 'Tomato Player: open-source web video player with skins',
    description:
      'Tomato Player is a free, MIT-licensed web video player: a core under 6 KB gzip, 9 swappable skins, HLS and DASH, captions, plugins, React, Vue and Svelte.',
  },
  docs: {
    title: 'Documentation',
    description:
      'Tomato Player docs: install, architecture, skins and theming, plugins, HLS and DASH streaming, React, Vue and Svelte, accessibility, API reference and guides.',
  },
  skins: {
    title: 'Video player skins gallery',
    description:
      'Nine live Tomato Player skins you can switch at runtime: Minimal, Cinema, Studio, Creator, Learn, Campus and three unofficial ones. Theme each, copy the code.',
  },
  plugins: {
    title: 'Video player plugins',
    description:
      'Tomato Player plugins are small opt-in packages: hotkeys, touch gestures, chapters, seek thumbnails, playlists, QoE analytics, Media Session and saved settings.',
  },
  demos: {
    title: 'Live video player demos',
    description:
      'Live Tomato Player demos with copy-paste code: HLS and DASH streaming, captions, chapters, playlists, analytics, hotkeys, theming, React and the web component.',
  },
  packages: {
    title: 'Packages and bundle sizes',
    description:
      'Every Tomato Player package with its purpose and measured gzip size: core, UI primitives, 9 skins, 8 plugins, HLS and DASH providers, bindings and CDN bundle.',
  },
  playground: {
    title: 'Video player playground',
    description:
      'Configure Tomato Player in the browser: switch between 9 skins, WebM, HLS and DASH sources, accent colors and plugins, watch the event log and copy the code.',
  },
} satisfies Record<string, RouteMeta>;

export const SKIN_META: Record<SkinSlug, RouteMeta> = {
  minimal: {
    title: 'Minimal skin: clean default video controls',
    description:
      'Minimal is the default Tomato Player skin: one row with time slider, volume, captions, settings, picture-in-picture and fullscreen, branded by one accent token.',
  },
  cinema: {
    title: 'Cinema skin: premium film-style player',
    description:
      'Cinema is a premium Tomato Player skin with a serif title and eyebrow, gold gradient progress, remaining time and skip buttons, made for trailers and launches.',
  },
  studio: {
    title: 'Studio skin: timecode and frame stepping',
    description:
      'Studio is a professional Tomato Player review skin with SMPTE timecode, frame-by-frame stepping, an A-B loop and 0.1× to 4× speed, for editors and reviewers.',
  },
  creator: {
    title: 'Creator skin: floating glass controls',
    description:
      'Creator is an expressive Tomato Player skin with floating glass pill controls and a two-stop gradient accent, for creator portfolios and social-first brands.',
  },
  learn: {
    title: 'Learn skin: video player for courses',
    description:
      'Learn is a Tomato Player skin for courses and LMS platforms: speed chips, ±10 second skips, a chapter panel and large, readable captions for lectures.',
  },
  campus: {
    title: 'Campus skin: paper stickers, tap to unmute',
    description:
      'Campus is a Tomato Player skin from the CampusLoop landing page: a paper-sticker control strip, sticker captions, tap to unmute and a portrait 9:16 layout.',
  },
  stream: {
    title: 'Stream skin: streaming-service layout',
    description:
      'Stream is an unofficial Tomato Player skin with streaming-service patterns: large icons, ±10 s skips, a centered title and next episode. No third-party assets.',
  },
  tube: {
    title: 'Tube skin: video-platform layout',
    description:
      'Tube is an unofficial Tomato Player skin with video-platform patterns: a thin progress bar that grows on hover, next and theater mode. No third-party assets.',
  },
  feed: {
    title: 'Feed skin: muted autoplay for social feeds',
    description:
      'Feed is an unofficial Tomato Player skin for social feeds: muted autoplay when scrolled into view, tap to unmute and a compact bar. No third-party assets.',
  },
};

export const PLUGIN_META: Record<PluginSlug, RouteMeta> = {
  hotkeys: {
    title: 'Hotkeys plugin: video keyboard shortcuts',
    description:
      'The Tomato Player hotkeys plugin adds shortcuts: Space and K to play, J and L to jump 10 s, arrows, F, M, C and I. Every key can be remapped or disabled.',
  },
  gestures: {
    title: 'Gestures plugin: double-tap to seek',
    description:
      'The Tomato Player gestures plugin adds touch controls: double-tap the left or right side of the video to seek, with a ripple that shows how far you jumped.',
  },
  chapters: {
    title: 'Chapters plugin: WebVTT video chapters',
    description:
      'The Tomato Player chapters plugin loads chapters from an array or WebVTT file, draws seek-bar markers, shows titles in the preview and emits chapter changes.',
  },
  thumbnails: {
    title: 'Thumbnails plugin: seek-bar previews',
    description:
      'The Tomato Player thumbnails plugin shows preview images above the seek bar on hover or drag, read from a standard WebVTT thumbnail track with sprite sheets.',
  },
  playlist: {
    title: 'Playlist plugin: next, previous, loop',
    description:
      'The Tomato Player playlist plugin adds next and previous, auto-advance and loop, with an API through player.plugin("playlist") and a playlist change event.',
  },
  analytics: {
    title: 'Analytics plugin: video QoE events',
    description:
      'The Tomato Player analytics plugin emits vendor-neutral events: startup time, play, pause, seek, quartiles, rebuffering and watch time for any backend.',
  },
  'media-session': {
    title: 'Media Session plugin: lock-screen controls',
    description:
      'The Tomato Player Media Session plugin shows title and artwork on the lock screen and in system media controls, and maps hardware media keys to playback.',
  },
  persist: {
    title: 'Persist plugin: remember player settings',
    description:
      'The Tomato Player persist plugin remembers volume, mute, speed, caption language and resume position in localStorage or your own storage and restores them.',
  },
};

/** Demo pages: the demo summary plus the longest factual suffix that keeps it within 160 characters. */
export const demoDescription = (summary: string) => {
  const suffixes = [
    ' A live Tomato Player example you can play in the browser, with the code to copy.',
    ' A live Tomato Player example you can play, with the code to copy.',
    ' A live Tomato Player example with the code to copy.',
  ];
  return suffixes.map((x) => summary + x).find((t) => t.length <= 160) ?? summary;
};
