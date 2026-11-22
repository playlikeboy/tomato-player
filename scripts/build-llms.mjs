#!/usr/bin/env node
// Concatenate docs into docs/llms-full.txt for AI assistants. Run: pnpm docs:llms
import { readFileSync, writeFileSync } from 'node:fs';

const files = [
  'docs/getting-started.md',
  'docs/concepts/architecture.md',
  'docs/api/player.md',
  'docs/api/ui.md',
  'docs/guides/skins.md',
  'docs/guides/plugins.md',
  'docs/guides/streaming.md',
  'docs/guides/frameworks.md',
  'docs/guides/accessibility.md',
  'docs/guides/custom-skins.md',
  'docs/guides/create-a-skin.md',
  'docs/guides/create-a-plugin.md',
  'docs/guides/create-a-provider.md',
  'docs/troubleshooting.md',
  'docs/migration/README.md',
];
const out = ['# Tomato Player: full documentation', '', readFileSync('llms.txt', 'utf8').split('\n## Docs')[0].split('\n').slice(2).join('\n').trim(), ''];
for (const f of files) out.push(`\n<!-- source: ${f} -->\n`, readFileSync(f, 'utf8').trim(), '');
writeFileSync('docs/llms-full.txt', out.join('\n'));
console.log(`docs/llms-full.txt: ${files.length} files, ${(out.join('\n').length / 1024).toFixed(1)} KB`);
