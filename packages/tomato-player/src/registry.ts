import { minimal } from '@tomato-player/skin-minimal';
import { cinema } from '@tomato-player/skin-cinema';
import { studio } from '@tomato-player/skin-studio';
import { creator } from '@tomato-player/skin-creator';
import { learn } from '@tomato-player/skin-learn';
import { stream } from '@tomato-player/skin-stream';
import { tube } from '@tomato-player/skin-tube';
import { feed } from '@tomato-player/skin-feed';
import { campus } from '@tomato-player/skin-campus';

/** Official skins by name — used by `<tomato-player skin="cinema">`. */
export const skins = { minimal, cinema, studio, creator, learn, stream, tube, feed, campus } as const;
export type SkinName = keyof typeof skins;
