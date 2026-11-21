import { describe, expect, it } from 'vitest';
import { createPlayer } from '@tomato-player/core';
import { __camel__ } from '../src';

describe('__name__', () => {
  it('exposes its API', () => {
    const player = createPlayer(document.body.appendChild(document.createElement('div')), { plugins: [__camel__()] });
    expect(player.plugin<{ count(): number }>('__name__')?.count()).toBe(0);
    player.destroy();
  });
});
