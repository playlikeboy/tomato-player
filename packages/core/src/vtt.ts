export interface VttCue {
  start: number;
  end: number;
  text: string;
}

/** `01:02:03.500` or `02:03.500` -> seconds. */
export function parseVttTime(value: string): number {
  const parts = value.trim().split(':').map(Number);
  let s = 0;
  for (const p of parts) s = s * 60 + p;
  return s;
}

/** Small, forgiving WebVTT cue parser (for chapters / thumbnails metadata, not caption rendering). */
export function parseVtt(text: string): VttCue[] {
  const cues: VttCue[] = [];
  const blocks = text.replace(/\r\n?/g, '\n').split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n');
    const idx = lines.findIndex((l) => l.includes('-->'));
    if (idx < 0) continue;
    const [from, rest] = lines[idx]!.split('-->');
    const to = rest!.trim().split(/\s+/)[0]!;
    cues.push({ start: parseVttTime(from!), end: parseVttTime(to), text: lines.slice(idx + 1).join('\n').trim() });
  }
  return cues;
}
