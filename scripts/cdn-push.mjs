#!/usr/bin/env node
// Publishes cdn-dist/ as a single commit on the `cdn` branch through the GitHub API.
// Commits created this way with the Actions token are signed by GitHub, so they show as Verified.
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_SHA.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repo, GITHUB_SHA: sha = 'local' } = process.env;
if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required');
const dir = join(process.cwd(), 'cdn-dist');
const api = async (path, body, method = body ? 'POST' : 'GET') => {
  const res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'content-type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  if (!res.ok && !(method === 'GET' && res.status === 404)) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 404 ? null : res.json();
};

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : files.push(join(d, f));
})(dir);

const tree = [];
for (const f of files) {
  const blob = await api('/git/blobs', { content: readFileSync(f).toString('base64'), encoding: 'base64' });
  tree.push({ path: relative(dir, f), mode: '100644', type: 'blob', sha: blob.sha });
}
const t = await api('/git/trees', { tree });
const commit = await api('/git/commits', { message: `cdn: build of ${sha.slice(0, 7)}`, tree: t.sha, parents: [] });
const ref = await api('/git/ref/heads/cdn');
if (ref) await api('/git/refs/heads/cdn', { sha: commit.sha, force: true }, 'PATCH');
else await api('/git/refs', { ref: 'refs/heads/cdn', sha: commit.sha });
console.log(`[cdn-push] ${files.length} files -> cdn @ ${commit.sha.slice(0, 7)} (verified: ${commit.verification?.verified})`);
