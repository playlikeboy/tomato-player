'use client';

// Site search: an Astryx CommandPalette over a Pagefind index built after `next build`.
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { CommandPalette } from '@astryxdesign/core/CommandPalette';
import { Kbd } from '@astryxdesign/core/Kbd';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { BASE_PATH } from '@/lib/site';

interface Hit {
  id: string;
  label: string;
  auxiliaryData: { excerpt: string; section?: string };
}

const QUICK: Hit[] = [
  ['/docs/getting-started/', 'Getting started', 'Docs'],
  ['/skins/', 'Skin gallery', 'Skins'],
  ['/plugins/', 'Plugins', 'Plugins'],
  ['/demos/', 'Live demos', 'Demos'],
  ['/playground/', 'Playground', 'Tools'],
  ['/docs/api/player/', 'Player API reference', 'Docs'],
  ['/docs/guides/streaming/', 'HLS and DASH streaming', 'Docs'],
  ['/docs/guides/create-a-skin/', 'Create a skin', 'Docs'],
].map(([url, label, section]) => ({ id: `${BASE_PATH}${url}`, label, auxiliaryData: { excerpt: '', section } }));

type Pagefind = {
  options(o: Record<string, unknown>): Promise<void>;
  debouncedSearch(q: string): Promise<{ results: { data(): Promise<{ url: string; excerpt: string; meta: { title?: string } }> }[] } | null>;
};

let pagefind: Promise<Pagefind | null> | undefined;
function loadPagefind() {
  // Loaded at runtime from the built site, so the bundler must not resolve it.
  const load = new Function('u', 'return import(u)') as (u: string) => Promise<Pagefind>;
  pagefind ??= load(`${BASE_PATH}/_pagefind/pagefind.js`)
    .then(async (pf) => {
      await pf.options({ baseUrl: `${BASE_PATH}/` });
      return pf;
    })
    .catch(() => null);
  return pagefind;
}

const strip = (html: string) => html.replace(/<[^>]+>/g, '');

export function Search() {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest('input, textarea, [contenteditable="true"]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const searchSource = useMemo(
    () => ({
      bootstrap: () => QUICK,
      async search(query: string): Promise<Hit[]> {
        const q = query.trim();
        if (!q) return QUICK;
        const pf = await loadPagefind();
        if (!pf) return QUICK.filter((h) => h.label.toLowerCase().includes(q.toLowerCase()));
        const res = await pf.debouncedSearch(q);
        if (!res) return [];
        const data = await Promise.all(res.results.slice(0, 12).map((r) => r.data()));
        return data.map((d) => ({
          id: d.url,
          label: d.meta.title ?? d.url,
          auxiliaryData: { excerpt: strip(d.excerpt) },
        }));
      },
    }),
    [],
  );

  return (
    <>
      <Button
        label="Search"
        variant="secondary"
        onClick={() => setOpen(true)}
        tooltip="Search the site ( / or Ctrl K )"
      >
        Search <Kbd keys="/" />
      </Button>
      <CommandPalette<Hit>
        isOpen={isOpen}
        onOpenChange={setOpen}
        label="Search Tomato Player"
        searchSource={searchSource}
        emptySearchText="No pages match. Try “hls”, “captions” or “skin”."
        onValueChange={(url) => {
          setOpen(false);
          window.location.assign(url);
        }}
        renderItem={(item) => (
          <VStack gap={0.5}>
            <Text weight="medium">{item.label}</Text>
            {item.auxiliaryData.excerpt ? (
              <Text type="supporting" color="secondary" maxLines={2}>
                {item.auxiliaryData.excerpt}
              </Text>
            ) : (
              <Text type="supporting" color="secondary">
                {item.auxiliaryData.section}
              </Text>
            )}
          </VStack>
        )}
      />
    </>
  );
}
