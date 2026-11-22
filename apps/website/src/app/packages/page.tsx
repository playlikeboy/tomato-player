import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PackagesTable } from '@/components/pages/Packages';
import { fmtKb, packages } from '@/lib/packages';
import { PAGE_META } from '@/lib/meta';
import { breadcrumbs, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  ...PAGE_META.packages,
  path: '/packages/',
  keywords: ['video player bundle size', 'lightweight video player', 'npm video player'],
});

export default function Page() {
  const rows = packages().map((p) => ({ name: p.name, kind: p.kind, description: p.description, size: fmtKb(p.gzipKb), dir: p.dir }));
  return (
    <>
      <JsonLd data={breadcrumbs([['Packages', '/packages/']])} />
      <PackagesTable rows={rows} />
    </>
  );
}
