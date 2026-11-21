import type { Source, SourceObject, TimeRange } from './types';

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** `75` -> `1:15`, `3725` -> `1:02:05`. Negative input renders with a leading minus. */
export function formatTime(seconds: number, forceHours = false): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const sign = seconds < 0 ? '-' : '';
  const total = Math.floor(Math.abs(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  if (h > 0 || forceHours) return `${sign}${h}:${String(m).padStart(2, '0')}:${ss}`;
  return `${sign}${m}:${ss}`;
}

const MIME_BY_EXT: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  mov: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg',
  ogg: 'video/ogg',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  m3u8: 'application/x-mpegurl',
  mpd: 'application/dash+xml',
};

export function guessType(url: string): string | undefined {
  const clean = url.split(/[?#]/)[0] ?? '';
  const ext = clean.slice(clean.lastIndexOf('.') + 1).toLowerCase();
  return MIME_BY_EXT[ext];
}

export function normalizeSource(source: Source): SourceObject {
  const obj = typeof source === 'string' ? { src: source } : { ...source };
  if (!obj.type) {
    const guessed = guessType(obj.src);
    if (guessed) obj.type = guessed;
  }
  if (obj.type) obj.type = obj.type.toLowerCase();
  return obj;
}

export const isHlsType = (type?: string) => !!type && /mpegurl/.test(type);
export const isDashType = (type?: string) => type === 'application/dash+xml';

export function rangesFrom(ranges: TimeRanges | undefined | null): TimeRange[] {
  const out: TimeRange[] = [];
  if (!ranges) return out;
  for (let i = 0; i < ranges.length; i++) out.push({ start: ranges.start(i), end: ranges.end(i) });
  return out;
}

/** Media Source Extensions (incl. Safari 17+ ManagedMediaSource). */
export function supportsMSE(): boolean {
  if (!isBrowser) return false;
  const w = window as any;
  return !!(w.ManagedMediaSource || w.MediaSource || w.WebKitMediaSource);
}

let styleCache: WeakMap<Document, Set<string>> | undefined;
/** Inject a `<style>` once per document per id. */
export function injectStyle(id: string, css: string, doc: Document = document): void {
  styleCache ??= new WeakMap();
  let ids = styleCache.get(doc);
  if (!ids) styleCache.set(doc, (ids = new Set()));
  if (ids.has(id) || doc.querySelector(`style[data-tomato="${id}"]`)) {
    ids.add(id);
    return;
  }
  const style = doc.createElement('style');
  style.dataset.tomato = id;
  style.textContent = css;
  doc.head.appendChild(style);
  ids.add(id);
}
