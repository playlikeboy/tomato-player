// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMap = { [key: string]: any };
export type Handler<P> = (payload: P) => void;

export class Emitter<E extends object = EventMap> {
  #handlers = new Map<keyof E, Set<Handler<any>>>();

  on<K extends keyof E>(type: K, handler: Handler<E[K]>): () => void {
    let set = this.#handlers.get(type);
    if (!set) this.#handlers.set(type, (set = new Set()));
    set.add(handler);
    return () => this.off(type, handler);
  }

  once<K extends keyof E>(type: K, handler: Handler<E[K]>): () => void {
    const off = this.on(type, (payload) => {
      off();
      handler(payload);
    });
    return off;
  }

  off<K extends keyof E>(type: K, handler: Handler<E[K]>): void {
    this.#handlers.get(type)?.delete(handler);
  }

  emit<K extends keyof E>(type: K, payload: E[K]): void {
    const set = this.#handlers.get(type);
    if (!set) return;
    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (error) {
        // A broken listener must never break playback.
        console.error(`[tomato-player] listener for "${String(type)}" threw`, error);
      }
    }
  }

  clear(): void {
    this.#handlers.clear();
  }
}
