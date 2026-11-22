import type { Metadata } from 'next';
import { packages } from './packages';
import { SITE, absolute } from './site';

interface PageMeta {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article';
  /** Absolute URL of a page-specific social image, with its pixel size. */
  image?: { url: string; width: number; height: number; alt?: string };
  /** Site path of a Markdown version of this page, advertised as `<link rel="alternate" type="text/markdown">`. */
  markdown?: string;
  /** Last change, for `article:modified_time`. */
  modified?: Date;
}

/** Current release, read from the core package at build time. */
export const VERSION = packages().find((p) => p.name === '@tomato-player/core')?.version ?? '0.1.0';

/** Per-page metadata: canonical URL, machine-readable alternates, Open Graph and Twitter cards. */
export function pageMeta({ title, description, path, keywords = [], type = 'website', image, markdown, modified }: PageMeta): Metadata {
  const url = absolute(path);
  const alt = image?.alt ?? `${SITE.name}: ${title}`;
  const images = [image ? { url: image.url, width: image.width, height: image.height, alt } : { url: absolute('/og.png'), width: 1200, height: 630, alt }];
  const types: Record<string, string> = { 'text/plain': absolute('/llms.txt') };
  if (markdown) types['text/markdown'] = absolute(markdown);
  return {
    title,
    description,
    keywords: [...keywords, ...SITE.keywords.slice(0, 6)],
    alternates: { canonical: url, types },
    openGraph: {
      type,
      url,
      title: `${title} · ${SITE.name}`,
      description,
      siteName: SITE.name,
      images,
      locale: 'en_US',
      ...(type === 'article' && modified ? { modifiedTime: modified.toISOString(), authors: [SITE.author.url] } : {}),
    },
    twitter: { card: 'summary_large_image', title: `${title} · ${SITE.name}`, description, images: images.map((i) => i.url) },
  };
}

/** The maintainer, referenced by id from every other node. */
export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE.author.url}#person`,
  name: SITE.author.name,
  url: SITE.author.url,
  sameAs: [SITE.author.url],
};

export const SOFTWARE_ID = `${absolute('/')}#software`;
export const WEBSITE_ID = `${absolute('/')}#website`;

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

/**
 * Tomato Player (or one of its packages) as both an application and its source code.
 * Facts only: free, MIT, runs in any browser, source on GitHub. No ratings or download counts exist.
 */
export const softwareLd = (extra: Record<string, unknown> = {}) => ({
  '@context': 'https://schema.org',
  '@type': ['SoftwareApplication', 'SoftwareSourceCode'],
  '@id': SOFTWARE_ID,
  name: SITE.name,
  alternateName: 'tomato-player',
  description: SITE.description,
  url: absolute('/'),
  image: absolute('/og.png'),
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Web video player',
  operatingSystem: 'Any (web browser)',
  softwareVersion: VERSION,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  isAccessibleForFree: true,
  codeRepository: SITE.repo,
  programmingLanguage: ['TypeScript', 'JavaScript', 'CSS'],
  runtimePlatform: 'Web browser',
  license: 'https://opensource.org/licenses/MIT',
  author: PERSON,
  publisher: PERSON,
  ...extra,
});

/** A package of the ecosystem (skin, plugin): its own node, part of the main software. */
export const packageLd = (pkg: string, extra: Record<string, unknown>) =>
  softwareLd({
    '@id': `${absolute('/')}#${pkg.replace(/[^a-z0-9]+/gi, '-')}`,
    name: pkg,
    alternateName: undefined,
    isPartOf: { '@type': 'SoftwareApplication', '@id': SOFTWARE_ID, name: SITE.name, url: absolute('/') },
    ...extra,
  });

/** Documentation page as a TechArticle with real modification dates. */
export const articleLd = (a: { title: string; description: string; path: string; section: string; words: number; modified: Date; published?: Date; markdown?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: a.title,
  description: a.description,
  url: absolute(a.path),
  mainEntityOfPage: absolute(a.path),
  wordCount: a.words,
  articleSection: a.section,
  inLanguage: 'en',
  dateModified: a.modified.toISOString(),
  ...(a.published ? { datePublished: a.published.toISOString() } : {}),
  ...(a.markdown ? { encoding: { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: absolute(a.markdown) } } : {}),
  isPartOf: { '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE.name, url: absolute('/') },
  author: PERSON,
  publisher: PERSON,
  about: { '@type': 'SoftwareApplication', '@id': SOFTWARE_ID, name: SITE.name, url: absolute('/') },
});
