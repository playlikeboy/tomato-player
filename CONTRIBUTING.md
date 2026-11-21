# Contributing to Tomato Player

Thanks for helping. Tomato Player is meant to be a **community ecosystem**: skins, plugins, providers and integrations from anyone. This guide gets you from clone to merged PR.

## Setup

```sh
git clone https://github.com/playlikeboy/tomato-player
cd tomato-player
pnpm install        # Node 18+ and pnpm 9
pnpm build
pnpm test
pnpm playground     # http://localhost:5173/examples/playground/
```

## Repository layout

```
packages/
  core/              engine (state, events, providers, skins, plugins)
  ui/                accessible control primitives + base CSS
  skins/<name>/      one package per skin
  plugins/<name>/    one package per plugin
  providers/<name>/  hls, dash
  integrations/      react, vue, svelte
  tomato-player/     batteries-included bundle, <tomato-player>, CDN build
docs/                Markdown docs (source of truth) + research
examples/            playground and CDN example
templates/           scaffolding used by `pnpm new`
scripts/             validate, size budgets, scaffolder, dev server
```

## Make a skin or plugin

```sh
pnpm new skin aurora "Northern-lights inspired skin"
pnpm new plugin sleep-timer "Pause after N minutes"
```

Then read [Create a skin](docs/guides/create-a-skin.md) or [Create a plugin](docs/guides/create-a-plugin.md).

## Quality gates

`pnpm run check` runs everything CI runs:

| Command | What it checks |
| --- | --- |
| `pnpm build` | Every package builds (ESM, CJS, `.d.ts`; IIFE for the bundle). |
| `pnpm typecheck` | Strict TypeScript, including `noUncheckedIndexedAccess`. |
| `pnpm test` | Vitest + happy-dom, run against sources. |
| `pnpm validate` | Package manifests: naming, `tomato.kind`, exports, README, scoped skin CSS, engines as peers only. |
| `pnpm size` | Gzip budgets: core 6 KB, ui 11 KB, skin 4.5 KB, plugin 1.5 KB. |

## Principles for changes

1. **No import-time side effects.** Everything must be SSR-safe.
2. **Clean up.** Anything you add must be removed by `destroy()`.
3. **Accessibility is not optional.** Real buttons, names, keyboard support, visible focus.
4. **Small by default.** Heavy dependencies go behind `import()` and are optional peers.
5. **No trademarks.** Skins may be inspired by familiar patterns, but they must not copy logos, fonts or icons, and must be labeled unofficial.
6. **Respect licenses.** Keep upstream notices. Check `THIRD_PARTY_NOTICES.md` when adding a dependency.

## Commits and releases

Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat(skins): …`, `fix(core): …`, `docs: …`). Packages are versioned together while the project is 0.x.

## Code of conduct

Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Website

The site at https://playlikeboy.github.io/tomato-player/ is generated from `docs/`, `examples/` and the built packages by `scripts/build-site.mjs`, and deployed by `.github/workflows/pages.yml` on every push to `main`. Pull requests get a downloadable `site-preview-pr-<n>` artifact.

```sh
pnpm build && pnpm site:dev   # http://localhost:5173/site-dist/
```
