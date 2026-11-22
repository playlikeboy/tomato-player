# Design

Tomato Player's visual system has two layers: the **website** (apps/website), presented as an edition catalogue, and the **player** (packages/ui base plus nine skins), which every site page shows live.

## World: the Collection

The site is a numbered edition catalogue. Each skin is a release, No.01 to No.09, shown at cover scale as a live player beside its colophon (package, weight, accent, best use). Rules separate things; boxes are rare. The house colour is tomato red; each skin's own accent appears only on its own spread.

- Mode: dark-first (light supported through the Astryx theme).
- Strategy: restrained neutrals plus one committed house colour; the closing band is the one full tomato field.
- Reference implementation: `apps/website/src/components/pages/Home.tsx`, `Skins.tsx`, `apps/website/src/app/globals.css` (`.cx-*`).

## Tokens

Website tokens come from the Astryx theme `tomato` (`apps/website/themes/tomato/`, edited only with `pnpm exec astryx experimental theme editor set tomato ...`).

| Role | Value |
|---|---|
| Accent (house red) | `#e5402c` (generated shades for light and dark) |
| Deep red, closing band | `#b5301d` (`--cx-red-deep`) |
| Neutral seed (warm stone) | `#7d716a` |
| Body background, dark | `#0e0c0b` (lacquer black) |
| Success | `#16a34a` |
| Corners | small (`--radius-element`, `--radius-container`) |
| Surfaces | outlined |
| Rules | `1px solid var(--color-border)` (`--cx-rule`) |
| Ease | `cubic-bezier(0.22, 1, 0.36, 1)` (`--cx-ease`) |

## Type

| Role | Face | Notes |
|---|---|---|
| Display and headings | Bricolage Grotesque Variable (`@fontsource-variable/bricolage-grotesque`) | semibold, tight tracking (-0.02 to -0.035em); edition numerals at 800 with -0.04em |
| Body and UI | Geist Sans (`@fontsource/geist-sans`) | tabular numerals site-wide |
| Code only | Geist Mono (`@fontsource/geist-mono`) | never as a "technical" costume |

Hero headline: `clamp(44px, 5.4vw, 82px)`, line-height 0.95. Body measure stays under ~62ch.

## Components and patterns

- **Edition number** (`.cx-edition`): "No." plus a two-digit numeral in tomato red; reveals with a clip-path wipe (520ms) whenever the edition changes. This is the site's one authored motion.
- **Colophon** (`.cx-facts`): two-column definition list, label in secondary text, value in primary.
- **Edition strip** (`.cx-strip`): nine 16:9 thumbnails as a radiogroup (arrow keys, Home, End); selected item gets a 2px tomato ring; unselected thumbnails are dimmed and desaturated.
- **Catalogue index** (`.cx-index`): ruled rows of number, thumbnail, name, summary, accent swatch and weight.
- **Spec sheet and FAQ** (`.cx-spec`, `.cx-faq`): ruled definition lists in a 5/7 split with a sticky heading column.
- **Spreads** (`.cx-spread`, skins gallery): live player 8 columns, colophon 4 columns.
- **Links** (`.cx-more`): text plus drawn chevron, 1px tomato underline that thickens on hover.
- Astryx components (Button, Heading, Text, CodeBlock, Table, Banner, TabList) carry everything interactive outside the player.
- Banned here: eyebrow labels above headings, icon-card grids, emoji as icons, gradient text.

## Player base (packages/ui/src/base.css)

All skins inherit these tokens; skins override them on `.tp[data-skin='<name>']`.

| Token | Default |
|---|---|
| `--tp-accent` | `#f0472e` |
| `--tp-surface` | `rgba(20, 18, 17, 0.86)` with 20px backdrop blur (menus over video) |
| `--tp-border` | `rgba(255, 255, 255, 0.09)` |
| `--tp-hover` | `rgba(255, 255, 255, 0.13)` |
| `--tp-track` / `--tp-buffer` | `rgba(255,255,255,0.24)` / `0.42` |
| `--tp-thumb`, `--tp-thumb-size` | `#fff`, `13px` |
| `--tp-slider-height` / `--tp-slider-hover-height` | `4px` / `6px` |
| `--tp-control-size` / `--tp-icon-size` | `40px` / `22px` |
| `--tp-button-radius` | `999px` |
| `--tp-scrim`, `--tp-scrim-top` | eased multi-stop gradients |
| `--tp-icon-shadow` | `drop-shadow(0 1px 2px rgba(0,0,0,.35))`, off on solid surfaces |
| `--tp-ease` / `--tp-duration` | `cubic-bezier(0.22, 1, 0.36, 1)` / `180ms` |

Patterns: pressed toggles show a 4px dot under the icon; menus open with a 200ms rise and scale; submenu rows show a drawn chevron; the big play button is a 72px blurred disc that fills with the accent on hover; captions sit on a 74% black plate with balanced wrapping.

## Skins

| No. | Skin | Accent | Character |
|---|---|---|---|
| 01 | Minimal | `#f0472e` | one row over an eased scrim |
| 02 | Cinema | `#e8b04b` | serif title card, 2px progress rule, remaining time |
| 03 | Studio | `#38bdf8` | transport bar below the picture, frame timecode, playhead line |
| 04 | Creator | `#a855f7` | floating blurred capsule, orange-to-purple progress |
| 05 | Learn | `#10b981` | speed chips, sliding chapter panel, large captions |
| 06 | Campus | `#6b3df5` | CampusLoop paper stickers, solid surfaces, no icon shadow |
| 07 | Stream | `#e50914` | unofficial; large borderless icons that scale on hover |
| 08 | Tube | `#ff0033` | unofficial; hairline progress that grows, underline toggle marks |
| 09 | Feed | `#0866ff` | unofficial; muted autoplay with unmute pill |

## Imagery

- Poster: `examples/assets/poster.jpg`, a 1280×720 frame of *Big Buck Bunny* (Blender Foundation, CC BY 3.0); credits in `examples/assets/CREDITS.md`.
- Skin screenshots: `.github/assets/skin-*.png`, captured from `examples/playground` by headless Chromium.
