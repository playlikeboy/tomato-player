// Internal helper: writes package.json + tsconfig for an extension package.
// Usage: node scripts/pkg.mjs <dir> <name> <kind> "<description>" [--css]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const [dir, name, kind, description, flag] = process.argv.slice(2);
const css = flag === '--css';
const root = relative(dir, '.') || '.';
mkdirSync(join(dir, 'src'), { recursive: true });
const build = `tsup src/index.ts --format esm,cjs --dts --clean --minify${css ? ' --loader .css=text && cp src/style.css dist/style.css' : ''}`;
const pkg = {
  name,
  version: '0.1.0',
  description,
  license: 'MIT',
  type: 'module',
  sideEffects: css ? ['*.css'] : false,
  main: './dist/index.cjs',
  module: './dist/index.js',
  types: './dist/index.d.ts',
  exports: {
    '.': { types: './dist/index.d.ts', import: './dist/index.js', require: './dist/index.cjs' },
    ...(css ? { './style.css': './dist/style.css' } : {}),
  },
  files: ['dist'],
  scripts: { build, typecheck: 'tsc --noEmit -p .' },
  dependencies: { '@tomato-player/core': 'workspace:*', ...(kind === 'skin' ? { '@tomato-player/ui': 'workspace:*' } : {}) },
  keywords: ['tomato-player', `tomato-player-${kind}`, 'video', 'player'],
  repository: { type: 'git', url: 'https://github.com/playlikeboy/tomato-player', directory: dir },
  tomato: { kind },
};
writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({ extends: `${root}/tsconfig.base.json`, include: ['src', `${root}/types`] }, null, 2) + '\n');
