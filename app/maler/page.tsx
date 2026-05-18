import Link from 'next/link';
import { ALL_TEMPLATES, getTemplatesByKind } from '@/lib/templates';

export const metadata = {
  title: 'Maler — Elektroberegning',
  description:
    'Kopierbare maler for kundekommunikasjon: avviksrapport, midlertidig løsning, sluttkontroll-info, utbytting og overlevering.',
};

export default function MalerOversikt() {
  const kundekommunikasjon = getTemplatesByKind('kundekommunikasjon');

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-24 pt-10 sm:pt-16">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-ink-500 hover:text-copper-300 transition-colors"
        >
          ← Forside
        </Link>
      </nav>

      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Tekst-maler
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink-50 mb-3">
          Maler for kundekommunikasjon
        </h1>
        <p className="max-w-2xl text-base text-ink-200 leading-relaxed">
          Skriftlige maler som dekker de mest vanlige kundebrevene en elektriker
          trenger — fra avviksrapport til overleveringsbrev. Klikk en mal,
          erstatt plassholderne, og kopier teksten.
        </p>
        <p className="mt-4 text-sm text-ink-500">
          {ALL_TEMPLATES.length} maler · alle med plassholdere og kopier-knapp
        </p>
      </header>

      <section aria-labelledby="kundekommunikasjon-tittel">
        <h2
          id="kundekommunikasjon-tittel"
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Kundekommunikasjon
        </h2>
        <ul className="space-y-3" role="list">
          {kundekommunikasjon.map((t) => (
            <li key={t.id}>
              <Link
                href={`/maler/${t.slug}/`}
                className="glass glass-hover block rounded-xl p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-baseline gap-3">
                      <span className="font-display text-2xl text-copper-300 leading-none">
                        {t.glyph ?? '✉'}
                      </span>
                      <h3 className="font-display text-lg text-ink-50">
                        {t.title}
                      </h3>
                    </div>
                    {t.subtitle && (
                      <p className="mb-1 font-mono text-xs text-ink-500">
                        {t.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-ink-500 shrink-0">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
