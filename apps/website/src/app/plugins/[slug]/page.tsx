import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { PluginDetail } from '@/components/pages/Plugins';
import { fmtKb, sizeOf } from '@/lib/packages';
import { breadcrumbs, pageMeta, softwareLd } from '@/lib/seo';
import { PLUGINS, absolute } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => PLUGINS.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PLUGINS.find((x) => x.slug === slug)!;
  return pageMeta({
    title: `${p.name} plugin — ${p.summary.replace(/\.$/, '')}`,
    description: p.description.slice(0, 158),
    path: `/plugins/${p.slug}/`,
    keywords: [`video player ${p.name.toLowerCase()}`, `${p.name.toLowerCase()} plugin`],
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const p = PLUGINS.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            ['Plugins', '/plugins/'],
            [p.name, `/plugins/${p.slug}/`],
          ]),
          softwareLd({ name: `@tomato-player/plugin-${p.slug}`, description: p.description, url: absolute(`/plugins/${p.slug}/`) }),
        ]}
      />
      <PluginDetail slug={p.slug} size={fmtKb(sizeOf(`@tomato-player/plugin-${p.slug}`))} />
    </>
  );
}
