var $=t=>{throw TypeError(t)};var X=(t,e,n)=>e.has(t)||$("Cannot "+n);var I=(t,e,n)=>(X(t,e,"read from private field"),n?n.call(t):e.get(t)),D=(t,e,n)=>e.has(t)?$("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n);var z=`/* Tomato Player \u2014 base layer shared by every skin. Skins override tokens and layout. */
.tp {
  --tp-accent: #f0472e;
  --tp-fg: #fff;
  --tp-muted-fg: rgba(255, 255, 255, 0.7);
  --tp-bg: #000;
  --tp-surface: rgba(20, 18, 17, 0.86);
  --tp-border: rgba(255, 255, 255, 0.09);
  --tp-hover: rgba(255, 255, 255, 0.13);
  --tp-track: rgba(255, 255, 255, 0.24);
  --tp-buffer: rgba(255, 255, 255, 0.42);
  --tp-thumb: #fff;
  --tp-radius: 8px;
  --tp-button-radius: 999px;
  --tp-font: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --tp-control-size: 40px;
  --tp-icon-size: 22px;
  --tp-gap: 2px;
  --tp-slider-height: 4px;
  --tp-slider-hover-height: 6px;
  --tp-thumb-size: 13px;
  --tp-scrim: linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.52) 32%, rgba(0, 0, 0, 0.2) 66%, rgba(0, 0, 0, 0) 100%);
  --tp-scrim-top: linear-gradient(to bottom, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.28) 55%, rgba(0, 0, 0, 0) 100%);
  --tp-shadow: 0 18px 48px -14px rgba(0, 0, 0, 0.75), 0 4px 12px -4px rgba(0, 0, 0, 0.4);
  --tp-icon-shadow: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  --tp-focus: 0 0 0 2px var(--tp-bg), 0 0 0 4px var(--tp-accent);
  --tp-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --tp-duration: 180ms;
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: var(--tp-aspect-ratio, auto);
  overflow: hidden;
  background: var(--tp-bg);
  color: var(--tp-fg);
  font-family: var(--tp-font);
  font-size: 14px;
  line-height: 1.2;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  container-type: inline-size;
  outline: none;
  isolation: isolate;
}
.tp:focus-visible { box-shadow: var(--tp-focus); }
.tp[data-fullscreen] { aspect-ratio: auto; width: 100%; height: 100%; border-radius: 0 !important; }
.tp[data-idle][data-playing] { cursor: none; }
.tp *, .tp *::before, .tp *::after { box-sizing: border-box; }
.tp ::selection { background: var(--tp-accent); color: #fff; }
.tp-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: var(--tp-bg); }
.tp-skin { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.tp-skin > *, .tp-skin button, .tp-skin [role='slider'], .tp-skin .tp-menu { pointer-events: auto; }
.tp-gesture-layer { position: absolute; inset: 0; }
.tp-spacer { flex: 1 1 auto; }
.tp [hidden] { display: none !important; }

/* Buttons */
.tp-button {
  all: unset;
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
  min-width: var(--tp-control-size);
  height: var(--tp-control-size);
  padding: 0 calc((var(--tp-control-size) - var(--tp-icon-size)) / 2);
  border-radius: var(--tp-button-radius);
  color: inherit;
  cursor: pointer;
  transition: transform var(--tp-duration) var(--tp-ease), background-color var(--tp-duration) var(--tp-ease), color var(--tp-duration), opacity var(--tp-duration);
}
.tp-button:hover { background: var(--tp-hover); }
.tp-button:active { transform: scale(0.9); }
.tp-button:focus-visible, .tp-slider:focus-visible, .tp-menu-item:focus-visible, .tp-live:focus-visible { box-shadow: var(--tp-focus); outline: none; }
.tp-button[aria-pressed='true'] { color: var(--tp-accent); }
.tp-button[aria-pressed='true']::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 5px;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: currentColor;
}
.tp-icon { width: var(--tp-icon-size); height: var(--tp-icon-size); display: block; filter: var(--tp-icon-shadow); }
/* Icons rendered by a framework component (React portals and similar) sit in a sized host. */
.tp-icon:not(svg) { display: grid; place-items: center; }
.tp-icon:not(svg) svg { width: 100%; height: 100%; display: block; }
.tp-icon:not(svg) > span { display: contents; }
/* Icon micro-motion on SVG icons; component icons (React portals) bring their own animation. */
svg.tp-icon { transition: transform var(--tp-duration) var(--tp-ease); }
.tp-button:hover > svg[data-tp-icon='settings'], .tp-button[aria-expanded='true'] > svg[data-tp-icon='settings'] { transform: rotate(45deg); }
.tp-button:hover > svg[data-tp-icon='forward'] { transform: rotate(20deg); }
.tp-button:hover > svg[data-tp-icon='backward'], .tp-button:hover > svg[data-tp-icon='replay'] { transform: rotate(-20deg); }
.tp-button:hover > svg[data-tp-icon='fullscreen'] { transform: scale(1.12); }
.tp-button:hover > svg[data-tp-icon='fullscreenExit'] { transform: scale(0.88); }
.tp-button:hover > svg[data-tp-icon='next'] { transform: translateX(2px); }
.tp-button:hover > svg[data-tp-icon='previous'] { transform: translateX(-2px); }
.tp-button:active > svg.tp-icon { transform: scale(0.9); }
.tp-button-text { margin-left: 6px; font-weight: 600; }
.tp-seek { grid-template-areas: 'stack'; }
.tp-seek > * { grid-area: stack; }
.tp-seek-amount { font-size: 8px; font-weight: 700; transform: translateY(1px); font-variant-numeric: tabular-nums; }

/* Sliders */
.tp-slider {
  --tp-slider-value: 0;
  --tp-slider-buffer: 0;
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;
  flex: 1 1 auto;
  min-width: 40px;
  cursor: pointer;
  touch-action: none;
  border-radius: 999px;
}
.tp-slider-track {
  position: relative;
  width: 100%;
  height: var(--tp-slider-height);
  border-radius: 999px;
  background: var(--tp-track);
  overflow: hidden;
  transition: height var(--tp-duration) var(--tp-ease);
}
.tp-slider-buffer, .tp-slider-fill { position: absolute; inset: 0 auto 0 0; border-radius: inherit; }
.tp-slider-buffer { width: calc(var(--tp-slider-buffer) * 100%); background: var(--tp-buffer); }
.tp-slider-fill { width: calc(var(--tp-slider-value) * 100%); background: var(--tp-accent); }
.tp-slider-thumb {
  position: absolute;
  left: calc(var(--tp-slider-value) * 100%);
  width: var(--tp-thumb-size);
  height: var(--tp-thumb-size);
  margin-left: calc(var(--tp-thumb-size) / -2);
  border-radius: 50%;
  background: var(--tp-thumb);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  transform: scale(0);
  transition: transform var(--tp-duration) var(--tp-ease);
}
.tp-slider:hover .tp-slider-thumb, .tp-slider[data-dragging] .tp-slider-thumb, .tp-slider:focus-visible .tp-slider-thumb { transform: scale(1); }
.tp-time-slider:hover .tp-slider-track, .tp-time-slider[data-dragging] .tp-slider-track { height: var(--tp-slider-hover-height); }
.tp-volume { display: flex; align-items: center; }
.tp-volume-slider { flex: none; width: 0; min-width: 0; opacity: 0; transition: width 240ms var(--tp-ease), opacity var(--tp-duration), margin 240ms var(--tp-ease); }
.tp-volume:hover .tp-volume-slider, .tp-volume:focus-within .tp-volume-slider { width: 76px; opacity: 1; margin: 0 10px 0 2px; }
.tp-volume-slider .tp-slider-thumb { transform: scale(1); }
.tp[data-size='sm'] .tp-volume-slider { display: none; }

/* Chapter markers & preview */
.tp-chapter-markers { position: absolute; inset: 0; pointer-events: none; }
.tp-chapter-marker { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: rgba(0, 0, 0, 0.55); }
.tp-preview {
  position: absolute;
  bottom: calc(100% + 12px);
  left: var(--tp-preview-x, 0);
  display: grid;
  justify-items: center;
  gap: 6px;
  transform: translateX(-50%) translateY(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms var(--tp-ease), transform 200ms var(--tp-ease);
}
.tp-preview[data-visible] { opacity: 1; transform: translateX(-50%); }
.tp-preview-thumb { border-radius: var(--tp-radius); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), var(--tp-shadow); background-color: var(--tp-bg); background-repeat: no-repeat; }
.tp-preview-chapter:empty { display: none; }
.tp-preview-chapter, .tp-preview-time {
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--tp-surface);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow: inset 0 0 0 1px var(--tp-border);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.tp-preview-chapter { max-width: 28ch; overflow: hidden; text-overflow: ellipsis; color: var(--tp-fg); }

/* Text */
.tp-time-display, .tp-time { font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 13px; font-weight: 500; letter-spacing: 0.01em; }
.tp-time-display { padding: 0 10px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35); }
.tp-time-sep, .tp-time-duration { color: var(--tp-muted-fg); }
.tp-time-sep { padding: 0 0.3em; }
.tp-time-display[data-live] > .tp-time, .tp-time-display[data-live] > .tp-time-sep { display: none; }
.tp-title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
.tp-live { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 4px; padding: 2px 6px; }
.tp-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tp-muted-fg); }
.tp-live[data-edge] .tp-live-dot { background: var(--tp-accent); animation: tp-pulse 1.6s var(--tp-ease) infinite; }
@keyframes tp-pulse { 50% { opacity: 0.35; } }

/* Overlays */
.tp-big-play {
  position: absolute;
  top: 50%;
  left: 50%;
  --tp-control-size: 72px;
  --tp-icon-size: 30px;
  width: var(--tp-control-size);
  padding: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(16, 14, 13, 0.5);
  -webkit-backdrop-filter: blur(10px) saturate(1.3);
  backdrop-filter: blur(10px) saturate(1.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22), 0 10px 30px -8px rgba(0, 0, 0, 0.6);
  transition: transform 260ms var(--tp-ease), background-color var(--tp-duration), opacity 240ms var(--tp-ease), box-shadow var(--tp-duration);
}
.tp-big-play .tp-icon { margin-left: 3px; }
.tp-big-play:hover { background: var(--tp-accent); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 14px 36px -8px rgba(0, 0, 0, 0.65); transform: translate(-50%, -50%) scale(1.06); }
.tp-big-play:active { transform: translate(-50%, -50%) scale(0.95); }
.tp-big-play:focus-visible { box-shadow: var(--tp-focus); }
.tp[data-started] .tp-big-play { opacity: 0; pointer-events: none; transform: translate(-50%, -50%) scale(0.9); }
.tp[data-started][data-paused] .tp-big-play { opacity: 1; pointer-events: auto; transform: translate(-50%, -50%); }
.tp-spinner { position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; margin: -22px 0 0 -22px; opacity: 0; transition: opacity 150ms 250ms; pointer-events: none !important; }
.tp[data-waiting] .tp-spinner { opacity: 1; }
.tp-spinner-ring { width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.18); border-top-color: var(--tp-accent); animation: tp-spin 0.75s linear infinite; }
@keyframes tp-spin { to { transform: rotate(360deg); } }
.tp-error { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(8, 7, 7, 0.86); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); text-align: center; }
.tp-error-message { margin: 0; max-width: 36ch; font-size: 15px; line-height: 1.45; text-wrap: balance; }

/* Menu */
.tp-menu-wrap { position: relative; }
.tp-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 10px);
  min-width: 232px;
  max-height: min(62cqh, 340px);
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
  padding: 6px;
  border-radius: calc(var(--tp-radius) + 4px);
  background: var(--tp-surface);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  backdrop-filter: blur(20px) saturate(1.4);
  box-shadow: inset 0 0 0 1px var(--tp-border), var(--tp-shadow);
  transform-origin: bottom right;
  animation: tp-menu-in 200ms var(--tp-ease);
  z-index: 10;
}
@keyframes tp-menu-in { from { opacity: 0; transform: translateY(6px) scale(0.97); } }
.tp-menu-item {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 38px;
  padding: 8px 12px;
  border-radius: calc(var(--tp-radius) - 1px);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 120ms;
}
.tp-menu-item:hover { background: var(--tp-hover); }
.tp-menu-label { flex: 1; }
.tp-menu-hint { display: inline-flex; align-items: center; gap: 6px; color: var(--tp-muted-fg); font-size: 13px; font-variant-numeric: tabular-nums; }
.tp-menu-item[role='menuitem']:has(.tp-menu-hint)::after {
  content: '';
  width: 6px;
  height: 6px;
  margin: 0 2px 0 -8px;
  border-top: 1.5px solid var(--tp-muted-fg);
  border-right: 1.5px solid var(--tp-muted-fg);
  transform: rotate(45deg);
}
.tp-menu-item[aria-checked='true'] { font-weight: 650; }
.tp-menu-hint .tp-icon { width: 18px; height: 18px; color: var(--tp-accent); filter: none; }
.tp-menu-back { display: inline-flex; align-items: center; gap: 6px; font-weight: 650; }
.tp-menu-back .tp-icon { width: 16px; height: 16px; transform: rotate(180deg); filter: none; }
.tp-menu-item:has(.tp-menu-back) { margin-bottom: 4px; border-bottom: 1px solid var(--tp-border); border-radius: calc(var(--tp-radius) - 1px) calc(var(--tp-radius) - 1px) 0 0; }

/* Captions */
.tp-media::cue { font-family: var(--tp-font); background: rgba(0, 0, 0, 0.72); color: #fff; font-size: var(--tp-cue-size, 1em); }
.tp[data-size='lg'] .tp-media::cue { --tp-cue-size: 1.25em; }

@media (prefers-reduced-motion: reduce) {
  .tp *, .tp *::before, .tp *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
@media (forced-colors: active) {
  .tp-slider-fill { background: Highlight; }
  .tp-slider-track { border: 1px solid CanvasText; }
  .tp-icon { filter: none; }
}

/* Auto-hide: any element with .tp-autohide fades out while playing and idle. */
.tp-autohide { transition: opacity 360ms var(--tp-ease), transform 360ms var(--tp-ease), visibility 360ms; }
.tp[data-playing][data-idle]:not([data-menu-open]) .tp-autohide { opacity: 0; visibility: hidden; }
.tp:not([data-started]) .tp-hide-unstarted { display: none !important; }
.tp-row { display: flex; align-items: center; gap: var(--tp-gap); min-width: 0; }
.tp-rate { font-weight: 700; font-size: 13px; font-variant-numeric: tabular-nums; }
.tp-unmute { display: none; }
.tp[data-muted-autoplay] .tp-unmute { display: inline-flex; }
.tp-caption { position: absolute; inset: auto 0 calc(var(--tp-caption-offset, 72px)) 0; display: flex; justify-content: center; padding: 0 16px; pointer-events: none !important; transition: bottom 360ms var(--tp-ease); }
.tp[data-playing][data-idle] .tp-caption { --tp-caption-offset: 24px; }
.tp-caption-text {
  margin: 0;
  max-width: 42ch;
  padding: 5px 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.74);
  text-align: center;
  font-size: clamp(14px, 2.4cqw, 24px);
  font-weight: 500;
  line-height: 1.35;
  white-space: pre-line;
  text-wrap: balance;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.tp[data-pseudo-fullscreen] { position: fixed !important; inset: 0; z-index: 2147483647; width: 100vw; height: 100dvh; max-width: none; padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
`;import{clamp as A,formatTime as M}from"@tomato-player/core";function p(t,e={},...n){let r=document.createElement(t);for(let o in e){let a=e[o];a==null||a===!1||(o.startsWith("on")&&typeof a=="function"?r.addEventListener(o.slice(2),a):o==="class"?r.className=String(a):r.setAttribute(o,a===!0?"":String(a)))}return Z(r,n),r}function Z(t,e){for(let n of e)n==null||n===!1||t.append(n)}function T(t){let e=document.createElement("template");e.innerHTML=t.trim();let n=e.content.firstElementChild;return n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false"),n}var P,h=class{constructor(){D(this,P,[])}add(e){e&&I(this,P).push(e)}listen(e,n,r,o){e.addEventListener(n,r,o),I(this,P).push(()=>e.removeEventListener(n,r,o))}dispose(){for(let e of I(this,P).splice(0).reverse())e()}};P=new WeakMap;var b=t=>`<svg class="tp-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">${t}</svg>`,S={play:b('<path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11.3-7.2a1 1 0 0 0 0-1.8L8.6 3.9C7.9 3.5 7 4 7 4.8Z"/>'),pause:b('<rect x="6" y="4" width="4.2" height="16" rx="1.2"/><rect x="13.8" y="4" width="4.2" height="16" rx="1.2"/>'),replay:b('<path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z"/>'),volumeHigh:b('<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),volumeLow:b('<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),volumeMuted:b('<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),fullscreen:b('<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),fullscreenExit:b('<path d="M9 4v4a1 1 0 0 1-1 1H4M20 9h-4a1 1 0 0 1-1-1V4M15 20v-4a1 1 0 0 1 1-1h4M4 15h4a1 1 0 0 1 1 1v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),pip:b('<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="12" y="12" width="7" height="5" rx="1"/>'),captions:b('<rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),settings:b('<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.3 4.6-.1-1.1 2-1.6-2-3.4-2.4.9a8 8 0 0 0-1.9-1.1L15.5 4h-4l-.4 2.8a8 8 0 0 0-1.9 1.1l-2.4-.9-2 3.4 2 1.6a8 8 0 0 0 0 2.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.2.8 1.9 1.1l.4 2.6h4l.4-2.6c.7-.3 1.3-.6 1.9-1.1l2.4.9 2-3.4-2-1.6.1-1.1Z" transform="translate(-1.5 0)"/>'),forward:b('<path d="M12 5V2l5 4-5 4V7a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7Z"/>'),backward:b('<path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z"/>'),next:b('<path d="M5 5.6v12.8c0 .8.9 1.2 1.5.8l9-6.4a1 1 0 0 0 0-1.6l-9-6.4C5.9 4.4 5 4.8 5 5.6Z"/><rect x="17" y="5" width="2.5" height="14" rx="1"/>'),previous:b('<path d="M19 5.6v12.8c0 .8-.9 1.2-1.5.8l-9-6.4a1 1 0 0 1 0-1.6l9-6.4c.6-.4 1.5 0 1.5.8Z"/><rect x="4.5" y="5" width="2.5" height="14" rx="1"/>'),cast:b('<path d="M3 17a4 4 0 0 1 4 4M3 13a8 8 0 0 1 8 8M3 9.5A11.5 11.5 0 0 1 14.5 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),chapters:b('<path d="M4 6h16M4 12h10M4 18h13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),check:b('<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),chevron:b('<path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),theater:b('<rect x="2" y="7" width="20" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>'),tomato:b('<path d="M12 7c4.7 0 8 3 8 6.8S16.4 21 12 21s-8-3.4-8-7.2S7.3 7 12 7Z"/><path d="M12 7.5 9.5 4.5M12 7.5l2.5-3M12 7.5V3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>')};var H=new WeakMap;function L(t,e){e?H.set(t,e):H.delete(t)}function C(t,e){let n=t?.options.icons?.[e]??(t?H.get(t)?.[e]:void 0)??S[e]??S.play,r=typeof n=="function"?n(e):T(n);return r.classList.add("tp-icon"),r.setAttribute("data-tp-icon",e),r.setAttribute("aria-hidden","true"),r}function w(t,e){return{el:t,destroy(){e.dispose(),t.remove()}}}function k(t,e,n,r){t.add(e.store.select(n,r))}function N(t,e){let n=new h,r=p("button",{type:"button",class:`tp-button ${e.className??""}`.trim(),"aria-label":e.label,title:e.label});return e.icon&&r.append(e.icon in S?C(t,e.icon):T(e.icon)),e.text&&r.append(p("span",{class:"tp-button-text"},e.text)),n.listen(r,"click",e.onClick),w(r,n)}function E(t,e,n,r){let o=new h,a=p("button",{type:"button",class:`tp-button ${e}`});o.listen(a,"click",n);let s="";return k(o,t,d=>JSON.stringify(r(d)),d=>{if(d===s)return;s=d;let{icon:c,label:u,pressed:v}=JSON.parse(d);a.replaceChildren(C(t,c)),a.setAttribute("aria-label",u),a.title=u,v!==void 0&&a.setAttribute("aria-pressed",String(v))}),w(a,o)}var ht=t=>E(t,"tp-play",()=>{t.togglePlay()},e=>e.ended?{icon:"replay",label:t.t("replay")}:e.paused?{icon:"play",label:t.t("play")}:{icon:"pause",label:t.t("pause")}),U=t=>E(t,"tp-mute",()=>t.toggleMute(),e=>e.muted||e.volume===0?{icon:"volumeMuted",label:t.t("unmute")}:{icon:e.volume<.5?"volumeLow":"volumeHigh",label:t.t("mute")}),vt=t=>E(t,"tp-fullscreen",()=>{t.toggleFullscreen()},e=>e.fullscreen?{icon:"fullscreenExit",label:t.t("exitFullscreen")}:{icon:"fullscreen",label:t.t("enterFullscreen")});function gt(t){let e=E(t,"tp-pip",()=>{t.togglePip().catch(()=>{})},r=>({icon:"pip",label:r.pip?t.t("exitPip"):t.t("enterPip"),pressed:r.pip}));return typeof document<"u"&&(document.pictureInPictureEnabled||"webkitSetPresentationMode"in t.media)||(e.el.hidden=!0),e}function xt(t){let e=0,n=E(t,"tp-captions",()=>{let{textTrack:o}=t.state;o>=0?(e=o,t.setTextTrack(-1)):t.setTextTrack(e)},o=>({icon:"captions",label:t.t("captions"),pressed:o.textTrack>=0})),r=new h;return k(r,t,o=>o.textTracks.length,o=>n.el.hidden=o===0),{el:n.el,destroy:()=>(r.dispose(),n.destroy())}}function kt(t,e){let n=e<0,r=t.t(n?"seekBackward":"seekForward",{seconds:Math.abs(e)}),o=N(t,{icon:n?"backward":"forward",label:r,className:`tp-seek ${n?"tp-seek-back":"tp-seek-forward"}`,onClick:()=>t.seekBy(e)});return o.el.append(p("span",{class:"tp-seek-amount","aria-hidden":"true"},String(Math.abs(e)))),o}function wt(t){let e=t.media,n=N(t,{icon:"cast",label:t.t("cast"),className:"tp-cast",onClick:()=>{e.webkitShowPlaybackTargetPicker?e.webkitShowPlaybackTargetPicker():e.remote?.prompt().catch(()=>{})}});return n.el.hidden=!0,e.remote?.watchAvailability?e.remote.watchAvailability(r=>n.el.hidden=!r).catch(()=>n.el.hidden=!0):"WebKitPlaybackTargetAvailabilityEvent"in globalThis&&e.addEventListener("webkitplaybacktargetavailabilitychanged",r=>n.el.hidden=r.availability!=="available"),n}function q(t){let e=new h,n=p("div",{class:"tp-slider-fill"}),r=p("div",{class:"tp-slider-buffer"}),o=p("div",{class:"tp-slider-thumb"}),a=p("div",{class:"tp-slider-track"},r,n),s=p("div",{class:`tp-slider ${t.className??""}`.trim(),role:"slider",tabindex:0,"aria-label":t.label,"aria-valuemin":0,"aria-valuemax":100},a,o),d=0,c=!1,u=t.step??.05,v=i=>{s.style.setProperty("--tp-slider-value",String(i))},x=i=>{let l=s.getBoundingClientRect();return l.width?A((i.clientX-l.left)/l.width,0,1):0};e.listen(s,"pointerdown",i=>{i.button===0&&(c=!0,s.setPointerCapture?.(i.pointerId),s.toggleAttribute("data-dragging",!0),d=x(i),v(d),t.onInput(d))}),e.listen(s,"pointermove",i=>{let l=x(i);t.onHover?.(l,i.clientX),c&&(d=l,v(l),t.onInput(l))});let f=i=>{c&&(c=!1,s.removeAttribute("data-dragging"),(t.onCommit??t.onInput)(x(i)))};return e.listen(s,"pointerup",f),e.listen(s,"pointercancel",f),e.listen(s,"pointerleave",()=>t.onHover?.(null,0)),e.listen(s,"keydown",i=>{let l={ArrowRight:u,ArrowUp:u,ArrowLeft:-u,ArrowDown:-u,PageUp:.1,PageDown:-.1},m;i.key in l?m=d+l[i.key]:i.key==="Home"?m=0:i.key==="End"&&(m=1),m!==void 0&&(i.preventDefault(),i.stopPropagation(),d=A(m,0,1),v(d),(t.onCommit??t.onInput)(d))}),{el:s,track:a,get dragging(){return c},setValue(i,l){c||(d=A(i,0,1),v(d),s.setAttribute("aria-valuenow",String(Math.round(d*100))),s.setAttribute("aria-valuetext",l))},setBuffered(i){s.style.setProperty("--tp-slider-buffer",String(A(i,0,1)))},destroy(){e.dispose(),s.remove()}}}function F(t){let e=q({label:t.t("volume"),className:"tp-volume-slider",onInput:r=>t.setVolume(r)}),n=new h;return k(n,t,r=>r.muted?0:r.volume,r=>e.setValue(r,`${Math.round(r*100)}%`)),{el:e.el,destroy:()=>(n.dispose(),e.destroy())}}function yt(t){let e=U(t),n=F(t),r=p("div",{class:"tp-volume"},e.el,n.el);return{el:r,destroy:()=>(e.destroy(),n.destroy(),r.remove())}}function Ct(t,e={}){let n=new h,r=e.liveScrub??!0,o=p("div",{class:"tp-preview","aria-hidden":"true"}),a=p("div",{class:"tp-preview-thumb"}),s=p("div",{class:"tp-preview-chapter"}),d=p("div",{class:"tp-preview-time"});o.append(a,s,d);let c=()=>{let i=t.state;return i.live&&i.seekable?{start:i.seekable.start,length:i.seekable.end-i.seekable.start}:{start:0,length:i.duration}},u=i=>{let l=c();return l.start+i*l.length},v=q({label:t.t("seek"),className:"tp-time-slider",step:.01,onInput:i=>{r&&t.seek(u(i))},onCommit:i=>t.seek(u(i)),onHover:(i,l)=>{if(i===null||!c().length)return o.removeAttribute("data-visible");let m=u(i);d.textContent=M(t.state.live?m-(t.state.seekable?.end??0):m);let y=t.inject("chapters")?.list().find(V=>m>=V.start&&m<V.end);s.textContent=y?.title??"";let g=t.inject("thumbnails")?.get(m);g?(a.hidden=!1,Object.assign(a.style,{width:`${g.width}px`,height:`${g.height}px`,backgroundImage:`url("${g.url}")`,backgroundPosition:`-${g.x}px -${g.y}px`})):a.hidden=!0;let R=v.el.getBoundingClientRect(),O=(o.offsetWidth||0)/2,j=A(l-R.left,O,Math.max(O,R.width-O));o.style.setProperty("--tp-preview-x",`${j}px`),o.setAttribute("data-visible","")}});v.el.append(o);let x=p("div",{class:"tp-chapter-markers","aria-hidden":"true"});v.track.append(x);let f=()=>{let i=t.inject("chapters")?.list()??[],{length:l}=c();x.replaceChildren(...l?i.slice(1).map(m=>p("span",{class:"tp-chapter-marker",style:`left:${m.start/l*100}%`})):[])};return n.add(t.on("plugin:chapters",f)),k(n,t,i=>i.duration,f),k(n,t,i=>`${i.currentTime}|${i.duration}|${i.buffered.length?i.buffered[i.buffered.length-1].end:0}`,()=>{let i=t.state,l=c(),m=l.length?(i.currentTime-l.start)/l.length:0;v.setValue(m,t.t("timeOf",{current:M(i.currentTime),duration:M(i.duration)}));let y=i.buffered.find(g=>g.start<=i.currentTime&&g.end>=i.currentTime)?.end??0;v.setBuffered(l.length?(y-l.start)/l.length:0)}),{el:v.el,destroy:()=>(n.dispose(),v.destroy())}}function B(t,e,n){let r=new h,o=p("span",{class:e});return k(r,t,n,a=>o.textContent=a),w(o,r)}var W=t=>B(t,"tp-time tp-time-current",e=>M(e.currentTime,e.duration>=3600)),G=t=>B(t,"tp-time tp-time-duration",e=>M(e.duration)),Pt=t=>B(t,"tp-time tp-time-remaining",e=>M(-(e.duration-e.currentTime))),St=t=>B(t,"tp-title",e=>e.title??"");function Mt(t){let e=new h,n=W(t),r=G(t),o=Q(t),a=p("span",{class:"tp-time-display"},n.el,p("span",{class:"tp-time-sep"}," / "),r.el,o.el);return k(e,t,s=>s.live,s=>a.toggleAttribute("data-live",s)),e.add(()=>(n.destroy(),r.destroy(),o.destroy())),w(a,e)}function Q(t){let e=new h,n=p("button",{type:"button",class:"tp-live","aria-label":t.t("goLive")},p("span",{class:"tp-live-dot"}),t.t("live"));return e.listen(n,"click",()=>{let r=t.state.seekable?.end;r!==void 0&&t.seek(r)}),k(e,t,r=>r.live,r=>n.hidden=!r),k(e,t,r=>!!r.seekable&&r.seekable.end-r.currentTime<10,r=>n.toggleAttribute("data-edge",r)),w(n,e)}function Tt(t){return N(t,{icon:"play",label:t.t("play"),className:"tp-big-play",onClick:()=>{t.togglePlay()}})}function At(){let t=p("div",{class:"tp-spinner",role:"status","aria-label":"Loading"},p("div",{class:"tp-spinner-ring"}));return w(t,new h)}function Et(t){let e=new h,n=p("p",{class:"tp-error-message"}),r=p("div",{class:"tp-error",role:"alert"},n);return k(e,t,o=>o.error?.message??"",o=>{r.hidden=!o,n.textContent=o?t.t("error"):"",o&&(n.title=o)}),w(r,e)}function It(t){let e=new h,n=p("div",{class:"tp-gesture-layer","aria-hidden":"true"}),r;return e.listen(n,"click",o=>{if(o.pointerType==="touch"&&t.state.idle&&!t.state.paused)return t.activity();clearTimeout(r),r=setTimeout(()=>{t.togglePlay()},200)}),e.listen(n,"dblclick",()=>{clearTimeout(r),t.toggleFullscreen()}),e.add(()=>clearTimeout(r)),w(n,e)}var Y=(t,e=[.5,.75,1,1.25,1.5,1.75,2])=>({id:"speed",label:t.t("speed"),items:n=>({items:e.map(r=>({label:r===1?t.t("normal"):`${r}\xD7`,value:r})),selected:n.playbackRate}),select:n=>t.setPlaybackRate(Number(n))}),J=t=>({id:"quality",label:t.t("quality"),items:e=>e.qualities.length>1?{items:[{label:t.t("auto"),value:-1},...[...e.qualities].sort((n,r)=>(r.height??0)-(n.height??0)).map(n=>({label:n.label,value:n.id}))],selected:e.quality}:null,select:e=>t.setQuality(Number(e))}),_=t=>({id:"captions",label:t.t("captions"),items:e=>e.textTracks.length?{items:[{label:t.t("captionsOff"),value:-1},...e.textTracks.map(n=>({label:n.label,value:n.id}))],selected:e.textTrack}:null,select:e=>t.setTextTrack(Number(e))}),tt=t=>({id:"audio",label:t.t("audio"),items:e=>e.audioTracks.length>1?{items:e.audioTracks.map(n=>({label:n.label,value:n.id})),selected:e.audioTrack}:null,select:e=>t.setAudioTrack(Number(e))});function zt(t,e){let n=new h,r=e??[J(t),Y(t),_(t),tt(t)],o=p("div",{class:"tp-menu",role:"menu",hidden:!0}),a=p("button",{type:"button",class:"tp-button tp-settings","aria-label":t.t("settings"),title:t.t("settings"),"aria-haspopup":"menu","aria-expanded":"false"},C(t,"settings")),s=p("div",{class:"tp-menu-wrap"},a,o),d=!1,c=null,u=(f,i,l,m={})=>{let y=p("button",{type:"button",class:"tp-menu-item",role:"menuitem",...m},p("span",{class:"tp-menu-label"},f),i?p("span",{class:"tp-menu-hint"},i):null);return y.addEventListener("click",g=>{g.stopPropagation(),l()}),y},v=()=>{let f=t.state;o.replaceChildren();let i=r.find(l=>l.id===c);if(i){let l=i.items(f);o.append(u(p("span",{class:"tp-menu-back"},C(t,"chevron"),i.label),null,()=>(c=null,v())));for(let m of l?.items??[]){let y=m.value===l?.selected;o.append(u(m.label,y?C(t,"check"):null,()=>{i.select(m.value),c=null,x()},{role:"menuitemradio","aria-checked":String(y)}))}}else for(let l of r){let m=l.items(f);if(!m)continue;let y=m.items.find(g=>g.value===m.selected)?.label??"";o.append(u(l.label,y,()=>(c=l.id,v())))}o.querySelector("button")?.focus({preventScroll:!0})},x=()=>{d=!1,o.hidden=!0,a.setAttribute("aria-expanded","false"),t.el.removeAttribute("data-menu-open")};return n.listen(a,"click",f=>{if(f.stopPropagation(),d)return x();d=!0,c=null,o.hidden=!1,a.setAttribute("aria-expanded","true"),t.el.setAttribute("data-menu-open",""),v()}),n.listen(o,"keydown",f=>{if(f.key==="Escape"&&(f.stopPropagation(),x(),a.focus()),f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault(),f.stopPropagation();let i=[...o.querySelectorAll("button")],l=i.indexOf(document.activeElement);i[(l+(f.key==="ArrowDown"?1:-1)+i.length)%i.length]?.focus()}}),n.listen(document,"click",f=>{d&&!s.contains(f.target)&&x()}),n.add(t.store.subscribe((f,i)=>{f.idle&&!i.idle&&d&&x()})),w(s,n)}function Lt(t,...e){let n=e.filter(Boolean),r=p("div",{class:t},...n.map(o=>"destroy"in o?o.el:o));return{el:r,destroy(){for(let o of n)"destroy"in o&&o.destroy();r.remove()}}}var Nt=()=>w(p("div",{class:"tp-spacer"}),new h);function Bt(t,e){let n=e.filter(Boolean);for(let r of n)t.append(r.el);return()=>{for(let r of n)r.destroy()}}function Ot(t,e={}){if(typeof IntersectionObserver>"u")return()=>{};if((e.respectQuiet??!0)&&(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||navigator.connection?.saveData===!0))return()=>{};let r=e.playAt??.6,o=e.pauseAt??.2,a=!1,s=new IntersectionObserver(([c])=>{if(!c)return;let{media:u}=t;c.intersectionRatio>=r&&u.paused&&!(a&&(e.once??!0))?(a=!0,u.muted=!0,t.el.setAttribute("data-muted-autoplay",""),u.play().catch(()=>t.el.removeAttribute("data-muted-autoplay"))):c.intersectionRatio<o&&u.muted&&!u.paused&&u.pause()},{threshold:[0,o,r]});s.observe(t.el);let d=t.on("volumechange",({muted:c})=>{c||t.el.removeAttribute("data-muted-autoplay")});return()=>{s.disconnect(),d(),t.el.removeAttribute("data-muted-autoplay")}}function Ht(t,e={}){return N(t,{icon:"volumeMuted",label:e.label??t.t("tapToUnmute"),text:e.label??t.t("tapToUnmute"),className:"tp-unmute",onClick:()=>{(e.restart??!0)&&t.seek(0),t.setMuted(!1),t.media.volume===0&&t.setVolume(.6),t.play()}})}function Rt(t,e=[1,1.25,1.5,2,.75]){let n=new h,r=p("button",{type:"button",class:"tp-button tp-rate"});return n.listen(r,"click",()=>{let o=e.indexOf(t.state.playbackRate);t.setPlaybackRate(e[(o+1)%e.length])}),k(n,t,o=>o.playbackRate,o=>{r.textContent=`${o}x`,r.setAttribute("aria-label",`${t.t("speed")} ${o}x`)}),w(r,n)}function Vt(t){let e=new h,n=p("p",{class:"tp-caption-text"}),r=p("div",{class:"tp-caption","aria-hidden":"true",hidden:!0},n),o=null;t.provide("captionsRenderer",!0),e.add(()=>t.provide("captionsRenderer",!1));let a=()=>{let s=o?.activeCues?.[0];n.textContent=s?.text??"",r.hidden=!s};return k(e,t,s=>s.textTrack,s=>{o?.removeEventListener("cuechange",a),o=null,r.hidden=!0;let c=Array.from(t.media.textTracks??[]).filter(u=>u.kind==="subtitles"||u.kind==="captions")[s];c&&(c.mode="hidden",o=c,c.addEventListener("cuechange",a),a())}),e.add(()=>o?.removeEventListener("cuechange",a)),w(r,e)}import{defineSkin as et,injectStyle as nt}from"@tomato-player/core";function rt(t){return(e={})=>et({name:t.name,css:t.css,tokens:{...t.tokens,...e.tokens},mount(n,r){n.options.injectStyles!==!1&&nt("base",z,r.ownerDocument);let o=e.icons;L(n,t.icons||o?{...t.icons,...o}:void 0);let a=t.build(n,r,e),{controls:s,cleanup:d}=Array.isArray(a)?{controls:a,cleanup:void 0}:a,c=s.filter(Boolean);for(let u of c)u.el.parentNode||r.append(u.el);return()=>{d?.(),L(n,void 0);for(let u of c)u.destroy()}}})}var Kt=z;export{h as Scope,Z as append,tt as audioSection,Ot as autoplayInView,Kt as baseStyles,Tt as bigPlayButton,N as button,Vt as captionOverlay,xt as captionsButton,_ as captionsSection,wt as castButton,rt as createSkin,W as currentTime,G as duration,Et as errorOverlay,vt as fullscreenButton,It as gestureLayer,Lt as group,p as h,C as icon,S as icons,Q as liveBadge,Bt as mountAll,U as muteButton,gt as pipButton,ht as playButton,J as qualitySection,Rt as rateButton,Pt as remainingTime,kt as seekButton,L as setSkinIcons,zt as settingsMenu,q as slider,Nt as spacer,Y as speedSection,At as spinner,T as svg,Mt as timeDisplay,Ct as timeSlider,St as title,Ht as unmuteButton,yt as volumeControl,F as volumeSlider};
