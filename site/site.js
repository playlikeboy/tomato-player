// Tomato Player website: search, copy buttons, tabs, light syntax highlighting. No dependencies.
const BASE = document.documentElement.dataset.base || '/';

// ---- Copy buttons on code blocks
for (const pre of document.querySelectorAll('pre')) {
  const btn = document.createElement('button');
  btn.className = 'copy';
  btn.type = 'button';
  btn.textContent = 'Copy';
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? pre.innerText);
    btn.textContent = 'Copied';
    setTimeout(() => (btn.textContent = 'Copy'), 1200);
  });
  pre.append(btn);
}
for (const btn of document.querySelectorAll('[data-copy]')) {
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(btn.dataset.copy);
    const prev = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => (btn.textContent = prev), 1200);
  });
}

// ---- Minimal highlighting for ts/js/html/sh blocks
const KW = /\b(import|from|export|const|let|var|function|return|await|async|new|if|else|for|of|type|interface|extends|default|true|false|null|undefined)\b/g;
for (const code of document.querySelectorAll('pre code')) {
  if (code.dataset.hl) continue;
  code.dataset.hl = '1';
  const html = code.innerHTML;
  // Split strings/comments first so keywords inside them stay untouched.
  const parts = html.split(/(&#39;.*?&#39;|&quot;.*?&quot;|'[^'\n]*'|`[^`]*`|\/\/[^\n]*|&lt;!--.*?--&gt;|#[^\n!]*$)/gm);
  code.innerHTML = parts
    .map((p, i) => {
      if (i % 2 === 1) return p.startsWith('//') || p.startsWith('&lt;!--') || p.startsWith('#') ? `<span class="tok-c">${p}</span>` : `<span class="tok-s">${p}</span>`;
      return p.replace(KW, '<span class="tok-k">$1</span>').replace(/(?<![\w#&;-])(\d+(?:\.\d+)?)\b/g, '<span class="tok-n">$1</span>');
    })
    .join('');
}

// ---- Tabs
for (const group of document.querySelectorAll('[data-tabs]')) {
  const buttons = group.querySelectorAll('[role="tab"]');
  const panels = group.querySelectorAll('[role="tabpanel"]');
  buttons.forEach((b, i) =>
    b.addEventListener('click', () => {
      buttons.forEach((x, j) => x.setAttribute('aria-selected', String(i === j)));
      panels.forEach((p, j) => (p.hidden = i !== j));
    }),
  );
}

// ---- Search (index built at deploy time)
const input = document.querySelector('#search');
const results = document.querySelector('#search-results');
let index;
async function load() {
  index ??= await fetch(`${BASE}search-index.json`).then((r) => r.json());
  return index;
}
function score(entry, terms) {
  let s = 0;
  const title = entry.title.toLowerCase();
  const text = entry.text.toLowerCase();
  for (const t of terms) {
    if (title.includes(t)) s += 10;
    else if (entry.section.toLowerCase().includes(t)) s += 5;
    else if (text.includes(t)) s += 1;
    else return 0;
  }
  return s;
}
let selected = -1;
input?.addEventListener('input', async () => {
  const q = input.value.trim().toLowerCase();
  if (!q) return (results.hidden = true);
  const terms = q.split(/\s+/);
  const hits = (await load())
    .map((e) => [score(e, terms), e])
    .filter(([s]) => s > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 10);
  selected = -1;
  results.replaceChildren(
    ...(hits.length
      ? hits.map(([, e]) => {
          const a = document.createElement('a');
          a.href = BASE + e.url;
          a.innerHTML = `${e.title}<small>${e.section}</small>`;
          return a;
        })
      : [Object.assign(document.createElement('div'), { className: 'muted', style: 'padding:8px 10px', textContent: 'No results' })]),
  );
  results.hidden = false;
});
input?.addEventListener('keydown', (e) => {
  const links = [...results.querySelectorAll('a')];
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links.forEach((l, i) => l.setAttribute('aria-selected', String(i === selected)));
  } else if (e.key === 'Enter' && links[Math.max(0, selected)]) {
    location.href = links[Math.max(0, selected)].href;
  } else if (e.key === 'Escape') {
    results.hidden = true;
    input.blur();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    e.preventDefault();
    input?.focus();
  }
});
document.addEventListener('click', (e) => {
  if (results && !results.contains(e.target) && e.target !== input) results.hidden = true;
});
