'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { AppShell } from '@astryxdesign/core/AppShell';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Link as ALink, LinkProvider } from '@astryxdesign/core/Link';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Theme } from '@astryxdesign/core/theme';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { themes, defaultThemeSlug } from '@/astryx-themes';
import { NAV, SITE, absolute, asset } from '@/lib/site';
import { GitHubIcon, MoonIcon, SunIcon } from './icons';
import { Search } from './Search';
import { DocsNav, type DocSection } from './DocsNav';

type Mode = 'light' | 'dark';

function useMode(): [Mode, () => void] {
  const [mode, setMode] = useState<Mode>('dark');
  useEffect(() => {
    const saved = localStorage.getItem('tp-site-mode');
    if (saved === 'light' || saved === 'dark') setMode(saved);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);
  const toggle = () =>
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark';
      localStorage.setItem('tp-site-mode', next);
      return next;
    });
  return [mode, toggle];
}

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href);

export function Shell({ children, docSections }: { children: ReactNode; docSections: DocSection[] }) {
  const [mode, toggleMode] = useMode();
  const pathname = usePathname() ?? '/';

  const topNav = (
    <TopNav
      label="Main"
      heading={
        <TopNavHeading
          as={Link}
          logo={<img src={asset('/assets/logo.svg')} alt="" width={28} height={28} />}
          heading={SITE.name}
          headingHref="/"
        />
      }
      startContent={NAV.map((item) => (
        <TopNavItem key={item.href} as={Link} label={item.label} href={item.href} isSelected={isActive(pathname, item.href)} />
      ))}
      endContent={
        <HStack gap={2} vAlign="center">
          <Search />
          <IconButton
            variant="ghost"
            label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            tooltip={mode === 'dark' ? 'Light mode' : 'Dark mode'}
            icon={mode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleMode}
          />
          <Button
            label="GitHub"
            variant="secondary"
            icon={<GitHubIcon />}
            href={SITE.repo}
            target="_blank"
            rel="noopener"
          />
        </HStack>
      }
    />
  );

  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <LinkProvider component={Link}>
        <AppShell
          height="auto"
          variant="surface"
          topNav={topNav}
          sideNav={pathname.startsWith('/docs') ? <DocsNav sections={docSections} pathname={pathname} /> : undefined}
        >
          {children}
          <Footer />
        </AppShell>
      </LinkProvider>
    </Theme>
  );
}

const FOOTER: { title: string; links: [string, string][] }[] = [
  {
    title: 'Product',
    links: [
      ['Skins', '/skins/'],
      ['Plugins', '/plugins/'],
      ['Demos', '/demos/'],
      ['Playground', '/playground/'],
      ['Packages', '/packages/'],
    ],
  },
  {
    title: 'Docs',
    links: [
      ['Getting started', '/docs/getting-started/'],
      ['Player API', '/docs/api/player/'],
      ['Create a skin', '/docs/guides/create-a-skin/'],
      ['Streaming', '/docs/guides/streaming/'],
      ['Accessibility', '/docs/guides/accessibility/'],
    ],
  },
  {
    title: 'Community',
    links: [
      ['GitHub', SITE.repo],
      ['Issues', `${SITE.repo}/issues`],
      ['Contributing', '/docs/contributing/'],
      ['Changelog', '/docs/changelog/'],
      ['Roadmap', '/docs/roadmap/'],
    ],
  },
  {
    title: 'For AI tools',
    links: [
      ['llms.txt', absolute('/llms.txt')],
      ['llms-full.txt', absolute('/llms-full.txt')],
      ['Sitemap', absolute('/sitemap.xml')],
    ],
  },
];

function Footer() {
  return (
    <VStack as="footer" gap={6} paddingInline={6} paddingBlock={10}>
      <Divider />
      <Grid columns={{ minWidth: 180, repeat: 'fit' }} gap={6}>
        <VStack gap={2}>
          <Heading level={2} type="display-3">
            🍅 {SITE.name}
          </Heading>
          <Text color="secondary">{SITE.tagline}. MIT licensed, built in the open.</Text>
        </VStack>
        {FOOTER.map((col) => (
          <VStack key={col.title} gap={2} as="nav" aria-label={col.title}>
            <Text weight="semibold">{col.title}</Text>
            {col.links.map(([label, href]) => (
              <ALink key={href} href={href} color="secondary" isExternalLink={href.startsWith('http') && !href.startsWith(SITE.url)}>
                {label}
              </ALink>
            ))}
          </VStack>
        ))}
      </Grid>
      <Text type="supporting" color="secondary">
        © {new Date().getFullYear()} {SITE.author.name} and contributors · MIT License · Stream, Tube and Feed are unofficial,
        platform-inspired skins with no affiliation.
      </Text>
    </VStack>
  );
}
