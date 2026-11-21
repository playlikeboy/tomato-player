// Prepend the React Server Components "use client" directive to built files (bundlers strip it).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
for (const file of readdirSync(dir)) {
  if (!/\.(c?js)$/.test(file)) continue;
  const path = join(dir, file);
  const code = readFileSync(path, 'utf8');
  if (!code.startsWith('"use client"')) writeFileSync(path, `"use client";\n${code}`);
}
