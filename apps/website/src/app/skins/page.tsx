import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SkinGallery } from '@/components/pages/Skins';
import { assetSize } from '@/lib/images';
import { PAGE_META } from '@/lib/meta';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { fmtKb, sizeOf } from '@/lib/packages';
import { SKINS, absolute } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  ...PAGE_META.skins,
  path: '/skins/',
  keywords: ['video player skins', 'video player themes', 'custom video controls'],
  image: { url: absolute('/assets/skins.png'), ...assetSize('skins.png'), alt: 'All Tomato Player skins' },
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([['Skins', '/skins/']]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Tomato Player skins',
            itemListElement: SKINS.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: `${s.name} skin`, url: absolute(`/skins/${s.slug}/`) })),
          },
        ]}
      />
      <SkinGallery sizes={Object.fromEntries(SKINS.map((s) => [s.slug, fmtKb(sizeOf(`@tomato-player/skin-${s.slug}`))]))} />
    </>
  );
}
