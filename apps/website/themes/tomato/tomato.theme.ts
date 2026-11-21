// The tomato theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in tomato.settings.json and the generated tomato.settings.ts;
// change them with `astryx experimental theme editor set tomato ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {tomatoSettings} from './tomato.settings';

export const tomatoTheme = defineTheme({
  extends: tomatoSettings,
  name: 'tomato',
});
