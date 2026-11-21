import type { MetadataRoute } from 'next';
import { absolute } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/_next/', '/_pagefind/'] }],
    sitemap: absolute('/sitemap.xml'),
  };
}
