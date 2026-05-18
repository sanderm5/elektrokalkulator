'use client';

import { useMemo, useState } from 'react';
import { parseNumber } from '@/lib/format';
import {
  computeLikeretterPiv,
  TOPOLOGI_OPTIONS,
  type Topologi,
} from '@/lib/modules/likeretter-piv';
import type { ModuleResult } from '@/lib/modules/types';
import { ModuleResultView } from './ModuleResultView';

export default function LikeretterPivModule() {
  const [topologi, setTopologi] = useState<Topologi>('helbolge-bro');
  const [urms, setUrms] = useState('230');
  const [idc, setIdc] = useState('');

  const { result, error } = useMemo<{ result: ModuleResult | null; error: string | null }>(() => {
    const u = parseNumber(urms);
    if (!Number.isFinite(u)) {
      return { result: null, error: null };
    }
    const i = parseNumber(idc);
    try {
      return {
        result: computeLikeretterPiv({
          topologi,
          U_rms_V: u,
          I_dc_A: Number.isFinite(i) && i > 0 ? i : undefined,
        }),
        error: null,
      };
    } catch (err) {
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Ukjent feil.',
      };
    }
  }, [topologi, urms, idc]);

  return (
    <section
      className="glass rounded-2xl p-6 sm:p-8"
      role="region"
      aria-label="PIV per likeretter-topologi"
    >
      <div className="mb-6">
        <span className="mb-2 block text-sm text-ink-500">Velg topologi</span>
        <div role="radiogroup" aria-label="Likeretter-topologi" className="grid gap-2 sm:grid-cols-2">
          {TOPOLOGI_OPTIONS.map((opt) => {
            const aktiv = topologi === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={aktiv}
                onClick={() => setTopologi(opt.value)}
                className={`rounded-lg border px-4 py-3 text-left transition-all duration-200 ease-out-quart ${
                  aktiv
                    ? 'border-copper-400/60 bg-copper-400/[0.10] text-copper-200'
                    : 'border-ink-700/40 bg-ink-900/40 text-ink-500 hover:border-copper-400/30 hover:text-ink-200'
                }`}
              >
                <div className="font-display text-base">{opt.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={
            topologi === 'trefase-bro'
              ? 'Linjespenning U_L'
              : 'Effektivverdi U_rms'
          }
          symbol={topologi === 'trefase-bro' ? 'U_L' : 'U_rms'}
          unit="V"
          value={urms}
          onChange={setUrms}
          autoFocus
          hint={
            topologi === 'trefase-bro'
              ? 'Linjespenningen (f.eks. 400 V AC inn til B6-bro).'
              : 'Effektivverdi (RMS) på AC-spenningen.'
          }
        />
        <Field
          label="DC-strøm (valgfritt)"
          symbol="I_dc"
          unit="A"
          value={idc}
          onChange={setIdc}
          hint="Oppgi for å få anbefalt I_F per diode."
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-400/40 bg-danger-400/[0.08] p-3 text-sm text-danger-300"
        >
          {error}
        </p>
      )}

      <ModuleResultView result={result} pending="Skriv inn spenning for å regne PIV." />
    </section>
  );
}

function Field({
  label,
  symbol,
  unit,
  value,
  onChange,
  hint,
  autoFocus,
}: {
  label: string;
  symbol: string;
  unit: string;
  value: string;
  onChange: (raw: string) => void;
  hint?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-ink-500">
          <span className="font-mono text-copper-200 mr-1.5">{symbol}</span>
          {label}
        </span>
        <span className="font-mono text-xs text-ink-500">{unit}</span>
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        className="calc-input w-full rounded-lg px-3.5 py-3 text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && (
        <p className="mt-1.5 text-xs text-ink-500 leading-relaxed">{hint}</p>
      )}
    </label>
  );
}
