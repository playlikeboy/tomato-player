import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const bundle = fileURLToPath(new URL('../dist/tomato-player.global.js', import.meta.url));

describe.skipIf(!existsSync(bundle))('CDN bundle (run `pnpm build` first)', () => {
  it('exposes window.TomatoPlayer and upgrades <tomato-player>', async () => {
    new Function(readFileSync(bundle, 'utf8'))();
    const TP = (window as any).TomatoPlayer;
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
    expect(readFileSync(bundle, 'utf8')).not.toContain('MANIFEST_PARSED');
  });
});
