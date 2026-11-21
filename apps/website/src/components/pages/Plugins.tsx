'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Player } from '@/components/Player';
import { Code, OptionsTable, Page, PageHeader, SectionTitle } from '@/components/blocks';
import { DEMOS, PLUGINS, type PluginSlug } from '@/lib/site';
import { pluginUsage } from '@/lib/snippets';

export function PluginIndex({ sizes }: { sizes: Record<string, string> }) {
  return (
    <Page width={1200}>
      <PageHeader
        trail={[['Plugins', '/plugins/']]}
        eyebrow="Plugins"
        title="Video player plugins"
        lead="Small, independent packages built on the public plugin API. Each one adds a feature without touching the core, and each one is a template for writing your own."
        actions={
          <>
            <Button label="Plugins guide" variant="primary" href="/docs/guides/plugins/" />
            <Button label="Create a plugin" href="/docs/guides/create-a-plugin/" />
          </>
        }
      />
      <Grid columns={{ minWidth: 320, repeat: 'fit' }} gap={4}>
        {PLUGINS.map((p) => (
          <ClickableCard key={p.slug} label={`${p.name} plugin`} href={`/plugins/${p.slug}/`} padding={5}>
            <VStack gap={2}>
              <HStack hAlign="between" vAlign="center">
                <Heading level={2}>{p.name}</Heading>
                <Text type="supporting" color="secondary">
                  {sizes[p.slug]} gzip
                </Text>
              </HStack>
              <Text color="secondary" as="p">
                {p.summary}
              </Text>
              <Text type="code" color="secondary">
                @tomato-player/plugin-{p.slug}
              </Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </Page>
  );
}

const DEMO_PROPS: Partial<Record<PluginSlug, { plugins: PluginSlug[]; note: string }>> = {
  hotkeys: { plugins: ['hotkeys'], note: 'Click the player, then press Space, J, L, the arrow keys, M, F or C.' },
  gestures: { plugins: ['gestures'], note: 'On a touch screen, double-tap the left or right side of the video.' },
  chapters: { plugins: ['chapters'], note: 'Hover the seek bar to see the chapter markers and titles.' },
  analytics: { plugins: ['analytics'], note: 'Open the analytics demo to watch the events stream in.' },
  'media-session': { plugins: ['media-session'], note: 'Play, then check your system media controls or lock screen.' },
  persist: { plugins: ['persist'], note: 'Change the volume or speed, reload the page and they are remembered.' },
  playlist: {
    plugins: ['playlist'],
    note: 'This player has three items; when one ends the next starts. The playlist demo adds next and previous buttons.',
  },
};

export function PluginDetail({ slug, size }: { slug: PluginSlug; size: string }) {
  const plugin = PLUGINS.find((p) => p.slug === slug)!;
  const demo = DEMO_PROPS[slug];
  const demoPage = DEMOS.find((d) => d.slug === plugin.demo);
  return (
    <Page width={1100}>
      <PageHeader
        trail={[
          ['Plugins', '/plugins/'],
          [plugin.name, `/plugins/${slug}/`],
        ]}
        eyebrow={`@tomato-player/plugin-${slug}`}
        title={`${plugin.name} plugin`}
        badges={[`${size} gzip`]}
        lead={plugin.description}
        actions={
          <>
            {demoPage && <Button label={`Demo: ${demoPage.title}`} variant="primary" href={`/demos/${demoPage.slug}/`} />}
            <Button
              label="Source on GitHub"
              href={`https://github.com/playlikeboy/tomato-player/tree/main/packages/plugins/${slug}`}
              target="_blank"
              rel="noopener"
            />
          </>
        }
      />
      {demo ? (
        <VStack gap={2}>
          <Player
            plugins={demo.plugins}
            pluginOptions={
              slug === 'playlist'
                ? {
                    playlist: {
                      items: [
                        { src: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm', title: 'Big Buck Bunny' },
                        { src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', title: 'Big Buck Bunny (HLS)' },
                      ],
                    },
                  }
                : undefined
            }
            label={`${plugin.name} plugin demo`}
          />
          <Text type="supporting" color="secondary">
            {demo.note}
          </Text>
        </VStack>
      ) : (
        <Banner
          status="info"
          title="Bring your own assets"
          description="This plugin needs files from your pipeline (a WebVTT sprite-sheet track), so this page shows the setup only."
          collapsible={false}
        />
      )}
      <SectionTitle title="Install" />
      <CodeBlock code={`npm i @tomato-player/plugin-${slug}`} language="bash" hasLanguageLabel={false} width="100%" />
      <SectionTitle title="Usage" />
      <Code code={pluginUsage(slug, plugin.importName, plugin.usage)} language="ts" title="player.ts" />
      <SectionTitle title="Options" />
      <OptionsTable rows={plugin.options} />
      <SectionTitle title="Other plugins" />
      <Grid columns={{ minWidth: 220, repeat: 'fit' }} gap={3}>
        {PLUGINS.filter((p) => p.slug !== slug).map((p) => (
          <ClickableCard key={p.slug} label={`${p.name} plugin`} href={`/plugins/${p.slug}/`} padding={3} variant="muted">
            <VStack gap={1}>
              <Text weight="semibold">{p.name}</Text>
              <Text type="supporting" color="secondary">
                {p.summary}
              </Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </Page>
  );
}
