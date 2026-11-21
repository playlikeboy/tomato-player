'use client';

import { useState } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { Selector } from '@astryxdesign/core/Selector';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Player } from '@/components/Player';
import { Code, OptionsTable, Page, PageHeader, SectionTitle } from '@/components/blocks';
import { MEDIA, SKINS, asset, type SkinSlug } from '@/lib/site';
import { skinUsage } from '@/lib/snippets';

/** Tomato palette swatches offered as accent presets. */
export const ACCENTS: [string, string][] = [
  ['default', 'Skin default'],
  ['#e5372a', 'Tomato'],
  ['#f97316', 'Tangerine'],
  ['#eab308', 'Mustard'],
  ['#16a34a', 'Basil'],
  ['#0ea5e9', 'Sky'],
  ['#8b5cf6', 'Plum'],
];

export function AccentPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Selector
      label="Accent color"
      isLabelHidden
      value={value}
      onChange={(v) => v && onChange(v)}
      options={ACCENTS.map(([v, label]) => ({ value: v, label: v === 'default' ? label : `${label} · ${v}` }))}
      width={240}
    />
  );
}

export function SkinGallery() {
  return (
    <Page width={1280}>
      <PageHeader
        trail={[['Skins', '/skins/']]}
        eyebrow="Skin gallery"
        title="Video player skins"
        lead={`${SKINS.length} complete interfaces for one engine. Every card is a real player: press play, try the controls, then open the skin for theming and code.`}
        actions={
          <>
            <Button label="Compare in the playground" variant="primary" href="/playground/" />
            <Button label="Create your own skin" href="/docs/guides/create-a-skin/" />
          </>
        }
      />
      <Grid columns={{ minWidth: 460, repeat: 'fit' }} gap={6}>
        {SKINS.map((s) => (
          <Card key={s.slug} padding={4}>
            <VStack gap={3}>
              <Player skin={s.slug} label={`${s.name} skin demo`} plugins={['hotkeys']} lazy />
              <HStack gap={2} vAlign="center" wrap="wrap">
                <Heading level={2}>{s.name}</Heading>
                {s.unofficial && <Badge label="Unofficial" variant="warning" />}
                {s.portrait && <Badge label="9:16" variant="purple" />}
              </HStack>
              <Text color="secondary" as="p">
                {s.summary}
              </Text>
              <CodeBlock code={`npm i @tomato-player/skin-${s.slug}`} language="bash" hasLanguageLabel={false} width="100%" size="sm" />
              <HStack gap={2}>
                <Button label={`Open ${s.name}`} variant="primary" href={`/skins/${s.slug}/`} />
                <Button label="Try in playground" variant="ghost" href={`/playground/?skin=${s.slug}`} />
              </HStack>
            </VStack>
          </Card>
        ))}
      </Grid>
      <Banner
        status="info"
        title="About the platform-inspired skins"
        description="Stream, Tube and Feed recreate common interaction patterns of popular video services. They use no logos, fonts or assets from those services and are not affiliated with or endorsed by them."
        collapsible={false}
      />
    </Page>
  );
}

export function SkinDetail({ slug, size }: { slug: SkinSlug; size: string }) {
  const skin = SKINS.find((s) => s.slug === slug)!;
  const [accent, setAccent] = useState('default');
  const others = SKINS.filter((s) => s.slug !== slug).slice(0, 4);
  const code = skinUsage(slug, skin.factory).replace(
    '  skin:',
    accent === 'default' ? '  skin:' : `  tokens: { accent: '${accent}' },\n  skin:`,
  );

  return (
    <Page width={1200}>
      <PageHeader
        trail={[
          ['Skins', '/skins/'],
          [skin.name, `/skins/${slug}/`],
        ]}
        eyebrow={`@tomato-player/skin-${slug}`}
        title={`${skin.name} skin`}
        badges={[...(skin.unofficial ? ['Unofficial'] : []), size + ' gzip']}
        lead={skin.description}
        actions={
          <>
            <Button label="Open in playground" variant="primary" href={`/playground/?skin=${slug}`} />
            <Button
              label="Source on GitHub"
              href={`https://github.com/playlikeboy/tomato-player/tree/main/packages/skins/${slug}`}
              target="_blank"
              rel="noopener"
            />
          </>
        }
      />
      <Player
        skin={slug}
        plugins={['hotkeys', 'gestures', 'chapters']}
        tokens={accent === 'default' ? undefined : { accent }}
        label={`${skin.name} skin live demo`}
      />
      <HStack gap={3} vAlign="center" wrap="wrap">
        <Text weight="semibold">Accent</Text>
        <AccentPicker value={accent} onChange={setAccent} />
      </HStack>
      <Text type="supporting" color="secondary">
        {MEDIA.credit}
      </Text>

      <Grid columns={{ minWidth: 340, repeat: 'fit' }} gap={6}>
        <VStack gap={4}>
          <SectionTitle title="Install and use" />
          <CodeBlock code={`npm i @tomato-player/core @tomato-player/skin-${slug}`} language="bash" hasLanguageLabel={false} width="100%" />
          <Code code={code} language="ts" title="player.ts" />
        </VStack>
        <VStack gap={4}>
          <SectionTitle title="At a glance" />
          <MetadataList>
            <MetadataListItem label="Best for">{skin.bestFor}</MetadataListItem>
            <MetadataListItem label="Highlights">{skin.features.join(' · ')}</MetadataListItem>
            <MetadataListItem label="Default accent">{skin.accent}</MetadataListItem>
            <MetadataListItem label="Size">{size} gzip, on top of the core</MetadataListItem>
            <MetadataListItem label="Aspect">{skin.portrait ? 'Portrait 9:16 first' : '16:9, responsive'}</MetadataListItem>
          </MetadataList>
        </VStack>
      </Grid>

      <SectionTitle title="Options" lead={`Pass these to ${slug}(). Every skin also accepts design tokens through createPlayer({ tokens }).`} />
      <OptionsTable rows={skin.options} />

      {skin.unofficial && (
        <Banner
          status="warning"
          title="Unofficial, platform-inspired design"
          description="This skin recreates common interaction patterns only. It uses no third-party logos, fonts or assets and implies no affiliation or endorsement."
          collapsible={false}
        />
      )}

      <SectionTitle title="More skins" />
      <Grid columns={{ minWidth: 240, repeat: 'fit' }} gap={3}>
        {others.map((s) => (
          <ClickableCard key={s.slug} label={`${s.name} skin`} href={`/skins/${s.slug}/`} padding={3}>
            <VStack gap={2}>
              <img className="tp-shot" src={asset(`/assets/skin-${s.slug}.png`)} alt={`${s.name} skin`} width={640} height={360} loading="lazy" />
              <Text weight="semibold">{s.name}</Text>
              <Text type="supporting" color="secondary">
                {s.summary}
              </Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </Page>
  );
}
