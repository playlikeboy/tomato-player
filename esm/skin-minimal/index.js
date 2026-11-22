import{bigPlayButton as e,captionsButton as o,createSkin as s,errorOverlay as r,fullscreenButton as l,gestureLayer as m,group as n,pipButton as d,playButton as c,settingsMenu as u,spacer as g,spinner as x,timeDisplay as k,timeSlider as f,volumeControl as v}from"@tomato-player/ui";var a=`/* Minimal: one quiet row over an eased scrim. The default skin. */
.tp[data-skin='minimal'] { --tp-radius: 10px; border-radius: var(--tp-radius); }
.tp[data-skin='minimal'] .tp-controls {
  position: absolute; inset: auto 0 0 0; display: grid; gap: 0;
  padding: clamp(40px, 12cqw, 72px) clamp(8px, 1.6cqw, 14px) clamp(4px, 1cqw, 8px);
  background: var(--tp-scrim);
}
.tp[data-skin='minimal'] .tp-time-slider { margin: 0 calc((var(--tp-control-size) - var(--tp-icon-size)) / 2); }
.tp[data-skin='minimal'] .tp-big-play { --tp-control-size: 68px; --tp-icon-size: 28px; }
.tp[data-skin='minimal'][data-size='sm'] .tp-pip { display: none; }
.tp[data-skin='minimal'] [data-tp-icon='play'] svg, .tp[data-skin='minimal'] [data-tp-icon='pause'] svg { fill: currentColor; }
`;var y=s({name:"minimal",css:a,build:(i,b,t)=>[m(i),x(),e(i),r(i),n("tp-controls tp-autohide tp-hide-unstarted",f(i),n("tp-row",c(i),v(i),k(i),g(),o(i),t.settings!==!1&&u(i),t.pip!==!1&&d(i),l(i)))]}),q=y;export{q as default,y as minimal};
