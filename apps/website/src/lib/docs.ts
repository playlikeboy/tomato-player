// Build-time docs loader: reads the repo's Markdown, maps files to routes and rewrites links.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { SITE } from './site';

const ROOT = resolve(process.cwd(), '../..');

export interface DocEntry {
  slug: string[];
  file: string;
  section: string;
  title?: string;
}

/** Ordered table of contents. `file` is relative to the repo root. */
const TOC: { section: string; items: [string, string, string?][] }[] = [
  {
    section: 'Start here',
    items: [
      ['getting-started', 'docs/getting-started.md', 'Getting started'],
      ['concepts/architecture', 'docs/concepts/architecture.md', 'Architecture'],
      ['troubleshooting', 'docs/troubleshooting.md', 'Troubleshooting'],
      ['migration', 'docs/migration/README.md', 'Migration'],
    ],
  },
  {
    section: 'Guides',
    items: [
      ['guides/skins', 'docs/guides/skins.md', 'Skins'],
      ['guides/plugins', 'docs/guides/plugins.md', 'Plugins'],
      ['guides/streaming', 'docs/guides/streaming.md', 'Streaming (HLS & DASH)'],
      ['guides/frameworks', 'docs/guides/frameworks.md', 'React, Vue & Svelte'],
      ['guides/accessibility', 'docs/guides/accessibility.md', 'Accessibility'],
    ],
  },
  {
    section: 'Extend',
    items: [
      ['guides/create-a-skin', 'docs/guides/create-a-skin.md', 'Create a skin'],
      ['guides/create-a-plugin', 'docs/guides/create-a-plugin.md', 'Create a plugin'],
      ['guides/create-a-provider', 'docs/guides/create-a-provider.md', 'Create a provider'],
    ],
  },
  {
    section: 'API reference',
    items: [
      ['api/player', 'docs/api/player.md', 'Player API'],
      ['api/ui', 'docs/api/ui.md', 'UI primitives'],
    ],
  },
  {
    section: 'Project',
    items: [
      ['roadmap', 'docs/roadmap.md', 'Roadmap'],
      ['changelog', 'CHANGELOG.md', 'Changelog'],
      ['contributing', 'CONTRIBUTING.md', 'Contributing'],
      ['security', 'SECURITY.md', 'Security'],
      ['code-of-conduct', 'CODE_OF_CONDUCT.md', 'Code of conduct'],
    ],
  },
  {
    section: 'Research',
    items: [
      ['research', 'docs/research/README.md', 'Overview'],
      ['research/landscape', 'docs/research/landscape.md', 'Player landscape'],
      ['research/developer-pain-points', 'docs/research/developer-pain-points.md', 'Developer pain points'],
      ['research/opportunities', 'docs/research/opportunities.md', 'Opportunities'],
      ['research/integration-strategy', 'docs/research/integration-strategy.md', 'Integration strategy'],
    ],
  },
];

export const DOCS: DocEntry[] = TOC.flatMap(({ section, items }) =>
  items.map(([slug, file, title]) => ({ slug: slug.split('/'), file, section, title })),
);

export const DOC_SECTIONS = TOC.map(({ section, items }) => ({
  section,
  items: items.map(([slug, file, title]) => ({ href: `/docs/${slug}/`, title: title ?? slug, file })),
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
  const description = (plain ?? `${title} — Tomato Player documentation.`)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_]/g, '')
    .slice(0, 158);
  return {
    ...entry,
    title,
    description,
    body,
    editUrl: `${SITE.repo}/edit/main/${entry.file}`,
    words: body.split(/\s+/).length,
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
