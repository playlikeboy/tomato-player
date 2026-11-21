import type { Metadata } from 'next';
import { Home } from '@/components/pages/Home';
import { JsonLd } from '@/components/JsonLd';
import { fmtKb, packages, sizeOf } from '@/lib/packages';
import { pageMeta, softwareLd } from '@/lib/seo';
import { FAQ, SITE } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMeta({
    title: `${SITE.name} — open-source HTML5 video player for React, Vue, Svelte & the web`,
    description: SITE.description,
    path: '/',
  }),
  title: { absolute: `${SITE.name} — Open-source HTML5 video player with skins, HLS & DASH` },
};

export default function Page() {
  const stats = {
    core: fmtKb(sizeOf('@tomato-player/core')),
    cdn: fmtKb(sizeOf('tomato-player')),
    packages: packages().length,
  };
  return (
    <>
      <JsonLd
        data={[
          softwareLd({ keywords: SITE.keywords.join(', '), version: '0.1.0' }),
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
