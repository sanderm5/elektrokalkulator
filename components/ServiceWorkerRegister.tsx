'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegister() {
  const [updateReady, setUpdateReady] = useState<ServiceWorker | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // Bare i produksjon (kjør ikke i dev)
    if (window.location.hostname === 'localhost' && window.location.port === '3000') {
      // Next dev — ikke registrer SW
      return;
    }

    let registrationRef: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registrationRef = registration;
        if (registration.active && !navigator.serviceWorker.controller) {
          // Første-gangs installasjon ferdig — fortell brukeren
          setInstalled(true);
          window.setTimeout(() => setInstalled(false), 4000);
        }

        // Sjekk for oppdateringer ved fokus
        function checkUpdate() {
          registration.update().catch(() => null);
        }
        window.addEventListener('focus', checkUpdate);

        // Lytt på ny SW
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setUpdateReady(newWorker);
            }
          });
        });

        return () => window.removeEventListener('focus', checkUpdate);
      })
      .catch((err) => {
        console.error('Service worker-registrering feilet:', err);
      });

    // Reload når en ny SW har tatt over
    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      );
    };
  }, []);

  function applyUpdate() {
    updateReady?.postMessage({ type: 'SKIP_WAITING' });
    setUpdateReady(null);
  }

  if (!installed && !updateReady) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-xs glass rounded-xl px-4 py-3 text-sm shadow-2xl animate-fade-up"
    >
      {updateReady ? (
        <>
          <p className="text-ink-50">Ny versjon tilgjengelig.</p>
          <p className="text-xs text-ink-500 mt-0.5">
            Oppdater for å få nyeste formler.
          </p>
          <button
            type="button"
            onClick={applyUpdate}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-copper-400/20 border border-copper-400/40 px-3 py-1 text-xs text-copper-200 hover:bg-copper-400/30 transition-colors"
          >
            Oppdater nå
          </button>
        </>
      ) : (
        <>
          <p className="text-ink-50">Offline-tilgang aktivert</p>
          <p className="text-xs text-ink-500 mt-0.5">
            Appen fungerer nå uten internett.
          </p>
        </>
      )}
    </div>
  );
}
