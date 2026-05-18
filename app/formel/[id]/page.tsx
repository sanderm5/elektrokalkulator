import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_FORMULAS, getFormula } from '@/lib/formulas';
import { getCategory } from '@/lib/categories';
import { Calculator } from '@/components/Calculator';
import { ExampleBox } from '@/components/ExampleBox';
import { KravForklaring } from '@/components/KravForklaring';

const KRAV_FORKLARING_IDS = new Set([
  'krav-1-overlast',
  'krav-2-automatsikring',
  'krav-2-gg-smelte',
]);

/**
 * Naturlige par av formler som regnes sammen. Når du åpner én, vises
 * companion-kalkulatoren ved siden av (lg+) eller stablet under (mobil).
 */
const COMPANION_MAP: Record<string, string> = {
  // Krav 1 og 2 — kabel/vern-koordinering
  'krav-1-overlast': 'krav-2-automatsikring',
  'krav-2-automatsikring': 'krav-1-overlast',
  'krav-2-gg-smelte': 'krav-1-overlast',
  // Kortslutning — min og maks regnes alltid sammen for vern-verifisering
  'ik-min': 'ik-maks',
  'ik-maks': 'ik-min',
  // Spenningsfall 1-fas — forenklet vs med cos φ
  'spenningsfall-enfase-forenklet': 'spenningsfall-enfase-med-cosphi',
  'spenningsfall-enfase-med-cosphi': 'spenningsfall-enfase-forenklet',
  // Spenningsfall 3-fas — forenklet vs med cos φ
  'spenningsfall-trefase-forenklet': 'spenningsfall-trefase-med-cosphi',
  'spenningsfall-trefase-med-cosphi': 'spenningsfall-trefase-forenklet',
};

/** Kort etikett til chip over hver kalkulator (formel-titler er for lange). */
const COMPANION_LABEL: Record<string, string> = {
  'krav-1-overlast': 'Krav 1',
  'krav-2-automatsikring': 'Krav 2 (automat)',
  'krav-2-gg-smelte': 'Krav 2 (gG)',
  'ik-min': 'I_k,min',
  'ik-maks': 'I_k,maks',
  'spenningsfall-enfase-forenklet': '1-fas · forenklet',
  'spenningsfall-enfase-med-cosphi': '1-fas · med cos φ',
  'spenningsfall-trefase-forenklet': '3-fas · forenklet',
  'spenningsfall-trefase-med-cosphi': '3-fas · med cos φ',
};

export function generateStaticParams() {
  return ALL_FORMULAS.map((f) => ({ id: f.id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FormulaPage({ params }: Props) {
  const { id } = await params;
  const formula = getFormula(id);
  if (!formula) notFound();

  const category = getCategory(formula.category);
  const related = (formula.related ?? [])
    .map((rid) => getFormula(rid))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  const companionId = COMPANION_MAP[formula.id];
  const companion = companionId ? getFormula(companionId) : undefined;
  const containerWidth = companion ? 'max-w-4xl lg:max-w-6xl' : 'max-w-4xl';
  const primaryLabel = COMPANION_LABEL[formula.id] ?? formula.title;
  const companionLabel = companion
    ? COMPANION_LABEL[companion.id] ?? companion.title
    : '';

  return (
    <div
      className={`mx-auto ${containerWidth} px-5 sm:px-8 pb-24 pt-10 sm:pt-16`}
    >
      <nav className="mb-8 flex items-center gap-2 text-sm">
        <Link href="/" className="text-ink-500 hover:text-copper-300 transition-colors">
          Forside
        </Link>
        <span className="text-ink-700">/</span>
        <Link
          href={`/kategori/${category.slug}/`}
          className="text-ink-500 hover:text-copper-300 transition-colors"
        >
          {category.title}
        </Link>
      </nav>

      <header className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          {category.title}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-50 mb-2">
          {formula.title}
        </h1>
        {formula.subtitle && (
          <p className="font-mono text-base text-ink-500">{formula.subtitle}</p>
        )}
      </header>

      {companion ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
                {primaryLabel} · denne siden
              </span>
            </div>
            <Calculator formulaId={formula.id} />
          </div>
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">
                {companionLabel} · samtidig
              </span>
              <Link
                href={`/formel/${companion.id}/`}
                className="font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors"
              >
                Egen side →
              </Link>
            </div>
            <Calculator formulaId={companion.id} />
          </div>
        </div>
      ) : (
        <Calculator formulaId={formula.id} />
      )}

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <article className="glass rounded-xl p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-copper-300 mb-3">
            Hva formelen sier
          </h2>
          <p className="text-sm text-ink-200 leading-relaxed">
            {formula.description}
          </p>
        </article>
        <article className="glass rounded-xl p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-copper-300 mb-3">
            Når du bruker den
          </h2>
          <p className="text-sm text-ink-200 leading-relaxed">
            {formula.whenToUse}
          </p>
        </article>
      </section>

      {KRAV_FORKLARING_IDS.has(formula.id) && <KravForklaring />}

      {formula.examples.length > 0 && (
        <section className="mt-10" aria-labelledby="eksempler-tittel">
          <h2
            id="eksempler-tittel"
            className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
          >
            Regneeksempler
          </h2>
          <div className="space-y-4">
            {formula.examples.map((ex, i) => (
              <ExampleBox key={i} example={ex} index={i} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="relatert-tittel">
          <h2
            id="relatert-tittel"
            className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
          >
            Relaterte formler
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/formel/${r.id}/`}
                  className="glass glass-hover block rounded-lg p-4"
                >
                  <div className="text-sm text-ink-50 mb-1">{r.title}</div>
                  {r.subtitle && (
                    <div className="font-mono text-xs text-ink-500">
                      {r.subtitle}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {formula.source && (
        <p className="mt-12 text-xs text-ink-500 italic">
          Kilde: {formula.source}
        </p>
      )}
    </div>
  );
}
