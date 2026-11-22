// Copies repo-level assets the website serves as static files:
// caption/chapter tracks, README screenshots, llms.txt, Markdown mirrors of the docs, the no-build CDN example and the CDN bundle.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { llmsIndex, writeMarkdownMirrors } from './markdown-mirrors.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const app = resolve(here, '..');
const root = resolve(app, '../..');
const pub = join(app, 'public');

const copy = (from, to) => {
  const src = join(root, from);
  if (!existsSync(src)) return console.warn(`[prepare] missing ${from}`);
  mkdirSync(dirname(join(pub, to)), { recursive: true });
  cpSync(src, join(pub, to), { recursive: true });
};

for (const dir of ['assets', 'media', 'lib', 'examples', 'docs']) rmSync(join(pub, dir), { recursive: true, force: true });

copy('examples/assets', 'media');
copy('.github/assets', 'assets');
copy('docs/llms-full.txt', 'llms-full.txt');
copy('packages/tomato-player/dist', 'lib/tomato-player');

// The CDN example loads the bundle from jsDelivr once published; on the site it uses the local copy.
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const cdn = readFileSync(join(root, 'examples/cdn/index.html'), 'utf8')
  .replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/playlikeboy\/tomato-player@cdn\//g, `${base}/lib/tomato-player/`)
  .replace(/\.\.\/assets\//g, `${base}/media/`);
mkdirSync(join(pub, 'examples/cdn'), { recursive: true });
writeFileSync(join(pub, 'examples/cdn/index.html'), cdn);

// Markdown mirror of every docs page (/docs/<slug>.md), linked from each page with rel="alternate",
// and llms.txt with an index of those mirrors appended.
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://playlikeboy.github.io/tomato-player').replace(/\/$/, '');
const mirrors = writeMarkdownMirrors({ root, app, out: pub, site });
writeFileSync(join(pub, 'llms.txt'), `${readFileSync(join(root, 'llms.txt'), 'utf8').trimEnd()}\n${llmsIndex(mirrors)}`);

console.log(`[prepare] static assets ready (${mirrors.length} Markdown docs)`);
