import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import type { Player } from '@tomato-player/core';
import { TomatoPlayer } from '../src';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<TomatoPlayer />', () => {
  it('renders an empty div on the server (no window access)', () => {
    const html = renderToString(createElement(TomatoPlayer, { src: 'a.mp4', className: 'x' }));
    expect(html).toBe('<div class="x"></div>');
  });

  it('creates once under StrictMode, updates src in place, destroys on unmount', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    const onReady = vi.fn();
    await act(async () => {
      root.render(createElement(StrictMode, null, createElement(TomatoPlayer, { src: 'a.mp4', onReady })));
    });
    // StrictMode mounts, unmounts, mounts again: the first instance must be destroyed.
    const players = onReady.mock.calls.map((c) => c[0] as Player);
    expect(players.at(-1)!.destroyed).toBe(false);
    expect(players.slice(0, -1).every((p) => p.destroyed)).toBe(true);
    expect(host.querySelectorAll('video')).toHaveLength(1);

    const player = players.at(-1)!;
    const setSource = vi.spyOn(player, 'setSource');
    await act(async () => {
      root.render(createElement(StrictMode, null, createElement(TomatoPlayer, { src: 'b.mp4', onReady })));
    });
    expect(setSource).toHaveBeenCalledWith('b.mp4', expect.anything());
    await act(async () => root.unmount());
    expect(player.destroyed).toBe(true);
  });
});
