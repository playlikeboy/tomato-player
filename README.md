# Tomato Player CDN build (v0.1.0)

Generated from `main` by `.github/workflows/cdn.yml`. Do not edit this branch by hand.

All-in-one script (every skin and plugin, plus `<tomato-player>`):

    <script src="https://cdn.jsdelivr.net/gh/playlikeboy/tomato-player@cdn/tomato-player.global.js"></script>

ES modules: copy `importmap.json` into a `<script type="importmap">`, then import packages by name.

- @tomato-player/core  ->  esm/core/index.js
- @tomato-player/plugin-analytics  ->  esm/plugin-analytics/index.js
- @tomato-player/plugin-chapters  ->  esm/plugin-chapters/index.js
- @tomato-player/plugin-gestures  ->  esm/plugin-gestures/index.js
- @tomato-player/plugin-hotkeys  ->  esm/plugin-hotkeys/index.js
- @tomato-player/plugin-media-session  ->  esm/plugin-media-session/index.js
- @tomato-player/plugin-persist  ->  esm/plugin-persist/index.js
- @tomato-player/plugin-playlist  ->  esm/plugin-playlist/index.js
- @tomato-player/plugin-thumbnails  ->  esm/plugin-thumbnails/index.js
- @tomato-player/provider-dash  ->  esm/provider-dash/index.js
- @tomato-player/provider-hls  ->  esm/provider-hls/index.js
- @tomato-player/skin-campus  ->  esm/skin-campus/index.js
- @tomato-player/skin-cinema  ->  esm/skin-cinema/index.js
- @tomato-player/skin-creator  ->  esm/skin-creator/index.js
- @tomato-player/skin-feed  ->  esm/skin-feed/index.js
- @tomato-player/skin-learn  ->  esm/skin-learn/index.js
- @tomato-player/skin-minimal  ->  esm/skin-minimal/index.js
- @tomato-player/skin-stream  ->  esm/skin-stream/index.js
- @tomato-player/skin-studio  ->  esm/skin-studio/index.js
- @tomato-player/skin-tube  ->  esm/skin-tube/index.js
- tomato-player  ->  esm/tomato-player/index.js
- @tomato-player/ui  ->  esm/ui/index.js

Docs: https://playlikeboy.github.io/tomato-player/docs/guides/cdn/
