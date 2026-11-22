// Build-time docs loader: reads the repo's Markdown, maps files to routes and rewrites links.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { SITE } from './site';
import toc from './toc.json';
import { lastModified } from './dates';

const ROOT = resolve(process.cwd(), '../..');

export interface DocEntry {
  slug: string[];
  file: string;
  section: string;
  title?: string;
  /** Short title for <title>, kept under 45 characters. */
  metaTitle?: string;
  /** Answer-first summary for meta description and listings (120 to 160 characters). */
  summary?: string;
}

interface TocItem {
  slug: string;
  file: string;
  title?: string;
  metaTitle?: string;
  description?: string;
}

/** Ordered table of contents, shared with scripts/prepare.mjs (Markdown mirrors). */
const TOC: { section: string; items: TocItem[] }[] = toc.sections;

export const DOCS: DocEntry[] = TOC.flatMap(({ section, items }) =>
  items.map(({ slug, file, title, metaTitle, description }) => ({ slug: slug.split('/'), file, section, title, metaTitle, summary: description })),
);

export const DOC_SECTIONS = TOC.map(({ section, items }) => ({
  section,
  items: items.map(({ slug, file, title }) => ({ href: `/docs/${slug}/`, title: title ?? slug, file })),
}));

const byFile = new Map(DOCS.map((d) => [normalize(d.file), d]));

export function findDoc(slug: string[]): DocEntry | undefined {
  const key = slug.join('/');
  return DOCS.find((d) => d.slug.join('/') === key);
}

/** Resolve a link found in `fromFile` to a site route, a GitHub URL, or leave it alone. */
function rewriteLink(href: string, fromFile: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [path, hash = ''] = href.split('#');
  const target = normalize(relative(ROOT, resolve(ROOT, dirname(fromFile), path)));
  const candidates = [target, join(target, 'README.md')];
  for (const c of candidates) {
    const doc = byFile.get(c);
    if (doc) return `/docs/${doc.slug.join('/')}/${hash ? `#${hash}` : ''}`;
  }
  if (target === 'README.md') return '/';
  if (target.startsWith('.github/assets/')) return `${SITE.url}/assets/${target.slice('.github/assets/'.length)}`;
  if (target.startsWith('examples/playground')) return '/playground/';
  const kind = existsSync(join(ROOT, target)) && !/\.[a-z0-9]+$/i.test(target) ? 'tree' : 'blob';
  return `${SITE.repo}/${kind}/main/${target}${hash ? `#${hash}` : ''}`;
}

export interface LoadedDoc extends DocEntry {
  title: string;
  description: string;
  body: string;
  editUrl: string;
  words: number;
  /** Last change of the source file (git, else file mtime). */
  updated: Date;
  /** Site path of the raw Markdown mirror written by scripts/prepare.mjs. */
  markdown: string;
}

/** Site path of a doc's Markdown mirror, e.g. `/docs/guides/skins.md`. */
export const markdownPath = (entry: DocEntry) => `/docs/${entry.slug.join('/')}.md`;

/** Cut text at a word boundary so meta descriptions never end mid-word. */
export function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[\s,;:.\u2014-]+$/, '')}…`;
}

export function loadDoc(entry: DocEntry): LoadedDoc {
  const raw = readFileSync(join(ROOT, entry.file), 'utf8');
  const h1 = raw.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const title = entry.title ?? h1 ?? entry.slug.at(-1)!;
  // Drop the leading H1: the page renders its own header.
  let body = raw.replace(/^#\s+.+\n+/m, '');
  body = body.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (_m, bang, text, href, t = '') =>
    `${bang}[${text}](${rewriteLink(href, entry.file)}${t})`,
  );
  const plain = body
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 50 && !/^[#|>\-*!<]/.test(l));
  const description =
    entry.summary ??
    clip((plain ?? `${title} — Tomato Player documentation.`).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*_]/g, ''));
  return {
    ...entry,
    title,
    description,
    body,
    editUrl: `${SITE.repo}/edit/main/${entry.file}`,
    words: body.split(/\s+/).length,
    updated: lastModified(entry.file),
    markdown: markdownPath(entry),
  };
}

export function neighbours(entry: DocEntry) {
  const i = DOCS.indexOf(entry);
  const pick = (d?: DocEntry) => (d ? { href: `/docs/${d.slug.join('/')}/`, title: d.title ?? d.slug.join('/') } : undefined);
  return { prev: pick(DOCS[i - 1]), next: pick(DOCS[i + 1]) };
}

export function readRepoFile(file: string) {
  return readFileSync(join(ROOT, file), 'utf8');
}
