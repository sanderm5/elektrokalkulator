import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_TEMPLATES, getTemplate } from '@/lib/templates';
import { KundekommunikasjonView } from '@/components/templates/KundekommunikasjonView';

export function generateStaticParams() {
  return ALL_TEMPLATES.map((t) => ({ slug: t.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MalPage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-24 pt-10 sm:pt-16">
      <nav className="mb-8 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-ink-500 hover:text-copper-300 transition-colors"
        >
          Forside
        </Link>
        <span className="text-ink-700">/</span>
        <Link
          href="/maler/"
          className="text-ink-500 hover:text-copper-300 transition-colors"
        >
          Maler
        </Link>
      </nav>

      <header className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Kundekommunikasjon
        </p>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-50 mb-2">
          {template.title}
        </h1>
        {template.subtitle && (
          <p className="text-base text-ink-500">{template.subtitle}</p>
        )}
      </header>

      <section className="mb-8 grid gap-6 sm:grid-cols-2">
        <article className="glass rounded-xl p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-copper-300 mb-3">
            Hva malen er
          </h2>
          <p className="text-sm text-ink-200 leading-relaxed">
            {template.description}
          </p>
        </article>
        <article className="glass rounded-xl p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-copper-300 mb-3">
            Når du bruker den
          </h2>
          <p className="text-sm text-ink-200 leading-relaxed">
            {template.whenToUse}
          </p>
        </article>
      </section>

      <KundekommunikasjonView template={template} />

      {template.source && (
        <p className="mt-12 text-xs text-ink-500 italic">
          Kilde: {template.source}
        </p>
      )}
    </div>
  );
}
