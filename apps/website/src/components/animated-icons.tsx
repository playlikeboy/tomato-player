'use client';

// Animated control icons from @animateicons/react, rendered into the player through
// @tomato-player/react's icon portals. Loaded lazily by <Player>, so only pages that
// show an animated skin download motion.
import { useEffect, useRef, type ComponentType, type RefAttributes } from 'react';
import type { IconHandle } from '@animateicons/react';
import {
  CaptionsIcon, CastIcon, ListIcon, MaximizeIcon, MinimizeIcon, PauseIcon, PictureInPictureIcon, PlayIcon,
  RotateCcwIcon, RotateCwIcon, SettingsIcon, SkipBackIcon, SkipForwardIcon, Volume1Icon, Volume2Icon, VolumeXIcon,
} from '@animateicons/react/lucide';
import type { ReactIconSet } from '@tomato-player/react';

type AnimatedIcon = ComponentType<{ size?: number } & RefAttributes<IconHandle>>;

/** Plays the icon's animation when its whole control is hovered or focused, not only the glyph. */
function Animated({ icon: Icon }: { icon: AnimatedIcon }) {
  const icon = useRef<IconHandle>(null);
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const control = anchor.current?.closest<HTMLElement>('button, [role="slider"]');
    if (!control) return;
    const start = () => icon.current?.startAnimation();
    control.addEventListener('pointerenter', start);
    control.addEventListener('focus', start);
    return () => {
      control.removeEventListener('pointerenter', start);
      control.removeEventListener('focus', start);
    };
  }, []);
  return (
    <span ref={anchor} className="tp-animated-icon">
      <Icon ref={icon} size={24} />
    </span>
  );
}

const set: Record<string, AnimatedIcon> = {
  play: PlayIcon,
  pause: PauseIcon,
  replay: RotateCcwIcon,
  backward: RotateCcwIcon,
  forward: RotateCwIcon,
  volumeHigh: Volume2Icon,
  volumeLow: Volume1Icon,
  volumeMuted: VolumeXIcon,
  fullscreen: MaximizeIcon,
  fullscreenExit: MinimizeIcon,
  pip: PictureInPictureIcon,
  captions: CaptionsIcon,
  settings: SettingsIcon,
  next: SkipForwardIcon,
  previous: SkipBackIcon,
  cast: CastIcon,
  chapters: ListIcon,
};

export const ANIMATED_ICONS: ReactIconSet = Object.fromEntries(Object.entries(set).map(([name, Icon]) => [name, <Animated icon={Icon} />]));
