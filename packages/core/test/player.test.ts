import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlayer, defineProvider, defineSkin, definePlugin } from '../src';

afterEach(() => {
  document.body.innerHTML = '';
});

function mount() {
  const host = document.createElement('div');
  document.body.appendChild(host);
  return host;
}

describe('createPlayer', () => {
  it('creates a video inside a container and reflects state as data attributes', () => {
    const host = mount();
    const player = createPlayer(host, { title: 'Demo' });
    expect(host.classList.contains('tp')).toBe(true);
    expect(host.querySelector('video.tp-media')).toBe(player.media);
    expect(player.media.playsInline).toBe(true);
    expect(host.hasAttribute('data-paused')).toBe(true);
    expect(host.getAttribute('aria-label')).toBe('Demo');
    player.store.set({ waiting: true });
    expect(host.hasAttribute('data-waiting')).toBe(true);
    player.destroy();
    expect(host.classList.contains('tp')).toBe(false);
    expect(host.querySelector('video')).toBeNull();
  });

  it('wraps an existing <video> and unwraps it on destroy', () => {
    const host = mount();
    const video = document.createElement('video');
    host.appendChild(video);
    const player = createPlayer(video);
    expect(video.parentElement).toBe(player.el);
    expect(player.el.parentElement).toBe(host);
    player.destroy();
    expect(video.parentElement).toBe(host);
  });

  it('picks the first provider that can play the source', async () => {
    const load = vi.fn();
    const fake = defineProvider({
      name: 'fake',
      canPlay: (s) => s.src.endsWith('.fake'),
      create: () => ({ load, destroy() {} }),
    });
    const player = createPlayer(mount(), { providers: [fake] });
    await player.setSource('movie.fake');
    expect(player.state.provider).toBe('fake');
    expect(load).toHaveBeenCalledWith({ src: 'movie.fake' });
    await player.setSource('movie.mp4');
    expect(player.state.provider).toBe('native');
    expect(player.state.source?.type).toBe('video/mp4');
  });

  it('reports NO_PROVIDER for DASH without a dash provider', async () => {
    const player = createPlayer(mount());
    const onError = vi.fn();
    player.on('error', onError);
    await player.setSource('stream.mpd');
    expect(player.state.error?.code).toBe('NO_PROVIDER');
    expect(onError).toHaveBeenCalledOnce();
  });

  it('mounts, swaps and cleans up skins with design tokens', () => {
    const cleanup = vi.fn();
    const a = defineSkin({
      name: 'a',
      css: '.x{}',
      tokens: { accent: 'red' },
      mount: (_p, root) => {
        root.innerHTML = '<button class="a">a</button>';
        return cleanup;
      },
    });
    const b = defineSkin({ name: 'b', mount: (_p, root) => void (root.innerHTML = '<i class="b"></i>') });
    const player = createPlayer(mount(), { skin: a, tokens: { radius: '8px' } });
    expect(player.el.dataset.skin).toBe('a');
    expect(player.el.style.getPropertyValue('--tp-accent')).toBe('red');
    expect(player.el.style.getPropertyValue('--tp-radius')).toBe('8px');
    expect(document.querySelector('style[data-tomato="skin-a"]')).not.toBeNull();
    player.setSkin(b);
    expect(cleanup).toHaveBeenCalledOnce();
    expect(player.el.querySelector('.a')).toBeNull();
    expect(player.el.querySelector('.b')).not.toBeNull();
    expect(player.el.style.getPropertyValue('--tp-accent')).toBe('');
  });

  it('runs plugins once, exposes their API and destroys them in reverse order', () => {
    const order: string[] = [];
    const make = (name: string) =>
      definePlugin<{ hello: () => string }>({
        name,
        setup: () => ({ api: { hello: () => name }, destroy: () => order.push(name) }),
      });
    const player = createPlayer(mount(), { plugins: [make('one'), make('two')] });
    expect(player.plugin<{ hello: () => string }>('two')?.hello()).toBe('two');
    expect(player.use(make('one'))?.hello()).toBe('one');
    player.destroy();
    expect(order).toEqual(['two', 'one']);
  });

  it('shares capabilities through provide/inject', () => {
    const player = createPlayer(mount());
    player.provide('answer', 42);
    expect(player.inject<number>('answer')).toBe(42);
  });

  it('clamps volume and unmutes when volume is raised', () => {
    const player = createPlayer(mount(), { muted: true });
    player.setVolume(3);
    expect(player.media.volume).toBe(1);
    expect(player.media.muted).toBe(false);
  });

  it('localizes strings', () => {
    const player = createPlayer(mount(), { i18n: { play: 'Lecture' } });
    expect(player.t('play')).toBe('Lecture');
    expect(player.t('pause')).toBe('Pause');
  });

  it('never throws from destroy() twice', () => {
    const player = createPlayer(mount());
    player.destroy();
    expect(() => player.destroy()).not.toThrow();
    expect(player.destroyed).toBe(true);
  });
});

describe('pseudo fullscreen fallback', () => {
  it('pins the player with CSS when the Fullscreen API is missing', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    (host as any).requestFullscreen = undefined;
    const player = createPlayer(host, { fullscreenFallback: 'pseudo' });
    await player.enterFullscreen();
    expect(player.state.fullscreen).toBe(true);
    expect(host.hasAttribute('data-pseudo-fullscreen')).toBe(true);
    await player.exitFullscreen();
    expect(player.state.fullscreen).toBe(false);
    expect(host.hasAttribute('data-pseudo-fullscreen')).toBe(false);
  });
});
