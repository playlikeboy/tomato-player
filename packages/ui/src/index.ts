import baseCss from './base.css';

export * from './controls';
export { createSkin } from './skin';
export type { SkinDefinition } from './skin';
export { h, svg, append, Scope } from './dom';
export type { Child } from './dom';
export { icons } from './icons';
export { icon, setSkinIcons } from './icon';
export type { IconSet } from './icon';
export type { IconName } from './icons';

/** Shared base stylesheet. Skins prepend it to their own CSS. */
export const baseStyles: string = baseCss;
