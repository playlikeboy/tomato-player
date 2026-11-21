export type Child = Node | string | null | undefined | false;
type Attrs = Record<string, string | number | boolean | undefined | null | EventListener>;

/** Tiny hyperscript helper: `h('button', { class: 'x', onclick }, 'Play')`. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const key in attrs) {
    const value = attrs[key];
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
    else if (key === 'class') el.className = String(value);
    else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

export function append(el: Element, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child);
  }
}

/** Parse a trusted SVG string (from ./icons) into an element. */
export function svg(markup: string): SVGElement {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup.trim();
  const el = tpl.content.firstElementChild as SVGElement;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('focusable', 'false');
  return el;
}

/** Collects cleanup functions. */
export class Scope {
  #fns: (() => void)[] = [];
  add(fn: (() => void) | void): void {
    if (fn) this.#fns.push(fn);
  }
  listen(el: EventTarget, type: string, fn: (e: any) => void, opts?: AddEventListenerOptions): void {
    el.addEventListener(type, fn, opts);
    this.#fns.push(() => el.removeEventListener(type, fn, opts));
  }
  dispose(): void {
    for (const fn of this.#fns.splice(0).reverse()) fn();
  }
}
