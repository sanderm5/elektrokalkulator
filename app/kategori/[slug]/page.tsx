import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategoryBySlug, isModuleCategory } from '@/lib/categories';
import { getFormulasByCategory } from '@/lib/formulas';
import { getModulesByCategory } from '@/lib/modules';
import { FormulaDisplay } from '@/components/FormulaDisplay';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const moduler = isModuleCategory(category.id) ? getModulesByCategory(category.id) : [];
  const formler = isModuleCategory(category.id) ? [] : getFormulasByCategory(category.id);
  const erTom = moduler.length === 0 && formler.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-24 pt-10 sm:pt-16">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-ink-500 hover:text-copper-300 transition-colors"
        >
          ← Alle kategorier
        </Link>
      </nav>

      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          {category.short}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink-50 mb-3">
          {category.title}
        </h1>
        <p className="max-w-2xl text-base text-ink-200 leading-relaxed">
          {category.description}
        </p>
      </header>

      {erTom ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-ink-200 mb-2">
            Innhold i denne kategorien legges inn snart.
          </p>
          <p className="text-sm text-ink-500">
            Bla tilbake til forsiden og åpne en av de fylte kategoriene.
          </p>
        </div>
      ) : moduler.length > 0 ? (
        <ul className="space-y-3" role="list">
          {moduler.map((m) => (
            <li key={m.id}>
              <Link
                href={`/modul/${m.id}/`}
                className="glass glass-hover block rounded-xl p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-baseline gap-3">
                      <span className="font-display text-2xl text-copper-300 leading-none">
                        {m.glyph ?? '⌬'}
                      </span>
                      <h2 className="font-display text-lg text-ink-50">{m.title}</h2>
                    </div>
                    {m.subtitle && (
                      <p className="mb-1 font-mono text-xs text-ink-500">
                        {m.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-ink-500 shrink-0"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3" role="list">
          {formler.map((f) => (
            <li key={f.id} data-relevans={f.relevans ?? 'kjerne'}>
              <Link
                href={`/formel/${f.id}/`}
                className="glass glass-hover block rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg text-ink-50 mb-1">
                      {f.title}
                    </h2>
                    <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <FormulaDisplay latex={f.latex} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
