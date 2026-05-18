import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_MODULES, getModule } from '@/lib/modules';
import { getCategory } from '@/lib/categories';
import { ModuleRouter } from '@/components/modules/ModuleRouter';

export function generateStaticParams() {
  return ALL_MODULES.map((m) => ({ id: m.id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ModulePage({ params }: Props) {
  const { id } = await params;
  const mod = getModule(id);
  if (!mod) notFound();

  const category = getCategory(mod.category);

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-24 pt-10 sm:pt-16">
      <nav className="mb-8 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-ink-500 hover:text-copper-300 transition-colors"
        >
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
          {mod.title}
        </h1>
        {mod.subtitle && (
          <p className="font-mono text-base text-ink-500">{mod.subtitle}</p>
        )}
      </header>

      <ModuleRouter id={mod.id} />

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <article className="glass rounded-xl p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-copper-300 mb-3">
            Hva modulen gjør
          </h2>
          <p className="text-sm text-ink-200 leading-relaxed">
            {mod.description}
          </p>
        </article>
        <article className="glass rounded-xl p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-copper-300 mb-3">
            Når du bruker den
          </h2>
          <p className="text-sm text-ink-200 leading-relaxed">{mod.whenToUse}</p>
        </article>
      </section>

      {mod.source && (
        <p className="mt-12 text-xs text-ink-500 italic">Kilde: {mod.source}</p>
      )}
    </div>
  );
}
