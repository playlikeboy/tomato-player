import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PackagesTable } from '@/components/pages/Packages';
import { fmtKb, packages } from '@/lib/packages';
import { breadcrumbs, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Packages and bundle sizes',
  description:
    'Every Tomato Player npm package with its purpose and gzip size: the core, UI primitives, 9 skins, 8 plugins, HLS and DASH providers, React, Vue and Svelte bindings and the CDN bundle.',
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
