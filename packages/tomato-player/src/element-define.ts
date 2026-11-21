import { createPlayer, isBrowser, type Player, type PlayerOptions, type Provider, type SourceObject, type TextTrackInit } from '@tomato-player/core';
import { hotkeys } from '@tomato-player/plugin-hotkeys';
import { gestures } from '@tomato-player/plugin-gestures';
import { chapters } from '@tomato-player/plugin-chapters';
import { thumbnails } from '@tomato-player/plugin-thumbnails';
import { skins, type SkinName } from './registry';

export interface TomatoElementConfig {
  /** Providers every element gets (e.g. `[hls()]`). */
  providers?: Provider[];
  /** Extra options merged into every player. */
  options?: PlayerOptions;
}

const OBSERVED = ['src', 'poster', 'title', 'skin', 'accent'] as const;

/**
 * Define `<tomato-player>`. Safe to call on the server (no-op) and more than once.
 *
 * ```html
 * <tomato-player src="movie.mp4" skin="cinema" poster="poster.jpg" title="Big Buck Bunny" hotkeys>
 *   <track kind="captions" src="en.vtt" srclang="en" label="English" default />
 * </tomato-player>
 * ```
 *
 * Boolean attributes: `autoplay`, `muted`, `loop`, `no-hotkeys`, `no-gestures`.
 * URL attributes: `thumbnails`, `chapters`. Token attribute: `accent`.
 */
export function defineTomatoElement(tag = 'tomato-player', config: TomatoElementConfig = {}): void {
  if (!isBrowser || customElements.get(tag)) return;

  class TomatoPlayerElement extends HTMLElement {
    static observedAttributes = [...OBSERVED];
    player: Player | null = null;

    connectedCallback() {
      if (this.player) return;
      if (!this.style.display) this.style.display = 'block';
      const sources: SourceObject[] = [...this.querySelectorAll('source')].map((s) => ({ src: s.src, type: s.type || undefined }));
      const tracks: TextTrackInit[] = [...this.querySelectorAll('track')].map((t) => ({
        src: t.src,
        kind: (t.kind as TextTrackInit['kind']) || 'subtitles',
        label: t.label,
        srclang: t.srclang,
        default: t.default,
      }));
      this.replaceChildren();
      const has = (n: string) => this.hasAttribute(n);
      const plugins = [
        !has('no-hotkeys') && hotkeys(),
        !has('no-gestures') && gestures(),
        has('chapters') && chapters({ chapters: this.getAttribute('chapters')! }),
        has('thumbnails') && thumbnails({ src: this.getAttribute('thumbnails')! }),
      ].filter(Boolean) as NonNullable<PlayerOptions['plugins']>;
      const src = this.getAttribute('src');
      this.player = createPlayer(this, {
        ...config.options,
        src: src ? [src] : sources.length ? sources : undefined,
        poster: this.getAttribute('poster') ?? undefined,
        title: this.getAttribute('title') ?? undefined,
        tracks,
        autoplay: has('autoplay'),
        muted: has('muted'),
        loop: has('loop'),
        providers: config.providers ?? config.options?.providers,
        plugins: [...plugins, ...(config.options?.plugins ?? [])],
        skin: this.resolveSkin(),
        tokens: this.getAttribute('accent') ? { accent: this.getAttribute('accent')! } : undefined,
      });
      this.dispatchEvent(new CustomEvent('ready', { detail: this.player }));
    }

    disconnectedCallback() {
      // Defer so moving the element in the DOM doesn't tear the player down.
      queueMicrotask(() => {
        if (!this.isConnected) {
          this.player?.destroy();
          this.player = null;
        }
      });
    }

    attributeChangedCallback(name: (typeof OBSERVED)[number], prev: string | null, next: string | null) {
      const p = this.player;
      if (!p || prev === next) return;
      if (name === 'src' && next) void p.setSource(next, { poster: this.getAttribute('poster') ?? undefined, title: this.getAttribute('title') ?? undefined });
      else if (name === 'skin') p.setSkin(this.resolveSkin());
      else if (name === 'poster' && next) p.media.poster = next;
      else if (name === 'title') p.store.set({ title: next });
      else if (name === 'accent') p.el.style.setProperty('--tp-accent', next ?? '');
    }

    private resolveSkin() {
      const name = (this.getAttribute('skin') ?? 'minimal') as SkinName | 'none';
      if (name === 'none') return null;
      const factory = skins[name] ?? skins.minimal;
      return factory();
    }
  }

  customElements.define(tag, TomatoPlayerElement);
}



