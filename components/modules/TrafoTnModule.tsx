'use client';

import { useMemo, useState } from 'react';
import { parseNumber } from '@/lib/format';
import { computeTrafoTn, TVERRSNITT_OPTIONS } from '@/lib/modules/trafo-tn';
import type { ModuleResult } from '@/lib/modules/types';
import { ModuleResultView } from './ModuleResultView';

export default function TrafoTnModule() {
  const [trafoKva, setTrafoKva] = useState('1000');
  const [un, setUn] = useState('400');
  const [uk, setUk] = useState('4');
  const [lMate, setLMate] = useState('100');
  const [aMate, setAMate] = useState('95');
  const [lKurs, setLKurs] = useState('30');
  const [aKurs, setAKurs] = useState('10');
  const [inVern, setInVern] = useState('32');
  const [karakteristikk, setKarakteristikk] = useState<'B' | 'C' | 'D'>('B');

  const { result, error } = useMemo<{ result: ModuleResult | null; error: string | null }>(() => {
    const kva = parseNumber(trafoKva);
    const u = parseNumber(un);
    const k = parseNumber(uk);
    const lm = parseNumber(lMate);
    const am = parseNumber(aMate);
    const lk = parseNumber(lKurs);
    const ak = parseNumber(aKurs);
    const iv = parseNumber(inVern);
    if (
      !Number.isFinite(kva) ||
      !Number.isFinite(u) ||
      !Number.isFinite(k) ||
      !Number.isFinite(lm) ||
      !Number.isFinite(am) ||
      !Number.isFinite(lk) ||
      !Number.isFinite(ak) ||
      !Number.isFinite(iv)
    ) {
      return { result: null, error: null };
    }
    try {
      return {
        result: computeTrafoTn({
          trafo_kVA: kva,
          Un_linje_V: u,
          uk_pst: k,
          L_mate_m: lm,
          A_mate_mm2: am,
          L_kurs_m: lk,
          A_kurs_mm2: ak,
          In_vern_A: iv,
          karakteristikk,
        }),
        error: null,
      };
    } catch (err) {
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Ukjent feil.',
      };
    }
  }, [trafoKva, un, uk, lMate, aMate, lKurs, aKurs, inVern, karakteristikk]);

  return (
    <section
      className="glass rounded-2xl p-6 sm:p-8"
      role="region"
      aria-label="Trafo til TN-nett"
    >
      <fieldset className="mb-6">
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Trafo og system
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Trafostørrelse"
            symbol="S"
            unit="kVA"
            value={trafoKva}
            onChange={setTrafoKva}
            autoFocus
          />
          <Field
            label="Linjespenning"
            symbol="U_n"
            unit="V"
            value={un}
            onChange={setUn}
            hint="400 V (TN-S), 690 V (industri)."
          />
          <Field
            label="Kortslutningsspenning"
            symbol="u_k"
            unit="%"
            value={uk}
            onChange={setUk}
            hint="Trafoens u_k — typisk 4–6 %."
          />
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Matekabel (trafo → tavle)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lengde" symbol="L" unit="m" value={lMate} onChange={setLMate} />
          <TverrsnittSelect label="Tverrsnitt" symbol="A" value={aMate} onChange={setAMate} />
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Kurskabel (tavle → last)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lengde" symbol="L" unit="m" value={lKurs} onChange={setLKurs} />
          <TverrsnittSelect label="Tverrsnitt" symbol="A" value={aKurs} onChange={setAKurs} />
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Kursens vern
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Merkestrøm I_n"
            symbol="I_n"
            unit="A"
            value={inVern}
            onChange={setInVern}
          />
          <div>
            <span className="mb-1.5 block text-sm text-ink-500">Karakteristikk</span>
            <div role="radiogroup" aria-label="Karakteristikk" className="grid grid-cols-3 gap-2">
              {(['B', 'C', 'D'] as const).map((char) => {
                const aktiv = karakteristikk === char;
                const k = char === 'B' ? 5 : char === 'C' ? 10 : 20;
                return (
                  <button
                    key={char}
                    type="button"
                    role="radio"
                    aria-checked={aktiv}
                    onClick={() => setKarakteristikk(char)}
                    className={`rounded-lg border px-3 py-2.5 transition-all duration-200 ease-out-quart ${
                      aktiv
                        ? 'border-copper-400/60 bg-copper-400/[0.10] text-copper-200'
                        : 'border-ink-700/40 bg-ink-900/40 text-ink-500 hover:border-copper-400/30 hover:text-ink-200'
                    }`}
                  >
                    <div className="font-display text-lg">{char}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider">
                      k={k}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-400/40 bg-danger-400/[0.08] p-3 text-sm text-danger-300"
        >
          {error}
        </p>
      )}

      <ModuleResultView result={result} pending="Fyll inn alle felter for beregning." />
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

function TverrsnittSelect({
  label,
  symbol,
  value,
  onChange,
}: {
  label: string;
  symbol: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-ink-500">
          <span className="font-mono text-copper-200 mr-1.5">{symbol}</span>
          {label}
        </span>
        <span className="font-mono text-xs text-ink-500">mm²</span>
      </span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3.5 py-3 text-lg font-mono"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23c97b43' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundPosition: 'right 1rem center',
          paddingRight: '2.5rem',
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {TVERRSNITT_OPTIONS.map((A) => (
          <option key={A} value={A}>
            {A.toString().replace('.', ',')}
          </option>
        ))}
      </select>
    </label>
  );
}
