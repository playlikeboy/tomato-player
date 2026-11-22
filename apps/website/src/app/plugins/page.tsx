import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PluginIndex } from '@/components/pages/Plugins';
import { fmtKb, sizeOf } from '@/lib/packages';
import { PAGE_META } from '@/lib/meta';
import { breadcrumbs, pageMeta } from '@/lib/seo';
import { PLUGINS } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  ...PAGE_META.plugins,
  path: '/plugins/',
  keywords: ['video player plugins', 'video chapters', 'video playlist', 'video analytics', 'keyboard shortcuts video'],
});

export default function Page() {
  const sizes = Object.fromEntries(PLUGINS.map((p) => [p.slug, fmtKb(sizeOf(`@tomato-player/plugin-${p.slug}`))]));
  return (
    <>
      <JsonLd data={breadcrumbs([['Plugins', '/plugins/']])} />
      <PluginIndex sizes={sizes} />
    </>
  );
}
