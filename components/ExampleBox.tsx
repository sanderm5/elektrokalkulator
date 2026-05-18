import type { FormulaExample } from '@/lib/formulas/types';
import { FormulaDisplay } from './FormulaDisplay';

type Props = {
  example: FormulaExample;
  index: number;
};

export function ExampleBox({ example, index }: Props) {
  return (
    <article className="glass rounded-xl p-5 sm:p-6">
      <header className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-copper-300">
          Eksempel {index + 1}
        </span>
      </header>

      <p className="mb-4 text-sm text-ink-200 leading-relaxed">
        {example.scenario}
      </p>

      <ol className="space-y-2 pl-1">
        {example.steps.map((step, i) => (
          <li
            key={i}
            className="flex items-center gap-3 border-l-2 border-copper-400/20 pl-4 py-1"
          >
            <FormulaDisplay latex={step.latex} />
            {step.note && (
              <span className="text-xs text-ink-500 italic">— {step.note}</span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 inline-flex items-baseline gap-2 rounded-lg bg-live-500/10 px-3 py-1.5">
        <span className="text-xs uppercase tracking-wider text-ink-500">
          Svar
        </span>
        <span className="font-mono text-live-400">{example.answer}</span>
      </div>
    </article>
  );
}
