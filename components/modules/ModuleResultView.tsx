import type { ModuleResult, ModuleStatus } from '@/lib/modules/types';

type Props = {
  result: ModuleResult | null;
  pending?: string;
};

const STATUS_LABEL: Record<ModuleStatus, string> = {
  ok: 'OK',
  warn: 'OBS',
  fail: 'AVVIK',
  info: 'INFO',
};

const STATUS_TEXT_CLASS: Record<ModuleStatus, string> = {
  ok: 'text-live-400',
  warn: 'text-copper-300',
  fail: 'text-danger-300',
  info: 'text-ink-200',
};

const STATUS_BADGE_CLASS: Record<ModuleStatus, string> = {
  ok: 'border-live-400/40 bg-live-400/[0.08] text-live-400',
  warn: 'border-copper-400/40 bg-copper-400/[0.08] text-copper-300',
  fail: 'border-danger-400/50 bg-danger-400/[0.10] text-danger-300',
  info: 'border-ink-700/40 bg-ink-700/[0.20] text-ink-200',
};

const VERDICT_RING_CLASS: Record<ModuleStatus, string> = {
  ok: 'border-live-400/40 bg-live-400/[0.06]',
  warn: 'border-copper-400/40 bg-copper-400/[0.06]',
  fail: 'border-danger-400/50 bg-danger-400/[0.08]',
  info: 'border-ink-700/40 bg-ink-700/[0.20]',
};

function StatusBadge({ status }: { status: ModuleStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_BADGE_CLASS[status]}`}
      aria-label={`Status: ${STATUS_LABEL[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ModuleResultView({ result, pending }: Props) {
  if (!result) {
    return (
      <section
        className="mt-8 rounded-xl border border-copper-400/20 bg-ink-950/60 p-5"
        role="status"
        aria-live="polite"
      >
        <div className="mb-1 text-xs uppercase tracking-wider text-ink-500">
          Resultat
        </div>
        <p className="text-sm text-ink-500 italic">
          {pending ?? 'Fyll inn verdier for å beregne.'}
        </p>
      </section>
    );
  }

  return (
    <section
      className="mt-8 space-y-6"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {result.verdict && (
        <div
          className={`rounded-xl border p-5 ${VERDICT_RING_CLASS[result.verdict.status]}`}
        >
          <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-ink-500">
            <span>Konklusjon</span>
            <StatusBadge status={result.verdict.status} />
          </div>
          <p
            className={`font-display text-xl sm:text-2xl ${STATUS_TEXT_CLASS[result.verdict.status]}`}
          >
            {result.verdict.text}
          </p>
        </div>
      )}

      {result.sections.map((section, i) => (
        <article
          key={`${section.title}-${i}`}
          className="glass rounded-xl p-5 sm:p-6"
        >
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
            {section.title}
          </h3>
          <dl className="space-y-3">
            {section.rows.map((row, j) => (
              <div
                key={`${row.label}-${j}`}
                className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-ink-700/30 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <dt className="text-sm text-ink-200">{row.label}</dt>
                  {row.hint && (
                    <p className="mt-0.5 text-xs text-ink-500 leading-relaxed">
                      {row.hint}
                    </p>
                  )}
                </div>
                <dd className="flex items-baseline gap-2 text-right">
                  <span
                    className={`font-mono text-base sm:text-lg font-semibold tabular-nums ${row.status ? STATUS_TEXT_CLASS[row.status] : 'text-ink-50'}`}
                  >
                    {row.value}
                  </span>
                  {row.unit && (
                    <span className="font-mono text-xs text-ink-500">
                      {row.unit}
                    </span>
                  )}
                  {row.status && <StatusBadge status={row.status} />}
                </dd>
              </div>
            ))}
          </dl>
          {section.note && (
            <p className="mt-4 text-xs text-ink-500 italic leading-relaxed">
              {section.note}
            </p>
          )}
        </article>
      ))}

      {result.recommendations && result.recommendations.length > 0 && (
        <article className="rounded-xl border border-copper-400/30 bg-copper-400/[0.04] p-5 sm:p-6">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
            Anbefalte tiltak
          </h3>
          <ul className="space-y-2" role="list">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm text-ink-200 leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-copper-300"
                />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
