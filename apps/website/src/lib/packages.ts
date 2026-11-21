// Build-time package catalog with real gzip sizes, read from the monorepo.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(process.cwd(), '../..');

export interface PackageInfo {
  name: string;
  kind: string;
  description: string;
  version: string;
  dir: string;
  gzipKb: number | null;
}

const KIND_ORDER = ['core', 'ui', 'bundle', 'skin', 'plugin', 'provider', 'integration'];

function gz(file: string) {
  return existsSync(file) ? gzipSync(readFileSync(file), { level: 9 }).length / 1024 : null;
}

let cache: PackageInfo[] | undefined;
export function packages(): PackageInfo[] {
  if (cache) return cache;
  const dirs = ['packages'];
  const found: string[] = [];
  while (dirs.length) {
    const dir = dirs.pop()!;
    if (existsSync(join(ROOT, dir, 'package.json'))) found.push(dir);
    else
      for (const d of readdirSync(join(ROOT, dir), { withFileTypes: true }))
        if (d.isDirectory() && !['node_modules', 'dist', 'src', 'test'].includes(d.name)) dirs.push(join(dir, d.name));
  }
  cache = found
    .map((dir) => {
      const pkg = JSON.parse(readFileSync(join(ROOT, dir, 'package.json'), 'utf8'));
      const kind = pkg.tomato?.kind ?? 'other';
      const entry = kind === 'bundle' ? 'dist/tomato-player.global.js' : 'dist/index.js';
      return { name: pkg.name, kind, description: pkg.description ?? '', version: pkg.version, dir, gzipKb: gz(join(ROOT, dir, entry)) };
    })
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.name.localeCompare(b.name));
  return cache;
}

export const sizeOf = (name: string) => packages().find((p) => p.name === name)?.gzipKb ?? null;
export const fmtKb = (kb: number | null) => (kb == null ? '—' : `${kb.toFixed(kb < 10 ? 1 : 0)} KB`);
