'use client';

import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Player } from '@/components/Player';
import { CodeTabs } from '@/components/blocks';
import { DEMOS, FAQ, MEDIA, PLUGINS, SKINS, asset, type SkinSlug } from '@/lib/site';
import { FRAMEWORK_TABS, INSTALL } from '@/lib/snippets';

export const edition = (slug: SkinSlug) => String(SKINS.findIndex((s) => s.slug === slug) + 1).padStart(2, '0');

export interface HomeStats {
  core: string;
  cdn: string;
  packages: number;
  skins: Record<string, string>;
}

const THEMING = `createPlayer('#player', {
  src: 'movie.mp4',
  skin: cinema({ eyebrow: 'Now showing' }),
  tokens: { accent: '#e5402c', radius: '4px' },
});`;

export function Home({ stats }: { stats: HomeStats }) {
  const [skin, setSkin] = useState<SkinSlug>('cinema');
  const active = SKINS.find((s) => s.slug === skin)!;
  const strip = useRef<HTMLDivElement>(null);

  const spec: [string, string][] = [
    ['Core', `${stats.core} gzip, zero dependencies, SSR-safe.`],
    ['Streaming', 'HLS through hls.js (native on Safari) and DASH through dash.js, both loaded only when a stream needs them.'],
    ['Captions', 'WebVTT in any language, a styled caption layer, chapters on the seek bar.'],
    ['Access', 'Labelled buttons and sliders, visible focus, keyboard shortcuts, reduced motion respected.'],
    ['Frameworks', 'React, Vue and Svelte bindings, a <tomato-player> element and a one-file CDN build.'],
    ['Plugins', `${PLUGINS.length} official, from analytics and playlists to Media Session.`],
    ['Packages', `${stats.packages} on one version, MIT licensed. The all-in-one build is ${stats.cdn}.`],
  ];

  // Arrow keys move through the edition strip like a set of radio buttons.
  const onStripKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = SKINS.findIndex((s) => s.slug === skin);
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? SKINS.length - 1 : -2;
    if (next === -2) return;
    e.preventDefault();
    const s = SKINS[(next + SKINS.length) % SKINS.length]!;
    setSkin(s.slug);
    strip.current?.querySelector<HTMLButtonElement>(`[data-slug="${s.slug}"]`)?.focus();
  };

  return (
    <div className="cx">
      {/* First viewport: the collection on its stand. */}
      <section className="cx-hero" aria-labelledby="cx-title">
        <div className="cx-hero-copy">
          <Heading level={1} type="display-1" id="cx-title" textWrap="balance">
            Nine players. One engine.
          </Heading>
          <Text type="large" color="secondary" as="p" textWrap="pretty">
            Tomato Player is an open-source web video player whose whole interface is a skin you can swap. Pick an
            edition: same film, same {stats.core} core, a different player.
          </Text>
          <HStack gap={2} wrap="wrap">
            <Button label="Get started" variant="primary" size="lg" href="/docs/getting-started/" />
            <Button label="Browse the collection" size="lg" href="/skins/" />
          </HStack>

        </div>

          <div className="cx-colophon" aria-live="polite">
          <div className="cx-edition" key={skin}>
            <span className="cx-edition-no">No.</span>
            <span className="cx-edition-num">{edition(skin)}</span>
          </div>
          <div className="cx-colophon-body">
            <p className="cx-colophon-name">
              {active.name}
              {active.unofficial && <span className="cx-tag">Unofficial</span>}
            </p>
            <dl className="cx-facts">
              <dt>Package</dt>
              <dd>
                <code>@tomato-player/skin-{skin}</code>
              </dd>
              <dt>Weight</dt>
              <dd>{stats.skins[skin]} gzip</dd>
              <dt>Accent</dt>
              <dd>
                <span className="cx-swatch" style={{ background: active.accent }} aria-hidden="true" />
                {active.accent}
              </dd>
              <dt>For</dt>
              <dd>{active.bestFor}</dd>
            </dl>
            <Link className="cx-more" href={`/skins/${skin}/`}>
              Open No.{edition(skin)} {active.name}
            </Link>
          </div>
        </div>
        <div className="cx-cover">
          <Player
            skin={skin}
            plugins={['hotkeys', 'gestures', 'chapters']}
            label={`Live player, ${active.name} skin`}
            options={active.portrait ? { aspectRatio: '9 / 16' } : undefined}
          />
        </div>

        <div className="cx-strip" role="radiogroup" aria-label="Choose a skin" ref={strip} onKeyDown={onStripKey}>
          {SKINS.map((s) => {
            const on = s.slug === skin;
            return (
              <button
                key={s.slug}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                data-slug={s.slug}
                className="cx-strip-item"
                onClick={() => setSkin(s.slug)}
              >
                <img src={asset(`/assets/skin-${s.slug}.png`)} alt="" width={320} height={180} loading="lazy" decoding="async" />
                <span className="cx-strip-label">
                  <span className="cx-strip-num">{edition(s.slug)}</span>
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* The catalogue index. */}
      <section className="cx-section" aria-labelledby="cx-index">
        <header className="cx-section-head">
          <Heading level={2} id="cx-index" type="display-3">
            The collection
          </Heading>
          <Text color="secondary" as="p" textWrap="pretty">
            Each edition is a complete interface in its own package. Install one, theme it with tokens, or replace it
            with your own.
          </Text>
        </header>
        <ol className="cx-index">
          {SKINS.map((s) => (
            <li key={s.slug}>
              <Link href={`/skins/${s.slug}/`} className="cx-index-row">
                <span className="cx-index-num">{edition(s.slug)}</span>
                <img src={asset(`/assets/skin-${s.slug}.png`)} alt="" width={160} height={90} loading="lazy" decoding="async" />
                <span className="cx-index-name">
                  {s.name}
                  {s.unofficial && <span className="cx-tag">Unofficial</span>}
                </span>
                <span className="cx-index-summary">{s.summary}</span>
                <span className="cx-index-meta">
                  <span className="cx-swatch" style={{ background: s.accent }} aria-hidden="true" />
                  {stats.skins[s.slug]}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* What every edition shares. */}
      <section className="cx-section cx-split" aria-labelledby="cx-engine">
        <header className="cx-section-head">
          <Heading level={2} id="cx-engine" type="display-3">
            Under every edition
          </Heading>
          <Text color="secondary" as="p" textWrap="pretty">
            Skins change the interface, never the engine. Streaming, captions and accessibility work the same in all
            nine, and in the one you write next.
          </Text>
          <HStack gap={2} wrap="wrap">
            <Button label="Architecture" href="/docs/concepts/architecture/" />
            <Button label="Packages" variant="ghost" href="/packages/" />
          </HStack>
        </header>
        <dl className="cx-spec">
          {spec.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cx-section cx-split" aria-labelledby="cx-frameworks">
        <header className="cx-section-head">
          <Heading level={2} id="cx-frameworks" type="display-3">
            Drop it into your stack
          </Heading>
          <Text color="secondary" as="p" textWrap="pretty">
            Thin bindings over one engine. The core never touches window at import, so Next.js, Nuxt and SvelteKit
            render it on the server without guards.
          </Text>
          <CodeBlock code={INSTALL} language="bash" hasLanguageLabel={false} width="100%" />
        </header>
        <CodeTabs tabs={FRAMEWORK_TABS} label="Framework examples" />
      </section>

      {/* Make your own. */}
      <section className="cx-section cx-split" aria-labelledby="cx-yours">
        <header className="cx-section-head">
          <Heading level={2} id="cx-yours" type="display-3">
            Edition {String(SKINS.length + 1).padStart(2, '0')} is yours
          </Heading>
          <Text color="secondary" as="p" textWrap="pretty">
            Start by changing tokens on a skin you like. When you need a different layout, build a skin from the same UI
            primitives the official ones use and publish it as a package.
          </Text>
          <HStack gap={2} wrap="wrap">
            <Button label="Make your own skin" variant="primary" href="/docs/guides/custom-skins/" />
            <Button label="Theme a skin" href="/docs/guides/skins/" />
          </HStack>
        </header>
        <CodeBlock code={THEMING} language="ts" title="player.ts" width="100%" />
      </section>

      {/* Plugins and demos as two short indexes. */}
      <section className="cx-section cx-lists" aria-label="Plugins and demos">
        <div>
          <HStack hAlign="between" vAlign="end" gap={4}>
            <Heading level={2} type="display-3">
              Plugins
            </Heading>
            <Link className="cx-more" href="/plugins/">
              All plugins
            </Link>
          </HStack>
          <ul className="cx-list">
            {PLUGINS.map((p) => (
              <li key={p.slug}>
                <Link href={`/plugins/${p.slug}/`}>
                  <span className="cx-list-name">{p.name}</span>
                  <span className="cx-list-text">{p.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <HStack hAlign="between" vAlign="end" gap={4}>
            <Heading level={2} type="display-3">
              Live demos
            </Heading>
            <Link className="cx-more" href="/demos/">
              All demos
            </Link>
          </HStack>
          <ul className="cx-list">
            {DEMOS.slice(0, 8).map((d) => (
              <li key={d.slug}>
                <Link href={`/demos/${d.slug}/`}>
                  <span className="cx-list-name">{d.title}</span>
                  <span className="cx-list-text">{d.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cx-section cx-split" aria-labelledby="cx-faq">
        <header className="cx-section-head">
          <Heading level={2} id="cx-faq" type="display-3">
            Questions
          </Heading>
          <Text color="secondary" as="p">
            Anything else is in the <Link href="/docs/">docs</Link> or on{' '}
            <a href="https://github.com/playlikeboy/tomato-player/issues" target="_blank" rel="noopener">
              GitHub issues
            </a>
            .
          </Text>
        </header>
        <dl className="cx-faq">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cx-close" aria-labelledby="cx-close">
        <VStack gap={4} maxWidth={720}>
          <Heading level={2} id="cx-close" type="display-2" textWrap="balance">
            Ship a player that looks like your product.
          </Heading>
          <p className="cx-close-text">Free and MIT licensed. Read the docs, star the repo, or start edition {SKINS.length + 1}.</p>
          <HStack gap={2} wrap="wrap">
            <Link className="cx-close-btn" href="/docs/getting-started/">
              Get started
            </Link>
            <a className="cx-close-btn cx-close-btn-ghost" href="https://github.com/playlikeboy/tomato-player" target="_blank" rel="noopener">
              Star on GitHub
            </a>
          </HStack>
          <p className="cx-credit">{MEDIA.credit}</p>
        </VStack>
      </section>
    </div>
  );
}
