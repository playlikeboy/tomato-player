import type { Plugin, Provider, Skin } from './types';

/** Identity helpers that give extension authors full type inference. */
export const definePlugin = <API = void>(plugin: Plugin<API>): Plugin<API> => plugin;
export const defineSkin = (skin: Skin): Skin => skin;
export const defineProvider = (provider: Provider): Provider => provider;
