'use client';

import { useMemo } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Markdown } from '@astryxdesign/core/Markdown';
import { Outline, parseOutlineFromMarkdown } from '@astryxdesign/core/Outline';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Page, PageHeader } from '@/components/blocks';
import type { DocSection } from '@/components/DocsNav';

export interface DocProps {
  title: string;
  description: string;
  section: string;
  slug: string;
  body: string;
  editUrl: string;
  minutes: number;
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}

export function Doc({ title, section, slug, body, editUrl, minutes, prev, next }: DocProps) {
  const outline = useMemo(() => parseOutlineFromMarkdown(body).filter((i) => i.level <= 3), [body]);
  return (
    <HStack gap={8} vAlign="start" width="100%">
      <VStack gap={6} paddingInline={6} paddingBlock={8} maxWidth={860} width="100%" as="article" data-pagefind-body="">
        <PageHeader
          trail={[
            ['Docs', '/docs/'],
            [title, `/docs/${slug}/`],
          ]}
          eyebrow={section}
          title={title}
        />
        <Text type="supporting" color="secondary">
          {minutes} min read ·{' '}
          <Link href={editUrl} isExternalLink color="secondary">
            Edit this page on GitHub
          </Link>
        </Text>
        <Markdown headingLevelStart={2} contentWidth="100%" autolink="gfm">
          {body}
        </Markdown>
        <Divider />
        <Grid columns={2} gap={3}>
          {prev ? (
            <ClickableCard label={`Previous: ${prev.title}`} href={prev.href} padding={4}>
              <VStack gap={1}>
                <Text type="supporting" color="secondary">
                  Previous
                </Text>
                <Text weight="semibold">{prev.title}</Text>
              </VStack>
            </ClickableCard>
          ) : (
            <VStack />
          )}
          {next && (
            <ClickableCard label={`Next: ${next.title}`} href={next.href} padding={4}>
              <VStack gap={1} hAlign="end">
                <Text type="supporting" color="secondary">
                  Next
                </Text>
                <Text weight="semibold">{next.title}</Text>
              </VStack>
            </ClickableCard>
          )}
        </Grid>
      </VStack>
      {outline.length > 1 && (
        <VStack as="aside" gap={2} paddingBlock={8} width={240} style={{ position: 'sticky', top: 'var(--spacing-12)' }} data-pagefind-ignore="">
          <Text type="label" color="secondary" weight="semibold">
            On this page
          </Text>
          <Outline items={outline} density="compact" offset={72} />
        </VStack>
      )}
    </HStack>
  );
}

export function DocsCatalog({ sections, descriptions }: { sections: DocSection[]; descriptions: Record<string, string> }) {
  return (
    <Page width={1100}>
      <PageHeader
        trail={[['Docs', '/docs/']]}
        eyebrow="Documentation"
        title="Tomato Player docs"
        lead="Everything from your first player to writing your own skins, plugins and streaming providers. New here? Start with Getting started; it takes about five minutes."
        actions={
          <>
            <Button label="Getting started" variant="primary" href="/docs/getting-started/" />
            <Button label="Player API" href="/docs/api/player/" />
          </>
        }
      />
      {sections.map((s) => (
        <VStack key={s.section} gap={3}>
          <Heading level={2}>{s.section}</Heading>
          <Grid columns={{ minWidth: 300, repeat: 'fit' }} gap={3}>
            {s.items.map((item) => (
              <ClickableCard key={item.href} label={item.title} href={item.href} padding={4}>
                <VStack gap={1}>
                  <Text weight="semibold">{item.title}</Text>
                  <Text type="supporting" color="secondary" maxLines={2}>
                    {descriptions[item.href]}
                  </Text>
                </VStack>
              </ClickableCard>
            ))}
          </Grid>
        </VStack>
      ))}
    </Page>
  );
}
