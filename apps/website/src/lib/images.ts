// Build-time image dimensions for Open Graph tags, read from the PNG header so they never go stale.
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), '../..');

/** Width and height of a screenshot in `.github/assets` (served at `/assets/<name>`). */
export function assetSize(name: string, fallback = { width: 1200, height: 630 }): { width: number; height: number } {
  const file = join(ROOT, '.github/assets', name);
  if (!existsSync(file)) return fallback;
  const head = readFileSync(file).subarray(0, 24);
  // PNG: 8-byte signature, then the IHDR chunk with big-endian width and height at bytes 16 and 20.
  if (head.length < 24 || head.readUInt32BE(12) !== 0x49484452) return fallback;
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}
