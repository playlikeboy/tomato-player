'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Switch } from '@astryxdesign/core/Switch';
import { Text } from '@astryxdesign/core/Text';
import { Player, type SourceKind } from '@/components/Player';
import { Code, Page, PageHeader } from '@/components/blocks';
import { AccentPicker } from '@/components/pages/Skins';
import { MEDIA, SKINS, type PluginSlug, type SkinSlug } from '@/lib/site';

const PLAYGROUND_PLUGINS: [PluginSlug, string][] = [
  ['hotkeys', 'Keyboard shortcuts'],
  ['gestures', 'Double-tap to seek'],
  ['chapters', 'Chapters'],
  ['persist', 'Remember settings'],
  ['media-session', 'Media Session'],
  ['analytics', 'Analytics (logged below)'],
];

const importName = (p: PluginSlug) => (p === 'media-session' ? 'mediaSession' : p);

export function Playground() {
  const [skin, setSkin] = useState<SkinSlug>('minimal');
  const [source, setSource] = useState<SourceKind>('mp4');
  const [accent, setAccent] = useState('default');
  const [enabled, setEnabled] = useState<PluginSlug[]>(['hotkeys', 'gestures', 'chapters', 'analytics']);
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef(setLog);

  useEffect(() => {
    const s = new URLSearchParams(location.search).get('skin');
    if (s && SKINS.some((x) => x.slug === s)) setSkin(s as SkinSlug);
  }, []);

  const push = (msg: string) => logRef.current((l) => [`${new Date().toLocaleTimeString()}  ${msg}`, ...l].slice(0, 60));
  const pick = (s: string) => {
    setSkin(s as SkinSlug);
    history.replaceState(null, '', `?skin=${s}`);
  };
  const toggle = (p: PluginSlug, on: boolean) => setEnabled((list) => (on ? [...list, p] : list.filter((x) => x !== p)));

  const info = SKINS.find((s) => s.slug === skin)!;
  const code = [
    `import { createPlayer } from '@tomato-player/core';`,
    `import { ${skin} } from '@tomato-player/skin-${skin}';`,
    source === 'hls' ? `import { hls } from '@tomato-player/provider-hls';` : '',
    source === 'dash' ? `import { dash } from '@tomato-player/provider-dash';` : '',
    ...enabled.map((p) => `import { ${importName(p)} } from '@tomato-player/plugin-${p}';`),
    '',
    `createPlayer('#player', {`,
    `  src: '${source === 'mp4' ? 'movie.webm' : source === 'hls' ? 'stream.m3u8' : 'stream.mpd'}',`,
    source === 'hls' ? '  providers: [hls()],' : source === 'dash' ? '  providers: [dash()],' : '',
    `  skin: ${info.factory},`,
    accent !== 'default' ? `  tokens: { accent: '${accent}' },` : '',
    `  plugins: [${enabled.map((p) => `${importName(p)}()`).join(', ')}],`,
    `});`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return (
    <Page width={1400}>
      <PageHeader
        trail={[['Playground', '/playground/']]}
        eyebrow="Playground"
        title="Build your player"
        lead="Pick a skin, a source, an accent and plugins. The player rebuilds live and the code updates to match, ready to paste."
      />
      <Grid columns={{ minWidth: 560, repeat: 'fit' }} gap={6}>
        <VStack gap={4}>
          <Player
            skin={skin}
            source={source}
            plugins={enabled}
            pluginOptions={{
              analytics: { heartbeat: 10000, onEvent: (e: { type: string; percent?: number }) => push(`analytics · ${e.type}${e.percent ? ` ${e.percent}%` : ''}`) },
            }}
            tokens={accent === 'default' ? undefined : { accent }}
            options={info.portrait ? { aspectRatio: '9 / 16' } : undefined}
            onReady={(p) => {
              push(`ready · ${skin} skin`);
              const offs = (['play', 'pause', 'ended', 'seeked', 'qualitychange', 'error', 'fullscreenchange'] as const).map((t) =>
                p.on(t, (d: unknown) => push(`${t}${typeof d === 'number' || typeof d === 'string' || typeof d === 'boolean' ? ` · ${d}` : ''}`)),
              );
              return () => offs.forEach((off) => off());
            }}
          />
          <Text type="supporting" color="secondary">
            {MEDIA.credit}
          </Text>
          <Code code={code} language="ts" title="player.ts" />
        </VStack>
        <VStack gap={5}>
          <Card padding={5}>
            <VStack gap={5}>
              <Selector
                label="Skin"
                value={skin}
                onChange={(v) => v && pick(v)}
                options={SKINS.map((s) => ({ value: s.slug, label: s.name, description: s.summary }))}
                width="100%"
              />
              <VStack gap={2}>
                <Text weight="semibold">Source</Text>
                <SegmentedControl label="Source" value={source} onChange={(v) => setSource(v as SourceKind)} layout="fill">
                  <SegmentedControlItem value="mp4" label="WebM" />
                  <SegmentedControlItem value="hls" label="HLS" />
                  <SegmentedControlItem value="dash" label="DASH" />
                </SegmentedControl>
              </VStack>
              <VStack gap={2}>
                <Text weight="semibold">Accent</Text>
                <AccentPicker value={accent} onChange={setAccent} />
              </VStack>
              <VStack gap={2}>
                <Text weight="semibold">Plugins</Text>
                {PLAYGROUND_PLUGINS.map(([p, label]) => (
                  <Switch key={p} label={label} value={enabled.includes(p)} onChange={(on) => toggle(p, on)} />
                ))}
              </VStack>
            </VStack>
          </Card>
          <Card padding={4} variant="muted">
            <VStack gap={2}>
              <HStack hAlign="between">
                <Text weight="semibold">Event log</Text>
                <Text type="supporting" color="secondary">
                  {log.length} events
                </Text>
              </HStack>
              <VStack gap={0.5} maxWidth="100%" isScrollable height={220}>
                {log.length === 0 && <Text color="secondary">Press play to see events.</Text>}
                {log.map((line, i) => (
                  <Text key={`${line}-${i}`} type="code" color="secondary">
                    {line}
                  </Text>
                ))}
              </VStack>
            </VStack>
          </Card>
        </VStack>
      </Grid>
    </Page>
  );
}
