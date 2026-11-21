#!/usr/bin/env node
// Validates every package's manifest so community skins/plugins stay consistent.
// Run: pnpm validate
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const KINDS = ['core', 'ui', 'bundle', 'skin', 'plugin', 'provider', 'integration'];
const roots = ['packages', 'packages/skins', 'packages/plugins', 'packages/providers', 'packages/integrations'];
const errors = [];
let count = 0;

for (const root of roots) {
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    const manifest = join(dir, 'package.json');
    if (!statSync(dir).isDirectory() || !existsSync(manifest)) continue;
    count++;
    const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
    const fail = (msg) => errors.push(`${pkg.name ?? dir}: ${msg}`);
    const kind = pkg.tomato?.kind;

    if (!/^(@tomato-player\/[a-z0-9-]+|tomato-player)$/.test(pkg.name ?? '')) fail('name must be "@tomato-player/<name>" (community packages: "tomato-player-<kind>-<name>")');
    if (!KINDS.includes(kind)) fail(`"tomato.kind" must be one of ${KINDS.join(', ')}`);
    if (!pkg.description || pkg.description.length < 20) fail('needs a meaningful "description" (20+ chars)');
    if (!pkg.license) fail('needs a "license" (SPDX id)');
    if (pkg.type !== 'module') fail('must set "type": "module"');
    if (!pkg.exports?.['.']?.types) fail('"exports[\'.\']" must include "types"');
    if (!pkg.files?.includes('dist')) fail('"files" must include "dist"');
    if (!pkg.repository?.directory) fail('"repository.directory" is required');
    if (!existsSync(join(dir, 'README.md'))) fail('missing README.md');
    if (pkg.dependencies?.['hls.js'] || pkg.dependencies?.dashjs) fail('streaming engines must be peerDependencies, never dependencies');

    if (kind === 'skin') {
      if (!existsSync(join(dir, 'src/style.css'))) fail('skins need src/style.css');
      if (!pkg.exports['./style.css']) fail('skins must export "./style.css"');
      if (!pkg.keywords?.includes('tomato-player-skin')) fail('skins need the "tomato-player-skin" keyword (used by the gallery)');
      const css = readFileSync(join(dir, 'src/style.css'), 'utf8');
      const skinName = pkg.name.split('skin-')[1];
      const unscoped = css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .split('}')
        .map((rule) => rule.split('{')[0].trim())
        .filter((sel) => sel && !sel.startsWith('@') && !sel.startsWith('from') && !sel.startsWith('to') && !/^\d/.test(sel))
        .filter((sel) => !sel.split(',').every((s) => s.includes(`[data-skin='${skinName}']`) || s.includes(`[data-skin="${skinName}"]`)));
      if (unscoped.length) fail(`every CSS selector must be scoped to [data-skin='${skinName}'] (found: ${unscoped.slice(0, 2).join(' | ')})`);
    }
    if (kind === 'plugin' && !pkg.keywords?.includes('tomato-player-plugin')) fail('plugins need the "tomato-player-plugin" keyword');
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} problem(s) in ${count} packages:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✔ ${count} packages valid`);
