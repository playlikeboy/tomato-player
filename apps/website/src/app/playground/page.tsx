import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { Playground } from '@/components/pages/Playground';
import { assetSize } from '@/lib/images';
import { PAGE_META } from '@/lib/meta';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { absolute } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  ...PAGE_META.playground,
  path: '/playground/',
  keywords: ['video player playground', 'video player generator', 'video player configurator'],
  image: { url: absolute('/assets/playground.png'), ...assetSize('playground.png'), alt: 'Tomato Player playground' },
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs([['Playground', '/playground/']])} />
      <Playground />
    </>
  );
}
