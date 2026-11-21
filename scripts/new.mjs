#!/usr/bin/env node
// Scaffold a new extension:  pnpm new skin aurora "Northern-lights inspired skin"
//                            pnpm new plugin sleep-timer "Stop playback after N minutes"
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const [kind, name, ...desc] = process.argv.slice(2);
if (!['skin', 'plugin'].includes(kind) || !/^[a-z][a-z0-9-]*$/.test(name ?? '')) {
  console.error('Usage: pnpm new <skin|plugin> <kebab-name> "<description>"');
  process.exit(1);
}
const description = desc.join(' ') || `A ${kind} for Tomato Player.`;
const dir = join('packages', `${kind}s`, name);
if (existsSync(dir)) {
  console.error(`${dir} already exists`);
  process.exit(1);
}
const camel = name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const pascal = camel[0].toUpperCase() + camel.slice(1);

execFileSync('node', ['scripts/pkg.mjs', dir, `@tomato-player/${kind}-${name}`, kind, description, ...(kind === 'skin' ? ['--css'] : [])], { stdio: 'inherit' });
cpSync(join('templates', kind), dir, { recursive: true });

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const file of walk(dir)) {
  if (file.endsWith('package.json')) continue;
  const text = readFileSync(file, 'utf8');
  writeFileSync(file, text.replaceAll('__name__', name).replaceAll('__camel__', camel).replaceAll('__Pascal__', pascal).replaceAll('__DESCRIPTION__', description));
}
writeFileSync(
  join(dir, 'README.md'),
  `# @tomato-player/${kind}-${name}\n\n${description}\n\n## Install\n\n\`\`\`sh\nnpm i @tomato-player/core @tomato-player/${kind}-${name}\n\`\`\`\n\n## Usage\n\n\`\`\`ts\nimport { ${camel} } from '@tomato-player/${kind}-${name}';\n\ncreatePlayer('#player', { src: 'movie.mp4', ${kind === 'skin' ? `skin: ${camel}()` : `plugins: [${camel}()]`} });\n\`\`\`\n`,
);
console.log(`\n✔ Created ${dir}\n\nNext:\n  pnpm install\n  pnpm --filter @tomato-player/${kind}-${name} build\n  pnpm validate && pnpm test\n  pnpm playground   # try it live\n`);
