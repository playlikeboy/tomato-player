#!/usr/bin/env node
// Builds the static website into site-dist/: landing page, live skin gallery,
// playground, rendered docs with search, examples and llms.txt.
//
//   pnpm build && pnpm site            # base "/tomato-player/" (GitHub Pages)
//   pnpm site:dev                      # base "/site-dist/", served from the repo root
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { gzipSync } from 'node:zlib';
import { Marked } from 'marked';

const OUT = 'site-dist';
const BASE = process.env.SITE_BASE ?? '/tomato-player/';
const REPO = 'https://github.com/playlikeboy/tomato-player';
const SITE_URL = process.env.SITE_URL ?? 'https://playlikeboy.github.io/tomato-player/';
const MEDIA = {
  webm: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm',
  hls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Big.Buck.Bunny.-.Opening.Screen.png/1280px-Big.Buck.Bunny.-.Opening.Screen.png',
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const write = (file, content) => {
  const path = join(OUT, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------- packages → /lib
const pkgRoots = ['packages', 'packages/skins', 'packages/plugins', 'packages/providers', 'packages/integrations'];
const packages = [];
for (const root of pkgRoots) {
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    const manifest = join(dir, 'package.json');
    if (!existsSync(manifest) || !existsSync(join(dir, 'dist'))) continue;
    const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
    const rel = dir.replace(/^packages\/?/, '') || name;
    cpSync(join(dir, 'dist'), join(OUT, 'lib', rel), { recursive: true, filter: (f) => !/\.(d\.c?ts|map|json)$/.test(f) || statSync(f).isDirectory() });
    const entry = join(dir, 'dist/index.js');
    const gz = existsSync(entry) ? gzipSync(readFileSync(entry), { level: 9 }).length / 1024 : 0;
    packages.push({ name: pkg.name, kind: pkg.tomato?.kind, description: pkg.description, rel, gz, dir });
  }
}
if (!packages.some((p) => p.name === '@tomato-player/core')) {
  console.error('Run `pnpm build` before building the site.');
  process.exit(1);
}
const importMap = {
  imports: Object.fromEntries([
    ...packages.filter((p) => p.kind !== 'bundle' && p.kind !== 'integration').map((p) => [p.name, `${BASE}lib/${p.rel}/index.js`]),
    ['hls.js', 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.mjs'],
  ]),
};
const importMapTag = `<script type="importmap">${JSON.stringify(importMap)}</script>`;
const sizeOf = (name) => packages.find((p) => p.name === name)?.gz ?? 0;
const cdnGz = gzipSync(readFileSync('packages/tomato-player/dist/tomato-player.global.js'), { level: 9 }).length / 1024;
const coreGz = sizeOf('@tomato-player/core');
const fullGz = coreGz + sizeOf('@tomato-player/ui') + sizeOf('@tomato-player/skin-minimal');

// ---------------------------------------------------------------- static assets
cpSync('site/site.css', join(OUT, 'site.css'));
cpSync('site/site.js', join(OUT, 'site.js'));
cpSync('.github/assets', join(OUT, 'assets'), { recursive: true });
cpSync('examples/assets', join(OUT, 'assets/media'), { recursive: true });
cpSync('llms.txt', join(OUT, 'llms.txt'));
if (existsSync('docs/llms-full.txt')) cpSync('docs/llms-full.txt', join(OUT, 'llms-full.txt'));
write('.nojekyll', '');

// ---------------------------------------------------------------- layout
const NAV = [
  ['Docs', 'docs/'],
  ['Skins', 'gallery/'],
  ['Playground', 'playground/'],
  ['Examples', 'examples/'],
  ['Research', 'docs/research/'],
];
function layout({ title, description, body, active = '', head = '', scripts = '' }) {
  const pageTitle = title ? `${title} · Tomato Player` : 'Tomato Player · One player. A thousand possibilities.';
  const desc = description ?? 'A modular, accessible, SSR-safe web video player with swappable skins, plugins, HLS/DASH and React, Vue and Svelte bindings.';
  return `<!doctype html>
<html lang="en" data-base="${BASE}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(desc)}" />
<meta property="og:title" content="${esc(pageTitle)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${SITE_URL}assets/skins.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#0b0b0e" />
<link rel="icon" href="${BASE}assets/logo.svg" type="image/svg+xml" />
<link rel="stylesheet" href="${BASE}site.css" />
${head}
</head>
<body>
<a href="#main" style="position:absolute;left:-9999px" onfocus="this.style.left='8px'">Skip to content</a>
<header class="site-header">
  <a class="brand" href="${BASE}"><img src="${BASE}assets/logo.svg" alt="" /> Tomato Player</a>
  <nav class="site-nav" aria-label="Main">${NAV.map(([label, href]) => `<a href="${BASE}${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
  <div class="header-end">
    <div class="search" role="search">
      <input id="search" type="search" placeholder="Search docs  /" aria-label="Search documentation" autocomplete="off" />
      <div id="search-results" class="search-results" hidden></div>
    </div>
    <a class="gh" href="${REPO}">GitHub ↗</a>
  </div>
</header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="wrap">
  <div>🍅 Tomato Player · MIT License · <a href="${REPO}">GitHub</a> · <a href="${BASE}llms.txt">llms.txt</a></div>
  <div>Big Buck Bunny © Blender Foundation, CC BY 3.0 · HLS test stream by Mux · Stream, Tube and Feed are unofficial designs with no affiliation.</div>
</div></footer>
<script type="module" src="${BASE}site.js"></script>
${scripts}
</body>
</html>`;
}

// ---------------------------------------------------------------- skins metadata
const SKINS = [
  ['minimal', 'Clean, lightweight controls. The default skin.', 'minimal()'],
  ['cinema', 'Premium cinematic look: serif title, eyebrow, gold gradient, remaining time.', "cinema({ eyebrow: 'A Tomato Original' })"],
  ['studio', 'Professional toolbar: SMPTE timecode, frame stepping, A-B loop, 0.1× to 4×.', 'studio({ fps: 24 })'],
  ['creator', 'Floating glass pill controls with a vivid two-stop gradient.', 'creator()'],
  ['learn', 'For courses: speed chips, ±10 s, chapter panel, large captions.', 'learn()'],
  ['campus', 'From the CampusLoop landing page: paper sticker strip, sticker captions, tap to unmute.', 'campus({ autoplayInView: false })'],
  ['stream', 'Streaming-service patterns: big icons, ±10 s, centered title, next episode.', "stream({ subtitle: 'S1:E1', onNext() {} })", true],
  ['tube', 'Video-platform patterns: thin expanding progress, theater mode.', 'tube({ onNext() {}, onTheater() {} })', true],
  ['feed', 'Social-feed patterns: muted autoplay in view, tap to unmute, compact bar.', 'feed({ autoplayInView: false })', true],
];
const skinImports = SKINS.map(([n]) => `import { ${n} } from '@tomato-player/skin-${n}';`).join('\n');
const skinFactories = `{ ${SKINS.map(([n, , f]) => `${n}: () => ${f}`).join(', ')} }`;

// ---------------------------------------------------------------- landing
const landing = layout({
  head: importMapTag,
  body: `
<div class="wrap">
  <section class="hero">
    <div>
      <div class="eyebrow">Open-source web video player</div>
      <h1>One player.<br/><span>A thousand possibilities.</span></h1>
      <p class="lead">A ${coreGz.toFixed(1)} KB core, swappable skins, community plugins, HLS/DASH loaded on demand, and first-class React, Vue, Svelte and HTML support. Accessible and SSR-safe.</p>
      <div class="cta">
        <a class="btn primary" href="${BASE}docs/getting-started/">Get started →</a>
        <a class="btn" href="${BASE}gallery/">Browse skins</a>
        <a class="btn" href="${BASE}playground/">Playground</a>
      </div>
      <div class="install"><span>npm i tomato-player</span><button type="button" data-copy="npm i tomato-player">Copy</button></div>
    </div>
    <div>
      <div id="hero" class="hero-player"></div>
      <div class="skin-chips" role="group" aria-label="Switch skin">${SKINS.map(([n], i) => `<button type="button" data-skin="${n}" aria-pressed="${i === 1}">${n}</button>`).join('')}</div>
    </div>
  </section>

  <div class="stats">
    <div class="stat"><b>${coreGz.toFixed(1)} KB</b><span>core, gzip</span></div>
    <div class="stat"><b>${fullGz.toFixed(1)} KB</b><span>full player (core + UI + skin)</span></div>
    <div class="stat"><b>${SKINS.length}</b><span>skins, swappable at runtime</span></div>
    <div class="stat"><b>${packages.filter((p) => p.kind === 'plugin').length}</b><span>plugins, ~0.5–0.9 KB each</span></div>
  </div>

  <section class="block">
    <div class="eyebrow">Why Tomato</div>
    <h2>Built around the problems developers actually report.</h2>
    <p class="muted" style="max-width:62ch">Every design decision traces back to a GitHub issue, migration pain or browser quirk. Read the <a href="${BASE}docs/research/">research collection</a>.</p>
    <div class="features">
      <div class="feature"><div class="ico">🪶</div><h3>Pay for what you use</h3><p>hls.js and dash.js are optional peers, loaded with <code>import()</code> only when a stream needs them, and never on Safari, which plays HLS natively.</p></div>
      <div class="feature"><div class="ico">🧩</div><h3>Skins are packages</h3><p>State lives in <code>data-*</code> attributes and design tokens in CSS variables. Swap skins at runtime with <code>player.setSkin()</code>.</p></div>
      <div class="feature"><div class="ico">⚡</div><h3>SSR-safe by construction</h3><p>No package touches <code>window</code> at import time. The React binding is tested with <code>renderToString</code> and Strict Mode.</p></div>
      <div class="feature"><div class="ico">♿</div><h3>Accessible by default</h3><p>Real buttons, sliders with <code>aria-valuetext</code>, keyboard menus, focus rings, reduced motion. Tests assert every control has a name.</p></div>
      <div class="feature"><div class="ico">🧹</div><h3>Leak-free lifecycle</h3><p>Every listener is bound to an <code>AbortSignal</code>. <code>destroy()</code> is idempotent and restores the DOM exactly.</p></div>
      <div class="feature"><div class="ico">🤖</div><h3>Docs for humans and AI</h3><p>Markdown-first docs, <a href="${BASE}llms.txt">llms.txt</a> and <a href="${BASE}llms-full.txt">llms-full.txt</a>, so assistants write correct code.</p></div>
    </div>
  </section>

  <section class="block">
    <div class="two">
      <div>
        <div class="eyebrow">Use it anywhere</div>
        <h2>Your framework, or none at all.</h2>
        <p class="muted">Thin bindings (≤ 0.6 KB) for React, Vue and Svelte. A <code>&lt;tomato-player&gt;</code> web component for Angular, Astro, Solid and plain HTML. One script tag via jsDelivr or unpkg.</p>
        <p><a href="${BASE}docs/guides/frameworks/">Framework guide →</a></p>
      </div>
      <div data-tabs>
        <div class="tabs" role="tablist">
          <button role="tab" aria-selected="true">JavaScript</button><button role="tab" aria-selected="false">React</button><button role="tab" aria-selected="false">Vue</button><button role="tab" aria-selected="false">Svelte</button><button role="tab" aria-selected="false">HTML</button>
        </div>
        <div role="tabpanel"><pre><code>${esc(`import { createPlayer } from '@tomato-player/core';
import { cinema } from '@tomato-player/skin-cinema';
import { hotkeys } from '@tomato-player/plugin-hotkeys';

const player = createPlayer('#player', {
  src: 'movie.mp4',
  skin: cinema(),
  plugins: [hotkeys()],
});`)}</code></pre></div>
        <div role="tabpanel" hidden><pre><code>${esc(`import { TomatoPlayer } from '@tomato-player/react';
import { minimal } from '@tomato-player/skin-minimal';

const skin = minimal();
export const Video = () => <TomatoPlayer src="movie.mp4" skin={skin} />;`)}</code></pre></div>
        <div role="tabpanel" hidden><pre><code>${esc(`<script setup>
import { TomatoPlayer } from '@tomato-player/vue';
import { minimal } from '@tomato-player/skin-minimal';
const skin = minimal();
</script>

<template><TomatoPlayer src="movie.mp4" :skin="skin" /></template>`)}</code></pre></div>
        <div role="tabpanel" hidden><pre><code>${esc(`<script>
  import { tomato } from '@tomato-player/svelte';
  import { minimal } from '@tomato-player/skin-minimal';
</script>

<div use:tomato={{ src: 'movie.mp4', skin: minimal() }} />`)}</code></pre></div>
        <div role="tabpanel" hidden><pre><code>${esc(`<script src="https://cdn.jsdelivr.net/npm/tomato-player@0/dist/tomato-player.global.js"></script>

<tomato-player src="movie.mp4" skin="cinema" title="My film">
  <track kind="captions" src="en.vtt" srclang="en" label="English" />
</tomato-player>`)}</code></pre></div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="eyebrow">Ecosystem</div>
    <h2>${packages.length} packages. Install only what you need.</h2>
    <div class="prose"><table><thead><tr><th>Package</th><th>Kind</th><th>gzip</th><th>Description</th></tr></thead><tbody>
    ${packages.map((p) => `<tr><td><code>${p.name}</code></td><td>${p.kind}</td><td>${p.kind === 'bundle' ? `${cdnGz.toFixed(1)} KB (CDN, all-in)` : `${p.gz.toFixed(2)} KB`}</td><td>${esc(p.description)}</td></tr>`).join('')}
    </tbody></table></div>
  </section>

  <section class="block" style="text-align:center">
    <h2>Build skin #${SKINS.length + 1}.</h2>
    <p class="muted">The goal is a searchable gallery of 1,000+ community skins. One command scaffolds a validated package.</p>
    <div class="install" style="margin:18px auto"><span>pnpm new skin aurora</span><button type="button" data-copy="pnpm new skin aurora">Copy</button></div>
    <p><a class="btn primary" href="${BASE}docs/guides/create-a-skin/">Create a skin →</a> <a class="btn" href="${REPO}/blob/main/CONTRIBUTING.md">Contribute</a></p>
  </section>
</div>`,
  scripts: `<script type="module">
import { createPlayer } from '@tomato-player/core';
import { hls } from '@tomato-player/provider-hls';
import { hotkeys } from '@tomato-player/plugin-hotkeys';
import { gestures } from '@tomato-player/plugin-gestures';
import { chapters } from '@tomato-player/plugin-chapters';
${skinImports}
const skins = ${skinFactories};
const player = createPlayer('#hero', {
  src: '${MEDIA.webm}',
  poster: '${MEDIA.poster}',
  title: 'Big Buck Bunny',
  preload: 'metadata',
  crossOrigin: 'anonymous',
  tracks: [{ src: '${BASE}assets/media/captions.en.vtt', label: 'English', srclang: 'en' }],
  providers: [hls()],
  plugins: [hotkeys(), gestures(), chapters({ chapters: '${BASE}assets/media/chapters.vtt' })],
  skin: skins.cinema(),
});
window.player = player;
for (const b of document.querySelectorAll('.skin-chips button')) {
  b.addEventListener('click', () => {
    player.setSkin(skins[b.dataset.skin]());
    document.querySelectorAll('.skin-chips button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  });
}
</script>`,
});
write('index.html', landing);

// ---------------------------------------------------------------- gallery
const gallery = layout({
  title: 'Skins',
  description: 'Live gallery of every Tomato Player skin. Play, theme and copy the code.',
  active: 'gallery/',
  head: importMapTag,
  body: `<div class="wrap" style="padding-top:40px;padding-bottom:80px">
  <div class="eyebrow">Gallery</div>
  <h1 style="font-size:44px;letter-spacing:-0.04em;margin:8px 0">Skins</h1>
  <p class="muted" style="max-width:66ch">Every skin below is a real, playable player. Each is an independent package, themeable with design tokens and swappable at runtime. Pick an accent color to theme a skin live. Stream, Tube and Feed are <b>unofficial</b>, platform-inspired designs with no logos, fonts or assets of any company and no affiliation.</p>
  <div class="gallery" style="margin-top:28px">
  ${SKINS.map(([n, d, f, unofficial]) => `<article class="card" id="${n}">
    <div class="stage"><div class="player" data-skin-name="${n}"></div></div>
    <div class="meta">
      <h3>${n}${unofficial ? ' <span class="badge">unofficial</span>' : ''}${n === 'campus' ? ' <span class="badge">CampusLoop</span>' : ''}</h3>
      <p>${esc(d)}</p>
      <div class="row"><code class="pkg">npm i @tomato-player/skin-${n}</code><button class="copy" type="button" data-copy="npm i @tomato-player/core @tomato-player/skin-${n}">Copy</button></div>
      <div class="row"><label class="muted" style="font-size:13px;display:flex;gap:6px;align-items:center">Accent <input type="color" data-accent="${n}" value="#ef4444" /></label>
      <a href="${BASE}playground/?skin=${n}" style="font-size:14px">Open in playground →</a>
      <a href="${REPO}/tree/main/packages/skins/${n}" style="font-size:14px">Source</a></div>
      <pre><code>${esc(`import { ${n} } from '@tomato-player/skin-${n}';\ncreatePlayer(el, { src, skin: ${f.replace(/\{ ?(onNext|subtitle)[^}]*\}/, '{ … }')} });`)}</code></pre>
    </div>
  </article>`).join('')}
  </div>
  <section class="block" style="margin-top:56px;text-align:center">
    <h2>Make your own</h2>
    <p class="muted">Scaffold with <code>pnpm new skin &lt;name&gt;</code>, compose UI primitives, style with tokens. <a href="${BASE}docs/guides/create-a-skin/">Read the guide →</a></p>
  </section>
</div>`,
  scripts: `<script type="module">
import { createPlayer } from '@tomato-player/core';
import { hotkeys } from '@tomato-player/plugin-hotkeys';
import { chapters } from '@tomato-player/plugin-chapters';
${skinImports}
const skins = ${skinFactories};
const players = {};
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    io.unobserve(e.target);
    const name = e.target.dataset.skinName;
    players[name] = createPlayer(e.target, {
      src: '${MEDIA.webm}',
      poster: '${MEDIA.poster}',
      title: 'Big Buck Bunny',
      preload: 'none',
      crossOrigin: 'anonymous',
      tracks: [{ src: '${BASE}assets/media/captions.en.vtt', label: 'English', srclang: 'en' }],
      plugins: [hotkeys(), chapters({ chapters: '${BASE}assets/media/chapters.vtt' })],
      skin: skins[name](),
    });
    // Only one gallery player plays at a time.
    players[name].on('play', () => Object.entries(players).forEach(([n, p]) => n !== name && p.pause()));
  }
}, { rootMargin: '200px' });
document.querySelectorAll('[data-skin-name]').forEach((el) => io.observe(el));
document.querySelectorAll('[data-accent]').forEach((input) => input.addEventListener('input', () => {
  players[input.dataset.accent]?.el.style.setProperty('--tp-accent', input.value);
}));
</script>`,
});
write('gallery/index.html', gallery);

// ---------------------------------------------------------------- playground (from examples/)
let playground = readFileSync('examples/playground/index.html', 'utf8');
playground = playground
  .replace(/<script type="importmap">[\s\S]*?<\/script>/, importMapTag)
  .replaceAll('/examples/assets/', `${BASE}assets/media/`)
  .replace('<a href="https://github.com/playlikeboy/tomato-player">GitHub →</a>', `<a href="${BASE}">← Home</a> <a href="${REPO}">GitHub →</a>`)
  .replace('<title>', `<link rel="icon" href="${BASE}assets/logo.svg" type="image/svg+xml" />\n    <title>`);
write('playground/index.html', playground);

// ---------------------------------------------------------------- examples
let cdn = readFileSync('examples/cdn/index.html', 'utf8')
  .replace('https://cdn.jsdelivr.net/npm/tomato-player@0/dist/tomato-player.global.js', `${BASE}lib/tomato-player/tomato-player.global.js`)
  .replaceAll('../assets/', `${BASE}assets/media/`);
write('examples/cdn/index.html', cdn);
write(
  'examples/index.html',
  layout({
    title: 'Examples',
    active: 'examples/',
    body: `<div class="wrap prose" style="padding:40px 0 80px">
<h1>Examples</h1>
<ul>
  <li><a href="${BASE}examples/cdn/">CDN / no build step</a>: one script tag, the declarative <code>&lt;tomato-player&gt;</code> element and the imperative <code>TomatoPlayer.createPlayer()</code> with adaptive HLS.</li>
  <li><a href="${BASE}playground/">Playground</a>: every skin, source, accent and plugin, with a live event log and generated code.</li>
  <li><a href="${BASE}gallery/">Skin gallery</a>: all skins playable side by side.</li>
  <li><a href="${BASE}docs/guides/frameworks/">React, Vue, Svelte and web component snippets</a></li>
</ul>
<h2>Run locally</h2>
<pre><code>git clone ${REPO}
cd tomato-player
pnpm install
pnpm playground</code></pre>
</div>`,
  }),
);

// ---------------------------------------------------------------- docs
const DOCS = [
  ['Start', [['docs/README.md', 'Overview'], ['docs/getting-started.md', 'Getting started'], ['docs/concepts/architecture.md', 'Architecture']]],
  ['Reference', [['docs/api/player.md', 'Player API'], ['docs/api/ui.md', 'UI primitives']]],
  ['Guides', [['docs/guides/skins.md', 'Skins & theming'], ['docs/guides/plugins.md', 'Plugins'], ['docs/guides/streaming.md', 'Streaming & DRM'], ['docs/guides/frameworks.md', 'Frameworks'], ['docs/guides/accessibility.md', 'Accessibility']]],
  ['Extend', [['docs/guides/create-a-skin.md', 'Create a skin'], ['docs/guides/create-a-plugin.md', 'Create a plugin'], ['docs/guides/create-a-provider.md', 'Create a provider']]],
  ['Help', [['docs/troubleshooting.md', 'Troubleshooting'], ['docs/migration/README.md', 'Migration'], ['docs/roadmap.md', 'Roadmap'], ['CHANGELOG.md', 'Changelog'], ['CONTRIBUTING.md', 'Contributing']]],
  ['Research', [['docs/research/README.md', 'Summary'], ['docs/research/landscape.md', 'Landscape'], ['docs/research/developer-pain-points.md', 'Pain points'], ['docs/research/integration-strategy.md', 'Integration strategy'], ['docs/research/opportunities.md', 'Opportunities']]],
];
const urlFor = (file) => {
  if (file === 'docs/README.md') return 'docs/';
  if (file === 'CHANGELOG.md') return 'docs/changelog/';
  if (file === 'CONTRIBUTING.md') return 'docs/contributing/';
  return file.replace(/\/README\.md$/, '/').replace(/\.md$/, '/');
};
const flat = DOCS.flatMap(([, items]) => items);
const known = new Map(flat.map(([f]) => [f, urlFor(f)]));
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;|&#\d+;/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

const searchIndex = [];
flat.forEach(([file, label], i) => {
  const md = readFileSync(file, 'utf8');
  const toc = [];
  const marked = new Marked({
    gfm: true,
    walkTokens(token) {
      if (token.type !== 'link' && token.type !== 'image') return;
      const href = token.href;
      if (/^(https?:|mailto:|#)/.test(href)) return;
      const [path, hash] = href.split('#');
      const target = posix.normalize(posix.join(posix.dirname(file), path));
      if (known.has(target)) token.href = BASE + known.get(target) + (hash ? `#${hash}` : '');
      else if (target.startsWith('.github/assets/')) token.href = BASE + target.replace('.github/assets/', 'assets/');
      else if (target.startsWith('examples/playground')) token.href = `${BASE}playground/`;
      else token.href = `${REPO}/${existsSync(target) && statSync(target).isDirectory() ? 'tree' : 'blob'}/main/${target}${hash ? `#${hash}` : ''}`;
    },
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slug(text);
        if (depth === 2 || depth === 3) toc.push({ depth, id, text: text.replace(/<[^>]+>/g, '') });
        return depth === 1 ? `<h1 id="${id}">${text}</h1>` : `<h${depth} id="${id}"><a class="anchor" href="#${id}">${text}</a></h${depth}>`;
      },
    },
  });
  const html = marked.parse(md);
  const url = urlFor(file);
  const title = (md.match(/^#\s+(.+)$/m)?.[1] ?? label).replace(/[`*]/g, '');

  // search: one entry per h2 section
  const sections = md.split(/^##\s+/m);
  searchIndex.push({ title, section: label, url, text: sections[0].replace(/[#`*|>\-[\]()]/g, ' ').slice(0, 600) });
  for (const s of sections.slice(1)) {
    const heading = s.split('\n')[0].trim();
    searchIndex.push({ title: heading.replace(/[`*]/g, ''), section: title, url: `${url}#${slug(heading)}`, text: s.replace(/[#`*|>\-[\]()]/g, ' ').slice(0, 600) });
  }

  const prev = flat[i - 1];
  const next = flat[i + 1];
  const sidebar = DOCS.map(([group, items]) => `<h4>${group}</h4>${items.map(([f, l]) => `<a href="${BASE}${urlFor(f)}"${f === file ? ' aria-current="page"' : ''}>${l}</a>`).join('')}`).join('');
  const tocHtml = toc.length ? `<h4>On this page</h4>${toc.map((t) => `<a class="d${t.depth}" href="#${t.id}">${esc(t.text)}</a>`).join('')}` : '';
  write(
    `${url}index.html`,
    layout({
      title,
      description: md.replace(/^#.*$/m, '').replace(/[#`*>|]/g, '').trim().split('\n').find((l) => l.length > 40)?.slice(0, 180),
      active: file.startsWith('docs/research') ? 'docs/research/' : 'docs/',
      body: `<div class="wrap docs">
  <nav class="sidebar" aria-label="Documentation">${sidebar}</nav>
  <article class="prose">${html}
    <div class="pager">${prev ? `<a href="${BASE}${urlFor(prev[0])}"><small>← Previous</small>${prev[1]}</a>` : '<span></span>'}${next ? `<a href="${BASE}${urlFor(next[0])}" style="text-align:right"><small>Next →</small>${next[1]}</a>` : ''}</div>
    <a class="edit" href="${REPO}/edit/main/${file}">✎ Edit this page on GitHub</a>
  </article>
  <aside class="toc" aria-label="On this page">${tocHtml}</aside>
</div>`,
    }),
  );
});
write('search-index.json', JSON.stringify(searchIndex));

// ---------------------------------------------------------------- 404, sitemap, robots
write('404.html', layout({ title: 'Not found', body: `<div class="wrap" style="padding:120px 0;text-align:center"><h1 style="font-size:64px;margin:0">🍅 404</h1><p class="muted">This page got squashed.</p><p><a class="btn primary" href="${BASE}">Home</a> <a class="btn" href="${BASE}docs/">Docs</a></p></div>` }));
const urls = ['', 'gallery/', 'playground/', 'examples/', 'examples/cdn/', ...flat.map(([f]) => urlFor(f))];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);

console.log(`✔ site-dist/ built: ${urls.length} pages, ${packages.length} packages, base "${BASE}"`);
