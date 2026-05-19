// Service Worker — Elektro-kalkulator
// Precache-listen injiseres av scripts/build-precache.mjs etter `next build`.
// Bump VERSION når du vil tvinge ny installasjon hos eksisterende klienter.
const VERSION = 'elektro-v3';
const RUNTIME_CACHE = `${VERSION}-runtime`;
const STATIC_CACHE = `${VERSION}-static`;

// Komplett precache-liste — alle sider, RSC-payloads, fonter, ikoner, JS/CSS-chunks.
// Injiseres ved build. I dev (uten build-injeksjon) faller listen tilbake til minimum.
const PRECACHE_URLS = [
  /* __PRECACHE_MANIFEST__ */
];

// Install: precache alt i parallelle batcher (385+ filer går for tregt sekvensielt).
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const BATCH = 20;
      for (let i = 0; i < PRECACHE_URLS.length; i += BATCH) {
        const batch = PRECACHE_URLS.slice(i, i + BATCH);
        await Promise.all(
          batch.map((url) =>
            cache
              .add(new Request(url, { cache: 'reload' }))
              .catch((err) => {
                // Logg, men ikke avbryt — én feilet asset skal ikke felle hele installasjonen.
                console.warn('[sw] precache miss:', url, err?.message);
              }),
          ),
        );
      }
      await self.skipWaiting();
    })(),
  );
});

// Activate: rydd gamle caches og ta over åpne klienter.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isRscPayload(url) {
  return url.pathname.endsWith('.txt') && url.searchParams.has('_rsc');
}

function isNavigation(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html'))
  );
}

// Cache-first med bakgrunns-revalidering. For en statisk eksport er innholdet
// uforanderlig mellom deploys, så cache-first gir best offline-opplevelse.
// Ny versjon plukkes opp via SW-oppdatering (bumpet VERSION), ikke per-request.
async function cacheFirst(request, { cacheName, matchOptions } = {}) {
  const cached = await caches.match(request, matchOptions);
  if (cached) {
    // Stale-while-revalidate i bakgrunnen — fyller cache med fersk kopi hvis online,
    // men brukeren ser cached-versjonen umiddelbart.
    if (cacheName) {
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches
              .open(cacheName)
              .then((c) => c.put(request, res.clone()))
              .catch(() => null);
          }
        })
        .catch(() => null);
    }
    return cached;
  }
  // Ikke i cache — prøv nett, lagre om vi får den.
  try {
    const res = await fetch(request);
    if (res.ok && cacheName) {
      caches
        .open(cacheName)
        .then((c) => c.put(request, res.clone()))
        .catch(() => null);
    }
    return res;
  } catch (err) {
    // Offline og ikke cachet — for navigasjon, fall tilbake til forsiden.
    if (isNavigation(request)) {
      const fallback = await caches.match('/');
      if (fallback) return fallback;
    }
    return new Response('', { status: 504, statusText: 'Offline asset' });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // RSC-payloads har skiftende ?_rsc=<hash> — sjekk cache uten å bry oss om query.
  if (isRscPayload(url)) {
    event.respondWith(
      cacheFirst(request, {
        cacheName: RUNTIME_CACHE,
        matchOptions: { ignoreSearch: true },
      }),
    );
    return;
  }

  // Navigasjon → cache-first (alt er statisk, offline-first er det riktige valget her).
  if (isNavigation(request)) {
    event.respondWith(cacheFirst(request, { cacheName: RUNTIME_CACHE }));
    return;
  }

  // Static assets (JS, CSS, fonter, bilder, ikoner) → cache-first.
  event.respondWith(cacheFirst(request, { cacheName: STATIC_CACHE }));
});

// Tillat klienten å trigge umiddelbar aktivering av ny SW.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
