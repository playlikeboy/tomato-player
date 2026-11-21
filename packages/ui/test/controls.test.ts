import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlayer } from '@tomato-player/core';
import { captionsButton, playButton, settingsMenu, slider, timeDisplay, timeSlider } from '../src';

afterEach(() => {
  document.body.innerHTML = '';
});

const make = () => {
  const host = document.createElement('div');
  document.body.append(host);
  return createPlayer(host);
};

describe('ui controls', () => {
  it('play button reflects state with accessible labels', () => {
    const player = make();
    const btn = playButton(player);
    expect(btn.el.getAttribute('aria-label')).toBe('Play');
    player.store.set({ paused: false });
    expect(btn.el.getAttribute('aria-label')).toBe('Pause');
    player.store.set({ ended: true, paused: true });
    expect(btn.el.getAttribute('aria-label')).toBe('Replay');
    btn.destroy();
  });

  it('slider supports keyboard and reports aria values', () => {
    const onCommit = vi.fn();
    const s = slider({ label: 'Volume', onInput: () => {}, onCommit, step: 0.1 });
    document.body.append(s.el);
    s.setValue(0.5, '50%');
    expect(s.el.getAttribute('aria-valuenow')).toBe('50');
    s.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(onCommit).toHaveBeenLastCalledWith(0.6);
    s.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(onCommit).toHaveBeenLastCalledWith(0);
  });

  it('time slider seeks to the slider value', () => {
    const player = make();
    player.store.set({ duration: 100 });
    const seek = vi.spyOn(player, 'seek');
    const ts = timeSlider(player);
    ts.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(seek).toHaveBeenLastCalledWith(100);
  });

  it('time display shows current / duration', () => {
    const player = make();
    const td = timeDisplay(player);
    player.store.set({ currentTime: 65, duration: 600 });
    expect(td.el.textContent).toContain('1:05');
    expect(td.el.textContent).toContain('10:00');
  });

  it('captions button hides without tracks', () => {
    const player = make();
    const c = captionsButton(player);
    expect(c.el.hidden).toBe(true);
    player.store.set({ textTracks: [{ id: 0, label: 'English' }] });
    expect(c.el.hidden).toBe(false);
  });

  it('settings menu lists only relevant sections and applies a selection', () => {
    const player = make();
    const rate = vi.spyOn(player, 'setPlaybackRate');
    const menu = settingsMenu(player);
    player.el.append(menu.el);
    const trigger = menu.el.querySelector<HTMLButtonElement>('.tp-settings')!;
    trigger.click();
    const labels = [...menu.el.querySelectorAll('.tp-menu-label')].map((n) => n.textContent);
    expect(labels).toEqual(['Speed']);
    menu.el.querySelector<HTMLButtonElement>('.tp-menu-item')!.click();
    const twoX = [...menu.el.querySelectorAll<HTMLButtonElement>('.tp-menu-item')].find((b) => b.textContent?.startsWith('2×'))!;
    twoX.click();
    expect(rate).toHaveBeenCalledWith(2);
    expect(menu.el.querySelector('.tp-menu')!.hasAttribute('hidden')).toBe(true);
  });
});
