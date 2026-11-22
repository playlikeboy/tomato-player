// Build-time "last modified" dates for sitemap entries and structured data.
// Uses the last git commit that touched the files; falls back to file mtime, then to build time.
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), '../..');
const BUILD_TIME = new Date();
const cache = new Map<string, Date>();

function one(file: string): Date | undefined {
  if (cache.has(file)) return cache.get(file);
  let date: Date | undefined;
  try {
    const git = (args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    // Uncommitted edits (local builds) are newer than any commit: use the file's mtime for those.
    const dirty = git(['status', '--porcelain', '--', file]) !== '';
    const out = dirty ? '' : git(['log', '-1', '--format=%cI', '--', file]);
    if (out) date = new Date(out);
  } catch {
    // git missing or not a repository: fall through to mtime.
  }
  if (!date || Number.isNaN(date.getTime())) {
    const abs = join(ROOT, file);
    date = existsSync(abs) ? statSync(abs).mtime : undefined;
  }
  if (date) cache.set(file, date);
  return date;
}

/** Most recent change among `files` (paths relative to the repo root, files or directories). */
export function lastModified(...files: string[]): Date {
  const dates = files.map(one).filter((d): d is Date => !!d);
  return dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : BUILD_TIME;
}

/** Date the file was first committed (follows renames), or undefined outside git. */
export function firstAdded(file: string): Date | undefined {
  try {
    const out = execFileSync('git', ['log', '--follow', '--diff-filter=A', '--format=%cI', '--', file], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .trim()
      .split('\n')
      .pop();
    const date = out ? new Date(out) : undefined;
    return date && !Number.isNaN(date.getTime()) ? date : undefined;
  } catch {
    return undefined;
  }
}

export const buildTime = () => BUILD_TIME;
