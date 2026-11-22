#!/usr/bin/env node
// Assembles the built packages into cdn-dist/, the tree published on the `cdn` branch
// and served by jsDelivr from GitHub (https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/...).
// Run after `pnpm build`.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const out = join(root, 'cdn-dist');
const CDN = 'https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn';

function packageDirs(dir = 'packages', found = []) {
  if (existsSync(join(root, dir, 'package.json'))) return found.push(dir), found;
  for (const d of readdirSync(join(root, dir)))
    if (!['node_modules', 'dist', 'src', 'test'].includes(d) && statSync(join(root, dir, d)).isDirectory()) packageDirs(join(dir, d), found);
  return found;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const version = JSON.parse(readFileSync(join(root, 'packages/core/package.json'), 'utf8')).version;
const imports = {};
const listed = [];
for (const dir of packageDirs()) {
  const pkg = JSON.parse(readFileSync(join(root, dir, 'package.json'), 'utf8'));
  const dist = join(root, dir, 'dist');
  if (!existsSync(dist)) throw new Error(`${pkg.name} is not built: run pnpm build first`);
  // React, Vue and Svelte bindings need a bundler and their framework; they are npm-only.
  if (pkg.tomato?.kind === 'integration') continue;
  const short = pkg.name.replace('@tomato-player/', '');
  const target = join(out, 'esm', short);
  mkdirSync(target, { recursive: true });
  for (const f of readdirSync(dist)) if (/\.(js|css)$/.test(f) && !f.endsWith('.global.js')) cpSync(join(dist, f), join(target, f));
  imports[pkg.name] = `${CDN}/esm/${short}/index.js`;
  listed.push(`${pkg.name}  ->  esm/${short}/index.js`);
  if (pkg.name === 'tomato-player') {
    imports['tomato-player/element'] = `${CDN}/esm/${short}/element.js`;
    cpSync(join(dist, 'tomato-player.global.js'), join(out, 'tomato-player.global.js'));
  }
}
imports['hls.js'] = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.mjs';
imports['dashjs'] = 'https://cdn.jsdelivr.net/npm/dashjs@4/+esm';

writeFileSync(join(out, 'importmap.json'), JSON.stringify({ imports }, null, 2) + '\n');
cpSync(join(root, 'LICENSE'), join(out, 'LICENSE'));
writeFileSync(
  join(out, 'README.md'),
  `# Tomato Player CDN build (v${version})

Generated from \`main\` by \`.github/workflows/cdn.yml\`. Do not edit this branch by hand.

All-in-one script (every skin and plugin, plus \`<tomato-player>\`):

    <script src="${CDN}/tomato-player.global.js"></script>

ES modules: copy \`importmap.json\` into a \`<script type="importmap">\`, then import packages by name.

${listed.map((l) => `- ${l}`).join('\n')}

Docs: https://playlikeboy.github.io/tomato-player/docs/guides/cdn/
`,
);
console.log(`[cdn-dist] ${listed.length} packages -> ${relative(root, out)}/ (v${version})`);
