'use client';

import { useMemo, useState } from 'react';
import { parseNumber } from '@/lib/format';
import {
  diagnoseIsolasjon,
  diagnoseKontinuitet,
  diagnoseRcd,
  diagnoseSloyfeimpedans,
} from '@/lib/modules/diagnose';
import type { ModuleResult } from '@/lib/modules/types';
import { ModuleResultView } from './ModuleResultView';

type TabId = 'isolasjon' | 'kontinuitet' | 'rcd' | 'sloyfe';

const TABS: Array<{ id: TabId; label: string; short: string }> = [
  { id: 'isolasjon', label: 'Isolasjonsmåling', short: 'R_iso' },
  { id: 'kontinuitet', label: 'Kontinuitet PE', short: 'R_PE' },
  { id: 'rcd', label: 'RCD-test', short: 'IΔn' },
  { id: 'sloyfe', label: 'Sløyfeimpedans', short: 'Zs' },
];

function safeRun(fn: () => ModuleResult): { result: ModuleResult | null; error: string | null } {
  try {
    return { result: fn(), error: null };
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : 'Ukjent feil i beregningen.',
    };
  }
}

export default function DiagnoseModule() {
  const [tab, setTab] = useState<TabId>('isolasjon');

  return (
    <section
      className="glass rounded-2xl p-6 sm:p-8"
      role="region"
      aria-label="Diagnose fra måleverdier"
    >
      <div
        role="tablist"
        aria-label="Velg måletype"
        className="mb-6 flex flex-wrap gap-2"
      >
        {TABS.map((t) => {
          const aktiv = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={aktiv}
              aria-controls={`diagnose-panel-${t.id}`}
              id={`diagnose-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ease-out-quart ${
                aktiv
                  ? 'border-copper-400/60 bg-copper-400/[0.12] text-copper-200'
                  : 'border-ink-700/40 bg-ink-900/40 text-ink-500 hover:border-copper-400/30 hover:text-ink-200'
              }`}
            >
              <span aria-hidden="true" className="font-mono">
                {t.short}
              </span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`diagnose-panel-${tab}`}
        aria-labelledby={`diagnose-tab-${tab}`}
      >
        {tab === 'isolasjon' && <IsolasjonPanel />}
        {tab === 'kontinuitet' && <KontinuitetPanel />}
        {tab === 'rcd' && <RcdPanel />}
        {tab === 'sloyfe' && <SloyfePanel />}
      </div>
    </section>
  );
}

// =============================================================================
// 1. Isolasjons-panel
// =============================================================================

function IsolasjonPanel() {
  const [riso, setRiso] = useState('');
  const [mellom, setMellom] = useState<'faseledere' | 'fase-PE'>('fase-PE');

  const { result, error } = useMemo(() => {
    const r = parseNumber(riso);
    if (!Number.isFinite(r)) {
      return { result: null, error: null };
    }
    return safeRun(() => diagnoseIsolasjon({ R_iso_MOhm: r, mellom }));
  }, [riso, mellom]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Målt isolasjon"
          symbol="R_iso"
          unit="MΩ"
          value={riso}
          onChange={setRiso}
          hint="Skriv tallet måleren viser. Bruk 9999 (eller mer) for ∞."
          autoFocus
        />
        <Select
          label="Mellom"
          value={mellom}
          onChange={(v) => setMellom(v as 'faseledere' | 'fase-PE')}
          options={[
            { value: 'fase-PE', label: 'Fase mot PE (L–PE)' },
            { value: 'faseledere', label: 'Mellom faseledere (L–L / L–N)' },
          ]}
        />
      </div>
      {error && <ErrorMessage message={error} />}
      <ModuleResultView
        result={result}
        pending="Skriv inn målt isolasjonsverdi for tolkning."
      />
    </>
  );
}

// =============================================================================
// 2. Kontinuitets-panel
// =============================================================================

function KontinuitetPanel() {
  const [rpe, setRpe] = useState('');
  const [lengde, setLengde] = useState('');
  const [tverrsnitt, setTverrsnitt] = useState('');

  const { result, error } = useMemo(() => {
    const r = parseNumber(rpe);
    if (!Number.isFinite(r)) {
      return { result: null, error: null };
    }
    const L = parseNumber(lengde);
    const A = parseNumber(tverrsnitt);
    return safeRun(() =>
      diagnoseKontinuitet({
        R_PE_Ohm: r,
        L_meter: Number.isFinite(L) ? L : undefined,
        A_mm2: Number.isFinite(A) ? A : undefined,
      }),
    );
  }, [rpe, lengde, tverrsnitt]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Målt R i beskyttelsesleder"
          symbol="R_PE"
          unit="Ω"
          value={rpe}
          onChange={setRpe}
          hint="Måleresultatet ved kontinuitetstest (1 A DC eller AC iht. NEK EN 61557-4)."
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Kabellengde"
            symbol="L"
            unit="m"
            value={lengde}
            onChange={setLengde}
            hint="Valgfritt — gir teoretisk referanse."
          />
          <Field
            label="Tverrsnitt"
            symbol="A"
            unit="mm²"
            value={tverrsnitt}
            onChange={setTverrsnitt}
            hint="Valgfritt."
          />
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      <ModuleResultView
        result={result}
        pending="Skriv inn målt R_PE for tolkning."
      />
    </>
  );
}

// =============================================================================
// 3. RCD-panel
// =============================================================================

function RcdPanel() {
  const [iMerke, setIMerke] = useState('30');
  const [t1x, setT1x] = useState('');
  const [t5x, setT5x] = useState('');
  const [iUtlos, setIUtlos] = useState('');

  const { result, error } = useMemo(() => {
    const Im = parseNumber(iMerke);
    if (!Number.isFinite(Im)) {
      return { result: null, error: null };
    }
    return safeRun(() =>
      diagnoseRcd({
        I_merke_mA: Im,
        t_ved_1x_ms: parseNumber(t1x),
        t_ved_5x_ms: parseNumber(t5x),
        I_utlosning_mA: parseNumber(iUtlos),
      }),
    );
  }, [iMerke, t1x, t5x, iUtlos]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Merkestrøm RCD"
          symbol="IΔn"
          unit="mA"
          value={iMerke}
          onChange={setIMerke}
          hint="Typisk 30 mA (boligstikk), 100/300 mA (industri/utstyrsvern)."
        />
        <Field
          label="Målt utløsningsstrøm"
          symbol="I_utlos"
          unit="mA"
          value={iUtlos}
          onChange={setIUtlos}
          hint="Skal være mellom 0,5 og 1,0 × IΔn."
        />
        <Field
          label="Tid ved 1×IΔn"
          symbol="t₁"
          unit="ms"
          value={t1x}
          onChange={setT1x}
          hint="Krav: ≤ 300 ms"
        />
        <Field
          label="Tid ved 5×IΔn"
          symbol="t₅"
          unit="ms"
          value={t5x}
          onChange={setT5x}
          hint="Krav: ≤ 40 ms"
        />
      </div>
      {error && <ErrorMessage message={error} />}
      <ModuleResultView
        result={result}
        pending="Skriv inn merkestrøm og minst én måleverdi."
      />
    </>
  );
}

// =============================================================================
// 4. Sløyfe-panel
// =============================================================================

function SloyfePanel() {
  const [zsMalt, setZsMalt] = useState('');
  const [un, setUn] = useState('230');
  const [inVern, setInVern] = useState('16');
  const [karakteristikk, setKarakteristikk] = useState<'B' | 'C' | 'D'>('B');

  const k_vern = karakteristikk === 'B' ? 5 : karakteristikk === 'C' ? 10 : 20;

  const { result, error } = useMemo(() => {
    const zs = parseNumber(zsMalt);
    const u = parseNumber(un);
    const i = parseNumber(inVern);
    if (!Number.isFinite(zs) || !Number.isFinite(u) || !Number.isFinite(i)) {
      return { result: null, error: null };
    }
    return safeRun(() =>
      diagnoseSloyfeimpedans({
        Zs_malt_Ohm: zs,
        Un_fase_V: u,
        In_vern_A: i,
        k_vern,
        karakteristikk,
      }),
    );
  }, [zsMalt, un, inVern, k_vern, karakteristikk]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Målt sløyfeimpedans"
          symbol="Zs"
          unit="Ω"
          value={zsMalt}
          onChange={setZsMalt}
          hint="Sløyfeimpedans-test fra fase til PE."
          autoFocus
        />
        <Field
          label="Fasespenning"
          symbol="U_n"
          unit="V"
          value={un}
          onChange={setUn}
          hint="230 V i TN/IT. For 3-fas felles PEN bruk 230 V."
        />
        <Field
          label="Vernets merkestrøm"
          symbol="I_n"
          unit="A"
          value={inVern}
          onChange={setInVern}
        />
        <Select
          label="Karakteristikk"
          value={karakteristikk}
          onChange={(v) => setKarakteristikk(v as 'B' | 'C' | 'D')}
          options={[
            { value: 'B', label: 'B (k = 5 × I_n)' },
            { value: 'C', label: 'C (k = 10 × I_n)' },
            { value: 'D', label: 'D (k = 20 × I_n)' },
          ]}
        />
      </div>
      {error && <ErrorMessage message={error} />}
      <ModuleResultView
        result={result}
        pending="Fyll inn alle felter for tolkning."
      />
    </>
  );
}

// =============================================================================
// Felles input-primitiver
// =============================================================================

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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ink-500">{label}</span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3.5 py-3 text-base"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23c97b43' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundPosition: 'right 1rem center',
          paddingRight: '2.5rem',
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mt-4 rounded-lg border border-danger-400/40 bg-danger-400/[0.08] p-3 text-sm text-danger-300"
    >
      {message}
    </p>
  );
}
