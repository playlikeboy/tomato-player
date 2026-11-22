import type { Metadata } from 'next';
import { Home } from '@/components/pages/Home';
import { JsonLd } from '@/components/JsonLd';
import { fmtKb, packages, sizeOf } from '@/lib/packages';
import { PAGE_META } from '@/lib/meta';
import { pageMeta, softwareLd } from '@/lib/seo';
import { FAQ, SITE, SKINS, absolute } from '@/lib/site';

// Capabilities stated in PRODUCT.md and the docs, for structured data.
const FEATURES = [
  'Core under 6 KB gzip with no dependencies',
  '9 swappable skins, switchable at runtime',
  'Theming with --tp-* CSS design tokens',
  'HLS (hls.js, native on Safari) and MPEG-DASH (dash.js), lazy-loaded',
  'WebVTT captions, chapters and seek thumbnails',
  'Playlists, analytics events, hotkeys, gestures, Media Session, persisted settings',
  'React, Vue and Svelte bindings, <tomato-player> web component and CDN build',
  'SSR-safe, accessible controls targeting WCAG 2.2 AA',
];

export const metadata: Metadata = {
  ...pageMeta({
    title: 'Open-source web video player with skins',
    description: PAGE_META.home.description,
    path: '/',
  }),
  title: { absolute: PAGE_META.home.title },
};

export default function Page() {
  const stats = {
    core: fmtKb(sizeOf('@tomato-player/core')),
    cdn: fmtKb(sizeOf('tomato-player')),
    packages: packages().length,
    skins: Object.fromEntries(SKINS.map((s) => [s.slug, fmtKb(sizeOf(`@tomato-player/skin-${s.slug}`))])),
  };
  return (
    <>
      <JsonLd
        data={[
          softwareLd({ keywords: SITE.keywords.join(', '), featureList: FEATURES, screenshot: absolute('/assets/skins.png') }),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]}
      />
      <Home stats={stats} />
    </>
  );
}
