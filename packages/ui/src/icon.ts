import type { IconSource, Player } from '@tomato-player/core';
import { svg } from './dom';
import { icons, type IconName } from './icons';

/** An icon set: icon name to trusted SVG markup or an element factory. Missing names fall back to the default set. */
export type IconSet = Partial<Record<IconName | (string & {}), IconSource>>;

const skinSets = new WeakMap<Player, IconSet>();

/** Register the active skin's icon set (called by `createSkin`). */
export function setSkinIcons(player: Player, set: IconSet | undefined) {
  if (set) skinSets.set(player, set);
  else skinSets.delete(player);
}

/**
 * Render an icon by name. Lookup order: `createPlayer({ icons })`, then the skin's set, then the
 * built-in Tomato set. The result always carries `class="tp-icon"` and `data-tp-icon="<name>"`.
 */
export function icon(player: Player | null | undefined, name: IconName | (string & {})): Element {
  const source = player?.options.icons?.[name] ?? (player ? skinSets.get(player)?.[name] : undefined) ?? icons[name as IconName] ?? icons.play;
  const el = typeof source === 'function' ? source(name) : svg(source);
  el.classList.add('tp-icon');
  el.setAttribute('data-tp-icon', name);
  el.setAttribute('aria-hidden', 'true');
  return el;
}
