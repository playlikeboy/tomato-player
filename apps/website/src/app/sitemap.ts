import type { MetadataRoute } from 'next';
import { DOCS } from '@/lib/docs';
import { DEMOS, PLUGINS, SKINS, absolute } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'weekly') => ({
    url: absolute(path),
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    entry('/', 1),
    entry('/docs/', 0.9),
    entry('/skins/', 0.9),
    entry('/plugins/', 0.8),
    entry('/demos/', 0.8),
    entry('/playground/', 0.8),
    entry('/packages/', 0.6),
    ...DOCS.map((d) => entry(`/docs/${d.slug.join('/')}/`, d.section === 'Research' ? 0.4 : 0.7, 'monthly')),
    ...SKINS.map((s) => ({ ...entry(`/skins/${s.slug}/`, 0.7), images: [absolute(`/assets/skin-${s.slug}.png`)] })),
    ...PLUGINS.map((p) => entry(`/plugins/${p.slug}/`, 0.6)),
    ...DEMOS.map((d) => entry(`/demos/${d.slug}/`, 0.6)),
    entry('/examples/cdn/', 0.3, 'monthly'),
  ];
}
