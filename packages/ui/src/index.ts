import baseCss from './base.css';

export * from './controls';
export { h, svg, append, Scope } from './dom';
export type { Child } from './dom';
export { icons } from './icons';
export type { IconName } from './icons';

/** Shared base stylesheet. Skins prepend it to their own CSS. */
export const baseStyles: string = baseCss;
