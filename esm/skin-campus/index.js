import{autoplayInView as d,captionOverlay as u,captionsButton as m,createSkin as x,errorOverlay as g,fullscreenButton as v,gestureLayer as w,group as i,h as r,pipButton as f,playButton as h,rateButton as k,spinner as b,icon as y,timeDisplay as A,timeSlider as H,unmuteButton as Z,volumeControl as V}from"@tomato-player/ui";var n=`/* CampusLoop paper-sticker skin. Tokens mirror CampusLoop's design system (src/styles/tokens.css). */
.tp[data-skin='campus'] {
  --tp-accent: #6b3df5;
  --tp-brand-fg: #fff;
  --tp-brand-subtle: #f2edff;
  --tp-brand-text: #5a2be0;
  --tp-sticker: #fff;
  --tp-sticker-fg: #15131d;
  --tp-sticker-muted: #57526a;
  --tp-sunken: #ebe8f3;
  --tp-border-strong: #cbc6d9;
  --tp-hover: #f5f3fa;
  --tp-shadow: 0 6px 16px -6px rgb(21 19 29 / 0.26), 0 2px 4px -1px rgb(21 19 29 / 0.08);
  --tp-shadow-lift: 0 12px 26px -8px rgb(21 19 29 / 0.3), 0 3px 6px -2px rgb(21 19 29 / 0.1);
  --tp-display-font: var(--font-display, ui-rounded, 'SF Pro Rounded', system-ui, sans-serif);
  --tp-bg: #15131d;
  --tp-fg: var(--tp-sticker-fg);
  --tp-muted-fg: var(--tp-sticker-muted);
  --tp-track: var(--tp-sunken);
  --tp-buffer: var(--tp-border-strong);
  --tp-surface: var(--tp-sticker);
  --tp-thumb: var(--tp-accent);
  --tp-slider-height: 6px;
  --tp-icon-size: 20px;
  --tp-focus: 0 0 0 2px var(--tp-sticker), 0 0 0 4px var(--tp-accent);
  border-radius: 20px;
  box-shadow: var(--tp-shadow-lift);
}
.tp[data-skin='campus'][data-theme='dark'] { --tp-accent: #7650fa; --tp-brand-subtle: #24164f; --tp-brand-text: #b8a2ff; --tp-sticker: #2a2735; --tp-sticker-fg: #f5f3fa; --tp-sticker-muted: #cbc6d9; --tp-sunken: #15131d; --tp-border-strong: #4a4559; --tp-hover: #353141; --tp-shadow: 0 6px 16px -6px rgb(0 0 0 / 0.7), 0 2px 4px -1px rgb(0 0 0 / 0.4); }
@media (prefers-color-scheme: dark) {
  .tp[data-skin='campus']:not([data-theme='light']) { --tp-accent: #7650fa; --tp-brand-subtle: #24164f; --tp-brand-text: #b8a2ff; --tp-sticker: #2a2735; --tp-sticker-fg: #f5f3fa; --tp-sticker-muted: #cbc6d9; --tp-sunken: #15131d; --tp-border-strong: #4a4559; --tp-hover: #353141; --tp-shadow: 0 6px 16px -6px rgb(0 0 0 / 0.7), 0 2px 4px -1px rgb(0 0 0 / 0.4); }
}
.tp[data-skin='campus'] .tp-media { object-fit: cover; }
.tp[data-skin='campus'][data-fullscreen] { border-radius: 0; box-shadow: none; }
.tp[data-skin='campus'][data-fullscreen] .tp-media { object-fit: contain; }
@media (max-width: 639px) and (orientation: portrait) {
  .tp[data-skin='campus'] { --tp-aspect-ratio: 9/16; max-width: calc(78svh * 9 / 16); margin-inline: auto; }
}
.tp[data-skin='campus'] .tp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Poster play pill */
.tp[data-skin='campus'] .tp-campus-play { all: unset; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.tp[data-skin='campus'][data-started]:not([data-muted-autoplay]) .tp-campus-play { display: none; }
.tp[data-skin='campus'][data-muted-autoplay] .tp-campus-play { display: none; }
.tp[data-skin='campus'] .tp-campus-play-pill { display: flex; align-items: center; gap: 12px; height: 64px; padding: 10px 24px 10px 10px; border-radius: 999px; background: var(--tp-sticker); color: var(--tp-sticker-fg); box-shadow: var(--tp-shadow-lift); transition: transform 200ms var(--tp-ease); }
.tp[data-skin='campus'] .tp-campus-play:hover .tp-campus-play-pill { transform: scale(1.04); }
.tp[data-skin='campus'] .tp-campus-play:active .tp-campus-play-pill { transform: scale(0.97); }
.tp[data-skin='campus'] .tp-campus-play:focus-visible .tp-campus-play-pill { box-shadow: var(--tp-shadow-lift), var(--tp-focus); }
.tp[data-skin='campus'] .tp-campus-play-dot { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--tp-accent); color: var(--tp-brand-fg); }
.tp[data-skin='campus'] .tp-campus-play-dot .tp-icon { margin-left: 2px; }
.tp[data-skin='campus'] .tp-campus-play-text, .tp[data-skin='campus'] .tp-campus-error .tp-error-message { font-family: var(--tp-display-font); font-weight: 800; font-stretch: 82%; letter-spacing: -0.02em; line-height: 1; font-size: 20px; }
@container (min-width: 640px) {
  .tp[data-skin='campus'] .tp-campus-play-pill { height: 80px; padding-right: 32px; padding-left: 12px; }
  .tp[data-skin='campus'] .tp-campus-play-dot { width: 56px; height: 56px; }
  .tp[data-skin='campus'] .tp-campus-play-text { font-size: 24px; }
}

/* Unmute sticker */
.tp[data-skin='campus'] .tp-campus-unmute { position: absolute; top: 12px; left: 12px; height: 44px; padding: 0 16px; border-radius: 999px; background: var(--tp-sticker); color: var(--tp-brand-text); box-shadow: var(--tp-shadow); font-size: 14px; font-weight: 600; }
.tp[data-skin='campus'] .tp-campus-unmute:hover { background: var(--tp-brand-subtle); }
.tp[data-skin='campus'] .tp-campus-unmute .tp-button-text { margin-left: 8px; }

/* Sticker control strip */
.tp[data-skin='campus'] .tp-controls { position: absolute; inset: auto 8px 8px 8px; transition: opacity 200ms var(--tp-ease), transform 200ms var(--tp-ease), visibility 200ms; }
.tp[data-skin='campus'][data-playing][data-idle]:not([data-menu-open]) .tp-controls { transform: translateY(8px); }
.tp[data-skin='campus'][data-muted-autoplay] .tp-controls { opacity: 0; visibility: hidden; }
.tp[data-skin='campus'] .tp-campus-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding: 6px 8px; border-radius: 14px; background: var(--tp-sticker); color: var(--tp-sticker-fg); box-shadow: var(--tp-shadow); }
.tp[data-skin='campus'] .tp-campus-seek { order: -1; flex-basis: 100%; display: flex; height: 32px; padding: 0 8px; }
.tp[data-skin='campus'] .tp-campus-flex { flex: 1; }
.tp[data-skin='campus'] .tp-button { border-radius: 999px; color: var(--tp-sticker-fg); }
.tp[data-skin='campus'] .tp-button:hover { background: var(--tp-hover); }
.tp[data-skin='campus'] .tp-button[aria-pressed='true'] { background: var(--tp-brand-subtle); color: var(--tp-brand-text); }
.tp[data-skin='campus'] .tp-play .tp-icon, .tp[data-skin='campus'] .tp-campus-play-dot .tp-icon { fill: currentColor; }
.tp[data-skin='campus'] .tp-time-display { color: var(--tp-sticker-muted); font-weight: 500; font-size: 14px; padding: 0 6px; }
.tp[data-skin='campus'] .tp-time-current { color: var(--tp-sticker-fg); }
.tp[data-skin='campus'] .tp-rate { min-width: 40px; padding: 0 8px; font-size: 14px; }
.tp[data-skin='campus'] .tp-slider-thumb { width: 16px; height: 16px; margin-left: -8px; transform: scale(1); }
.tp[data-skin='campus'] .tp-preview-time { background: var(--tp-sticker); color: var(--tp-sticker-fg); box-shadow: var(--tp-shadow); }
.tp[data-skin='campus'] .tp-menu { background: var(--tp-sticker); color: var(--tp-sticker-fg); }
.tp[data-skin='campus'] .tp-spinner-ring { border-color: rgba(255, 255, 255, 0.4); border-top-color: var(--tp-accent); }
@container (min-width: 640px) {
  .tp[data-skin='campus'] .tp-controls { inset: auto 16px 16px 16px; }
  .tp[data-skin='campus'] .tp-campus-strip { flex-wrap: nowrap; border-radius: 999px; }
  .tp[data-skin='campus'] .tp-campus-seek { order: 0; flex: 1 1 auto; flex-basis: auto; padding: 0 4px; }
  .tp[data-skin='campus'] .tp-play { order: -2; }
  .tp[data-skin='campus'] .tp-campus-flex { display: none; }
  .tp[data-skin='campus'] .tp-campus-unmute { top: 16px; left: 16px; }
}
@container (max-width: 767px) { .tp[data-skin='campus'] .tp-volume-slider { display: none; } }
@container (max-width: 639px) { .tp[data-skin='campus'] .tp-pip { display: none; } }
@media (pointer: coarse) { .tp[data-skin='campus'] { --tp-control-size: 44px; } }

/* Sticker-label captions */
.tp[data-skin='campus'] .tp-caption { --tp-caption-offset: 112px; }
@container (min-width: 640px) { .tp[data-skin='campus'] .tp-caption { --tp-caption-offset: 80px; } }
.tp[data-skin='campus'][data-playing][data-idle] .tp-caption { --tp-caption-offset: 24px; }
.tp[data-skin='campus'] .tp-caption-text { padding: 6px 12px; border-radius: 6px; background: var(--tp-sticker); color: var(--tp-sticker-fg); box-shadow: var(--tp-shadow); font-weight: 600; font-size: 16px; }
@container (min-width: 640px) { .tp[data-skin='campus'] .tp-caption-text { font-size: 18px; } }

/* Error sticker */
.tp[data-skin='campus'] .tp-campus-error { background: var(--tp-bg); }
.tp[data-skin='campus'] .tp-campus-error .tp-error-message { max-width: 18ch; padding: 16px 20px; border-radius: 22px; background: var(--tp-sticker); color: var(--tp-sticker-fg); box-shadow: var(--tp-shadow); font-size: 24px; }

/* Sticker surfaces carry their own shadow: no icon shadow, no pressed dot. */
.tp[data-skin='campus'] { --tp-icon-shadow: none; }
.tp[data-skin='campus'] .tp-button[aria-pressed='true']::after { display: none; }
.tp[data-skin='campus'] .tp-menu { -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: var(--tp-shadow-lift); }
.tp[data-skin='campus'] .tp-menu-item:hover { background: var(--tp-hover); }
.tp[data-skin='campus'] .tp-time-display, .tp[data-skin='campus'] .tp-title { text-shadow: none; }
.tp[data-skin='campus'] .tp-slider-thumb { box-shadow: 0 1px 3px rgb(21 19 29 / 0.3); }
`;var c={play:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M240,128a15.7, 15.7,0,0,1-7.6, 13.5L88.3, 229.7a16,16,0,0,1-16.2 .3A15.9, 15.9,0,0,1,64, 216.1V39.9a15.9, 15.9,0,0,1, 8.1-13.8,16,16,0,0,1, 16.2 .3L232.4, 114.5A15.7, 15.7,0,0,1,240,128Z"/></svg>',pause:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"/></svg>',replay:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M228,128a100,100,0,0,1-98.7,100H128a99.4, 99.4,0,0,1-68.6-27.3,12,12,0,0,1, 16.5-17.4,76,76,0,1,0-1.6-109c-.1 .1-.2 .2-.4 .4L54.9,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.7L57.5, 57.1A100,100,0,0,1,228,128Z"/></svg>',volumeHigh:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M157.3, 21.2a12,12,0,0,0-12.6, 1.3L75.9,76H32A20,20,0,0,0,12,96v64a20,20,0,0,0,20,20H75.9l68.8, 53.5A12,12,0,0,0,164,224V32A12,12,0,0,0, 157.3, 21.2ZM36,100H68v56H36Zm104, 99.5L92, 162.1V93.9l48-37.3ZM212,128a44,44,0,0,1-11, 29.1,12,12,0,1,1-18-15.9,20,20,0,0,0,0-26.4,12,12,0,0,1,18-15.9A43.9, 43.9,0,0,1,212,128Zm40,0a83.9, 83.9,0,0,1-21.4,56,12,12,0,0,1-17.9-16,60,60,0,0,0,0-80,12,12,0,1,1, 17.9-16A83.9, 83.9,0,0,1,252,128Z"/></svg>',volumeLow:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M157.3, 21.2a12,12,0,0,0-12.6, 1.3L75.9,76H32A20,20,0,0,0,12,96v64a20,20,0,0,0,20,20H75.9l68.8, 53.5A12,12,0,0,0,164,224V32A12,12,0,0,0, 157.3, 21.2ZM36,100H68v56H36Zm104, 99.5L92, 162.1V93.9l48-37.3ZM212,128a44,44,0,0,1-11, 29.1,12,12,0,0,1-18-15.9,20,20,0,0,0,0-26.4,12,12,0,0,1,18-15.8A43.9, 43.9,0,0,1,212,128Z"/></svg>',volumeMuted:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M157.3, 21.2a12,12,0,0,0-12.6, 1.3L75.9,76H32A20,20,0,0,0,12,96v64a20,20,0,0,0,20,20H75.9l68.8, 53.5A12,12,0,0,0,164,224V32A12,12,0,0,0, 157.3, 21.2ZM36,100H68v56H36Zm104, 99.5L92, 162.1V93.9l48-37.3Zm108.5-56a12,12,0,0,1-17,17L216,145l-15.5, 15.5a12,12,0,0,1-17-17L199,128l-15.5-15.5a12,12,0,0,1,17-17L216,111l15.5-15.5a12,12,0,0,1,17,17L233,128Z"/></svg>',fullscreen:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M220,48V88a12,12,0,0,1-24,0V60H168a12,12,0,0,1,0-24h40A12,12,0,0,1,220,48ZM88,196H60V168a12,12,0,0,0-24,0v40a12,12,0,0,0,12,12H88a12,12,0,0,0,0-24Zm120-40a12,12,0,0,0-12,12v28H168a12,12,0,0,0,0,24h40a12,12,0,0,0,12-12V168A12,12,0,0,0,208,156ZM88,36H48A12,12,0,0,0,36,48V88a12,12,0,0,0,24,0V60H88a12,12,0,0,0,0-24Z"/></svg>',fullscreenExit:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M148,96V48a12,12,0,0,1,24,0V84h36a12,12,0,0,1,0,24H160A12,12,0,0,1,148,96ZM96,148H48a12,12,0,0,0,0,24H84v36a12,12,0,0,0,24,0V160A12,12,0,0,0,96,148Zm112,0H160a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V172h36a12,12,0,0,0,0-24ZM96,36A12,12,0,0,0,84,48V84H48a12,12,0,0,0,0,24H96a12,12,0,0,0,12-12V48A12,12,0,0,0,96,36Z"/></svg>',pip:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,44H40A20,20,0,0,0,20,64V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V64A20,20,0,0,0,216,44ZM44,68H212v48H136a12,12,0,0,0-12,12v60H44ZM148,188V140h64v48Z"/></svg>',captions:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,44H32A20,20,0,0,0,12,64V192a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V64A20,20,0,0,0,224,44Zm-4,144H36V68H220ZM52,128a44,44,0,0,1,66-38.1,12,12,0,0,1-12, 20.8,20,20,0,1,0,0, 34.7,12,12,0,1,1,12, 20.8A44,44,0,0,1,52,128Zm80,0a44,44,0,0,1,66-38.1,12,12,0,0,1-12, 20.8,20,20,0,1,0,0, 34.7,12,12,0,1,1,12, 20.8A44,44,0,0,1,132,128Z"/></svg>',settings:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128,76a52,52,0,1,0,52,52A52.1, 52.1,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm113.9-49.6A12,12,0,0,0,236, 98.3L208.2, 82.5l-.1-31.3a12,12,0,0,0-4.2-9.1,116,116,0,0,0-38-21.4,12,12,0,0,0-9.7 .9L128, 37.3, 99.8, 21.5a12,12,0,0,0-9.7-.9, 116.1, 116.1,0,0,0-38, 21.5,12,12,0,0,0-4.2, 9.1l-.1, 31.3L20, 98.3a12,12,0,0,0-5.8, 8.1, 110.7, 110.7,0,0,0,0, 43.1A12,12,0,0,0,20, 157.7l27.8, 15.8 .1, 31.3a12,12,0,0,0, 4.2, 9.1,116,116,0,0,0,38, 21.4,12,12,0,0,0, 9.7-.9L128, 218.7l28.1, 15.7a12,12,0,0,0, 9.7 .9, 116.1, 116.1,0,0,0,38-21.5,12,12,0,0,0, 4.2-9.1l.1-31.3, 27.8-15.8a12,12,0,0,0, 5.8-8.1A110.7, 110.7,0,0,0, 241.9, 106.4Zm-22.6, 33.2-26.9, 15.3a11.9, 11.9,0,0,0-4.5, 4.6c-.5,1-1.1, 1.9-1.7, 2.9a12,12,0,0,0-1.8, 6.3L184.1,199a91.8, 91.8,0,0,1-21.1, 11.9l-27.1-15.2a12,12,0,0,0-5.9-1.5h-.3c-1.1,0-2.3,0-3.4,0a12.1, 12.1,0,0,0-6.1, 1.5L93, 210.8A92.3, 92.3,0,0,1, 71.9,199l-.1-30.2a12,12,0,0,0-1.8-6.3c-.6-.9-1.2-1.9-1.7-2.9A11.9, 11.9,0,0,0, 63.7,155L36.8, 139.6a86.5, 86.5,0,0,1,0-23.2l26.9-15.3a12,12,0,0,0, 4.5-4.6c.5-1, 1.1-1.9, 1.7-2.9a12,12,0,0,0, 1.8-6.3L71.9,57A91.8, 91.8,0,0,1, 92.9, 45.2l27.1, 15.2a11.9, 11.9,0,0,0, 6.2, 1.5c1.1,0, 2.3,0, 3.4,0a12.1, 12.1,0,0,0, 6.1-1.5L163, 45.2A92.3, 92.3,0,0,1, 184.1,57l.1, 30.2a12,12,0,0,0, 1.8, 6.3c.6 .9, 1.2, 1.9, 1.7, 2.9A11.9, 11.9,0,0,0, 192.3,101l26.9, 15.3A86.5, 86.5,0,0,1, 219.2, 139.6Z"/></svg>',forward:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.4c-.1-.1-.3-.2-.4-.4A76,76,0,1,0,127,204h1a75.5, 75.5,0,0,0, 52.1-20.7,12,12,0,0,1, 16.5, 17.4A99.5, 99.5,0,0,1,128,228h-1.4A100,100,0,1,1, 198.5, 57.1L220, 76.7V56a12,12,0,0,1,24,0Z"/></svg>',backward:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M228,128a100,100,0,0,1-98.7,100H128a99.4, 99.4,0,0,1-68.6-27.3,12,12,0,0,1, 16.5-17.4,76,76,0,1,0-1.6-109c-.1 .1-.2 .2-.4 .4L54.9,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.7L57.5, 57.1A100,100,0,0,1,228,128Z"/></svg>',next:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M200,28a12,12,0,0,0-12,12v62l-113.5-71A20,20,0,0,0,44, 47.9V208.1A20,20,0,0,0, 74.5,225L188,154v62a12,12,0,0,0,24,0V40A12,12,0,0,0,200,28ZM68, 200.7V55.3L184.3,128Z"/></svg>',previous:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M201.8, 30.5a20,20,0,0,0-20.3 .5L68,102V40a12,12,0,0,0-24,0V216a12,12,0,0,0,24,0V154l113.5,71A20,20,0,0,0,212, 208.1V47.9A19.9, 19.9,0,0,0, 201.8, 30.5ZM188, 200.7, 71.7,128,188, 55.3Z"/></svg>',cast:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M232,60V196a20,20,0,0,1-20,20H172a12,12,0,0,1,0-24h36V64H48v4a12,12,0,0,1-24,0V60A20,20,0,0,1,44,40H212A20,20,0,0,1,232,60ZM36,176a12,12,0,0,0,0,24,4,4,0,0,1,4,4,12,12,0,0,0,24,0A28,28,0,0,0,36,176Zm0-40a12,12,0,0,0,0,24, 44, 44,0,0,1,44,44,12,12,0,0,0,24,0A68.1, 68.1,0,0,0,36,136Zm0-40a12,12,0,0,0,0,24, 84.1, 84.1,0,0,1,84,84,12,12,0,0,0,24,0A108.1, 108.1,0,0,0,36,96Z"/></svg>',chapters:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M76,64A12,12,0,0,1,88,52H216a12,12,0,0,1,0,24H88A12,12,0,0,1,76,64Zm140,52H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM44,112a16,16,0,1,0,16,16A16,16,0,0,0,44,112Zm0-64A16,16,0,1,0,60,64,16,16,0,0,0,44,48Zm0,128a16,16,0,1,0,16,16A16,16,0,0,0,44,176Z"/></svg>',check:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M232.5, 80.5l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183, 215.5, 63.5a12,12,0,0,1,17,17Z"/></svg>',chevron:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M184.5, 136.5l-80,80a12,12,0,0,1-17-17L159,128, 87.5, 56.5a12,12,0,1,1,17-17l80,80A12,12,0,0,1, 184.5, 136.5Z"/></svg>',theater:'<svg class="tp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36Zm-4,160H44V60H212Z"/></svg>'};function M(t,e){let a=r("button",{type:"button",class:"tp-campus-play"},r("span",{class:"tp-campus-play-pill"},r("span",{class:"tp-campus-play-dot"},y(t,"play")),r("span",{class:"tp-campus-play-text"},e),r("span",{class:"tp-sr"},", with sound"))),p=()=>{t.setMuted(!1),t.el.removeAttribute("data-muted-autoplay"),t.el.focus({preventScroll:!0}),t.play()};return a.addEventListener("click",p),{el:a,destroy:()=>a.remove()}}function L(t,e){let a=g(t);a.el.classList.add("tp-campus-error");let p=a.el.querySelector(".tp-error-message"),o=t.store.select(s=>s.error,s=>s&&(p.textContent=e));return{el:a.el,destroy:()=>(o(),a.destroy())}}var C=x({name:"campus",css:n,icons:c,build(t,e,a){let p=a.theme??"auto";p!=="auto"&&e.parentElement?.setAttribute("data-theme",p);let o=a.autoplayInView!==!1?d(t,{playAt:.6,pauseAt:.2,once:!0}):void 0,s=Z(t,{restart:!0,label:"Unmute"});return s.el.classList.add("tp-campus-unmute"),{controls:[w(t),b(),M(t,a.playLabel??"Play the video"),s,u(t),L(t,a.errorMessage??"The video is on its way. Check back soon."),i("tp-controls tp-autohide tp-hide-unstarted",i("tp-campus-strip",i("tp-campus-seek",H(t)),h(t),A(t),r("span",{class:"tp-campus-flex"}),V(t),m(t),k(t),f(t),v(t)))],cleanup:o}}}),E=C;export{C as campus,E as default};
