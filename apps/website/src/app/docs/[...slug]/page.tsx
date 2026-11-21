import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Doc } from '@/components/pages/Doc';
import { DOCS, findDoc, loadDoc, neighbours } from '@/lib/docs';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { SITE, absolute } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => DOCS.map((d) => ({ slug: d.slug }));

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadDoc(findDoc(slug)!);
  return pageMeta({
    title: `${doc.title} — ${doc.section}`,
    description: doc.description,
    path: `/docs/${slug.join('/')}/`,
    type: 'article',
    keywords: [doc.title.toLowerCase(), `tomato player ${doc.title.toLowerCase()}`],
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = findDoc(slug);
  if (!entry) notFound();
  const doc = loadDoc(entry);
  const path = `/docs/${slug.join('/')}/`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            ['Docs', '/docs/'],
            [doc.title, path],
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: doc.title,
            description: doc.description,
            url: absolute(path),
            wordCount: doc.words,
            articleSection: doc.section,
            inLanguage: 'en',
            isPartOf: { '@type': 'WebSite', name: SITE.name, url: absolute('/') },
            author: { '@type': 'Person', name: SITE.author.name, url: SITE.author.url },
            about: { '@type': 'SoftwareSourceCode', name: SITE.name, codeRepository: SITE.repo },
          },
        ]}
      />
      <Doc
        title={doc.title}
        description={doc.description}
        section={doc.section}
        slug={slug.join('/')}
        body={doc.body}
        editUrl={doc.editUrl}
        minutes={Math.max(1, Math.round(doc.words / 220))}
        {...neighbours(entry)}
      />
    </>
  );
}
