import type { Metadata } from 'next';
import { SITE, absolute } from './site';

interface PageMeta {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article';
  image?: string;
}

/** Per-page metadata: canonical URL, Open Graph and Twitter cards. */
export function pageMeta({ title, description, path, keywords = [], type = 'website', image }: PageMeta): Metadata {
  const url = absolute(path);
  const images = [image ? { url: image, alt: `${SITE.name} — ${title}` } : { url: absolute('/og.png'), width: 1200, height: 630, alt: `${SITE.name} — ${title}` }];
  return {
    title,
    description,
    keywords: [...keywords, ...SITE.keywords.slice(0, 6)],
    alternates: { canonical: url },
    openGraph: { type, url, title: `${title} · ${SITE.name}`, description, siteName: SITE.name, images, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title: `${title} · ${SITE.name}`, description, images: images.map((i) => i.url) },
  };
}

export const breadcrumbs = (trail: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as [string, string], ...trail].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: absolute(path),
  })),
});

export const softwareLd = (extra: Record<string, unknown> = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: SITE.name,
  description: SITE.description,
  url: absolute('/'),
  codeRepository: SITE.repo,
  programmingLanguage: ['TypeScript', 'JavaScript'],
  runtimePlatform: 'Web browser',
  license: 'https://opensource.org/licenses/MIT',
  author: { '@type': 'Person', name: SITE.author.name, url: SITE.author.url },
  ...extra,
});
