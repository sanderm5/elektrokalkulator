'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Formula, Interpretation, ValidationHint } from '@/lib/formulas/types';
import { getFormula } from '@/lib/formulas';
import { formatNumber, parseNumber } from '@/lib/format';
import { saveLastResult, useCompatibleLastResult } from '@/lib/hooks/useLastResult';
import { FormulaDisplay } from './FormulaDisplay';

const STATUS_STYLES: Record<
  ValidationHint['status'] | Interpretation['status'],
  { wrap: string; icon: string; ariaRole: 'status' | 'alert' }
> = {
  ok: {
    wrap: 'border-live-400/30 bg-live-400/[0.06] text-live-400',
    icon: '✓',
    ariaRole: 'status',
  },
  info: {
    wrap: 'border-copper-400/20 bg-copper-400/[0.04] text-ink-200',
    icon: 'ℹ',
    ariaRole: 'status',
  },
  warning: {
    wrap: 'border-copper-400/40 bg-copper-400/[0.08] text-copper-200',
    icon: '⚠',
    ariaRole: 'alert',
  },
  error: {
    wrap: 'border-danger-400/40 bg-danger-400/[0.08] text-danger-300',
    icon: '✗',
    ariaRole: 'alert',
  },
};

function StatusChip({
  status,
  message,
  className = '',
}: {
  status: ValidationHint['status'] | Interpretation['status'];
  message: string;
  className?: string;
}) {
  const s = STATUS_STYLES[status];
  return (
    <div
      role={s.ariaRole}
      className={`mt-2 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed animate-fade-up ${s.wrap} ${className}`}
    >
      <span aria-hidden="true" className="font-mono text-sm leading-none pt-0.5">
        {s.icon}
      </span>
      <span>{message}</span>
    </div>
  );
}

type Props = {
  formulaId: string;
};

type InputState = Record<string, string>;

function buildInitialState(formula: Formula): InputState {
  const state: InputState = {};
  for (const input of formula.inputs) {
    state[input.symbol] =
      input.defaultValue !== undefined ? formatNumber(input.defaultValue, 6) : '';
  }
  return state;
}

export function Calculator({ formulaId }: Props) {
  const formula = getFormula(formulaId);
  if (!formula) {
    return (
      <section className="glass rounded-2xl p-6 text-copper-300">
        Fant ikke formelen «{formulaId}».
      </section>
    );
  }
  return <CalculatorView formula={formula} />;
}

function CalculatorView({ formula }: { formula: Formula }) {
  const [values, setValues] = useState<InputState>(() =>
    buildInitialState(formula),
  );

  /** Best-effort parsed inputs — kun feltene som parses som tall.
   *  Brukes til per-felt-validering (slik at validate kan se andre felter
   *  selv om ikke ALLE er fylt ut). */
  const partialNumeric = useMemo(() => {
    const out: Record<string, number> = {};
    for (const input of formula.inputs) {
      const parsed = parseNumber(values[input.symbol] ?? '');
      if (!Number.isNaN(parsed)) out[input.symbol] = parsed;
    }
    return out;
  }, [formula, values]);

  const result = useMemo(() => {
    const numeric: Record<string, number> = {};
    for (const input of formula.inputs) {
      const raw = values[input.symbol] ?? '';
      const parsed = parseNumber(raw);
      if (Number.isNaN(parsed)) {
        return { kind: 'pending' as const, missing: input.name };
      }
      if (input.min !== undefined && parsed < input.min) {
        return {
          kind: 'error' as const,
          message: `${input.name} kan ikke være mindre enn ${input.min} ${input.unit}.`,
        };
      }
      if (input.max !== undefined && parsed > input.max) {
        return {
          kind: 'error' as const,
          message: `${input.name} kan ikke være større enn ${input.max} ${input.unit}.`,
        };
      }
      numeric[input.symbol] = parsed;
    }
    try {
      const value = formula.calculate(numeric);
      if (!Number.isFinite(value)) {
        return {
          kind: 'error' as const,
          message: 'Beregningen ga et ugyldig tall. Sjekk inputene.',
        };
      }
      return { kind: 'ok' as const, value, numeric };
    } catch (err) {
      return {
        kind: 'error' as const,
        message: err instanceof Error ? err.message : 'Ukjent feil.',
      };
    }
  }, [formula, values]);

  const interpretation: Interpretation | null = useMemo(() => {
    if (result.kind !== 'ok' || !formula.interpret) return null;
    try {
      return formula.interpret(result.value, result.numeric);
    } catch (err) {
      console.error('interpret() kastet:', err);
      return null;
    }
  }, [result, formula]);

  // Lagre OK-resultat slik at neste kalkulator kan tilby "Bruk forrige".
  useEffect(() => {
    if (result.kind === 'ok') {
      saveLastResult(
        formula.output.symbol,
        result.value,
        formula.id,
        formula.title,
      );
    }
  }, [result, formula.id, formula.output.symbol, formula.title]);

  const setInputValue = (symbol: string, raw: string) => {
    setValues((prev) => ({ ...prev, [symbol]: raw }));
  };

  return (
    <section
      className="glass rounded-2xl p-6 sm:p-8"
      role="region"
      aria-label={`Kalkulator for ${formula.title}`}
    >
      <div className="mb-6 flex items-center justify-center py-4">
        <FormulaDisplay latex={formula.latex} display />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {formula.inputs.map((input) => (
          <CalculatorInputField
            key={input.symbol}
            formulaId={formula.id}
            input={input}
            value={values[input.symbol] ?? ''}
            allInputs={partialNumeric}
            onChange={(raw) => setInputValue(input.symbol, raw)}
          />
        ))}
      </div>

      <div
        className="mt-8 rounded-xl border border-copper-400/20 bg-ink-950/60 p-5"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="mb-1 text-xs uppercase tracking-wider text-ink-500">
          Resultat
        </div>
        {result.kind === 'ok' ? (
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-copper-200 text-sm">
              {formula.output.symbol} =
            </span>
            <span className="result-value font-mono text-3xl sm:text-4xl text-live-400 font-semibold">
              {formatNumber(result.value, formula.output.decimals ?? 3)}
            </span>
            <span className="font-mono text-base text-ink-500">
              {formula.output.unit}
            </span>
          </div>
        ) : result.kind === 'pending' ? (
          <p className="text-sm text-ink-500 italic">
            Fyll inn {result.missing.toLowerCase()} for å beregne.
          </p>
        ) : (
          <p className="text-sm text-copper-300">{result.message}</p>
        )}
        {interpretation && (
          <StatusChip
            status={interpretation.status}
            message={interpretation.message}
            className="mt-4"
          />
        )}
      </div>
    </section>
  );
}

function CalculatorInputField({
  formulaId,
  input,
  value,
  allInputs,
  onChange,
}: {
  formulaId: string;
  input: Formula['inputs'][number];
  value: string;
  allInputs: Record<string, number>;
  onChange: (raw: string) => void;
}) {
  const last = useCompatibleLastResult(input.symbol, formulaId);
  const useLast = () => {
    if (!last) return;
    onChange(formatNumber(last.entry.value, 6));
  };

  const validation: ValidationHint | null = useMemo(() => {
    if (!input.validate) return null;
    const parsed = parseNumber(value);
    if (Number.isNaN(parsed)) return null;
    try {
      return input.validate(parsed, allInputs);
    } catch (err) {
      console.error('validate() kastet for', input.symbol, err);
      return null;
    }
  }, [input, value, allInputs]);

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-ink-500">
          <span className="font-mono text-copper-200 mr-1.5">
            {input.symbol}
          </span>
          {input.name}
        </span>
        <span className="font-mono text-xs text-ink-500">{input.unit}</span>
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="calc-input w-full rounded-lg px-3.5 py-3 text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${formulaId}-${input.symbol}-hint`}
      />
      {last && (
        <button
          type="button"
          onClick={useLast}
          className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-copper-400/40 bg-copper-400/[0.06] px-2.5 py-1 text-[11px] font-mono text-copper-200 hover:bg-copper-400/[0.12] transition-colors"
          aria-label={`Bruk siste resultat ${last.sourceSymbol} = ${formatNumber(last.entry.value, 3)} fra ${last.entry.formulaTitle}`}
        >
          <span aria-hidden="true">↺</span>
          <span>
            Bruk forrige: {last.sourceSymbol} = {formatNumber(last.entry.value, 3)}
          </span>
        </button>
      )}
      {input.hint && (
        <p
          id={`${formulaId}-${input.symbol}-hint`}
          className="mt-1.5 text-xs text-ink-500 leading-relaxed"
        >
          {input.hint}
        </p>
      )}
      {validation && (
        <StatusChip status={validation.status} message={validation.message} />
      )}
    </label>
  );
}
