#!/usr/bin/env node
// Walker out/ etter `next build` og injiserer en full precache-liste i out/sw.js.
// Sikrer at hele appen (alle sider, RSC-payloads, fonter, ikoner, JS/CSS-chunks)
// er tilgjengelig offline fra første lasting.

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const OUT_DIR = 'out';
const SW_TEMPLATE = 'public/sw.js';
const SW_OUTPUT = join(OUT_DIR, 'sw.js');
const PLACEHOLDER = '/* __PRECACHE_MANIFEST__ */';

// Maks-størrelse per fil vi vil precache (skipper enormt store assets — ingen forventet her).
const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function toUrlPath(absPath) {
  const rel = relative(OUT_DIR, absPath).split(sep).join('/');
  // index.html → katalog med trailing slash (matcher trailingSlash: true)
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

function shouldInclude(urlPath) {
  // SW-filen selv skal aldri precaches (browser cacher den med egne regler).
  if (urlPath === '/sw.js') return false;
  // Source maps er ikke nødvendige offline.
  if (urlPath.endsWith('.map')) return false;
  // Next.js 404-sider serveres av Vercel med 404-status, så cache.add() avviser
  // dem. Navigation-handler i sw.js faller uansett tilbake til "/" ved offline-miss.
  if (urlPath === '/404.html' || urlPath === '/404/') return false;
  return true;
}

async function main() {
  const files = await walk(OUT_DIR);
  const urls = [];

  for (const file of files) {
    const s = await stat(file);
    if (s.size > MAX_FILE_BYTES) continue;
    const url = toUrlPath(file);
    if (!shouldInclude(url)) continue;
    urls.push(url);
  }

  urls.sort();

  const template = await readFile(SW_TEMPLATE, 'utf8');
  if (!template.includes(PLACEHOLDER)) {
    throw new Error(
      `Mangler placeholder "${PLACEHOLDER}" i ${SW_TEMPLATE}. ` +
        `Legg den inn der precache-listen skal injiseres.`,
    );
  }

  const manifest = urls.map((u) => `  ${JSON.stringify(u)},`).join('\n');
  const generated = template.replace(PLACEHOLDER, manifest);

  await writeFile(SW_OUTPUT, generated, 'utf8');

  const totalBytes = (
    await Promise.all(
      urls.map(async (u) => {
        const p = u === '/' ? join(OUT_DIR, 'index.html') : join(OUT_DIR, u);
        try {
          return (await stat(p)).size;
        } catch {
          return 0;
        }
      }),
    )
  ).reduce((a, b) => a + b, 0);

  console.log(
    `[build-precache] Injiserte ${urls.length} URL-er i ${SW_OUTPUT} ` +
      `(~${(totalBytes / 1024 / 1024).toFixed(1)} MB precache).`,
  );
}

main().catch((err) => {
  console.error('[build-precache] Feilet:', err);
  process.exit(1);
});
