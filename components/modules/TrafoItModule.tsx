'use client';

import { useMemo, useState } from 'react';
import { parseNumber } from '@/lib/format';
import {
  computeTrafoIt,
  FAKTOR_PRESETS,
} from '@/lib/modules/trafo-it';
import type { ModuleResult } from '@/lib/modules/types';
import { ModuleResultView } from './ModuleResultView';

export default function TrafoItModule() {
  const [trafoKva, setTrafoKva] = useState('200');
  const [faktorMode, setFaktorMode] = useState<'preset' | 'custom'>('preset');
  const [faktorPreset, setFaktorPreset] = useState<string>('2');
  const [faktorCustom, setFaktorCustom] = useState('');
  const [ra, setRa] = useState('100');
  const [miljo, setMiljo] = useState<'tort' | 'vatt'>('tort');

  const faktor = faktorMode === 'preset' ? Number(faktorPreset) : parseNumber(faktorCustom);

  const { result, error } = useMemo<{ result: ModuleResult | null; error: string | null }>(() => {
    const kva = parseNumber(trafoKva);
    const r = parseNumber(ra);
    if (!Number.isFinite(kva) || !Number.isFinite(faktor) || !Number.isFinite(r)) {
      return { result: null, error: null };
    }
    try {
      return {
        result: computeTrafoIt({
          trafo_kVA: kva,
          faktor_mA_per_kVA: faktor,
          Ra_Ohm: r,
          miljo,
        }),
        error: null,
      };
    } catch (err) {
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Ukjent feil.',
      };
    }
  }, [trafoKva, faktor, ra, miljo]);

  return (
    <section
      className="glass rounded-2xl p-6 sm:p-8"
      role="region"
      aria-label="Trafo til IT-nett"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Trafostørrelse"
          symbol="S"
          unit="kVA"
          value={trafoKva}
          onChange={setTrafoKva}
          hint="Total tilsynelatende effekt på trafoen."
          autoFocus
        />

        <div className="block">
          <span className="mb-1.5 flex items-baseline justify-between">
            <span className="text-sm text-ink-500">
              <span className="font-mono text-copper-200 mr-1.5">f</span>
              Faktor I_jord per kVA
            </span>
            <span className="font-mono text-xs text-ink-500">mA/kVA</span>
          </span>
          {faktorMode === 'preset' ? (
            <select
              className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3.5 py-3 text-base"
              style={selectArrowStyle}
              value={faktorPreset}
              onChange={(e) => setFaktorPreset(e.target.value)}
            >
              {FAKTOR_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className="calc-input w-full rounded-lg px-3.5 py-3 text-lg"
              value={faktorCustom}
              onChange={(e) => setFaktorCustom(e.target.value)}
              placeholder="Egendefinert faktor"
            />
          )}
          <button
            type="button"
            onClick={() =>
              setFaktorMode((m) => (m === 'preset' ? 'custom' : 'preset'))
            }
            className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-copper-400/40 bg-copper-400/[0.06] px-2.5 py-1 text-[11px] font-mono text-copper-200 hover:bg-copper-400/[0.12] transition-colors duration-200 ease-out-quart"
          >
            {faktorMode === 'preset' ? '↻ Bytt til egendefinert' : '↻ Bytt til standardvalg'}
          </button>
        </div>

        <Field
          label="Overgangsmotstand til jord"
          symbol="R_a"
          unit="Ω"
          value={ra}
          onChange={setRa}
          hint="Målt jordingsmotstand ved hovedjordskinnen."
        />

        <div className="block">
          <span className="mb-1.5 block text-sm text-ink-500">Miljø</span>
          <div role="radiogroup" aria-label="Miljø" className="grid grid-cols-2 gap-2">
            {(['tort', 'vatt'] as const).map((m) => {
              const aktiv = miljo === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={aktiv}
                  onClick={() => setMiljo(m)}
                  className={`rounded-lg border px-3 py-3 font-mono text-sm transition-all duration-200 ease-out-quart ${
                    aktiv
                      ? 'border-copper-400/60 bg-copper-400/[0.10] text-copper-200'
                      : 'border-ink-700/40 bg-ink-900/40 text-ink-500 hover:border-copper-400/30 hover:text-ink-200'
                  }`}
                >
                  <div className="text-base">{m === 'tort' ? 'Tørt' : 'Vått'}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider">
                    grense {m === 'tort' ? '50 V' : '25 V'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-400/40 bg-danger-400/[0.08] p-3 text-sm text-danger-300"
        >
          {error}
        </p>
      )}

      <ModuleResultView result={result} pending="Fyll inn trafostørrelse og R_a." />
    </section>
  );
}

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23c97b43' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
} as const;

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
