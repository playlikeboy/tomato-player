'use client';

import { useState } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Section } from '@astryxdesign/core/Section';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Text } from '@astryxdesign/core/Text';
import { Player } from '@/components/Player';
import { CodeTabs, Page, SectionTitle } from '@/components/blocks';
import { PlayIcon } from '@/components/icons';
import { DEMOS, FAQ, MEDIA, PLUGINS, SKINS, asset, type SkinSlug } from '@/lib/site';
import { FRAMEWORK_TABS, INSTALL } from '@/lib/snippets';

const FEATURES: [string, string, string][] = [
  ['🧩', 'Tiny modular core', 'The engine is a few KB with zero dependencies. Skins, plugins and streaming engines are separate packages you add only when you need them.'],
  ['🎨', 'Swappable skins', 'Nine complete interfaces, switchable at runtime. Theme any of them with CSS tokens, or build your own from UI primitives.'],
  ['📡', 'HLS & DASH', 'Adaptive streaming with a quality menu. hls.js and dash.js load lazily, only when a stream needs them, with native HLS on Safari.'],
  ['♿', 'Accessible by default', 'Real buttons and sliders with labels, visible focus, keyboard shortcuts, captions and controls that stay up while focus is inside.'],
  ['⚛️', 'Every framework', 'Official React, Vue and Svelte bindings, a <tomato-player> web component and a CDN build. SSR-safe for Next.js, Nuxt and SvelteKit.'],
  ['🔌', 'Plugin ecosystem', 'Chapters, thumbnails, playlists, analytics, hotkeys, gestures, media session and persistence, all built on the public plugin API.'],
  ['💬', 'Captions & chapters', 'WebVTT captions in any language with a styled overlay, plus chapter markers on the seek bar and chapter titles in the preview.'],
  ['📱', 'Mobile first', 'Container queries, touch gestures, picture-in-picture, a pseudo-fullscreen fallback for iOS and portrait 9:16 skins.'],
  ['🤖', 'Agent ready', 'Typed APIs, llms.txt and llms-full.txt, so AI coding tools can wire up a player without guessing.'],
];

export function Home({ stats }: { stats: { core: string; cdn: string; packages: number } }) {
  const [skin, setSkin] = useState<SkinSlug>('cinema');
  const active = SKINS.find((s) => s.slug === skin)!;

  return (
    <VStack gap={0} hAlign="center">
      {/* Hero */}
      <Page width={1280}>
        <Grid columns={{ minWidth: 480, repeat: 'fit' }} gap={8} align="center">
          <VStack gap={5}>
            <HStack gap={2} wrap="wrap">
              <Badge label="v0.1 · MIT" variant="red" />
              <Badge label="Zero dependencies" variant="green" />
            </HStack>
            <Heading level={1} type="display-1" textWrap="balance">
              The open-source video player you can make your own.
            </Heading>
            <Text type="large" color="secondary" as="p" textWrap="pretty">
              Tomato Player is a {stats.core} HTML5 video player core with nine swappable skins, HLS and DASH
              streaming, captions, chapters, playlists and analytics, for React, Vue, Svelte or plain HTML.
            </Text>
            <HStack gap={2} wrap="wrap">
              <Button label="Get started" variant="primary" size="lg" href="/docs/getting-started/" />
              <Button label="See all skins" size="lg" href="/skins/" />
              <Button label="Playground" variant="ghost" size="lg" icon={<PlayIcon />} href="/playground/" />
            </HStack>
            <CodeBlock code={INSTALL} language="bash" hasLanguageLabel={false} width="100%" />
          </VStack>
          <VStack gap={3}>
            <Player skin={skin} plugins={['hotkeys', 'gestures', 'chapters']} label={`Live demo: ${active.name} skin`} />
            <TabList value={skin} onChange={(v) => setSkin(v as SkinSlug)} size="sm" overflow="auto" aria-label="Switch skin">
              {SKINS.map((s) => (
                <Tab key={s.slug} value={s.slug} label={s.name} />
              ))}
            </TabList>
            <Text type="supporting" color="secondary">
              {active.summary} Same player, same video: only the skin changes.
            </Text>
          </VStack>
        </Grid>

        {/* Stats */}
        <Grid columns={{ minWidth: 160, repeat: 'fit' }} gap={3}>
          {[
            [stats.core, 'core, gzip'],
            [String(SKINS.length), 'skins'],
            [String(PLUGINS.length), 'official plugins'],
            [String(stats.packages), 'npm packages'],
            [stats.cdn, 'all-in-one CDN build'],
          ].map(([value, label]) => (
            <Card key={label} padding={4} variant="muted">
              <VStack gap={1}>
                <Text size="3xl" weight="bold" hasTabularNumbers>
                  {value}
                </Text>
                <Text color="secondary">{label}</Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </Page>

      {/* Features */}
      <Section variant="muted" width="100%" padding={0} dividers={['top', 'bottom']}>
        <VStack hAlign="center" width="100%">
          <Page width={1280}>
            <SectionTitle
              title="Everything a web video player needs. Nothing it doesn’t."
              lead="Start with the core and one skin. Add streaming, plugins and framework bindings as your product grows."
            />
            <Grid columns={{ minWidth: 300, repeat: 'fit' }} gap={4}>
              {FEATURES.map(([icon, title, body]) => (
                <Card key={title} padding={5}>
                  <VStack gap={2}>
                    <Text size="2xl" aria-hidden="true">
                      {icon}
                    </Text>
                    <Heading level={3}>{title}</Heading>
                    <Text color="secondary" as="p">
                      {body}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </Grid>
          </Page>
        </VStack>
      </Section>

      {/* Skins */}
      <Page width={1280}>
        <HStack hAlign="between" vAlign="end" wrap="wrap" gap={4}>
          <SectionTitle title="Nine skins, one engine" lead="Each skin is a complete interface. Open one to play it, theme it and copy the code." />
          <Button label="Open the skin gallery" href="/skins/" />
        </HStack>
        <Grid columns={{ minWidth: 280, repeat: 'fit' }} gap={4}>
          {SKINS.map((s) => (
            <ClickableCard key={s.slug} label={`${s.name} skin`} href={`/skins/${s.slug}/`} padding={3}>
              <VStack gap={3}>
                <img
                  className="tp-shot"
                  src={asset(`/assets/skin-${s.slug}.png`)}
                  alt={`${s.name} skin for Tomato Player: ${s.summary}`}
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                />
                <HStack gap={2} vAlign="center">
                  <Heading level={3}>{s.name}</Heading>
                  {s.unofficial && <Badge label="Unofficial" variant="warning" />}
                </HStack>
                <Text color="secondary">{s.summary}</Text>
              </VStack>
            </ClickableCard>
          ))}
        </Grid>
      </Page>

      {/* Frameworks */}
      <Section variant="muted" width="100%" padding={0} dividers={['top', 'bottom']}>
        <VStack hAlign="center" width="100%">
          <Page width={1280}>
            <Grid columns={{ minWidth: 480, repeat: 'fit' }} gap={8}>
              <VStack gap={4}>
                <SectionTitle
                  title="Works where you work"
                  lead="One engine with thin bindings: React, Vue, Svelte, a web component and a script tag. The core never touches window at import, so server rendering just works."
                />
                <HStack gap={2} wrap="wrap">
                  <Button label="Framework guide" href="/docs/guides/frameworks/" />
                  <Button label="React demo" variant="ghost" href="/demos/react/" />
                  <Button label="Web component demo" variant="ghost" href="/demos/web-component/" />
                </HStack>
              </VStack>
              <CodeTabs tabs={FRAMEWORK_TABS} label="Framework examples" />
            </Grid>
          </Page>
        </VStack>
      </Section>

      {/* Plugins & demos */}
      <Page width={1280}>
        <SectionTitle title="Plugins" lead="Each plugin is a small package on the public plugin API. Use them as they are or as a template for your own." />
        <Grid columns={{ minWidth: 260, repeat: 'fit' }} gap={3}>
          {PLUGINS.map((p) => (
            <ClickableCard key={p.slug} label={`${p.name} plugin`} href={`/plugins/${p.slug}/`} padding={4} variant="muted">
              <VStack gap={1}>
                <Text weight="semibold">{p.name}</Text>
                <Text color="secondary">{p.summary}</Text>
              </VStack>
            </ClickableCard>
          ))}
        </Grid>
        <HStack hAlign="between" vAlign="end" wrap="wrap" gap={4}>
          <SectionTitle title="Live demos" lead="Real players, real streams. Every demo shows the code that builds it." />
          <Button label="All demos" href="/demos/" />
        </HStack>
        <Grid columns={{ minWidth: 260, repeat: 'fit' }} gap={3}>
          {DEMOS.slice(0, 8).map((d) => (
            <ClickableCard key={d.slug} label={d.title} href={`/demos/${d.slug}/`} padding={4}>
              <VStack gap={1}>
                <Text weight="semibold">{d.title}</Text>
                <Text color="secondary">{d.summary}</Text>
              </VStack>
            </ClickableCard>
          ))}
        </Grid>
      </Page>

      {/* FAQ */}
      <Section variant="muted" width="100%" padding={0} dividers={['top']}>
        <VStack hAlign="center" width="100%">
          <Page width={1280}>
            <SectionTitle title="Questions, answered" />
            <Grid columns={{ minWidth: 380, repeat: 'fit' }} gap={6}>
              {FAQ.map((f) => (
                <VStack key={f.q} gap={2}>
                  <Heading level={3}>{f.q}</Heading>
                  <Text color="secondary" as="p">
                    {f.a}
                  </Text>
                </VStack>
              ))}
            </Grid>
            <Card padding={8} variant="red">
              <VStack gap={4} hAlign="center">
                <Heading level={2} justify="center">
                  Ship a player you’re proud of.
                </Heading>
                <Text justify="center" as="p">
                  Free and MIT licensed. Star the repo, open an issue, or build skin number {SKINS.length + 1}.
                </Text>
                <HStack gap={2} wrap="wrap" hAlign="center">
                  <Button label="Read the docs" variant="primary" href="/docs/" />
                  <Button label="Star on GitHub" href="https://github.com/playlikeboy/tomato-player" target="_blank" rel="noopener" />
                </HStack>
                <Text type="supporting" color="secondary">
                  {MEDIA.credit}
                </Text>
              </VStack>
            </Card>
          </Page>
        </VStack>
      </Section>
    </VStack>
  );
}
