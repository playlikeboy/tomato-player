// Original Tomato Player icon set. 24x24, `currentColor`, MIT licensed.
const i = (body: string) => `<svg class="tp-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">${body}</svg>`;

export const icons = {
  play: i('<path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11.3-7.2a1 1 0 0 0 0-1.8L8.6 3.9C7.9 3.5 7 4 7 4.8Z"/>'),
  pause: i('<rect x="6" y="4" width="4.2" height="16" rx="1.2"/><rect x="13.8" y="4" width="4.2" height="16" rx="1.2"/>'),
  replay: i('<path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z"/>'),
  volumeHigh: i('<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  volumeLow: i('<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  volumeMuted: i('<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  fullscreen: i('<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  fullscreenExit: i('<path d="M9 4v4a1 1 0 0 1-1 1H4M20 9h-4a1 1 0 0 1-1-1V4M15 20v-4a1 1 0 0 1 1-1h4M4 15h4a1 1 0 0 1 1 1v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  pip: i('<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="12" y="12" width="7" height="5" rx="1"/>'),
  captions: i('<rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  settings: i('<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.3 4.6-.1-1.1 2-1.6-2-3.4-2.4.9a8 8 0 0 0-1.9-1.1L15.5 4h-4l-.4 2.8a8 8 0 0 0-1.9 1.1l-2.4-.9-2 3.4 2 1.6a8 8 0 0 0 0 2.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.2.8 1.9 1.1l.4 2.6h4l.4-2.6c.7-.3 1.3-.6 1.9-1.1l2.4.9 2-3.4-2-1.6.1-1.1Z" transform="translate(-1.5 0)"/>'),
  forward: i('<path d="M12 5V2l5 4-5 4V7a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7Z"/>'),
  backward: i('<path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z"/>'),
  next: i('<path d="M5 5.6v12.8c0 .8.9 1.2 1.5.8l9-6.4a1 1 0 0 0 0-1.6l-9-6.4C5.9 4.4 5 4.8 5 5.6Z"/><rect x="17" y="5" width="2.5" height="14" rx="1"/>'),
  previous: i('<path d="M19 5.6v12.8c0 .8-.9 1.2-1.5.8l-9-6.4a1 1 0 0 1 0-1.6l9-6.4c.6-.4 1.5 0 1.5.8Z"/><rect x="4.5" y="5" width="2.5" height="14" rx="1"/>'),
  cast: i('<path d="M3 17a4 4 0 0 1 4 4M3 13a8 8 0 0 1 8 8M3 9.5A11.5 11.5 0 0 1 14.5 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  chapters: i('<path d="M4 6h16M4 12h10M4 18h13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  check: i('<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
  chevron: i('<path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  theater: i('<rect x="2" y="7" width="20" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>'),
  tomato: i('<path d="M12 7c4.7 0 8 3 8 6.8S16.4 21 12 21s-8-3.4-8-7.2S7.3 7 12 7Z"/><path d="M12 7.5 9.5 4.5M12 7.5l2.5-3M12 7.5V3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
} as const;

export type IconName = keyof typeof icons;
