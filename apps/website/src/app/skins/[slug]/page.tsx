import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { SkinDetail } from '@/components/pages/Skins';
import { fmtKb, sizeOf } from '@/lib/packages';
import { breadcrumbs, pageMeta, softwareLd } from '@/lib/seo';
import { SKINS, absolute } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => SKINS.map((s) => ({ slug: s.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skin = SKINS.find((s) => s.slug === slug)!;
  return pageMeta({
    title: `${skin.name} skin — ${skin.summary.replace(/\.$/, '')}`,
    description: `${skin.description.slice(0, 150)}`,
    path: `/skins/${skin.slug}/`,
    keywords: [`${skin.name.toLowerCase()} video player skin`, ...skin.features.map((f) => f.toLowerCase())],
    image: absolute(`/assets/skin-${skin.slug}.png`),
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
          softwareLd({
            name: `@tomato-player/skin-${skin.slug}`,
            description: skin.description,
            url: absolute(`/skins/${skin.slug}/`),
            image: absolute(`/assets/skin-${skin.slug}.png`),
          }),
        ]}
      />
      <SkinDetail slug={skin.slug} size={fmtKb(sizeOf(`@tomato-player/skin-${skin.slug}`))} />
    </>
  );
}
