import Link from 'next/link';
import { ALL_TABLES } from '@/lib/tables';

export default function TabellerOversiktPage() {
  const sorted = [...ALL_TABLES].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24 pt-12 sm:pt-16">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-ink-500 hover:text-copper-300 transition-colors"
        >
          ← Forside
        </Link>
      </nav>

      <header className="mb-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Referansetabeller
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink-50 mb-3">
          Slå opp NEK 400-verdier
        </h1>
        <p className="max-w-2xl text-base text-ink-200 leading-relaxed">
          Filtrerbare tabeller for de verdiene du oftest trenger under
          eksamen: kabel-belastning, samtidighet, vern, RCD, spenningsfall
          og sluttkontroll. Klikk på en celle for å kopiere verdien.
        </p>
        <p className="mt-3 text-sm text-ink-500">
          {ALL_TABLES.length} tabeller · alle verifiserbare mot NEK 400
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {sorted.map((t) => {
          const rows = t.sections.reduce((acc, s) => acc + s.rows.length, 0);
          return (
            <Link
              key={t.id}
              href={`/tabeller/${t.slug}/`}
              className="glass glass-hover group rounded-xl p-5 block"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-3xl text-copper-300 leading-none">
                  {t.glyph ?? '▦'}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
                  {rows} rader
                </span>
              </div>
              <h3 className="font-display text-lg text-ink-50 mb-1 group-hover:text-copper-200 transition-colors">
                {t.title}
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">
                {t.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
