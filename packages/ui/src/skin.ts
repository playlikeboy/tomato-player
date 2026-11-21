import { defineSkin, injectStyle, type Player, type Skin } from '@tomato-player/core';
import baseCss from './base.css';
import type { Control } from './controls';

export interface SkinDefinition<O> {
  name: string;
  css: string;
  tokens?: Record<string, string>;
  /** Build controls. Return the controls you created; they are destroyed automatically. */
  build(player: Player, root: HTMLElement, options: O): (Control | null | undefined | false)[] | { controls: (Control | null | undefined | false)[]; cleanup?(): void };
}

/**
 * Create a configurable skin factory. Injects the shared base stylesheet once
 * (unless `injectStyles: false`), then the skin's own CSS via core.
 *
 * ```ts
 * export const minimal = createSkin<{ pip?: boolean }>({ name: 'minimal', css, build(player, root, o) { ... } });
 * createPlayer(el, { skin: minimal({ pip: false }) });
 * ```
 */
export function createSkin<O extends object = {}>(def: SkinDefinition<O>): (options?: O & { tokens?: Record<string, string> }) => Skin {
  return (options = {} as O) =>
    defineSkin({
      name: def.name,
      css: def.css,
      tokens: { ...def.tokens, ...(options as { tokens?: Record<string, string> }).tokens },
      mount(player, root) {
        if (player.options.injectStyles !== false) injectStyle('base', baseCss, root.ownerDocument);
        const out = def.build(player, root, options as O);
        const { controls, cleanup } = Array.isArray(out) ? { controls: out, cleanup: undefined } : out;
        const list = controls.filter(Boolean) as Control[];
        for (const c of list) if (!c.el.parentNode) root.append(c.el);
        return () => {
          cleanup?.();
          for (const c of list) c.destroy();
        };
      },
    });
}
