import { definePlugin, type PlayerError } from '@tomato-player/core';

export type AnalyticsEvent =
  | { type: 'view_start'; src: string; startupTime: number }
  | { type: 'play' | 'pause' | 'ended'; currentTime: number }
  | { type: 'seek'; from: number; to: number }
  | { type: 'quartile'; percent: 25 | 50 | 75 | 100 }
  | { type: 'rebuffer_start'; currentTime: number }
  | { type: 'rebuffer_end'; duration: number }
  | { type: 'quality_change'; quality: number }
  | { type: 'error'; error: PlayerError }
  | { type: 'heartbeat' | 'view_end'; watchTime: number; rebufferTime: number; rebufferCount: number };

export interface AnalyticsOptions {
  /** Receives every event. Forward to GA4, Segment, PostHog, your own endpoint... */
  onEvent(event: AnalyticsEvent & { sessionId: string; timestamp: number }): void;
  /** Heartbeat interval in ms while playing (default 30 000, `0` disables). */
  heartbeat?: number;
}

export interface AnalyticsAPI {
  summary(): { watchTime: number; rebufferTime: number; rebufferCount: number };
}

/** Vendor-neutral QoE analytics: startup time, rebuffering, watch time, quartiles. */
export const analytics = (options: AnalyticsOptions) =>
  definePlugin<AnalyticsAPI>({
    name: 'analytics',
    setup(player) {
      const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const now = () => performance.now();
      let loadStart = now();
      let started = false;
      let watchTime = 0;
      let lastTick = 0;
      let rebufferStart = 0;
      let rebufferTime = 0;
      let rebufferCount = 0;
      let lastTime = 0;
      const quartiles = new Set<number>();
      const send = (e: AnalyticsEvent) => options.onEvent({ ...e, sessionId, timestamp: Date.now() });
      const summary = () => ({ watchTime: Math.round(watchTime), rebufferTime: Math.round(rebufferTime), rebufferCount });

      const offs = [
        player.on('sourcechange', () => {
          loadStart = now();
          started = false;
          quartiles.clear();
        }),
        player.on('play', () => {
          if (!started) {
            started = true;
            send({ type: 'view_start', src: player.state.source?.src ?? '', startupTime: Math.round(now() - loadStart) });
          }
          send({ type: 'play', currentTime: player.state.currentTime });
          lastTick = now();
        }),
        player.on('pause', () => send({ type: 'pause', currentTime: player.state.currentTime })),
        player.on('ended', () => send({ type: 'ended', currentTime: player.state.currentTime })),
        player.on('seeking', (to) => send({ type: 'seek', from: lastTime, to })),
        player.on('qualitychange', (quality) => send({ type: 'quality_change', quality })),
        player.on('error', (error) => send({ type: 'error', error })),
        player.on('timeupdate', (t) => {
          if (!player.state.seeking) lastTime = t;
          if (!player.state.paused && lastTick) {
            const n = now();
            watchTime += n - lastTick;
            lastTick = n;
          }
          const d = player.state.duration;
          if (!d || player.state.live) return;
          for (const q of [25, 50, 75, 100] as const) {
            if (!quartiles.has(q) && t / d >= q / 100 - 0.001) {
              quartiles.add(q);
              send({ type: 'quartile', percent: q });
            }
          }
        }),
        player.store.select(
          (s) => s.waiting && s.started && !s.seeking,
          (waiting, prev) => {
            if (prev === undefined) return;
            if (waiting) {
              rebufferStart = now();
              rebufferCount++;
              send({ type: 'rebuffer_start', currentTime: player.state.currentTime });
            } else if (rebufferStart) {
              const d = now() - rebufferStart;
              rebufferTime += d;
              rebufferStart = 0;
              send({ type: 'rebuffer_end', duration: Math.round(d) });
            }
          },
        ),
      ];
      const interval = options.heartbeat ?? 30_000;
      const timer = interval ? setInterval(() => !player.state.paused && send({ type: 'heartbeat', ...summary() }), interval) : undefined;
      const onHide = () => document.visibilityState === 'hidden' && started && send({ type: 'view_end', ...summary() });
      document.addEventListener('visibilitychange', onHide);
      return {
        api: { summary },
        destroy() {
          if (started) send({ type: 'view_end', ...summary() });
          offs.forEach((off) => off());
          clearInterval(timer);
          document.removeEventListener('visibilitychange', onHide);
        },
      };
    },
  });
