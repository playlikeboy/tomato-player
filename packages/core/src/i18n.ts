export const en: Record<string, string> = {
  player: 'Video player',
  play: 'Play',
  pause: 'Pause',
  replay: 'Replay',
  mute: 'Mute',
  unmute: 'Unmute',
  volume: 'Volume',
  seek: 'Seek',
  enterFullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  enterPip: 'Picture-in-picture',
  exitPip: 'Exit picture-in-picture',
  captions: 'Captions',
  captionsOff: 'Off',
  settings: 'Settings',
  speed: 'Speed',
  normal: 'Normal',
  quality: 'Quality',
  auto: 'Auto',
  audio: 'Audio',
  live: 'Live',
  goLive: 'Go to live',
  seekForward: 'Forward {seconds} seconds',
  seekBackward: 'Back {seconds} seconds',
  cast: 'Cast',
  next: 'Next',
  previous: 'Previous',
  chapters: 'Chapters',
  error: 'This video could not be played.',
  tapToUnmute: 'Tap to unmute',
  timeOf: '{current} of {duration}',
};

export function translate(dict: Record<string, string>, key: string, vars?: Record<string, string | number>): string {
  let out = dict[key] ?? en[key] ?? key;
  if (vars) for (const k in vars) out = out.split(`{${k}}`).join(String(vars[k]));
  return out;
}
