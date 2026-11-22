import type { MetadataRoute } from 'next';
import { lastModified } from '@/lib/dates';
import { DOCS } from '@/lib/docs';
import { DEMOS, PLUGINS, SKINS, absolute } from '@/lib/site';

export const dynamic = 'force-static';

// Sources each route is built from, so lastModified reflects real content changes.
const SITE_SRC = ['apps/website/src/lib/site.ts', 'apps/website/src/lib/meta.ts'];
const page = (name: string) => `apps/website/src/components/pages/${name}.tsx`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, sources: string[], changeFrequency: 'weekly' | 'monthly' = 'weekly') => ({
    url: absolute(path),
    lastModified: lastModified(...sources),
    changeFrequency,
    priority,
  });
  const docPriority = (section: string, slug: string) =>
    section === 'Research' || section === 'Project' ? 0.4 : slug === 'getting-started' || slug === 'guides/custom-skins' ? 0.9 : 0.7;
  return [
    entry('/', 1, [page('Home'), ...SITE_SRC, 'README.md']),
    entry('/docs/', 0.8, [page('Doc'), 'apps/website/src/lib/toc.json']),
    entry('/skins/', 0.9, [page('Skins'), ...SITE_SRC, 'packages/skins']),
    entry('/plugins/', 0.8, [page('Plugins'), ...SITE_SRC, 'packages/plugins']),
    entry('/demos/', 0.7, [page('Demos'), ...SITE_SRC]),
    entry('/playground/', 0.7, [page('Playground'), ...SITE_SRC]),
    entry('/packages/', 0.5, [page('Packages'), 'packages']),
    ...DOCS.map((d) => entry(`/docs/${d.slug.join('/')}/`, docPriority(d.section, d.slug.join('/')), [d.file], 'monthly')),
    ...SKINS.map((s) => ({
      ...entry(`/skins/${s.slug}/`, 0.8, [page('Skins'), ...SITE_SRC, `packages/skins/${s.slug}`]),
      images: [absolute(`/assets/skin-${s.slug}.png`)],
    })),
    ...PLUGINS.map((p) => entry(`/plugins/${p.slug}/`, 0.6, [page('Plugins'), ...SITE_SRC, `packages/plugins/${p.slug}`])),
    ...DEMOS.map((d) => entry(`/demos/${d.slug}/`, 0.5, [page('Demos'), ...SITE_SRC])),
    entry('/examples/cdn/', 0.3, ['examples/cdn'], 'monthly'),
  ];
}
