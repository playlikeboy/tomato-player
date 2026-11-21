import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { Playground } from '@/components/pages/Playground';
import { breadcrumbs, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Playground: build and configure a video player online',
  description:
    'Configure Tomato Player in your browser: switch between 9 skins, WebM, HLS and DASH sources, accent colors and plugins, watch the event log and copy the generated code.',
  path: '/playground/',
  keywords: ['video player playground', 'video player generator', 'video player configurator'],
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs([['Playground', '/playground/']])} />
      <Playground />
    </>
  );
}
