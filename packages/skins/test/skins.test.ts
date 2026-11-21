import { afterEach, describe, expect, it } from 'vitest';
import { createPlayer, type Skin } from '@tomato-player/core';
import { minimal } from '../minimal/src';
import { cinema } from '../cinema/src';
import { studio } from '../studio/src';
import { creator } from '../creator/src';
import { learn } from '../learn/src';
import { stream } from '../stream/src';
import { tube } from '../tube/src';
import { feed } from '../feed/src';
import { campus } from '../campus/src';
import { timecode } from '../studio/src';

afterEach(() => {
  document.body.innerHTML = '';
});

const skins: [string, () => Skin][] = [
  ['minimal', () => minimal()],
  ['cinema', () => cinema({ eyebrow: 'Original' })],
  ['studio', () => studio({ fps: 24 })],
  ['creator', () => creator({ gradient: ['#f00', '#00f'] })],
  ['learn', () => learn()],
  ['stream', () => stream({ onNext() {}, onBack() {} })],
  ['tube', () => tube({ onNext() {}, onTheater() {} })],
  ['feed', () => feed()],
  ['campus', () => campus()],
];

describe.each(skins)('skin %s', (name, make) => {
  it('mounts accessible controls and cleans up completely', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const player = createPlayer(host, { skin: make(), title: 'Demo' });
    expect(player.el.dataset.skin).toBe(name);
    const buttons = [...player.el.querySelectorAll('button')];
    expect(buttons.length).toBeGreaterThan(2);
    for (const b of buttons) {
      const named = b.getAttribute('aria-label') || b.textContent?.trim();
      expect(named, `${name}: button ${b.className} needs a name`).toBeTruthy();
    }
    expect(player.el.querySelector('[role="slider"]')).not.toBeNull();
    player.setSkin(null);
    expect(player.el.querySelector('.tp-skin')).toBeNull();
    player.destroy();
  });
});

it('studio formats SMPTE timecode', () => {
  expect(timecode(3661.5, 30)).toBe('01:01:01:15');
});
