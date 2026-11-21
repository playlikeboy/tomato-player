# Accessibility

Tomato Player targets **WCAG 2.2 AA** for every official skin. The test suite asserts that every button in every skin has an accessible name.

## What you get by default

- The player root is a labeled `region` (title or `label` option) and is focusable.
- Buttons are real `<button>`s whose `aria-label` and `aria-pressed` follow state. Labels are translatable via `i18n`.
- Sliders use `role="slider"` with `aria-valuenow` and a human `aria-valuetext` ("1:05 of 10:00"), and respond to arrows, PageUp/PageDown, Home and End.
- The settings menu uses `role="menu"` and `menuitemradio` with `aria-checked`. Arrow keys move, Escape closes and returns focus.
- A visible focus ring (`--tp-focus`) is drawn on `:focus-visible` only.
- Captions are native text tracks by default, so OS-level caption preferences apply. `captionOverlay()` lets skins render larger, high-contrast cues.
- `prefers-reduced-motion` turns transitions off. In-view autoplay is skipped under reduced motion and Save-Data.
- `forced-colors` (Windows High Contrast) keeps sliders visible.
- Controls never auto-hide while a menu is open, while paused, or while focus is inside the player.

## Your responsibilities

- Provide captions (`tracks`) for speech content, and audio descriptions where needed.
- Pick an accent color with at least 3:1 contrast against the control background.
- Don't autoplay with sound.

## Keyboard map (`plugin-hotkeys`)

| Key | Action |
| --- | --- |
| Space / K | Play or pause |
| J / L | −10 s / +10 s |
| ← / → | −5 s / +5 s |
| ↑ / ↓ | Volume |
| M | Mute |
| F | Fullscreen |
| C | Captions |
| I | Picture-in-picture |
| 0–9 | Jump to 0–90 % |
| < / > | Speed |
| , / . | Frame step (paused) |
