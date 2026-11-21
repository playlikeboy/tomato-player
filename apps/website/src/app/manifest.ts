import type { MetadataRoute } from 'next';
import { BASE_PATH, SITE, asset } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: 'Tomato',
    description: SITE.description,
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: 'standalone',
    background_color: '#1c1917',
    theme_color: '#d12f1f',
    icons: [{ src: asset('/assets/logo.svg'), sizes: 'any', type: 'image/svg+xml' }],
  };
}
