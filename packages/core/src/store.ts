export type Listener<T> = (state: Readonly<T>, prev: Readonly<T>) => void;

export interface Store<T extends object> {
  /** Current snapshot. Treat as immutable. */
  get(): Readonly<T>;
  /** Shallow-merge a patch. Listeners fire only if a value actually changed. */
  set(patch: Partial<T>): void;
  /** Listen to every change. Returns an unsubscribe function. */
  subscribe(listener: Listener<T>): () => void;
  /**
   * Listen to a derived value. `callback` fires immediately and then only when
   * the selected value changes (compared with `Object.is`).
   */
  select<V>(selector: (state: Readonly<T>) => V, callback: (value: V, prev: V | undefined) => void): () => void;
}

/** Minimal synchronous store. ~40 lines, no dependencies. */
export function createStore<T extends object>(initial: T): Store<T> {
  let state = { ...initial };
  const listeners = new Set<Listener<T>>();

  return {
    get: () => state,
    set(patch) {
      let changed = false;
      for (const key in patch) {
        if (!Object.is(state[key], patch[key])) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      const prev = state;
      state = { ...state, ...patch };
      for (const listener of [...listeners]) listener(state, prev);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    select(selector, callback) {
      let current = selector(state);
      callback(current, undefined);
      const listener: Listener<T> = (next) => {
        const value = selector(next);
        if (Object.is(value, current)) return;
        const prev = current;
        current = value;
        callback(value, prev);
      };
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
