import { definePlugin } from '@tomato-player/core';

export interface GesturesOptions {
  /** Seconds per double-tap (default 10). Consecutive taps accumulate. */
  seekStep?: number;
  /** Width fraction of the left/right tap zones (default 0.35). */
  zone?: number;
}

const CSS = `.tp-gesture-ripple{position:absolute;top:0;bottom:0;width:35%;display:grid;place-items:center;pointer-events:none;z-index:2;font:700 14px/1 var(--tp-font);color:#fff;background:radial-gradient(circle at var(--x,50%) 50%,rgba(255,255,255,.22),transparent 60%);animation:tp-ripple .6s ease-out forwards}.tp-gesture-ripple[data-side=left]{left:0;border-radius:0 50% 50% 0}.tp-gesture-ripple[data-side=right]{right:0;border-radius:50% 0 0 50%}@keyframes tp-ripple{from{opacity:1}to{opacity:0}}`;

/** Double-tap the left/right side of the video to seek, like most mobile video apps. */
export const gestures = (options: GesturesOptions = {}) =>
  definePlugin({
    name: 'gestures',
    setup(player) {
      const step = options.seekStep ?? 10;
      const zone = options.zone ?? 0.35;
      if (!document.querySelector('style[data-tomato="gestures"]')) {
        const style = document.createElement('style');
        style.dataset.tomato = 'gestures';
        style.textContent = CSS;
        document.head.append(style);
      }
      let lastTap = 0;
      let streak = 0;
      let ripple: HTMLElement | null = null;
      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerType !== 'touch') return;
        const target = e.target as HTMLElement;
        if (target.closest('button, [role="slider"], .tp-menu, .tp-controls')) return;
        const rect = player.el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const side = x < zone ? 'left' : x > 1 - zone ? 'right' : null;
        const now = performance.now();
        if (side && now - lastTap < 300) {
          e.stopPropagation();
          e.preventDefault();
          streak++;
          player.seekBy(side === 'left' ? -step : step);
          ripple?.remove();
          ripple = document.createElement('div');
          ripple.className = 'tp-gesture-ripple';
          ripple.dataset.side = side;
          ripple.textContent = `${side === 'left' ? '−' : '+'}${streak * step}s`;
          player.el.append(ripple);
        } else streak = 0;
        lastTap = now;
      };
      player.el.addEventListener('pointerup', onPointerUp, true);
      return {
        destroy() {
          ripple?.remove();
          player.el.removeEventListener('pointerup', onPointerUp, true);
        },
      };
    },
  });
