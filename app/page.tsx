import Link from 'next/link';
import { CATEGORIES, isModuleCategory } from '@/lib/categories';
import { ALL_FORMULAS, getFormulasByCategory } from '@/lib/formulas';
import { ALL_MODULES, getModulesByCategory } from '@/lib/modules';
import { ALL_TABLES } from '@/lib/tables';
import { InlineSearch } from '@/components/InlineSearch';

export default function HomePage() {
  const totalFormler = ALL_FORMULAS.length;
  const kjerneFormler = ALL_FORMULAS.filter((f) => f.relevans !== 'sjelden').length;
  const totalTabeller = ALL_TABLES.length;
  const totalModuler = ALL_MODULES.length;
  const tabellerSortert = [...ALL_TABLES].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24 pt-12 sm:pt-20">
      <header className="mb-12 sm:mb-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          ELE2 · ELE3
        </p>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight text-ink-50 leading-[1.05]">
          Elektroberegning,
          <br />
          <span className="text-copper-300">slik den må gjøres.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-ink-200 leading-relaxed">
          Offline kalkulator for hele pensum. Formler, hva de betyr, når
          du bruker dem — og to ferdig regnede eksempler du kan kopiere
          tankegangen fra. Bygget for eksamen, og bare for eksamen.
        </p>
        <p className="mt-4 text-sm text-ink-500">
          <span data-fysikk-mode="off">{kjerneFormler}</span>
          <span data-fysikk-mode="on">{totalFormler}</span>
          {' '}formler · {totalModuler} moduler · {totalTabeller} referansetabeller · alle fungerer uten internett
        </p>
      </header>

      <div className="mb-10 sm:mb-14">
        <InlineSearch />
      </div>

      <section aria-labelledby="kategorier-tittel">
        <h2
          id="kategorier-tittel"
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Velg kategori
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.sort((a, b) => a.order - b.order).map((cat) => {
            const erModul = isModuleCategory(cat.id);
            const formler = erModul ? [] : getFormulasByCategory(cat.id);
            const moduler = erModul ? getModulesByCategory(cat.id) : [];
            const kjerne = formler.filter((f) => f.relevans !== 'sjelden').length;
            const total = formler.length;
            // Skjul formel-kategori-kort som er tomme uten fysikk (f.eks. Elektromagnetisme).
            // Modul-kategorier skjules aldri.
            const tomtUtenFysikk = !erModul && kjerne === 0 && total > 0;
            return (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}/`}
                className="glass glass-hover group rounded-xl p-5 block"
                data-tomt-uten-fysikk={tomtUtenFysikk ? 'true' : undefined}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-3xl text-copper-300 leading-none">
                    {cat.glyph}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
                    {erModul ? (
                      moduler.length === 0 ? 'kommer' : `${moduler.length} moduler`
                    ) : total === 0 ? (
                      'kommer'
                    ) : (
                      <>
                        <span data-fysikk-mode="off">
                          {kjerne === 0 ? 'skjult' : `${kjerne} formler`}
                        </span>
                        <span data-fysikk-mode="on">{total} formler</span>
                      </>
                    )}
                  </span>
                </div>
                <h3 className="font-display text-lg text-ink-50 mb-1 group-hover:text-copper-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="sjekkliste-tittel" className="mt-16">
        <h2
          id="sjekkliste-tittel"
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Eksamen
        </h2>
        <Link
          href="/sjekkliste/"
          className="glass glass-hover group block rounded-xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-display text-2xl text-copper-300 leading-none">
                  ✓
                </span>
                <h3 className="font-display text-lg text-ink-50 group-hover:text-copper-200 transition-colors">
                  Sjekkliste &amp; arbeidsflyt
                </h3>
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">
                Arbeidsflyt for installasjonsoppgaver, sjekkliste før innlevering
                (18 punkter, progresjon huskes) og De 5 sikre — begge versjoner.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-ink-500 group-hover:text-copper-300 transition-all group-hover:translate-x-0.5 shrink-0"
            >
              →
            </span>
          </div>
        </Link>
      </section>

      <section aria-labelledby="maler-tittel" className="mt-16">
        <h2
          id="maler-tittel"
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Maler
        </h2>
        <Link
          href="/maler/"
          className="glass glass-hover group block rounded-xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-display text-2xl text-copper-300 leading-none">
                  ✉
                </span>
                <h3 className="font-display text-lg text-ink-50 group-hover:text-copper-200 transition-colors">
                  Kundekommunikasjon
                </h3>
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">
                Avviksrapport, midlertidig løsning, sluttkontroll-info,
                pålegg om utbytting og overlevering — fem kopierbare maler
                med plassholdere.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-ink-500 group-hover:text-copper-300 transition-all group-hover:translate-x-0.5 shrink-0"
            >
              →
            </span>
          </div>
        </Link>
      </section>

      <section aria-labelledby="skjema-tittel" className="mt-16">
        <h2
          id="skjema-tittel"
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Tegninger
        </h2>
        <Link
          href="/skjema/"
          className="glass glass-hover group block rounded-xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-display text-2xl text-copper-300 leading-none">
                  ⌬
                </span>
                <h3 className="font-display text-lg text-ink-50 group-hover:text-copper-200 transition-colors">
                  Skjema &amp; symboler
                </h3>
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">
                Plantegnings-symboler (Skarven Forlag) og koblingsskjema-symboler
                (IEC 60617). Eksempel-skjemaer for bolig-inntak og motorkurs i
                enlinje + flerlinjet.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-ink-500 group-hover:text-copper-300 transition-all group-hover:translate-x-0.5 shrink-0"
            >
              →
            </span>
          </div>
        </Link>
      </section>

      <section aria-labelledby="tabeller-tittel" className="mt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2
            id="tabeller-tittel"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
          >
            Referansetabeller
          </h2>
          <Link
            href="/tabeller/"
            className="text-xs text-ink-500 hover:text-copper-300 transition-colors"
          >
            Se alle tabeller →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tabellerSortert.slice(0, 6).map((t) => {
            const rows = t.sections.reduce((acc, s) => acc + s.rows.length, 0);
            return (
              <Link
                key={t.id}
                href={`/tabeller/${t.slug}/`}
                className="glass glass-hover group rounded-xl p-5 block"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-2xl text-copper-300 leading-none">
                    {t.glyph ?? '▦'}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
                    {rows} rader
                  </span>
                </div>
                <h3 className="font-display text-base text-ink-50 mb-1 group-hover:text-copper-200 transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">
                  {t.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-20 pt-8 border-t border-ink-700/40">
        <p className="text-xs text-ink-500 leading-relaxed max-w-prose">
          Hjelpemiddel for elektroberegning. Verifiser alle resultater mot
          Eltabellen og NEK 400 før innlevering. Forfatter står ikke ansvarlig
          for feil — du regner selv.
        </p>
      </footer>
    </div>
  );
}
