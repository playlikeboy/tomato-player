import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { DocsCatalog } from '@/components/pages/Doc';
import { DOCS, DOC_SECTIONS, loadDoc } from '@/lib/docs';
import { PAGE_META } from '@/lib/meta';
import { breadcrumbs, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  ...PAGE_META.docs,
  path: '/docs/',
  keywords: ['video player documentation', 'video player api', 'html5 video player tutorial'],
});

export default function Page() {
  const descriptions = Object.fromEntries(DOCS.map((d) => [`/docs/${d.slug.join('/')}/`, loadDoc(d).description]));
  return (
    <>
      <JsonLd data={breadcrumbs([['Docs', '/docs/']])} />
      <DocsCatalog sections={DOC_SECTIONS} descriptions={descriptions} />
    </>
  );
}
