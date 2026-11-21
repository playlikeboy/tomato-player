import { definePlugin } from '@tomato-player/core';

export interface MediaSessionOptions {
  artist?: string;
  album?: string;
  artwork?: MediaImage[];
  seekStep?: number;
  /** Wire next/previous hardware keys, e.g. to the playlist plugin. */
  onNext?(): void;
  onPrevious?(): void;
}

/** Lock-screen / notification controls and hardware media keys via the Media Session API. */
export const mediaSession = (options: MediaSessionOptions = {}) =>
  definePlugin({
    name: 'media-session',
    setup(player) {
      const ms = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;
      if (!ms || typeof MediaMetadata === 'undefined') return;
      const step = options.seekStep ?? 10;
      const handlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
        ['play', () => void player.play()],
        ['pause', () => player.pause()],
        ['seekbackward', (d) => player.seekBy(-(d.seekOffset ?? step))],
        ['seekforward', (d) => player.seekBy(d.seekOffset ?? step)],
        ['seekto', (d) => d.seekTime !== undefined && player.seek(d.seekTime)],
        ['nexttrack', options.onNext ? () => options.onNext!() : null],
        ['previoustrack', options.onPrevious ? () => options.onPrevious!() : null],
      ];
      const bind = () => {
        for (const [action, fn] of handlers) {
          try {
            ms.setActionHandler(action, fn);
          } catch {
            /* unsupported action */
          }
        }
      };
      const updateMeta = () => {
        const s = player.state;
        ms.metadata = new MediaMetadata({
          title: s.title ?? '',
          artist: options.artist ?? '',
          album: options.album ?? '',
          artwork: options.artwork ?? (s.poster ? [{ src: s.poster }] : []),
        });
      };
      const offs = [
        player.on('play', () => {
          bind();
          updateMeta();
          ms.playbackState = 'playing';
        }),
        player.on('pause', () => (ms.playbackState = 'paused')),
        player.on('sourcechange', updateMeta),
        player.on('timeupdate', () => {
          const s = player.state;
          if (!s.duration || s.live || !ms.setPositionState) return;
          try {
            ms.setPositionState({ duration: s.duration, position: Math.min(s.currentTime, s.duration), playbackRate: s.playbackRate });
          } catch {
            /* ignore */
          }
        }),
      ];
      return {
        destroy() {
          offs.forEach((off) => off());
          for (const [action] of handlers) {
            try {
              ms.setActionHandler(action, null);
            } catch {
              /* ignore */
            }
          }
        },
      };
    },
  });
