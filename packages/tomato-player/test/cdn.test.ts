import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const bundle = resolve(process.cwd(), 'packages/tomato-player/dist/tomato-player.global.js');

describe.skipIf(!existsSync(bundle))('CDN bundle (run `pnpm build` first)', () => {
  it('exposes window.TomatoPlayer and upgrades <tomato-player>', async () => {
    // The IIFE declares `var TomatoPlayer`; return it from a function scope.
    const TP = new Function(`${readFileSync(bundle, 'utf8')}\nreturn TomatoPlayer;`)();
    expect(typeof TP.createPlayer).toBe('function');
    expect(Object.keys(TP.skins)).toContain('campus');
    document.body.innerHTML = '<tomato-player src="movie.mp4" skin="cinema" title="Demo"></tomato-player>';
    await Promise.resolve();
    const el = document.querySelector('tomato-player') as HTMLElement & { player: any };
    expect(el.player).toBeTruthy();
    expect(el.dataset.skin).toBe('cinema');
    el.setAttribute('skin', 'tube');
    expect(el.dataset.skin).toBe('tube');
    el.remove();
    await Promise.resolve();
    expect(el.player).toBeNull();
  });

  it('does not inline streaming engines', () => {
    // hls.js alone is ~400 KB minified; the whole bundle must stay far below that.
    expect(readFileSync(bundle).length).toBeLessThan(150_000);
  });
});
