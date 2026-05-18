// Service Worker — Elektro-kalkulator
// Bump versjonsnummeret når du vil tvinge ny installasjon.
const VERSION = 'elektro-v2';
const RUNTIME_CACHE = `${VERSION}-runtime`;
const STATIC_CACHE = `${VERSION}-static`;

// Kritiske URL-er som precaches ved install
const PRECACHE_URLS = [
  '/',
  '/tabeller/',
  '/skjema/',
  '/sjekkliste/',
  '/maler/',
  // Nye moduler i v2
  '/modul/diagnose/',
  '/modul/trafo-it/',
  '/modul/trafo-tn/',
  '/modul/likeretter-piv/',
  '/modul/installasjonsanalyse/',
  // Maler
  '/maler/avviksrapport/',
  '/maler/midlertidig-losning/',
  '/maler/sluttkontroll-info/',
  '/maler/utbytting-frist/',
  '/maler/overlevering/',
  // Statiske assets
  '/katex/katex.min.css',
  '/manifest.webmanifest',
  '/icons/icon.svg',
];

// Install: precache kritiske assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => null))
      .then(() => self.skipWaiting()),
  );
});

// Activate: rydd gamle caches og ta over åpne klienter
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Hjelper: er dette en navigasjon (HTML-side)?
function isNavigation(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html'))
  );
}

// Hjelper: er dette en statisk asset (CSS/JS/fonts/bilder)?
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/katex/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(css|js|woff2?|ttf|otf|svg|png|jpg|jpeg|webp|ico|json|webmanifest)$/i.test(
      url.pathname,
    )
  );
}

// Fetch-strategi:
//  - Navigasjon: network-first, fallback til cache (alltid prøv fersk side hvis online)
//  - Statisk asset: cache-first (raskt, endrer seg sjelden)
//  - Annet: network-first med cache-fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Kun GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bare cache same-origin
  if (url.origin !== self.location.origin) return;

  if (isNavigation(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Lagre kopi i cache for offline
          const copy = response.clone();
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => null);
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match('/') ||
              new Response('Offline — innholdet er ikke cached enda.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
              }),
          ),
        ),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches
                .open(STATIC_CACHE)
                .then((cache) => cache.put(request, copy))
                .catch(() => null);
            }
            return response;
          })
          .catch(
            () =>
              new Response('', {
                status: 504,
                statusText: 'Offline asset',
              }),
          );
      }),
    );
    return;
  }

  // Default: network-first med cache-fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => null);
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || new Response('', { status: 504 })),
      ),
  );
});

// Lytt på SKIP_WAITING melding fra klient
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
