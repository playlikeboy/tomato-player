import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { DemoView } from '@/components/pages/Demos';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { DEMOS } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => DEMOS.map((d) => ({ slug: d.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = DEMOS.find((x) => x.slug === slug)!;
  return pageMeta({
    title: `${d.title} demo`,
    description: `${d.summary} Live Tomato Player example with copy-paste code.`,
    path: `/demos/${d.slug}/`,
    keywords: d.tags.map((t) => `video player ${t}`),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const d = DEMOS.find((x) => x.slug === slug);
  if (!d) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          ['Demos', '/demos/'],
          [d.title, `/demos/${d.slug}/`],
        ])}
      />
      <DemoView slug={d.slug} />
    </>
  );
}
