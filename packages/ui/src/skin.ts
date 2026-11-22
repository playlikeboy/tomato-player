import { defineSkin, injectStyle, type Player, type Skin } from '@tomato-player/core';
import baseCss from './base.css';
import type { Control } from './controls';
import { setSkinIcons, type IconSet } from './icon';

export interface SkinDefinition<O> {
  name: string;
  css: string;
  tokens?: Record<string, string>;
  /** The skin's icon set. Names it leaves out use the default Tomato icons; `createPlayer({ icons })` overrides both. */
  icons?: IconSet;
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
export function createSkin<O extends object = {}>(def: SkinDefinition<O>): (options?: O & { tokens?: Record<string, string>; icons?: IconSet }) => Skin {
  return (options = {} as O) =>
    defineSkin({
      name: def.name,
      css: def.css,
      tokens: { ...def.tokens, ...(options as { tokens?: Record<string, string> }).tokens },
      mount(player, root) {
        if (player.options.injectStyles !== false) injectStyle('base', baseCss, root.ownerDocument);
        const own = (options as { icons?: IconSet }).icons;
        setSkinIcons(player, def.icons || own ? { ...def.icons, ...own } : undefined);
        const out = def.build(player, root, options as O);
        const { controls, cleanup } = Array.isArray(out) ? { controls: out, cleanup: undefined } : out;
        const list = controls.filter(Boolean) as Control[];
        for (const c of list) if (!c.el.parentNode) root.append(c.el);
        return () => {
          cleanup?.();
          setSkinIcons(player, undefined);
          for (const c of list) c.destroy();
        };
      },
    });
}
