import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SkinGallery } from '@/components/pages/Skins';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { SKINS, absolute } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Video player skins gallery',
  description: `Play all ${SKINS.length} Tomato Player skins live: Minimal, Cinema, Studio, Creator, Learn, Campus and three platform-inspired designs. Theme each one and copy the code.`,
  path: '/skins/',
  keywords: ['video player skins', 'video player themes', 'custom video controls'],
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
      <SkinGallery />
    </>
  );
}
