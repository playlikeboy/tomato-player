'use client';

import { createElement, useEffect, useState, type ReactNode } from 'react';
import type { Player as TP, PlayerState } from '@tomato-player/core';
import { usePlayerState } from '@tomato-player/react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Kbd } from '@astryxdesign/core/Kbd';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Table } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { Player, tracks } from '@/components/Player';
import { Code, Page, PageHeader, PlainLink, SectionTitle } from '@/components/blocks';
import { AccentPicker } from '@/components/pages/Skins';
import { DEMOS, MEDIA, asset } from '@/lib/site';

const fmt = (t = 0) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function DemoIndex() {
  const tags = [...new Set(DEMOS.flatMap((d) => d.tags))];
  const [tag, setTag] = useState('all');
  const list = tag === 'all' ? DEMOS : DEMOS.filter((d) => d.tags.includes(tag));
  return (
    <Page width={1200}>
      <PageHeader
        trail={[['Demos', '/demos/']]}
        eyebrow="Live demos"
        title="Tomato Player demos"
        lead="Working examples of streaming, captions, chapters, playlists, analytics, theming and every framework binding. Each demo runs a real player and shows the code behind it."
        actions={
          <>
            <Button label="Open the playground" variant="primary" href="/playground/" />
            <Button label="No-build CDN example" href={asset('/examples/cdn/')} as={PlainLink} />
          </>
        }
      />
      <SegmentedControl label="Filter demos" value={tag} onChange={setTag}>
        <SegmentedControlItem value="all" label="All" />
        {tags.map((t) => (
          <SegmentedControlItem key={t} value={t} label={t[0]!.toUpperCase() + t.slice(1)} />
        ))}
      </SegmentedControl>
      <Grid columns={{ minWidth: 300, repeat: 'fit' }} gap={4}>
        {list.map((d) => (
          <ClickableCard key={d.slug} label={d.title} href={`/demos/${d.slug}/`} padding={5}>
            <VStack gap={2}>
              <Heading level={2}>{d.title}</Heading>
              <Text color="secondary" as="p">
                {d.summary}
              </Text>
              <HStack gap={1}>
                {d.tags.map((t) => (
                  <Badge key={t} label={t} />
                ))}
              </HStack>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </Page>
  );
}

function Frame({ slug, children, code, side }: { slug: string; children: ReactNode; code: string; side?: ReactNode }) {
  const demo = DEMOS.find((d) => d.slug === slug)!;
  const i = DEMOS.indexOf(demo);
  const next = DEMOS[(i + 1) % DEMOS.length]!;
  return (
    <Page width={1200}>
      <PageHeader
        trail={[
          ['Demos', '/demos/'],
          [demo.title, `/demos/${slug}/`],
        ]}
        eyebrow="Live demo"
        title={demo.title}
        lead={demo.summary}
        badges={demo.tags}
      />
      {side ? (
        <Grid columns={{ minWidth: 340, repeat: 'fit' }} gap={6}>
          <VStack gap={3}>{children}</VStack>
          <VStack gap={3}>{side}</VStack>
        </Grid>
      ) : (
        children
      )}
      <Text type="supporting" color="secondary">
        {MEDIA.credit}
      </Text>
      <SectionTitle title="The code" />
      <Code code={code} language={code.trimStart().startsWith('<') ? 'html' : 'tsx'} />
      <HStack hAlign="between" wrap="wrap" gap={2}>
        <Button label="All demos" variant="ghost" href="/demos/" />
        <Button label={`Next: ${next.title}`} href={`/demos/${next.slug}/`} />
      </HStack>
    </Page>
  );
}

function usePlayerRef() {
  const [player, setPlayer] = useState<TP | null>(null);
  return [player, (p: TP) => setPlayer(p)] as const;
}

function LiveState({ player, fields }: { player: TP | null; fields: [string, (s: Readonly<PlayerState>) => ReactNode][] }) {
  // Re-render on every store change; the selector returns a version counter.
  usePlayerState(player, (s) => s);
  return (
    <Card padding={4} variant="muted">
      <MetadataList title="Live player state">
        {fields.map(([label, get]) => (
          <MetadataListItem key={label} label={label}>
            {player ? get(player.state) : '—'}
          </MetadataListItem>
        ))}
      </MetadataList>
    </Card>
  );
}

function HlsDemo({ dash = false }: { dash?: boolean }) {
  const [player, onReady] = usePlayerRef();
  const qualities = usePlayerState(player, (s) => s.qualities, []) ?? [];
  const quality = usePlayerState(player, (s) => s.quality, -1);
  return (
    <Frame
      slug={dash ? 'dash-streaming' : 'hls-streaming'}
      code={`import { createPlayer } from '@tomato-player/core';
import { ${dash ? 'dash' : 'hls'} } from '@tomato-player/provider-${dash ? 'dash' : 'hls'}';
import { minimal } from '@tomato-player/skin-minimal';

const player = createPlayer('#player', {
  src: '${dash ? MEDIA.dash : MEDIA.hls}',
  providers: [${dash ? 'dash()' : 'hls()'}], // ${dash ? 'dash.js' : 'hls.js'} loads only when this source plays
  skin: minimal(),
});

player.on('qualitychange', (q) => console.log('now playing', q));
player.setQuality(-1); // -1 = automatic`}
      side={
        <>
          <LiveState
            player={player}
            fields={[
              ['Engine', () => (dash ? 'dash.js (lazy)' : 'hls.js (lazy) or native HLS')],
              ['Renditions', (s) => s.qualities.map((q) => q.label).join(', ') || 'loading…'],
              ['Current', (s) => (s.quality === -1 ? 'Auto' : s.qualities.find((q) => q.id === s.quality)?.label ?? s.quality)],
              ['Buffered', (s) => fmt(s.buffered.at(-1)?.end ?? 0)],
              ['Waiting', (s) => (s.waiting ? 'yes' : 'no')],
            ]}
          />
          {qualities.length > 0 && (
            <VStack gap={2}>
              <Text weight="semibold">Pick a rendition</Text>
              <HStack gap={1} wrap="wrap">
                <Button label="Auto" size="sm" variant={quality === -1 ? 'primary' : 'secondary'} onClick={() => player?.setQuality(-1)} />
                {qualities.map((q) => (
                  <Button key={q.id} label={q.label} size="sm" variant={quality === q.id ? 'primary' : 'secondary'} onClick={() => player?.setQuality(q.id)} />
                ))}
              </HStack>
            </VStack>
          )}
        </>
      }
    >
      <Player source={dash ? 'dash' : 'hls'} captions={false} onReady={onReady} />
    </Frame>
  );
}

function CaptionsDemo() {
  const [player, onReady] = usePlayerRef();
  const track = usePlayerState(player, (s) => s.textTrack, -1);
  const [size, setSize] = useState('1');
  return (
    <Frame
      slug="captions"
      code={`createPlayer('#player', {
  src: 'movie.mp4',
  tracks: [
    { src: '/captions.en.vtt', label: 'English', srclang: 'en', default: true },
    { src: '/captions.es.vtt', label: 'Español', srclang: 'es' },
  ],
  tokens: { 'cue-size': '1.25' }, // scale caption text
  skin: minimal(),
});

player.setTextTrack(1); // show Spanish, -1 turns captions off`}
      side={
        <VStack gap={4}>
          <VStack gap={2}>
            <Text weight="semibold">Caption track</Text>
            <SegmentedControl label="Caption track" value={String(track)} onChange={(v) => player?.setTextTrack(Number(v))}>
              <SegmentedControlItem value="-1" label="Off" />
              <SegmentedControlItem value="0" label="English" />
              <SegmentedControlItem value="1" label="Español" />
            </SegmentedControl>
          </VStack>
          <VStack gap={2}>
            <Text weight="semibold">Caption size</Text>
            <SegmentedControl label="Caption size" value={size} onChange={setSize}>
              <SegmentedControlItem value="0.8" label="Small" />
              <SegmentedControlItem value="1" label="Medium" />
              <SegmentedControlItem value="1.4" label="Large" />
            </SegmentedControl>
          </VStack>
          <Text color="secondary" as="p">
            Captions render in an overlay the skin controls, so they move above the control bar and follow your design
            tokens. Press C to toggle them from the keyboard.
          </Text>
        </VStack>
      }
    >
      <Player tokens={{ 'cue-size': size }} onReady={(p) => { onReady(p); p.setTextTrack(0); }} />
    </Frame>
  );
}

type Chapter = { start: number; end: number; title: string };

function ChaptersDemo() {
  const [player, setPlayer] = useState<TP | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [current, setCurrent] = useState<string>();
  return (
    <Frame
      slug="chapters"
      code={`import { chapters } from '@tomato-player/plugin-chapters';

const player = createPlayer('#player', {
  src: 'movie.mp4',
  skin: learn(),
  plugins: [chapters({ chapters: '/chapters.vtt' })],
});

player.on('plugin:chapterchange', (chapter) => highlight(chapter.title));
const list = player.plugin('chapters').list();`}
      side={
        <Card padding={2} variant="muted">
          <VStack gap={1}>
            <Text weight="semibold">Chapters</Text>
            {chapters.length === 0 && <Text color="secondary">Loading chapters…</Text>}
            {chapters.map((c) => (
              <Button
                key={c.start}
                label={`${fmt(c.start)}  ${c.title}`}
                variant={current === c.title ? 'primary' : 'ghost'}
                onClick={() => {
                  player?.seek(c.start);
                  void player?.play();
                }}
              />
            ))}
          </VStack>
        </Card>
      }
    >
      <Player
        skin="learn"
        plugins={['hotkeys', 'chapters']}
        onReady={(p) => {
          setPlayer(p);
          const api = p.plugin<{ list(): Chapter[] }>('chapters');
          const sync = () => setChapters(api?.list() ?? []);
          sync();
          const offs = [p.on('plugin:chapters', sync), p.on('plugin:chapterchange', (c) => setCurrent((c as Chapter | undefined)?.title))];
          return () => offs.forEach((off) => off());
        }}
      />
    </Frame>
  );
}

const PLAYLIST = [
  { src: MEDIA.mp4, title: 'Big Buck Bunny', poster: MEDIA.poster },
  { src: MEDIA.tears, title: 'Tears of Steel (HLS)' },
  { src: MEDIA.hls, title: 'Big Buck Bunny (HLS, Mux)' },
];

function PlaylistDemo() {
  const [player, setPlayer] = useState<TP | null>(null);
  const [index, setIndex] = useState(0);
  type API = { play(i: number): Promise<void>; next(): Promise<void>; previous(): Promise<void> };
  const api = () => player?.plugin<API>('playlist');
  return (
    <Frame
      slug="playlist"
      code={`import { playlist } from '@tomato-player/plugin-playlist';
import { hls } from '@tomato-player/provider-hls';

const player = createPlayer('#player', {
  skin: stream({ onNext: () => player.plugin('playlist').next() }),
  providers: [hls()],
  plugins: [
    playlist({
      items: [
        { src: 'bunny.webm', title: 'Big Buck Bunny' },
        { src: 'tears-of-steel.m3u8', title: 'Tears of Steel' },
        { src: 'bunny.m3u8', title: 'Big Buck Bunny (HLS)' },
      ],
      loop: true,
    }),
  ],
});

player.on('plugin:playlistchange', ({ index }) => console.log('now playing', index));`}
      side={
        <Card padding={2} variant="muted">
          <VStack gap={1}>
            <Text weight="semibold">Up next</Text>
            {PLAYLIST.map((item, i) => (
              <Button key={item.title} label={`${i + 1}. ${item.title}`} variant={i === index ? 'primary' : 'ghost'} onClick={() => void api()?.play(i)} />
            ))}
            <HStack gap={2}>
              <Button label="Previous" onClick={() => void api()?.previous()} />
              <Button label="Next" onClick={() => void api()?.next()} />
            </HStack>
          </VStack>
        </Card>
      }
    >
      <Player
        skin="stream"
        source={PLAYLIST[0]!.src}
        skinOptions={{ subtitle: 'Playlist demo', onNext: () => undefined }}
        plugins={['hotkeys', 'playlist']}
        pluginOptions={{ playlist: { items: PLAYLIST, loop: true } }}
        captions={false}
        onReady={(p) => {
          setPlayer(p);
          return p.on('plugin:playlistchange', (e) => setIndex((e as { index: number }).index));
        }}
      />
    </Frame>
  );
}

type LogRow = { id: number; time: string; type: string; detail: string };

function AnalyticsDemo() {
  const [rows, setRows] = useState<LogRow[]>([]);
  return (
    <Frame
      slug="analytics"
      code={`import { analytics } from '@tomato-player/plugin-analytics';

createPlayer('#player', {
  src: 'movie.mp4',
  skin: minimal(),
  plugins: [
    analytics({
      heartbeat: 10_000,
      onEvent: (event) => navigator.sendBeacon('/qoe', JSON.stringify(event)),
    }),
  ],
});`}
    >
      <Player
        plugins={['hotkeys', 'analytics']}
        pluginOptions={{
          analytics: {
            heartbeat: 5000,
            onEvent: (e: Record<string, unknown>) =>
              setRows((r) =>
                [
                  {
                    id: Date.now() + Math.random(),
                    time: new Date().toLocaleTimeString(),
                    type: String(e.type),
                    detail: Object.entries(e)
                      .filter(([k]) => k !== 'type')
                      .map(([k, v]) => `${k}: ${typeof v === 'number' ? Math.round(v * 100) / 100 : String(v).slice(0, 60)}`)
                      .join(' · '),
                  },
                  ...r,
                ].slice(0, 40),
              ),
          },
        }}
      />
      <Card padding={0}>
        <Table
          data={rows}
          idKey="id"
          density="compact"
          emptyState={<Text color="secondary">Press play, seek and pause to see events.</Text>}
          columns={[
            { key: 'time', header: 'Time' },
            { key: 'type', header: 'Event', renderCell: (r) => <Badge label={r.type} variant="red" /> },
            { key: 'detail', header: 'Payload' },
          ]}
        />
      </Card>
    </Frame>
  );
}

const KEYS: [string, string][] = [
  ['Space', 'Play or pause'],
  ['K', 'Play or pause'],
  ['J', 'Back 10 seconds'],
  ['L', 'Forward 10 seconds'],
  ['←', 'Back 5 seconds'],
  ['→', 'Forward 5 seconds'],
  ['↑', 'Volume up'],
  ['↓', 'Volume down'],
  ['Home', 'Go to start'],
  ['End', 'Go to end'],
  ['M', 'Mute or unmute'],
  ['F', 'Fullscreen'],
  ['C', 'Captions on or off'],
  ['I', 'Picture-in-picture'],
];

function KeyboardDemo() {
  return (
    <Frame
      slug="keyboard-and-gestures"
      code={`import { hotkeys } from '@tomato-player/plugin-hotkeys';
import { gestures } from '@tomato-player/plugin-gestures';

createPlayer('#player', {
  src: 'movie.mp4',
  skin: minimal(),
  plugins: [
    hotkeys({ scope: 'focus', bindings: { p: (player) => player.togglePip(), i: null } }),
    gestures({ seekStep: 10 }),
  ],
});`}
      side={
        <Table
          data={KEYS.map(([key, action]) => ({ key, action }))}
          idKey="key"
          density="compact"
          columns={[
            { key: 'key', header: 'Key', renderCell: (r) => <Kbd keys={r.key} /> },
            { key: 'action', header: 'Action' },
          ]}
        />
      }
    >
      <Player plugins={['hotkeys', 'gestures']} />
      <Text color="secondary" as="p">
        Click or tab into the player, then use the keys on the right. On a phone, double-tap either side of the video to
        jump 10 seconds; taps in a row add up.
      </Text>
    </Frame>
  );
}

function ThemingDemo() {
  const [accent, setAccent] = useState('#e5372a');
  const [radius, setRadius] = useState('12px');
  const [size, setSize] = useState('40px');
  const tokens = { accent: accent === 'default' ? '#e5372a' : accent, radius, 'control-size': size };
  return (
    <Frame
      slug="theming"
      code={`createPlayer('#player', {
  src: 'movie.mp4',
  skin: minimal(),
  tokens: ${JSON.stringify(tokens, null, 2).replace(/\n/g, '\n  ')},
});

/* or in CSS */
.tomato-player { --tp-accent: ${tokens.accent}; --tp-radius: ${radius}; --tp-control-size: ${size}; }`}
      side={
        <VStack gap={4}>
          <VStack gap={2}>
            <Text weight="semibold">Accent</Text>
            <AccentPicker value={accent} onChange={setAccent} />
          </VStack>
          <VStack gap={2}>
            <Text weight="semibold">Corner radius</Text>
            <SegmentedControl label="Corner radius" value={radius} onChange={setRadius}>
              <SegmentedControlItem value="0px" label="Square" />
              <SegmentedControlItem value="12px" label="Soft" />
              <SegmentedControlItem value="24px" label="Round" />
            </SegmentedControl>
          </VStack>
          <VStack gap={2}>
            <Text weight="semibold">Control size</Text>
            <SegmentedControl label="Control size" value={size} onChange={setSize}>
              <SegmentedControlItem value="32px" label="Compact" />
              <SegmentedControlItem value="40px" label="Default" />
              <SegmentedControlItem value="52px" label="Large" />
            </SegmentedControl>
          </VStack>
          <Text color="secondary" as="p">
            Every skin reads the same --tp-* design tokens. Change them per player, per page or globally, with no rebuild.
          </Text>
        </VStack>
      }
    >
      <Player tokens={tokens} />
    </Frame>
  );
}

function ReactDemo() {
  const [Comp, setComp] = useState<null | typeof import('@tomato-player/react')>(null);
  const [skin, setSkin] = useState<unknown>(null);
  const [player, setPlayer] = useState<TP | null>(null);
  const time = usePlayerState(player, (s) => s.currentTime, 0);
  const paused = usePlayerState(player, (s) => s.paused, true);
  const volume = usePlayerState(player, (s) => s.volume, 1);
  const rate = usePlayerState(player, (s) => s.playbackRate, 1);
  useEffect(() => {
    void Promise.all([import('@tomato-player/react'), import('@tomato-player/skin-creator')]).then(([r, s]) => {
      setComp(r);
      setSkin(s.creator());
    });
  }, []);
  return (
    <Frame
      slug="react"
      code={`'use client';
import { TomatoPlayer, usePlayer, usePlayerState } from '@tomato-player/react';
import { creator } from '@tomato-player/skin-creator';

const skin = creator();

export function Video() {
  const [ref, player] = usePlayer();
  const time = usePlayerState(player, (s) => s.currentTime, 0);
  const paused = usePlayerState(player, (s) => s.paused, true);

  return (
    <>
      <TomatoPlayer ref={ref} src="movie.mp4" title="Big Buck Bunny" skin={skin} />
      <p>{paused ? 'Paused' : 'Playing'} at {time.toFixed(1)} s</p>
      <button onClick={() => player?.setPlaybackRate(2)}>2×</button>
    </>
  );
}`}
      side={
        <VStack gap={3}>
          <Card padding={4} variant="muted">
            <MetadataList title="usePlayerState()">
              <MetadataListItem label="Status">{paused ? 'Paused' : 'Playing'}</MetadataListItem>
              <MetadataListItem label="Time">{(time ?? 0).toFixed(1)} s</MetadataListItem>
              <MetadataListItem label="Volume">{Math.round((volume ?? 1) * 100)}%</MetadataListItem>
              <MetadataListItem label="Speed">{rate}×</MetadataListItem>
            </MetadataList>
          </Card>
          <HStack gap={2} wrap="wrap">
            <Button label={paused ? 'Play' : 'Pause'} variant="primary" onClick={() => (paused ? void player?.play() : player?.pause())} />
            <Button label="Back 10 s" onClick={() => player?.seekBy(-10)} />
            <Button label="1×" onClick={() => player?.setPlaybackRate(1)} />
            <Button label="2×" onClick={() => player?.setPlaybackRate(2)} />
          </HStack>
          <Text color="secondary" as="p">
            These Astryx buttons drive the player through its ref, and the panel re-renders from usePlayerState, a
            useSyncExternalStore hook.
          </Text>
        </VStack>
      }
    >
      {Comp && skin ? (
        <Comp.TomatoPlayer
          ref={setPlayer}
          src={MEDIA.mp4}
          poster={MEDIA.poster}
          title={MEDIA.title}
          tracks={tracks()}
          crossOrigin="anonymous"
          skin={skin as never}
          className="tp-host"
        />
      ) : (
        <Player captions={false} label="Loading React demo" />
      )}
    </Frame>
  );
}

function WebComponentDemo() {
  const [ready, setReady] = useState(false);
  const [skin, setSkin] = useState('cinema');
  useEffect(() => {
    void import('tomato-player/element').then(() => setReady(true));
  }, []);
  return (
    <Frame
      slug="web-component"
      code={`<script type="module">
  import 'tomato-player/element';
</script>

<tomato-player
  src="${MEDIA.mp4}"
  poster="${MEDIA.poster}"
  title="Big Buck Bunny"
  skin="${skin}"
  accent="#e5372a"
  chapters="/chapters.vtt"
></tomato-player>`}
      side={
        <VStack gap={3}>
          <Text weight="semibold">skin attribute</Text>
          <SegmentedControl label="Skin attribute" value={skin} onChange={setSkin}>
            {['minimal', 'cinema', 'studio', 'creator', 'tube'].map((s) => (
              <SegmentedControlItem key={s} value={s} label={s} />
            ))}
          </SegmentedControl>
          <Text color="secondary" as="p">
            Changing the attribute swaps the skin on the live element. The same element is in the CDN build, so it also
            works with a single script tag and no bundler.
          </Text>
          <Button label="Open the no-build CDN page" href={asset('/examples/cdn/')} as={PlainLink} />
        </VStack>
      }
    >
      {ready ? (
        createElement('tomato-player', {
          src: MEDIA.mp4,
          poster: MEDIA.poster,
          title: MEDIA.title,
          skin,
          accent: '#e5372a',
          chapters: asset('/media/chapters.vtt'),
          class: 'tp-host',
          style: { display: 'block' },
        })
      ) : (
        <Text color="secondary">Loading the custom element…</Text>
      )}
    </Frame>
  );
}

function VerticalDemo() {
  return (
    <Frame
      slug="vertical-video"
      code={`import { campus } from '@tomato-player/skin-campus';
import { feed } from '@tomato-player/skin-feed';

createPlayer('#reel', { src: 'reel.mp4', aspectRatio: '9 / 16', skin: campus({ autoplayInView: true }) });
createPlayer('#post', { src: 'post.mp4', aspectRatio: '9 / 16', skin: feed() }); // muted autoplay in view`}
    >
      <Grid columns={{ minWidth: 280, repeat: 'fit' }} gap={6}>
        <VStack gap={2}>
          <Player skin="campus" options={{ aspectRatio: '9 / 16' }} label="Campus skin, portrait" />
          <Text weight="semibold">Campus</Text>
        </VStack>
        <VStack gap={2}>
          <Player skin="feed" skinOptions={{ autoplayInView: true }} options={{ aspectRatio: '9 / 16', muted: true }} label="Feed skin, portrait" />
          <Text weight="semibold">Feed · autoplays muted in view</Text>
        </VStack>
      </Grid>
    </Frame>
  );
}

function PersistDemo() {
  const [saved, setSaved] = useState<string>('{}');
  useEffect(() => {
    const read = () => {
      const entries = Object.keys(localStorage)
        .filter((k) => k.startsWith('tomato'))
        .map((k) => `${k} = ${localStorage.getItem(k)}`);
      setSaved(entries.join('\n') || 'Nothing saved yet');
    };
    read();
    const id = setInterval(read, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Frame
      slug="persist"
      code={`import { persist } from '@tomato-player/plugin-persist';

createPlayer('#player', {
  src: 'movie.mp4',
  skin: minimal(),
  plugins: [persist({ resume: true })], // volume, speed, captions and position`}
      side={
        <VStack gap={3}>
          <Text weight="semibold">localStorage</Text>
          <Code code={saved} language="plaintext" />
          <Button label="Reload the page" variant="primary" onClick={() => location.reload()} />
          <Button
            label="Forget everything"
            variant="ghost"
            onClick={() => Object.keys(localStorage).filter((k) => k.startsWith('tomato')).forEach((k) => localStorage.removeItem(k))}
          />
        </VStack>
      }
    >
      <Player plugins={['hotkeys', 'persist']} />
      <Text color="secondary" as="p">
        Change the volume, speed or captions, play for a bit, then reload. The player comes back the way you left it.
      </Text>
    </Frame>
  );
}

export function DemoView({ slug }: { slug: string }) {
  switch (slug) {
    case 'hls-streaming':
      return <HlsDemo />;
    case 'dash-streaming':
      return <HlsDemo dash />;
    case 'captions':
      return <CaptionsDemo />;
    case 'chapters':
      return <ChaptersDemo />;
    case 'playlist':
      return <PlaylistDemo />;
    case 'analytics':
      return <AnalyticsDemo />;
    case 'keyboard-and-gestures':
      return <KeyboardDemo />;
    case 'theming':
      return <ThemingDemo />;
    case 'react':
      return <ReactDemo />;
    case 'web-component':
      return <WebComponentDemo />;
    case 'vertical-video':
      return <VerticalDemo />;
    case 'persist':
      return <PersistDemo />;
    default:
      return null;
  }
}
