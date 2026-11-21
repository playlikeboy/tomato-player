import { defineComponent, h, onBeforeUnmount, onMounted, shallowRef, watch, type PropType } from 'vue';
import { createPlayer, type Player, type PlayerOptions, type Skin, type Source } from '@tomato-player/core';

/**
 * ```vue
 * <TomatoPlayer :src="url" :skin="minimal()" :options="{ plugins: [hotkeys()] }" @ready="p => player = p" />
 * ```
 */
export const TomatoPlayer = defineComponent({
  name: 'TomatoPlayer',
  props: {
    src: { type: [String, Object, Array] as PropType<Source | Source[]>, default: undefined },
    poster: { type: String, default: undefined },
    title: { type: String, default: undefined },
    skin: { type: Object as PropType<Skin | null>, default: undefined },
    /** Any other `PlayerOptions` (plugins, providers, autoplay...). Read once at mount. */
    options: { type: Object as PropType<PlayerOptions>, default: () => ({}) },
  },
  emits: { ready: (_player: Player) => true },
  setup(props, { emit, expose }) {
    const host = shallowRef<HTMLDivElement>();
    const player = shallowRef<Player>();
    onMounted(() => {
      player.value = createPlayer(host.value!, { ...props.options, src: props.src, poster: props.poster, title: props.title, skin: props.skin });
      emit('ready', player.value);
    });
    onBeforeUnmount(() => player.value?.destroy());
    watch(
      () => [props.src, props.poster, props.title] as const,
      ([src, poster, title]) => {
        if (src && player.value) void player.value.setSource(src, { poster, title });
      },
      { deep: true },
    );
    watch(
      () => props.skin,
      (skin) => player.value?.setSkin(skin ?? null),
    );
    expose({ player });
    return () => h('div', { ref: host });
  },
});

/** Reactive state composable: `const paused = usePlayerState(player, s => s.paused)`. */
export function usePlayerState<T>(player: { value: Player | undefined }, selector: (s: Player['state']) => T) {
  const value = shallowRef<T>();
  let off: (() => void) | undefined;
  watch(
    () => player.value,
    (p) => {
      off?.();
      off = p?.store.select(selector, (v) => (value.value = v));
    },
    { immediate: true },
  );
  onBeforeUnmount(() => off?.());
  return value;
}

export type { Player, PlayerOptions } from '@tomato-player/core';
