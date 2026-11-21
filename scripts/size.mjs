#!/usr/bin/env node
// Gzip size budgets. Fails CI when a package grows past its budget.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const budget = { core: 6, ui: 11, skin: 4.5, plugin: 1.5, provider: 1.2, integration: 1, bundle: 30 }; // KB gzip
const roots = ['packages', 'packages/skins', 'packages/plugins', 'packages/providers', 'packages/integrations'];
const rows = [];
let failed = false;

for (const root of roots) {
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    if (!existsSync(join(dir, 'package.json'))) continue;
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    const kind = pkg.tomato?.kind;
    const file = kind === 'bundle' ? join(dir, 'dist/tomato-player.global.js') : join(dir, 'dist/index.js');
    if (!existsSync(file)) continue;
    const kb = gzipSync(readFileSync(file), { level: 9 }).length / 1024;
    const limit = budget[kind];
    const over = limit !== undefined && kb > limit;
    failed ||= over;
    rows.push([pkg.name, kind === 'bundle' ? 'CDN (all-in)' : kind, kb.toFixed(2), limit?.toFixed(1) ?? '-', over ? '✖' : '✔']);
  }
}

const widths = [0, 1, 2, 3, 4].map((i) => Math.max(...rows.map((r) => r[i].length), 8));
const line = (r) => r.map((c, i) => c.padEnd(widths[i])).join('  ');
console.log(line(['package', 'kind', 'gzip KB', 'budget', '']));
for (const r of rows) console.log(line(r));
if (failed) {
  console.error('\nSize budget exceeded.');
  process.exit(1);
}
