import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { SkinDetail } from '@/components/pages/Skins';
import { fmtKb, sizeOf } from '@/lib/packages';
import { lastModified } from '@/lib/dates';
import { assetSize } from '@/lib/images';
import { SKIN_META } from '@/lib/meta';
import { breadcrumbs, packageLd, pageMeta } from '@/lib/seo';
import { SKINS, absolute } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => SKINS.map((s) => ({ slug: s.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skin = SKINS.find((s) => s.slug === slug)!;
  return pageMeta({
    ...SKIN_META[skin.slug],
    path: `/skins/${skin.slug}/`,
    keywords: [`${skin.name.toLowerCase()} video player skin`, ...skin.features.map((f) => f.toLowerCase())],
    image: { url: absolute(`/assets/skin-${skin.slug}.png`), ...assetSize(`skin-${skin.slug}.png`), alt: `${skin.name} skin for Tomato Player` },
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const skin = SKINS.find((s) => s.slug === slug);
  if (!skin) notFound();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            ['Skins', '/skins/'],
            [skin.name, `/skins/${skin.slug}/`],
          ]),
          packageLd(`@tomato-player/skin-${skin.slug}`, {
            description: skin.description,
            url: absolute(`/skins/${skin.slug}/`),
            image: absolute(`/assets/skin-${skin.slug}.png`),
            screenshot: absolute(`/assets/skin-${skin.slug}.png`),
            applicationSubCategory: 'Video player skin',
            featureList: skin.features,
            dateModified: lastModified(`packages/skins/${skin.slug}`).toISOString(),
          }),
        ]}
      />
      <SkinDetail slug={skin.slug} size={fmtKb(sizeOf(`@tomato-player/skin-${skin.slug}`))} />
    </>
  );
}
