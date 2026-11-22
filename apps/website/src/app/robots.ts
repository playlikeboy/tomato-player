import type { MetadataRoute } from 'next';
import { BASE_PATH, absolute } from '@/lib/site';

export const dynamic = 'force-static';

// Search engines and AI assistants are welcome: the docs are meant to be read, quoted and cited.
// Named explicitly so a future blanket rule cannot shut them out by accident.
// Note: crawlers only read robots.txt at the domain root. On a GitHub Pages project site
// (playlikeboy.github.io/tomato-player/) this file takes effect once the site has its own domain.
const CRAWLERS = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Applebot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

// /_next/ stays crawlable: search engines render pages with its CSS and JS. Only the search index is excluded.
const DISALLOW = [`${BASE_PATH}/_pagefind/`];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: CRAWLERS, allow: `${BASE_PATH}/`, disallow: DISALLOW },
      { userAgent: '*', allow: `${BASE_PATH}/`, disallow: DISALLOW },
    ],
    sitemap: absolute('/sitemap.xml'),
  };
}
