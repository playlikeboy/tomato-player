import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/astryx-themes';
import './globals.css';
import { JsonLd } from '@/components/JsonLd';
import { Shell } from '@/components/Shell';
import { DOC_SECTIONS } from '@/lib/docs';
import { SITE, absolute, asset } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE.url}/`),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: SITE.keywords,
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  category: 'technology',
  alternates: { canonical: absolute('/'), types: { 'text/plain': absolute('/llms.txt') } },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: absolute('/'),
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    locale: 'en_US',
    images: [{ url: absolute('/og.png'), width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [absolute('/og.png')],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: { icon: [{ url: absolute('/assets/logo.svg'), type: 'image/svg+xml' }] },
  manifest: asset('/manifest.webmanifest'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
  ],
  colorScheme: 'dark light',
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: absolute('/'),
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@type': 'Person', name: SITE.author.name, url: SITE.author.url },
};

// Apply the saved color mode before first paint, so a light-mode visitor never sees a dark flash.
const modeScript = `try{var m=localStorage.getItem('tp-site-mode')||'dark';document.documentElement.dataset.theme=m;document.documentElement.style.colorScheme=m}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <JsonLd data={websiteLd} />
      </head>
      <body>
        <Shell docSections={DOC_SECTIONS}>{children}</Shell>
      </body>
    </html>
  );
}
