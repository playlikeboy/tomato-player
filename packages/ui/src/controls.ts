import { clamp, formatTime, type Player, type PlayerState } from '@tomato-player/core';
import { Scope, h, svg, type Child } from './dom';
import { icons, type IconName } from './icons';

export interface Control {
  el: HTMLElement;
  destroy(): void;
}

/** Contract other extensions can `provide()` to enrich the time slider. */
export interface ThumbnailProvider {
  get(time: number): { url: string; x: number; y: number; width: number; height: number } | null;
}
export interface ChaptersProvider {
  list(): { start: number; end: number; title: string }[];
}

function control(el: HTMLElement, scope: Scope): Control {
  return {
    el,
    destroy() {
      scope.dispose();
      el.remove();
    },
  };
}

function watch<V>(scope: Scope, player: Player, selector: (s: Readonly<PlayerState>) => V, fn: (v: V) => void) {
  scope.add(player.store.select(selector, fn));
}

// ---------------------------------------------------------------- Buttons

export interface ButtonOptions {
  icon?: IconName | string;
  label: string;
  className?: string;
  text?: string;
  onClick(e: MouseEvent): void;
}

/** Accessible icon button. `icon` may be an icon name or raw trusted SVG markup. */
export function button(_player: Player, opts: ButtonOptions): Control {
  const scope = new Scope();
  const el = h('button', { type: 'button', class: `tp-button ${opts.className ?? ''}`.trim(), 'aria-label': opts.label, title: opts.label });
  if (opts.icon) el.append(svg(opts.icon in icons ? icons[opts.icon as IconName] : opts.icon));
  if (opts.text) el.append(h('span', { class: 'tp-button-text' }, opts.text));
  scope.listen(el, 'click', opts.onClick);
  return control(el, scope);
}

function toggleButton(player: Player, className: string, onClick: () => void, render: (s: Readonly<PlayerState>) => { icon: IconName; label: string; pressed?: boolean }) {
  const scope = new Scope();
  const el = h('button', { type: 'button', class: `tp-button ${className}` });
  scope.listen(el, 'click', onClick);
  let last = '';
  watch(scope, player, (s) => JSON.stringify(render(s)), (json) => {
    if (json === last) return;
    last = json;
    const { icon, label, pressed } = JSON.parse(json) as ReturnType<typeof render>;
    el.replaceChildren(svg(icons[icon]));
    el.setAttribute('aria-label', label);
    el.title = label;
    if (pressed !== undefined) el.setAttribute('aria-pressed', String(pressed));
  });
  return control(el, scope);
}

export const playButton = (player: Player) =>
  toggleButton(player, 'tp-play', () => void player.togglePlay(), (s) =>
    s.ended ? { icon: 'replay', label: player.t('replay') } : s.paused ? { icon: 'play', label: player.t('play') } : { icon: 'pause', label: player.t('pause') },
  );

export const muteButton = (player: Player) =>
  toggleButton(player, 'tp-mute', () => player.toggleMute(), (s) =>
    s.muted || s.volume === 0
      ? { icon: 'volumeMuted', label: player.t('unmute') }
      : { icon: s.volume < 0.5 ? 'volumeLow' : 'volumeHigh', label: player.t('mute') },
  );

export const fullscreenButton = (player: Player) =>
  toggleButton(player, 'tp-fullscreen', () => void player.toggleFullscreen(), (s) =>
    s.fullscreen ? { icon: 'fullscreenExit', label: player.t('exitFullscreen') } : { icon: 'fullscreen', label: player.t('enterFullscreen') },
  );

export function pipButton(player: Player): Control {
  const c = toggleButton(player, 'tp-pip', () => void player.togglePip().catch(() => {}), (s) => ({
    icon: 'pip',
    label: s.pip ? player.t('exitPip') : player.t('enterPip'),
    pressed: s.pip,
  }));
  const supported = typeof document !== 'undefined' && ((document as any).pictureInPictureEnabled || 'webkitSetPresentationMode' in player.media);
  if (!supported) c.el.hidden = true;
  return c;
}

export function captionsButton(player: Player): Control {
  let lastOn = 0;
  const c = toggleButton(player, 'tp-captions', () => {
    const { textTrack } = player.state;
    if (textTrack >= 0) {
      lastOn = textTrack;
      player.setTextTrack(-1);
    } else player.setTextTrack(lastOn);
  }, (s) => ({ icon: 'captions', label: player.t('captions'), pressed: s.textTrack >= 0 }));
  const scope = new Scope();
  watch(scope, player, (s) => s.textTracks.length, (n) => (c.el.hidden = n === 0));
  return { el: c.el, destroy: () => (scope.dispose(), c.destroy()) };
}

export function seekButton(player: Player, seconds: number): Control {
  const back = seconds < 0;
  const label = player.t(back ? 'seekBackward' : 'seekForward', { seconds: Math.abs(seconds) });
  const c = button(player, { icon: back ? 'backward' : 'forward', label, className: `tp-seek ${back ? 'tp-seek-back' : 'tp-seek-forward'}`, onClick: () => player.seekBy(seconds) });
  c.el.append(h('span', { class: 'tp-seek-amount', 'aria-hidden': 'true' }, String(Math.abs(seconds))));
  return c;
}

/** Remote Playback API (Chromecast on Chrome/Android, AirPlay on Safari). Hidden when unavailable. */
export function castButton(player: Player): Control {
  const media = player.media as any;
  const c = button(player, {
    icon: 'cast',
    label: player.t('cast'),
    className: 'tp-cast',
    onClick: () => {
      if (media.webkitShowPlaybackTargetPicker) media.webkitShowPlaybackTargetPicker();
      else media.remote?.prompt().catch(() => {});
    },
  });
  c.el.hidden = true;
  if (media.remote?.watchAvailability) {
    media.remote.watchAvailability((available: boolean) => (c.el.hidden = !available)).catch(() => (c.el.hidden = true));
  } else if ('WebKitPlaybackTargetAvailabilityEvent' in globalThis) {
    media.addEventListener('webkitplaybacktargetavailabilitychanged', (e: any) => (c.el.hidden = e.availability !== 'available'));
  }
  return c;
}

// ---------------------------------------------------------------- Slider

export interface SliderOptions {
  label: string;
  className?: string;
  /** Called while dragging/keyboard with a value 0..1. */
  onInput(value: number): void;
  /** Called on release. Defaults to onInput. */
  onCommit?(value: number): void;
  /** Called when hovering, with the pointer value 0..1 (or null on leave). */
  onHover?(value: number | null, clientX: number): void;
  step?: number;
}

export interface Slider extends Control {
  track: HTMLElement;
  setValue(value: number, text: string): void;
  setBuffered(value: number): void;
  readonly dragging: boolean;
}

export function slider(opts: SliderOptions): Slider {
  const scope = new Scope();
  const fill = h('div', { class: 'tp-slider-fill' });
  const buffer = h('div', { class: 'tp-slider-buffer' });
  const thumb = h('div', { class: 'tp-slider-thumb' });
  const track = h('div', { class: 'tp-slider-track' }, buffer, fill);
  const el = h('div', { class: `tp-slider ${opts.className ?? ''}`.trim(), role: 'slider', tabindex: 0, 'aria-label': opts.label, 'aria-valuemin': 0, 'aria-valuemax': 100 }, track, thumb);
  let value = 0;
  let dragging = false;
  const step = opts.step ?? 0.05;

  const paint = (v: number) => {
    el.style.setProperty('--tp-slider-value', String(v));
  };
  const fromEvent = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    return rect.width ? clamp((e.clientX - rect.left) / rect.width, 0, 1) : 0;
  };
  scope.listen(el, 'pointerdown', (e: PointerEvent) => {
    if (e.button !== 0) return;
    dragging = true;
    el.setPointerCapture?.(e.pointerId);
    el.toggleAttribute('data-dragging', true);
    value = fromEvent(e);
    paint(value);
    opts.onInput(value);
  });
  scope.listen(el, 'pointermove', (e: PointerEvent) => {
    const v = fromEvent(e);
    opts.onHover?.(v, e.clientX);
    if (!dragging) return;
    value = v;
    paint(v);
    opts.onInput(v);
  });
  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    el.removeAttribute('data-dragging');
    (opts.onCommit ?? opts.onInput)(fromEvent(e));
  };
  scope.listen(el, 'pointerup', end);
  scope.listen(el, 'pointercancel', end);
  scope.listen(el, 'pointerleave', () => opts.onHover?.(null, 0));
  scope.listen(el, 'keydown', (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 0.1, PageDown: -0.1 };
    let next: number | undefined;
    if (e.key in map) next = value + map[e.key]!;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 1;
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    value = clamp(next, 0, 1);
    paint(value);
    (opts.onCommit ?? opts.onInput)(value);
  });

  return {
    el,
    track,
    get dragging() {
      return dragging;
    },
    setValue(v, text) {
      if (dragging) return;
      value = clamp(v, 0, 1);
      paint(value);
      el.setAttribute('aria-valuenow', String(Math.round(value * 100)));
      el.setAttribute('aria-valuetext', text);
    },
    setBuffered(v) {
      el.style.setProperty('--tp-slider-buffer', String(clamp(v, 0, 1)));
    },
    destroy() {
      scope.dispose();
      el.remove();
    },
  };
}

export function volumeSlider(player: Player): Control {
  const s = slider({ label: player.t('volume'), className: 'tp-volume-slider', onInput: (v) => player.setVolume(v) });
  const scope = new Scope();
  watch(scope, player, (st) => (st.muted ? 0 : st.volume), (v) => s.setValue(v, `${Math.round(v * 100)}%`));
  return { el: s.el, destroy: () => (scope.dispose(), s.destroy()) };
}

/** Mute button + volume slider that expands on hover. */
export function volumeControl(player: Player): Control {
  const mute = muteButton(player);
  const vol = volumeSlider(player);
  const el = h('div', { class: 'tp-volume' }, mute.el, vol.el);
  return { el, destroy: () => (mute.destroy(), vol.destroy(), el.remove()) };
}

export interface TimeSliderOptions {
  /** Seek continuously while dragging (default) or only on release. */
  liveScrub?: boolean;
}

/** Seek bar with buffered range, hover preview (time, thumbnail, chapter) and chapter markers. */
export function timeSlider(player: Player, opts: TimeSliderOptions = {}): Control {
  const scope = new Scope();
  const liveScrub = opts.liveScrub ?? true;
  const preview = h('div', { class: 'tp-preview', 'aria-hidden': 'true' });
  const previewImg = h('div', { class: 'tp-preview-thumb' });
  const previewChapter = h('div', { class: 'tp-preview-chapter' });
  const previewTime = h('div', { class: 'tp-preview-time' });
  preview.append(previewImg, previewChapter, previewTime);
  const range = () => {
    const s = player.state;
    if (s.live && s.seekable) return { start: s.seekable.start, length: s.seekable.end - s.seekable.start };
    return { start: 0, length: s.duration };
  };
  const toTime = (v: number) => {
    const r = range();
    return r.start + v * r.length;
  };
  const s = slider({
    label: player.t('seek'),
    className: 'tp-time-slider',
    step: 0.01,
    onInput: (v) => {
      if (liveScrub) player.seek(toTime(v));
    },
    onCommit: (v) => player.seek(toTime(v)),
    onHover: (v, clientX) => {
      if (v === null || !range().length) return preview.removeAttribute('data-visible');
      const time = toTime(v);
      previewTime.textContent = formatTime(player.state.live ? time - (player.state.seekable?.end ?? 0) : time);
      const chapter = player.inject<ChaptersProvider>('chapters')?.list().find((c) => time >= c.start && time < c.end);
      previewChapter.textContent = chapter?.title ?? '';
      const thumb = player.inject<ThumbnailProvider>('thumbnails')?.get(time);
      if (thumb) {
        previewImg.hidden = false;
        Object.assign(previewImg.style, {
          width: `${thumb.width}px`,
          height: `${thumb.height}px`,
          backgroundImage: `url("${thumb.url}")`,
          backgroundPosition: `-${thumb.x}px -${thumb.y}px`,
        });
      } else previewImg.hidden = true;
      const rect = s.el.getBoundingClientRect();
      const half = (preview.offsetWidth || 0) / 2;
      const x = clamp(clientX - rect.left, half, Math.max(half, rect.width - half));
      preview.style.setProperty('--tp-preview-x', `${x}px`);
      preview.setAttribute('data-visible', '');
    },
  });
  s.el.append(preview);
  const markers = h('div', { class: 'tp-chapter-markers', 'aria-hidden': 'true' });
  s.track.append(markers);

  const renderMarkers = () => {
    const chapters = player.inject<ChaptersProvider>('chapters')?.list() ?? [];
    const { length } = range();
    markers.replaceChildren(
      ...(length ? chapters.slice(1).map((c) => h('span', { class: 'tp-chapter-marker', style: `left:${(c.start / length) * 100}%` })) : []),
    );
  };
  scope.add(player.on('plugin:chapters', renderMarkers));
  watch(scope, player, (st) => st.duration, renderMarkers);
  watch(scope, player, (st) => `${st.currentTime}|${st.duration}|${st.buffered.length ? st.buffered[st.buffered.length - 1]!.end : 0}`, () => {
    const st = player.state;
    const r = range();
    const v = r.length ? (st.currentTime - r.start) / r.length : 0;
    s.setValue(v, player.t('timeOf', { current: formatTime(st.currentTime), duration: formatTime(st.duration) }));
    const end = st.buffered.find((b) => b.start <= st.currentTime && b.end >= st.currentTime)?.end ?? 0;
    s.setBuffered(r.length ? (end - r.start) / r.length : 0);
  });
  return { el: s.el, destroy: () => (scope.dispose(), s.destroy()) };
}

// ---------------------------------------------------------------- Text

function text(player: Player, className: string, render: (s: Readonly<PlayerState>) => string): Control {
  const scope = new Scope();
  const el = h('span', { class: className });
  watch(scope, player, render, (v) => (el.textContent = v));
  return control(el, scope);
}

export const currentTime = (player: Player) => text(player, 'tp-time tp-time-current', (s) => formatTime(s.currentTime, s.duration >= 3600));
export const duration = (player: Player) => text(player, 'tp-time tp-time-duration', (s) => formatTime(s.duration));
export const remainingTime = (player: Player) => text(player, 'tp-time tp-time-remaining', (s) => formatTime(-(s.duration - s.currentTime)));
export const title = (player: Player) => text(player, 'tp-title', (s) => s.title ?? '');

/** `1:23 / 4:56`, or a LIVE badge for live streams. */
export function timeDisplay(player: Player): Control {
  const scope = new Scope();
  const cur = currentTime(player);
  const dur = duration(player);
  const live = liveBadge(player);
  const el = h('span', { class: 'tp-time-display' }, cur.el, h('span', { class: 'tp-time-sep' }, ' / '), dur.el, live.el);
  watch(scope, player, (s) => s.live, (isLive) => el.toggleAttribute('data-live', isLive));
  scope.add(() => (cur.destroy(), dur.destroy(), live.destroy()));
  return control(el, scope);
}

export function liveBadge(player: Player): Control {
  const scope = new Scope();
  const el = h('button', { type: 'button', class: 'tp-live', 'aria-label': player.t('goLive') }, h('span', { class: 'tp-live-dot' }), player.t('live'));
  scope.listen(el, 'click', () => {
    const end = player.state.seekable?.end;
    if (end !== undefined) player.seek(end);
  });
  watch(scope, player, (s) => s.live, (live) => (el.hidden = !live));
  watch(scope, player, (s) => !!s.seekable && s.seekable.end - s.currentTime < 10, (edge) => el.toggleAttribute('data-edge', edge));
  return control(el, scope);
}

// ---------------------------------------------------------------- Overlays

export function bigPlayButton(player: Player): Control {
  const c = button(player, { icon: 'play', label: player.t('play'), className: 'tp-big-play', onClick: () => void player.togglePlay() });
  return c;
}

export function spinner(): Control {
  const el = h('div', { class: 'tp-spinner', role: 'status', 'aria-label': 'Loading' }, h('div', { class: 'tp-spinner-ring' }));
  return control(el, new Scope());
}

export function errorOverlay(player: Player): Control {
  const scope = new Scope();
  const msg = h('p', { class: 'tp-error-message' });
  const el = h('div', { class: 'tp-error', role: 'alert' }, msg);
  watch(scope, player, (s) => s.error?.message ?? '', (m) => {
    el.hidden = !m;
    msg.textContent = m ? player.t('error') : '';
    if (m) msg.title = m;
  });
  return control(el, scope);
}

/** Click/tap surface over the video: click toggles play, double-click toggles fullscreen. */
export function gestureLayer(player: Player): Control {
  const scope = new Scope();
  const el = h('div', { class: 'tp-gesture-layer', 'aria-hidden': 'true' });
  let timer: ReturnType<typeof setTimeout> | undefined;
  scope.listen(el, 'click', (e: MouseEvent) => {
    if ((e as PointerEvent).pointerType === 'touch') {
      // On touch, first tap reveals controls; tapping again while visible toggles play.
      if (player.state.idle && !player.state.paused) return player.activity();
    }
    clearTimeout(timer);
    timer = setTimeout(() => void player.togglePlay(), 200);
  });
  scope.listen(el, 'dblclick', () => {
    clearTimeout(timer);
    void player.toggleFullscreen();
  });
  scope.add(() => clearTimeout(timer));
  return control(el, scope);
}

// ---------------------------------------------------------------- Menus

export interface MenuItem {
  label: string;
  value: string | number;
  hint?: string;
}

export interface MenuSection {
  id: string;
  label: string;
  /** Items and the currently selected value. Return `null` to hide the section. */
  items(state: Readonly<PlayerState>): { items: MenuItem[]; selected: string | number } | null;
  select(value: string | number): void;
}

export const speedSection = (player: Player, rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]): MenuSection => ({
  id: 'speed',
  label: player.t('speed'),
  items: (s) => ({ items: rates.map((r) => ({ label: r === 1 ? player.t('normal') : `${r}×`, value: r })), selected: s.playbackRate }),
  select: (v) => player.setPlaybackRate(Number(v)),
});

export const qualitySection = (player: Player): MenuSection => ({
  id: 'quality',
  label: player.t('quality'),
  items: (s) =>
    s.qualities.length > 1
      ? { items: [{ label: player.t('auto'), value: -1 }, ...[...s.qualities].sort((a, b) => (b.height ?? 0) - (a.height ?? 0)).map((q) => ({ label: q.label, value: q.id }))], selected: s.quality }
      : null,
  select: (v) => player.setQuality(Number(v)),
});

export const captionsSection = (player: Player): MenuSection => ({
  id: 'captions',
  label: player.t('captions'),
  items: (s) => (s.textTracks.length ? { items: [{ label: player.t('captionsOff'), value: -1 }, ...s.textTracks.map((t) => ({ label: t.label, value: t.id }))], selected: s.textTrack } : null),
  select: (v) => player.setTextTrack(Number(v)),
});

export const audioSection = (player: Player): MenuSection => ({
  id: 'audio',
  label: player.t('audio'),
  items: (s) => (s.audioTracks.length > 1 ? { items: s.audioTracks.map((t) => ({ label: t.label, value: t.id })), selected: s.audioTrack } : null),
  select: (v) => player.setAudioTrack(Number(v)),
});

/** Settings popover with drill-down sections (speed, quality, captions, audio by default). */
export function settingsMenu(player: Player, sections?: MenuSection[]): Control {
  const scope = new Scope();
  const list = sections ?? [qualitySection(player), speedSection(player), captionsSection(player), audioSection(player)];
  const panel = h('div', { class: 'tp-menu', role: 'menu', hidden: true });
  const trigger = h('button', { type: 'button', class: 'tp-button tp-settings', 'aria-label': player.t('settings'), title: player.t('settings'), 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, svg(icons.settings));
  const el = h('div', { class: 'tp-menu-wrap' }, trigger, panel);
  let open = false;
  let view: string | null = null;

  const item = (label: Child, hint: Child, onClick: () => void, attrs: Record<string, string> = {}) => {
    const b = h('button', { type: 'button', class: 'tp-menu-item', role: 'menuitem', ...attrs }, h('span', { class: 'tp-menu-label' }, label), hint ? h('span', { class: 'tp-menu-hint' }, hint) : null);
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    return b;
  };

  const render = () => {
    const state = player.state;
    panel.replaceChildren();
    const section = list.find((s) => s.id === view);
    if (section) {
      const data = section.items(state);
      panel.append(item(h('span', { class: 'tp-menu-back' }, '‹ ', section.label), null, () => ((view = null), render())));
      for (const it of data?.items ?? []) {
        const checked = it.value === data?.selected;
        panel.append(
          item(it.label, checked ? svg(icons.check) : null, () => {
            section.select(it.value);
            view = null;
            close();
          }, { role: 'menuitemradio', 'aria-checked': String(checked) }),
        );
      }
    } else {
      for (const s of list) {
        const data = s.items(state);
        if (!data) continue;
        const current = data.items.find((i) => i.value === data.selected)?.label ?? '';
        panel.append(item(s.label, current, () => ((view = s.id), render())));
      }
    }
    (panel.querySelector('button') as HTMLButtonElement | null)?.focus({ preventScroll: true });
  };
  const close = () => {
    open = false;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    player.el.removeAttribute('data-menu-open');
  };
  scope.listen(trigger, 'click', (e: MouseEvent) => {
    e.stopPropagation();
    if (open) return close();
    open = true;
    view = null;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    player.el.setAttribute('data-menu-open', '');
    render();
  });
  scope.listen(panel, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      trigger.focus();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      const items = [...panel.querySelectorAll<HTMLButtonElement>('button')];
      const idx = items.indexOf(document.activeElement as HTMLButtonElement);
      items[(idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    }
  });
  scope.listen(document, 'click', (e: MouseEvent) => {
    if (open && !el.contains(e.target as Node)) close();
  });
  scope.add(player.store.subscribe((s, p) => {
    if (s.idle && !p.idle && open) close();
  }));
  return control(el, scope);
}

// ---------------------------------------------------------------- Layout

export function group(className: string, ...children: (Control | HTMLElement | null | undefined | false)[]): Control {
  const items = children.filter(Boolean) as (Control | HTMLElement)[];
  const el = h('div', { class: className }, ...items.map((c) => ('destroy' in c ? c.el : c)));
  return {
    el,
    destroy() {
      for (const c of items) if ('destroy' in c) c.destroy();
      el.remove();
    },
  };
}

export const spacer = (): Control => control(h('div', { class: 'tp-spacer' }), new Scope());

/** Mount a list of controls into `root` and return a single cleanup. */
export function mountAll(root: HTMLElement, controls: (Control | null | undefined | false)[]): () => void {
  const list = controls.filter(Boolean) as Control[];
  for (const c of list) root.append(c.el);
  return () => {
    for (const c of list) c.destroy();
  };
}
