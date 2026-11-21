import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const src = (p: string) => fileURLToPath(new URL(`./packages/${p}/src/index.ts`, import.meta.url));

export default defineConfig({
  resolve: {
    // Test against source, not dist, so `pnpm test` works without a build.
    alias: {
      '@tomato-player/core': src('core'),
      '@tomato-player/ui': src('ui'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['packages/**/test/**/*.test.ts'],
  },
});
