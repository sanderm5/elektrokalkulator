// Service Worker — Elektro-kalkulator
// Precache-listen injiseres av scripts/build-precache.mjs etter `next build`.
// Bump VERSION når du vil tvinge ny installasjon hos eksisterende klienter.
const VERSION = 'elektro-v5';
const RUNTIME_CACHE = `${VERSION}-runtime`;
const STATIC_CACHE = `${VERSION}-static`;

// Komplett precache-liste — alle sider, RSC-payloads, fonter, ikoner, JS/CSS-chunks.
// Injiseres ved build. I dev (uten build-injeksjon) er listen tom.
const PRECACHE_URLS = [
  /* __PRECACHE_MANIFEST__ */
];

const BATCH_SIZE = 20;

// Cache et batch URL-er parallelt, med tilgivende feilhåndtering.
async function cacheBatch(cache, urls) {
  await Promise.all(
    urls.map((url) =>
      cache
        .add(new Request(url, { cache: 'reload' }))
        .catch((err) => {
          console.warn('[sw] precache miss:', url, err?.message);
        }),
    ),
  );
}

// Fyll cache med alt som mangler fra PRECACHE_URLS. Brukes ved install,
// activate, og som selvreparasjon hvis cache er tømt eller install feilet.
async function backfillPrecache() {
  if (PRECACHE_URLS.length === 0) return { added: 0, total: 0 };
  const cache = await caches.open(STATIC_CACHE);
  const keys = await cache.keys();
  const have = new Set(keys.map((k) => new URL(k.url).pathname));
  const missing = PRECACHE_URLS.filter((u) => !have.has(u));
  if (missing.length === 0) {
    return { added: 0, total: PRECACHE_URLS.length };
  }
  console.log(
    `[sw] backfill: ${missing.length}/${PRECACHE_URLS.length} mangler — precacher nå`,
  );
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    await cacheBatch(cache, missing.slice(i, i + BATCH_SIZE));
  }
  return { added: missing.length, total: PRECACHE_URLS.length };
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await backfillPrecache();
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Rydd alle gamle versjoner.
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
      // Selvreparer hvis install ikke fikk fullført (f.eks. installerte mens offline).
      await backfillPrecache();
    })(),
  );
});

// Periodisk self-check: hvis cache mangler entries og vi er online, fyll opp.
// Trottlet til maks én gang per 60 sek for å unngå spam.
let lastBackfillCheck = 0;
function maybeBackfillInBackground() {
  const now = Date.now();
  if (now - lastBackfillCheck < 60_000) return;
  lastBackfillCheck = now;
  backfillPrecache().catch(() => null);
}

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

// Søk i alle våre caches med ignoreSearch + ignoreVary for robust matching.
async function findInCache(request, { ignoreSearch = false } = {}) {
  const direct = await caches.match(request, {
    ignoreSearch,
    ignoreVary: true,
  });
  if (direct) return direct;
  return null;
}

async function cacheFirst(request, { cacheName, ignoreSearch = false } = {}) {
  const cached = await findInCache(request, { ignoreSearch });

  if (cached) {
    // Stale-while-revalidate i bakgrunnen — fersk kopi til neste gang når online.
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
    // Trigger backfill-sjekk når vi vet vi har trafikk.
    maybeBackfillInBackground();
    return cached;
  }

  // Ikke i cache — prøv nett.
  try {
    const res = await fetch(request);
    if (res.ok && cacheName) {
      caches
        .open(cacheName)
        .then((c) => c.put(request, res.clone()))
        .catch(() => null);
      // Hvis vi traff nett her, cachen er sannsynligvis ufullstendig — backfill.
      maybeBackfillInBackground();
    }
    return res;
  } catch {
    // Offline + ikke cachet. For navigasjon, fall til forsiden.
    if (isNavigation(request)) {
      const fallback = await findInCache(new Request('/'));
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

  if (isRscPayload(url)) {
    event.respondWith(
      cacheFirst(request, { cacheName: RUNTIME_CACHE, ignoreSearch: true }),
    );
    return;
  }

  if (isNavigation(request)) {
    event.respondWith(cacheFirst(request, { cacheName: RUNTIME_CACHE }));
    return;
  }

  event.respondWith(cacheFirst(request, { cacheName: STATIC_CACHE }));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  // La klient trigge backfill manuelt om ønskelig.
  if (event.data?.type === 'BACKFILL') {
    event.waitUntil(backfillPrecache());
  }
});
