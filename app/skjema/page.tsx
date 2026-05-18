import Link from 'next/link';
import {
  CATEGORY_LABEL,
  KOBLINGSSKJEMA_SYMBOLER,
  PLANTEGNING_SYMBOLER,
  type ElectroSymbol,
  type SymbolCategory,
} from '@/lib/symbols';
import { SymbolView } from '@/components/SymbolView';
import { SchematicBoligInntak } from '@/components/SchematicBoligInntak';
import { SchematicMotorkurs } from '@/components/SchematicMotorkurs';
import { SchematicEnergisentral } from '@/components/SchematicEnergisentral';
import { SchematicIndustriIt } from '@/components/SchematicIndustriIt';

export const metadata = {
  title: 'Skjema og symboler — Elektroberegning',
  description:
    'Plantegnings-symboler (Skarven Forlag), koblingsskjema-symboler (IEC 60617) og eksempel-skjemaer.',
};

function groupByCategory(
  symbols: ElectroSymbol[],
): { category: SymbolCategory; items: ElectroSymbol[] }[] {
  const groups = new Map<SymbolCategory, ElectroSymbol[]>();
  for (const s of symbols) {
    const arr = groups.get(s.category) ?? [];
    arr.push(s);
    groups.set(s.category, arr);
  }
  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

export default function SkjemaPage() {
  const plantegning = groupByCategory(PLANTEGNING_SYMBOLER);
  const koblingsskjema = groupByCategory(KOBLINGSSKJEMA_SYMBOLER);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24 pt-10 sm:pt-14">
      <nav aria-label="Brødsmuler" className="mb-6">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors"
        >
          ← Forside
        </Link>
      </nav>

      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Tegninger
        </p>
        <h1 className="font-display text-3xl sm:text-5xl tracking-tight text-ink-50 leading-[1.05]">
          Skjema &amp; symboler
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-200 leading-relaxed">
          Plantegnings-symboler (Skarven Forlag &laquo;_A Elkraft 1-50&raquo;) og
          koblingsskjema-symboler (IEC 60617). To eksempel-skjemaer: bolig-inntak
          og motorkurs i begge stiler.
        </p>
        <p className="mt-4 text-sm text-ink-500">
          {PLANTEGNING_SYMBOLER.length} plantegnings-symboler ·{' '}
          {KOBLINGSSKJEMA_SYMBOLER.length} koblingsskjema-symboler · 4 eksempel-skjemaer
        </p>
      </header>

      {/* === EKSEMPEL: bolig-inntak === */}
      <section className="mb-16" aria-labelledby="ex-bolig-tittel">
        <h2
          id="ex-bolig-tittel"
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Eksempel 1 · Bolig-inntak (enlinjeskjema)
        </h2>
        <SchematicBoligInntak />
      </section>

      {/* === EKSEMPEL: motorkurs enlinje vs flerlinjet === */}
      <section className="mb-16" aria-labelledby="ex-motor-tittel">
        <h2
          id="ex-motor-tittel"
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Eksempel 2 · Motorkurs i begge stiler
        </h2>
        <SchematicMotorkurs />
      </section>

      {/* === EKSEMPEL: energisentral 200 kW === */}
      <section className="mb-16" aria-labelledby="ex-energisentral-tittel">
        <h2
          id="ex-energisentral-tittel"
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Eksempel 3 · Energisentral 200 kW (TN-S, eksamen-case)
        </h2>
        <SchematicEnergisentral />
      </section>

      {/* === EKSEMPEL: industri IT === */}
      <section className="mb-16" aria-labelledby="ex-industri-it-tittel">
        <h2
          id="ex-industri-it-tittel"
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Eksempel 4 · Industri på IT-nett med IMD
        </h2>
        <SchematicIndustriIt />
      </section>

      {/* === PLANTEGNINGS-SYMBOLER === */}
      <section className="mb-16" aria-labelledby="plantegning-tittel">
        <div className="mb-6">
          <h2
            id="plantegning-tittel"
            className="font-display text-2xl text-ink-50"
          >
            Plantegnings-symboler
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Brukes på arkitekturtegninger 1:50 / 1:100 — viser plassering av
            komponenter. PDF-ref viser plassering i Skarven Forlag-katalogen.
          </p>
        </div>
        {plantegning.map(({ category, items }) => (
          <div key={category} className="mb-10">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-copper-300">
              {CATEGORY_LABEL[category]}
              <span className="ml-2 text-ink-700">· {items.length}</span>
            </h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((s) => (
                <SymbolView key={s.id} symbol={s} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* === KOBLINGSSKJEMA-SYMBOLER === */}
      <section aria-labelledby="koblingsskjema-tittel">
        <div className="mb-6">
          <h2
            id="koblingsskjema-tittel"
            className="font-display text-2xl text-ink-50"
          >
            Koblingsskjema-symboler
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            IEC 60617 — brukes på enlinje- og flerlinjeskjema for elektriske
            kretser.
          </p>
        </div>
        {koblingsskjema.map(({ category, items }) => (
          <div key={category} className="mb-10">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-copper-300">
              {CATEGORY_LABEL[category]}
              <span className="ml-2 text-ink-700">· {items.length}</span>
            </h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((s) => (
                <SymbolView key={s.id} symbol={s} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
