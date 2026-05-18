import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { SearchDialog } from '@/components/SearchDialog';
import { FilterToggle } from '@/components/FilterToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

// Inline script som setter data-theme før React hydrerer — hindrer flicker.
const themeInitScript = `
(function(){try{
  var saved = localStorage.getItem('elektro-theme');
  var theme = (saved === 'light' || saved === 'dark')
    ? saved
    : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
}catch(e){
  document.documentElement.dataset.theme = 'dark';
}})();
`.trim();

export const metadata: Metadata = {
  title: 'Elektroberegning — ELE2 & ELE3',
  description:
    'Offline kalkulator for elektrofaget. Formler, forklaringer og regneeksempler — bygget for eksamen.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Elektro',
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Elektro',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0B0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb-NO" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-copper-400 focus:text-ink-950 focus:px-4 focus:py-2 focus:rounded"
        >
          Hopp til hovedinnhold
        </a>
        <header className="sticky top-0 z-30 border-b border-ink-700/30 bg-ink-950/70 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-5">
              <Link
                href="/"
                className="group inline-flex items-baseline gap-2 text-ink-50 hover:text-copper-200 transition-colors"
                aria-label="Til forside"
              >
                <span className="font-display text-base tracking-tight">Elektro</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500 group-hover:text-copper-300 transition-colors">
                  ELE2 · ELE3
                </span>
              </Link>
              <Link
                href="/sjekkliste/"
                className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors"
              >
                Sjekkliste
              </Link>
              <Link
                href="/skjema/"
                className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors"
              >
                Skjema
              </Link>
              <Link
                href="/tabeller/"
                className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors"
              >
                Tabeller
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <FilterToggle />
              <ThemeToggle />
              <SearchDialog />
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
