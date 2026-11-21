import { definePlugin, type Player } from '@tomato-player/core';

export type HotkeyAction = (player: Player, event: KeyboardEvent) => void;

export interface HotkeysOptions {
  /** `'focus'` (default): only when the player has focus. `'global'`: anywhere on the page except form fields. */
  scope?: 'focus' | 'global';
  /** Seconds for arrow keys (default 5) and j/l (default 10). */
  seekStep?: number;
  longSeekStep?: number;
  volumeStep?: number;
  /** Override or add bindings. Keys are `KeyboardEvent.key` values, lower-cased; `null` disables a default. */
  bindings?: Record<string, HotkeyAction | null>;
}

const RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function defaultBindings(o: Required<Pick<HotkeysOptions, 'seekStep' | 'longSeekStep' | 'volumeStep'>>): Record<string, HotkeyAction> {
  const rate = (dir: 1 | -1) => (p: Player) => {
    const i = RATES.findIndex((r) => r >= p.state.playbackRate);
    p.setPlaybackRate(RATES[Math.min(RATES.length - 1, Math.max(0, (i < 0 ? 3 : i) + dir))]!);
  };
  const map: Record<string, HotkeyAction> = {
    ' ': (p) => void p.togglePlay(),
    k: (p) => void p.togglePlay(),
    f: (p) => void p.toggleFullscreen(),
    m: (p) => p.toggleMute(),
    i: (p) => void p.togglePip().catch(() => {}),
    c: (p) => p.setTextTrack(p.state.textTrack >= 0 ? -1 : 0),
    arrowleft: (p) => p.seekBy(-o.seekStep),
    arrowright: (p) => p.seekBy(o.seekStep),
    j: (p) => p.seekBy(-o.longSeekStep),
    l: (p) => p.seekBy(o.longSeekStep),
    arrowup: (p) => p.setVolume(p.state.volume + o.volumeStep),
    arrowdown: (p) => p.setVolume(p.state.volume - o.volumeStep),
    home: (p) => p.seek(0),
    end: (p) => p.seek(p.state.duration),
    '>': rate(1),
    '<': rate(-1),
    ',': (p) => p.state.paused && p.seekBy(-1 / 30),
    '.': (p) => p.state.paused && p.seekBy(1 / 30),
  };
  for (let n = 0; n <= 9; n++) map[String(n)] = (p) => p.seek((p.state.duration * n) / 10);
  return map;
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName));

export const hotkeys = (options: HotkeysOptions = {}) =>
  definePlugin({
    name: 'hotkeys',
    setup(player) {
      const bindings: Record<string, HotkeyAction | null> = {
        ...defaultBindings({ seekStep: options.seekStep ?? 5, longSeekStep: options.longSeekStep ?? 10, volumeStep: options.volumeStep ?? 0.1 }),
        ...options.bindings,
      };
      const target: EventTarget = options.scope === 'global' ? document : player.el;
      const onKey = (e: Event) => {
        const event = e as KeyboardEvent;
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;
        // Let focused buttons/sliders handle their own Space/Enter/arrows.
        const t = event.target as HTMLElement | null;
        if (t && t !== player.el && t.closest?.('button, [role="slider"], [role="menu"]') && [' ', 'enter', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'home', 'end'].includes(event.key.toLowerCase())) return;
        const action = bindings[event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase()] ?? bindings[event.key];
        if (!action) return;
        event.preventDefault();
        player.activity();
        action(player, event);
      };
      target.addEventListener('keydown', onKey);
      return {
        api: { bindings },
        destroy: () => target.removeEventListener('keydown', onKey),
      };
    },
  });
