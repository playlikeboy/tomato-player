// Markdown mirrors of every docs page, for AI assistants and other agents.
// Each doc in src/lib/toc.json is written to <out>/docs/<slug>.md with links made absolute,
// and an index of all of them is appended to llms.txt.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';

const REPO = 'https://github.com/playlikeboy/tomato-player';

export function loadToc(app) {
  return JSON.parse(readFileSync(join(app, 'src/lib/toc.json'), 'utf8')).sections;
}

/** Rewrite a Markdown link target found in `fromFile` to an absolute URL. */
function rewrite(href, fromFile, { root, site, byFile }) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [path, hash = ''] = href.split('#');
  const anchor = hash ? `#${hash}` : '';
  const target = normalize(relative(root, resolve(root, dirname(fromFile), path)));
  for (const c of [target, join(target, 'README.md')]) {
    const slug = byFile.get(c);
    if (slug) return `${site}/docs/${slug}.md${anchor}`;
  }
  if (target === 'README.md') return `${site}/`;
  if (target.startsWith('.github/assets/')) return `${site}/assets/${target.slice('.github/assets/'.length)}`;
  if (target.startsWith('examples/playground')) return `${site}/playground/`;
  const kind = existsSync(join(root, target)) && !/\.[a-z0-9]+$/i.test(target) ? 'tree' : 'blob';
  return `${REPO}/${kind}/main/${target}${anchor}`;
}

/**
 * Write the mirrors. Returns the list of written docs for llms.txt.
 * @param {{ root: string, app: string, out: string, site: string }} opts
 */
export function writeMarkdownMirrors({ root, app, out, site }) {
  const sections = loadToc(app);
  const byFile = new Map(sections.flatMap((s) => s.items.map((i) => [normalize(i.file), i.slug])));
  const written = [];
  for (const { section, items } of sections) {
    for (const item of items) {
      const src = join(root, item.file);
      if (!existsSync(src)) {
        console.warn(`[prepare] missing ${item.file}`);
        continue;
      }
      const raw = readFileSync(src, 'utf8');
      const body = raw.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (_m, bang, text, href, t = '') => `${bang}[${text}](${rewrite(href, item.file, { root, site, byFile })}${t})`);
      const header = `<!-- Tomato Player documentation. Web page: ${site}/docs/${item.slug}/ · Source: ${REPO}/blob/main/${item.file} · License: MIT -->\n\n`;
      const file = join(out, 'docs', `${item.slug}.md`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, header + body);
      written.push({ section, ...item, url: `${site}/docs/${item.slug}.md` });
    }
  }
  return written;
}

/** llms.txt section listing every Markdown mirror, grouped like the docs sidebar. */
export function llmsIndex(written) {
  const lines = ['', '## All docs as Markdown', '', 'Every page of the documentation as plain Markdown, generated at build time:', ''];
  let section = '';
  for (const d of written) {
    if (d.section !== section) {
      section = d.section;
      lines.push(`### ${section}`, '');
    }
    lines.push(`- [${d.title}](${d.url}): ${d.description}`);
    if (written[written.indexOf(d) + 1]?.section !== section) lines.push('');
  }
  return lines.join('\n');
}
