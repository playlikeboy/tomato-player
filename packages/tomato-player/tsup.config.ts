import { defineConfig } from 'tsup';

/** Never bundle streaming engines: they are loaded at runtime only when a stream needs them. */
const externalEngines = {
  name: 'external-engines',
  setup(build: { onResolve: (o: { filter: RegExp }, cb: (a: { path: string }) => { path: string; external: boolean }) => void }) {
    build.onResolve({ filter: /^(hls\.js|dashjs)$/ }, (args) => ({ path: args.path, external: true }));
  },
};

export default defineConfig([
  {
    entry: { index: 'src/index.ts', element: 'src/element.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    external: [/^@tomato-player\//, 'hls.js', 'dashjs'],
  },
  {
    // <script src="https://cdn.jsdelivr.net/npm/tomato-player"></script>  ->  window.TomatoPlayer
    entry: { 'tomato-player': 'src/cdn.ts' },
    format: ['iife'],
    globalName: 'TomatoPlayer',
    minify: true,
    noExternal: [/^@tomato-player\//],
    esbuildPlugins: [externalEngines],
    loader: { '.css': 'text' },
    outExtension: () => ({ js: '.global.js' }),
  },
]);
