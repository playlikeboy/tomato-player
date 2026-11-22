import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { DemoIndex } from '@/components/pages/Demos';
import { PAGE_META } from '@/lib/meta';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { DEMOS, absolute } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  ...PAGE_META.demos,
  path: '/demos/',
  keywords: ['video player demo', 'hls player demo', 'react video player example', 'web component video player'],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([['Demos', '/demos/']]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Tomato Player demos',
            itemListElement: DEMOS.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.title, url: absolute(`/demos/${d.slug}/`) })),
          },
        ]}
      />
      <DemoIndex />
    </>
  );
}
