// Single source of truth for site copy and catalog data (skins, plugins, demos, FAQ).

export const SITE = {
  name: 'Tomato Player',
  tagline: 'The modular web video player',
  description:
    'Tomato Player is an open-source, MIT-licensed HTML5 video player for the web: an under-6 KB core, 9 swappable skins, HLS and DASH streaming, captions, chapters, playlists, analytics and React, Vue and Svelte bindings.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://playlikeboy.github.io/tomato-player').replace(/\/$/, ''),
  repo: 'https://github.com/playlikeboy/tomato-player',
  author: { name: 'playlikeboy', url: 'https://github.com/playlikeboy' },
  keywords: [
    'video player',
    'html5 video player',
    'javascript video player',
    'react video player',
    'vue video player',
    'svelte video player',
    'hls player',
    'dash player',
    'web component video player',
    'open source video player',
    'video.js alternative',
    'plyr alternative',
    'accessible video player',
    'video player skins',
  ],
};

export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
/** Prefix a public/ asset path with the deploy base path. */
export const asset = (path: string) => `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
export const absolute = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;

export const MEDIA = {
  title: 'Big Buck Bunny',
  mp4: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm',
  hls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  dash: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  tears: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  poster: asset('/media/poster.jpg'),
  credit: 'Big Buck Bunny © Blender Foundation, CC BY 3.0, via Wikimedia Commons. HLS test stream by Mux, DASH by Akamai.',
};

export type SkinSlug = 'minimal' | 'cinema' | 'studio' | 'creator' | 'learn' | 'campus' | 'stream' | 'tube' | 'feed';

export interface SkinInfo {
  slug: SkinSlug;
  name: string;
  summary: string;
  description: string;
  accent: string;
  factory: string;
  options: { name: string; type: string; description: string }[];
  features: string[];
  bestFor: string;
  unofficial?: boolean;
  portrait?: boolean;
}

export const SKINS: SkinInfo[] = [
  {
    slug: 'minimal',
    name: 'Minimal',
    summary: 'Clean, lightweight controls. The default skin.',
    description:
      'Minimal is the default Tomato Player skin: a single row of controls with a time slider, volume, captions, settings, picture-in-picture and fullscreen. It stays out of the way and fits any brand by changing one accent token.',
    accent: '#f0472e',
    factory: 'minimal()',
    options: [
      { name: 'pip', type: 'boolean', description: 'Show the picture-in-picture button (default true).' },
      { name: 'settings', type: 'boolean', description: 'Show the settings menu with speed, quality and captions (default true).' },
    ],
    features: ['Smallest skin', 'Settings menu', 'Captions menu', 'Container-query responsive'],
    bestFor: 'Product pages, docs, SaaS apps and anywhere the video is the content.',
  },
  {
    slug: 'cinema',
    name: 'Cinema',
    summary: 'Premium cinematic look with a serif title, eyebrow and gold accent.',
    description:
      'Cinema is a premium, film-first skin: a letterboxed serif title with an eyebrow line, gold gradient progress, remaining time and generous spacing. Use it for trailers, launches and storytelling.',
    accent: '#e8b04b',
    factory: "cinema({ eyebrow: 'A Tomato Original' })",
    options: [
      { name: 'eyebrow', type: 'string', description: 'Small label above the title.' },
      { name: 'seekStep', type: 'number', description: 'Seconds to skip with the ±buttons (default 10).' },
    ],
    features: ['Serif title overlay', 'Remaining time', 'Gold gradient progress', 'Skip buttons'],
    bestFor: 'Trailers, film festivals, product launches and brand stories.',
  },
  {
    slug: 'studio',
    name: 'Studio',
    summary: 'Pro toolbar with SMPTE timecode, frame stepping and A-B loop.',
    description:
      'Studio is a professional review skin: SMPTE timecode, frame-by-frame stepping, an A-B loop and playback from 0.1× to 4×. It suits editors, reviewers and anyone who needs exact frames.',
    accent: '#38bdf8',
    factory: 'studio({ fps: 24 })',
    options: [{ name: 'fps', type: 'number', description: 'Frame rate for timecode and frame stepping (default 30).' }],
    features: ['SMPTE timecode', 'Frame stepping', 'A-B loop', '0.1× to 4× speed'],
    bestFor: 'Video review tools, editing apps, sports analysis and QA.',
  },
  {
    slug: 'creator',
    name: 'Creator',
    summary: 'Floating glass pill controls with a vivid two-stop gradient.',
    description:
      'Creator is an expressive skin with floating glass controls and a two-stop gradient accent. It is built for creator portfolios, course trailers and social-first brands.',
    accent: '#a855f7',
    factory: 'creator()',
    options: [{ name: 'gradient', type: '[string, string]', description: 'Two colors for the accent gradient.' }],
    features: ['Glass pill controls', 'Gradient accent', 'Floating layout'],
    bestFor: 'Creator portfolios, landing pages and social-first brands.',
  },
  {
    slug: 'learn',
    name: 'Learn',
    summary: 'For courses: speed chips, ±10 s, chapter panel and large captions.',
    description:
      'Learn is an education skin: prominent speed chips, ±10 second skips, a chapter panel and large, readable captions. It is designed for courses, lectures and tutorials.',
    accent: '#10b981',
    factory: 'learn()',
    options: [
      { name: 'rates', type: 'number[]', description: 'Speed chips to show (default 0.75, 1, 1.25, 1.5, 2).' },
      { name: 'seekStep', type: 'number', description: 'Seconds to skip (default 10).' },
      { name: 'chapterPanel', type: 'boolean', description: 'Show the chapter list panel (default true).' },
    ],
    features: ['Speed chips', 'Chapter panel', 'Large captions', 'Skip buttons'],
    bestFor: 'Online courses, LMS platforms, lectures and tutorials.',
  },
  {
    slug: 'campus',
    name: 'Campus',
    summary: 'Paper sticker strip, sticker captions and tap to unmute.',
    description:
      'Campus is ported from the CampusLoop landing page: a playful paper-sticker control strip, sticker-style captions, a speed cycle and tap-to-unmute. It is portrait-first and can autoplay muted when scrolled into view.',
    accent: '#6b3df5',
    factory: 'campus({ autoplayInView: false })',
    options: [
      { name: 'playLabel', type: 'string', description: 'Label of the big play pill (default "Play the video").' },
      { name: 'autoplayInView', type: 'boolean', description: 'Autoplay muted when scrolled into view.' },
      { name: 'errorMessage', type: 'string', description: 'Message shown when the media fails.' },
      { name: 'theme', type: "'light' | 'dark' | 'auto'", description: 'Sticker color scheme.' },
    ],
    features: ['Sticker controls', 'Sticker captions', 'Tap to unmute', 'Portrait 9:16'],
    bestFor: 'Student and community products, launch videos and playful brands.',
    portrait: true,
  },
  {
    slug: 'stream',
    name: 'Stream',
    summary: 'Streaming-service patterns: big icons, ±10 s, centered title, next episode.',
    description:
      'Stream is an unofficial skin inspired by streaming-service patterns: large icons, ±10 second skips, a centered episode title and a next-episode button. It uses no third-party logos or assets and implies no affiliation.',
    accent: '#e50914',
    factory: "stream({ subtitle: 'S1:E1', onNext() {} })",
    options: [
      { name: 'subtitle', type: 'string', description: 'Episode line under the title.' },
      { name: 'onNext', type: '() => void', description: 'Shows a next-episode button when set.' },
      { name: 'nextLabel', type: 'string', description: 'Label of the next button.' },
      { name: 'onBack', type: '() => void', description: 'Shows a back arrow when set.' },
    ],
    features: ['Next episode', 'Back button', 'Large icons', 'Centered title'],
    bestFor: 'Series, episodic content and OTT-style apps.',
    unofficial: true,
  },
  {
    slug: 'tube',
    name: 'Tube',
    summary: 'Video-platform patterns: thin expanding progress and theater mode.',
    description:
      'Tube is an unofficial skin inspired by video-platform patterns: a thin progress bar that grows on hover, a next button and a theater-mode toggle. It uses no third-party logos or assets and implies no affiliation.',
    accent: '#ff0033',
    factory: 'tube({ onNext() {}, onTheater() {} })',
    options: [
      { name: 'onNext', type: '() => void', description: 'Shows a next button when set.' },
      { name: 'onTheater', type: '(on: boolean) => void', description: 'Shows a theater-mode toggle when set.' },
    ],
    features: ['Theater mode', 'Expanding progress', 'Next button'],
    bestFor: 'Video sites, communities and user-generated content.',
    unofficial: true,
  },
  {
    slug: 'feed',
    name: 'Feed',
    summary: 'Social-feed patterns: muted autoplay in view, tap to unmute, compact bar.',
    description:
      'Feed is an unofficial skin inspired by social-feed patterns: muted autoplay when the video scrolls into view, tap to unmute and a compact control bar. It uses no third-party logos or assets and implies no affiliation.',
    accent: '#0866ff',
    factory: 'feed({ autoplayInView: false })',
    options: [{ name: 'autoplayInView', type: 'boolean', description: 'Autoplay muted when at least half visible (default true).' }],
    features: ['Autoplay in view', 'Tap to unmute', 'Compact bar'],
    bestFor: 'Feeds, timelines and short-form video lists.',
    unofficial: true,
  },
];

export type PluginSlug =
  | 'hotkeys'
  | 'gestures'
  | 'chapters'
  | 'thumbnails'
  | 'playlist'
  | 'analytics'
  | 'media-session'
  | 'persist';

export interface PluginInfo {
  slug: PluginSlug;
  name: string;
  importName: string;
  summary: string;
  description: string;
  usage: string;
  options: { name: string; type: string; description: string }[];
  demo?: string;
}

export const PLUGINS: PluginInfo[] = [
  {
    slug: 'hotkeys',
    name: 'Hotkeys',
    importName: 'hotkeys',
    summary: 'Keyboard shortcuts with familiar defaults, fully remappable.',
    description:
      'Adds keyboard shortcuts with familiar video-platform defaults: Space and K to play, J and L to jump 10 seconds, arrows to seek and change volume, Home and End, F for fullscreen, M to mute, C for captions and I for picture-in-picture. Every binding can be remapped or disabled.',
    usage: "hotkeys({ scope: 'focus', seekStep: 5, bindings: { p: (player) => player.togglePip() } })",
    options: [
      { name: 'scope', type: "'focus' | 'global'", description: 'Listen only while the player has focus, or on the whole page.' },
      { name: 'seekStep', type: 'number', description: 'Arrow-key seek in seconds (default 5).' },
      { name: 'longSeekStep', type: 'number', description: 'J and L seek in seconds (default 10).' },
      { name: 'volumeStep', type: 'number', description: 'Volume change per key press (default 0.1).' },
      { name: 'bindings', type: 'Record<string, action | null>', description: 'Add, replace or remove (null) bindings.' },
    ],
    demo: 'keyboard-and-gestures',
  },
  {
    slug: 'gestures',
    name: 'Gestures',
    importName: 'gestures',
    summary: 'Double-tap to seek on touch, with visual feedback.',
    description: 'Adds touch gestures: double-tap the left or right side to seek, with a ripple showing how far you jumped.',
    usage: 'gestures({ seekStep: 10, zone: 0.35 })',
    options: [
      { name: 'seekStep', type: 'number', description: 'Seconds per double-tap (default 10).' },
      { name: 'zone', type: 'number', description: 'Width of each side zone as a fraction of the player (default 0.35).' },
    ],
    demo: 'keyboard-and-gestures',
  },
  {
    slug: 'chapters',
    name: 'Chapters',
    importName: 'chapters',
    summary: 'Chapters from an array or WebVTT, with seek-bar markers.',
    description:
      'Loads chapters from an array or a WebVTT file, draws markers on the seek bar, shows the chapter title in the preview and emits a plugin:chapterchange event.',
    usage: "chapters({ chapters: '/chapters.vtt' })",
    options: [{ name: 'chapters', type: 'Chapter[] | string', description: 'Array of { start, end?, title } or a WebVTT URL.' }],
    demo: 'chapters',
  },
  {
    slug: 'thumbnails',
    name: 'Thumbnails',
    importName: 'thumbnails',
    summary: 'Seek-bar preview thumbnails from WebVTT sprite sheets.',
    description:
      'Shows a preview image above the seek bar while you hover or drag. It reads the standard WebVTT thumbnail format, with sprite-sheet coordinates in #xywh fragments.',
    usage: "thumbnails({ src: '/thumbnails.vtt' })",
    options: [{ name: 'src', type: 'string', description: 'URL of the WebVTT thumbnail track.' }],
  },
  {
    slug: 'playlist',
    name: 'Playlist',
    importName: 'playlist',
    summary: 'Next and previous, auto-advance and loop.',
    description:
      'Turns the player into a playlist with next, previous, auto-advance and loop. The plugin exposes an API through player.plugin("playlist") and emits plugin:playlistchange.',
    usage: "playlist({ items: [{ src: 'a.mp4', title: 'Intro' }, { src: 'b.m3u8', title: 'Part 2' }], loop: true })",
    options: [
      { name: 'items', type: 'PlaylistItem[]', description: 'Items with src, title, poster and tracks.' },
      { name: 'start', type: 'number', description: 'Index to start from (default 0).' },
      { name: 'autoAdvance', type: 'boolean', description: 'Play the next item when one ends (default true).' },
      { name: 'loop', type: 'boolean', description: 'Go back to the first item after the last.' },
    ],
    demo: 'playlist',
  },
  {
    slug: 'analytics',
    name: 'Analytics',
    importName: 'analytics',
    summary: 'Vendor-neutral QoE events: startup time, quartiles, rebuffering, watch time.',
    description:
      'Emits vendor-neutral playback analytics: view start with startup time, play, pause, seek, quartiles, rebuffering and heartbeat watch time. Send the events to any backend.',
    usage: "analytics({ heartbeat: 10000, onEvent: (e) => navigator.sendBeacon('/qoe', JSON.stringify(e)) })",
    options: [
      { name: 'onEvent', type: '(event) => void', description: 'Called for every analytics event.' },
      { name: 'heartbeat', type: 'number', description: 'Milliseconds between watch-time heartbeats.' },
    ],
    demo: 'analytics',
  },
  {
    slug: 'media-session',
    name: 'Media Session',
    importName: 'mediaSession',
    summary: 'Lock-screen controls, artwork and hardware media keys.',
    description:
      'Connects the player to the Media Session API: title and artwork on the lock screen and in system media controls, plus hardware media keys for play, pause and seek.',
    usage: "mediaSession({ artist: 'Blender Foundation', artwork: [{ src: '/art.png', sizes: '512x512' }] })",
    options: [
      { name: 'artist', type: 'string', description: 'Artist shown in system controls.' },
      { name: 'album', type: 'string', description: 'Album shown in system controls.' },
      { name: 'artwork', type: 'MediaImage[]', description: 'Artwork images.' },
      { name: 'seekStep', type: 'number', description: 'Seconds for seek forward and backward actions.' },
    ],
  },
  {
    slug: 'persist',
    name: 'Persist',
    importName: 'persist',
    summary: 'Remember volume, speed, captions and resume position.',
    description:
      'Remembers the viewer’s volume, mute, speed, caption language and resume position in localStorage (or any storage you pass) and restores them on the next visit.',
    usage: "persist({ key: 'course-42', resume: true })",
    options: [
      { name: 'key', type: 'string', description: "Storage key prefix (default 'tomato')." },
      { name: 'volume', type: 'boolean', description: 'Remember volume and mute (default true).' },
      { name: 'rate', type: 'boolean', description: 'Remember speed (default true).' },
      { name: 'captions', type: 'boolean', description: 'Remember the caption language (default true).' },
      { name: 'resume', type: 'boolean', description: 'Resume where the viewer left off (default true).' },
      { name: 'storage', type: 'Storage-like', description: 'Custom storage, for example sessionStorage.' },
    ],
    demo: 'persist',
  },
];

export interface DemoInfo {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
}

export const DEMOS: DemoInfo[] = [
  { slug: 'hls-streaming', title: 'HLS adaptive streaming', summary: 'Adaptive bitrate HLS with a quality menu, powered by a lazy-loaded hls.js.', tags: ['provider', 'hls'] },
  { slug: 'dash-streaming', title: 'MPEG-DASH streaming', summary: 'DASH playback with dash.js, loaded only when a .mpd source plays.', tags: ['provider', 'dash'] },
  { slug: 'captions', title: 'Multi-language captions', summary: 'WebVTT captions in two languages with a captions menu and styled cues.', tags: ['accessibility'] },
  { slug: 'chapters', title: 'Chapters', summary: 'WebVTT chapters with seek-bar markers and a live chapter list.', tags: ['plugin'] },
  { slug: 'playlist', title: 'Playlist', summary: 'Three items with next, previous and auto-advance, driven by the plugin API.', tags: ['plugin'] },
  { slug: 'analytics', title: 'Analytics events', summary: 'Watch QoE events stream in: startup time, quartiles, seeks and heartbeats.', tags: ['plugin'] },
  { slug: 'keyboard-and-gestures', title: 'Keyboard and gestures', summary: 'Every shortcut, plus double-tap seeking on touch screens.', tags: ['plugin', 'accessibility'] },
  { slug: 'theming', title: 'Theming with tokens', summary: 'Change accent, radius and control size live through CSS design tokens.', tags: ['skin'] },
  { slug: 'react', title: 'React component', summary: 'The <TomatoPlayer> component with usePlayerState for live state.', tags: ['framework'] },
  { slug: 'web-component', title: 'Web component', summary: 'A <tomato-player> custom element configured with HTML attributes.', tags: ['framework'] },
  { slug: 'vertical-video', title: 'Vertical video', summary: 'Portrait 9:16 players with the Campus and Feed skins.', tags: ['skin'] },
  { slug: 'persist', title: 'Remember settings', summary: 'Volume, speed and position survive a reload with the persist plugin.', tags: ['plugin'] },
];

export const FAQ = [
  {
    q: 'What is Tomato Player?',
    a: 'Tomato Player is a free, open-source (MIT) web video player. Its core is under 6 KB gzipped, 9 swappable skins, plugins for chapters, playlists, analytics and more, HLS and DASH streaming, and bindings for React, Vue and Svelte.',
  },
  {
    q: 'Is Tomato Player a good Video.js or Plyr alternative?',
    a: 'Yes, if you want a smaller core and full control of the UI. Tomato Player keeps the engine separate from the skin, so you can switch the whole interface at runtime, ship only the plugins you use and theme everything with CSS tokens.',
  },
  {
    q: 'Does it support HLS and DASH?',
    a: 'Yes. The HLS provider uses hls.js and falls back to native HLS on Safari and iOS. The DASH provider uses dash.js. Both engines load lazily, only when a stream of that type plays.',
  },
  {
    q: 'Can I use it with React, Next.js, Vue, Nuxt or Svelte?',
    a: 'Yes. There are official bindings for React, Vue and Svelte. The core is SSR-safe, so it works in Next.js, Nuxt and SvelteKit. There is also a <tomato-player> web component and a CDN build for plain HTML.',
  },
  {
    q: 'Is it accessible?',
    a: 'Every control is a real button or slider with a label, keyboard focus stays visible, controls stay shown while focus is inside the player, and captions and keyboard shortcuts are built in. The accessibility guide lists what is covered.',
  },
  {
    q: 'How do I make my own skin?',
    a: 'Run pnpm new skin my-skin to scaffold one, compose it from the @tomato-player/ui primitives and publish it to npm. The create-a-skin guide walks through it step by step.',
  },
];

export const NAV = [
  { label: 'Docs', href: '/docs/' },
  { label: 'Skins', href: '/skins/' },
  { label: 'Plugins', href: '/plugins/' },
  { label: 'Demos', href: '/demos/' },
  { label: 'Playground', href: '/playground/' },
];
