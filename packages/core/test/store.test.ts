import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../src/store';
import { Emitter } from '../src/emitter';
import { formatTime, normalizeSource } from '../src/utils';
import { translate } from '../src/i18n';

describe('createStore', () => {
  it('notifies only on real changes', () => {
    const store = createStore({ a: 1, b: 'x' });
    const fn = vi.fn();
    store.subscribe(fn);
    store.set({ a: 1 });
    expect(fn).not.toHaveBeenCalled();
    store.set({ a: 2 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(store.get()).toEqual({ a: 2, b: 'x' });
  });

  it('select fires immediately and on change of the selected value', () => {
    const store = createStore({ a: 1, b: 1 });
    const fn = vi.fn();
    store.select((s) => s.a, fn);
    store.set({ b: 2 });
    store.set({ a: 3 });
    expect(fn.mock.calls).toEqual([
      [1, undefined],
      [3, 1],
    ]);
  });
});

describe('Emitter', () => {
  it('supports on/once/off and isolates throwing listeners', () => {
    const e = new Emitter<{ x: number }>();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const a = vi.fn();
    const b = vi.fn();
    e.on('x', () => {
      throw new Error('boom');
    });
    e.on('x', a);
    e.once('x', b);
    e.emit('x', 1);
    e.emit('x', 2);
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('utils', () => {
  it('formats time', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(75)).toBe('1:15');
    expect(formatTime(3725)).toBe('1:02:05');
    expect(formatTime(-5)).toBe('-0:05');
    expect(formatTime(NaN)).toBe('0:00');
  });

  it('guesses source types from extensions', () => {
    expect(normalizeSource('a/b/video.mp4?x=1').type).toBe('video/mp4');
    expect(normalizeSource('live.m3u8').type).toBe('application/x-mpegurl');
    expect(normalizeSource('stream.mpd').type).toBe('application/dash+xml');
    expect(normalizeSource({ src: 'x', type: 'Video/MP4' }).type).toBe('video/mp4');
  });

  it('translates with variables and falls back to English', () => {
    expect(translate({}, 'seekForward', { seconds: 10 })).toBe('Forward 10 seconds');
    expect(translate({ play: 'Reproducir' }, 'play')).toBe('Reproducir');
    expect(translate({}, 'unknown-key')).toBe('unknown-key');
  });
});
