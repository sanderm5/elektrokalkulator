import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_TABLES, getTable } from '@/lib/tables';
import { getFormula } from '@/lib/formulas';
import { TableView } from '@/components/TableView';
import { VerifyBanner } from '@/components/VerifyBanner';

export function generateStaticParams() {
  return ALL_TABLES.map((t) => ({ slug: t.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TabellPage({ params }: Props) {
  const { slug } = await params;
  const table = getTable(slug);
  if (!table) notFound();

  const relatedFormler = (table.relatedFormulaIds ?? [])
    .map((id) => getFormula(id))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-24 pt-10 sm:pt-16">
      <nav className="mb-8 flex items-center gap-2 text-sm">
        <Link href="/" className="text-ink-500 hover:text-copper-300 transition-colors">
          Forside
        </Link>
        <span className="text-ink-700">/</span>
        <Link href="/tabeller/" className="text-ink-500 hover:text-copper-300 transition-colors">
          Tabeller
        </Link>
      </nav>

      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Referansetabell
        </p>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-50 mb-3">
          {table.title}
        </h1>
        <p className="max-w-2xl text-base text-ink-200 leading-relaxed">
          {table.description}
        </p>
        {table.source && (
          <p className="mt-3 text-xs text-ink-500 italic">
            Kilde: {table.source}
          </p>
        )}
      </header>

      <VerifyBanner
        status={table.verifyStatus ?? 'delvis'}
        sources={table.verifySources}
      />

      <TableView table={table} />

      {relatedFormler.length > 0 && (
        <section className="mt-12" aria-labelledby="relatert-tittel">
          <h2
            id="relatert-tittel"
            className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
          >
            Brukes med disse formlene
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {relatedFormler.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/formel/${f.id}/`}
                  className="glass glass-hover block rounded-lg p-4"
                >
                  <div className="text-sm text-ink-50 mb-1">{f.title}</div>
                  {f.subtitle && (
                    <div className="font-mono text-xs text-ink-500">
                      {f.subtitle}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
