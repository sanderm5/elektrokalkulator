'use client';

import { useEffect, useMemo, useState } from 'react';
import { parseNumber } from '@/lib/format';
import {
  computeInstallasjonsanalyse,
  type AnalyseInput,
  type Kurs,
} from '@/lib/modules/installasjonsanalyse';
import { TVERRSNITT_OPTIONS } from '@/lib/modules/trafo-tn';
import type { ModuleResult } from '@/lib/modules/types';
import type { Forlegging, KabelType } from '@/lib/calc/iz-lookup';
import { ModuleResultView } from './ModuleResultView';

const STATE_KEY = 'elektro-installasjonsanalyse-v1';

type State = {
  system: 'TN-S' | 'IT';
  trafo_kVA: string;
  uk_pst: string;
  Un_linje: string;
  mate_L: string;
  mate_A: string;
  kurser: KursDraft[];
};

type KursDraft = {
  id: string;
  navn: string;
  P_kW: string;
  cos_phi: string;
  fas: '1-fas' | '3-fas';
  L_m: string;
  A_mm2: string;
  kabel: KabelType;
  forlegging: Forlegging;
  karakteristikk: 'B' | 'C' | 'D';
  In_A: string;
  samtidighet: string;
  kontinuerlig: boolean;
};

const KABEL_TYPER: Array<{ value: KabelType; label: string }> = [
  { value: 'PFXP-2', label: 'PFXP 2-leder (enfase)' },
  { value: 'PFXP-3', label: 'PFXP 3-leder (trefase)' },
  { value: 'TFXP-2', label: 'TFXP MR Flex 2-leder' },
  { value: 'TFXP-3', label: 'TFXP MR Flex 3-leder' },
];

const FORLEGGINGS: Array<{ value: Forlegging; label: string }> = [
  { value: 'A2', label: 'A2 — i rør i isolert vegg' },
  { value: 'B2', label: 'B2 — i rør på vegg' },
  { value: 'C', label: 'C — klamret direkte' },
  { value: 'D2', label: 'D2 — i jord' },
  { value: 'E', label: 'E — fritt i luft / kabelstige' },
];

const DEFAULT_KURS = (n: number): KursDraft => ({
  id: `kurs-${Date.now()}-${n}`,
  navn: `Kurs ${n}`,
  P_kW: '5',
  cos_phi: '1',
  fas: '1-fas',
  L_m: '20',
  A_mm2: '2.5',
  kabel: 'PFXP-2',
  forlegging: 'C',
  karakteristikk: 'B',
  In_A: '16',
  samtidighet: '1',
  kontinuerlig: false,
});

const INITIAL_STATE: State = {
  system: 'TN-S',
  trafo_kVA: '500',
  uk_pst: '4',
  Un_linje: '400',
  mate_L: '50',
  mate_A: '50',
  kurser: [DEFAULT_KURS(1)],
};

const EXAMPLE_ENERGISENTRAL: State = {
  system: 'TN-S',
  trafo_kVA: '1000',
  uk_pst: '4',
  Un_linje: '400',
  mate_L: '30',
  mate_A: '95',
  kurser: [
    {
      id: 'ex-vp1',
      navn: 'Varmepumpe VP1',
      P_kW: '55',
      cos_phi: '0.9',
      fas: '3-fas',
      L_m: '12',
      A_mm2: '50',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'C',
      In_A: '100',
      samtidighet: '1',
      kontinuerlig: true,
    },
    {
      id: 'ex-vp2',
      navn: 'Varmepumpe VP2',
      P_kW: '55',
      cos_phi: '0.9',
      fas: '3-fas',
      L_m: '15',
      A_mm2: '50',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'C',
      In_A: '100',
      samtidighet: '1',
      kontinuerlig: true,
    },
    {
      id: 'ex-vv',
      navn: 'Varmtvannstank',
      P_kW: '32',
      cos_phi: '1',
      fas: '3-fas',
      L_m: '20',
      A_mm2: '16',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'C',
      In_A: '63',
      samtidighet: '1',
      kontinuerlig: true,
    },
    {
      id: 'ex-pumper',
      navn: 'Sirkulasjonspumper',
      P_kW: '15',
      cos_phi: '0.85',
      fas: '3-fas',
      L_m: '25',
      A_mm2: '6',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'C',
      In_A: '32',
      samtidighet: '0.8',
      kontinuerlig: true,
    },
    {
      id: 'ex-vent',
      navn: 'Ventilasjon',
      P_kW: '11',
      cos_phi: '0.85',
      fas: '3-fas',
      L_m: '35',
      A_mm2: '4',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'C',
      In_A: '25',
      samtidighet: '1',
      kontinuerlig: true,
    },
  ],
};

const EXAMPLE_BOLIG: State = {
  system: 'TN-S',
  trafo_kVA: '100',
  uk_pst: '4',
  Un_linje: '400',
  mate_L: '20',
  mate_A: '25',
  kurser: [
    {
      id: 'ex-lys',
      navn: 'Lyskurs',
      P_kW: '1.5',
      cos_phi: '1',
      fas: '1-fas',
      L_m: '15',
      A_mm2: '1.5',
      kabel: 'PFXP-2',
      forlegging: 'C',
      karakteristikk: 'B',
      In_A: '10',
      samtidighet: '0.8',
      kontinuerlig: false,
    },
    {
      id: 'ex-stikk',
      navn: 'Stikkontakter stue',
      P_kW: '3.5',
      cos_phi: '1',
      fas: '1-fas',
      L_m: '12',
      A_mm2: '2.5',
      kabel: 'PFXP-2',
      forlegging: 'C',
      karakteristikk: 'B',
      In_A: '16',
      samtidighet: '0.3',
      kontinuerlig: false,
    },
    {
      id: 'ex-komfyr',
      navn: 'Komfyr',
      P_kW: '7',
      cos_phi: '1',
      fas: '3-fas',
      L_m: '8',
      A_mm2: '2.5',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'B',
      In_A: '16',
      samtidighet: '1',
      kontinuerlig: false,
    },
    {
      id: 'ex-bereder',
      navn: 'Varmtvannsbereder',
      P_kW: '3',
      cos_phi: '1',
      fas: '1-fas',
      L_m: '10',
      A_mm2: '2.5',
      kabel: 'PFXP-2',
      forlegging: 'C',
      karakteristikk: 'B',
      In_A: '16',
      samtidighet: '1',
      kontinuerlig: true,
    },
    {
      id: 'ex-elbil',
      navn: 'Elbil-lader',
      P_kW: '11',
      cos_phi: '1',
      fas: '3-fas',
      L_m: '15',
      A_mm2: '6',
      kabel: 'PFXP-3',
      forlegging: 'C',
      karakteristikk: 'B',
      In_A: '20',
      samtidighet: '1',
      kontinuerlig: true,
    },
  ],
};

function loadState(): State {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.sessionStorage.getItem(STATE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.kurser) &&
      parsed.kurser.length > 0
    ) {
      return parsed as State;
    }
    return INITIAL_STATE;
  } catch (err) {
    console.error('Kunne ikke lese installasjonsanalyse-state:', err);
    return INITIAL_STATE;
  }
}

function saveState(s: State): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STATE_KEY, JSON.stringify(s));
  } catch (err) {
    console.error('Kunne ikke lagre installasjonsanalyse-state:', err);
  }
}

function draftToInput(s: State): AnalyseInput | null {
  const trafo_kVA = parseNumber(s.trafo_kVA);
  const uk_pst = parseNumber(s.uk_pst);
  const Un_linje_V = parseNumber(s.Un_linje);
  const mate_L = parseNumber(s.mate_L);
  const mate_A = parseNumber(s.mate_A);
  if (![trafo_kVA, uk_pst, Un_linje_V, mate_L, mate_A].every(Number.isFinite)) {
    return null;
  }

  const kurser: Kurs[] = [];
  for (const d of s.kurser) {
    const P = parseNumber(d.P_kW);
    const cos = parseNumber(d.cos_phi);
    const L = parseNumber(d.L_m);
    const A = parseNumber(d.A_mm2);
    const In = parseNumber(d.In_A);
    const samt = parseNumber(d.samtidighet);
    if (![P, cos, L, A, In, samt].every(Number.isFinite)) return null;
    kurser.push({
      id: d.id,
      navn: d.navn,
      P_kW: P,
      cos_phi: cos,
      fas: d.fas,
      L_m: L,
      A_mm2: A,
      kabel: d.kabel,
      forlegging: d.forlegging,
      vern: { karakteristikk: d.karakteristikk, In_A: In },
      samtidighet: samt,
      kontinuerlig: d.kontinuerlig,
    });
  }

  return {
    system: s.system,
    trafo_kVA,
    uk_pst,
    Un_linje_V,
    matekabel: { L_m: mate_L, A_mm2: mate_A },
    kurser,
  };
}

export default function InstallasjonsanalyseModule() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const { result, error } = useMemo<{ result: ModuleResult | null; error: string | null }>(() => {
    const input = draftToInput(state);
    if (!input) return { result: null, error: null };
    try {
      return { result: computeInstallasjonsanalyse(input), error: null };
    } catch (err) {
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Ukjent feil.',
      };
    }
  }, [state]);

  const oppdaterKurs = (idx: number, patch: Partial<KursDraft>) => {
    setState((s) => ({
      ...s,
      kurser: s.kurser.map((k, i) => (i === idx ? { ...k, ...patch } : k)),
    }));
  };

  const slettKurs = (idx: number) => {
    setState((s) => ({
      ...s,
      kurser: s.kurser.length > 1 ? s.kurser.filter((_, i) => i !== idx) : s.kurser,
    }));
  };

  const leggTilKurs = () => {
    setState((s) => ({
      ...s,
      kurser: [...s.kurser, DEFAULT_KURS(s.kurser.length + 1)],
    }));
  };

  const nullstill = () => {
    if (window.confirm('Nullstille alle kurser og fylle inn standard verdier?')) {
      setState(INITIAL_STATE);
    }
  };

  return (
    <section
      className="glass rounded-2xl p-6 sm:p-8"
      role="region"
      aria-label="Sammenhengende installasjonsanalyse"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setState(EXAMPLE_ENERGISENTRAL)}
          className="inline-flex items-center gap-1.5 rounded-full border border-copper-400/40 bg-copper-400/[0.06] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-copper-200 hover:bg-copper-400/[0.12] transition-colors duration-200 ease-out-quart"
        >
          Eksempel: Energisentral 200 kW
        </button>
        <button
          type="button"
          onClick={() => setState(EXAMPLE_BOLIG)}
          className="inline-flex items-center gap-1.5 rounded-full border border-copper-400/40 bg-copper-400/[0.06] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-copper-200 hover:bg-copper-400/[0.12] transition-colors duration-200 ease-out-quart"
        >
          Eksempel: Bolig
        </button>
        <button
          type="button"
          onClick={nullstill}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-700/40 bg-ink-900/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:border-copper-400/30 hover:text-ink-200 transition-all duration-200 ease-out-quart"
        >
          Nullstill
        </button>
      </div>

      {/* Trafo og system */}
      <fieldset className="mb-6">
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Trafo og system
        </legend>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <span className="mb-1.5 block text-sm text-ink-500">System</span>
            <div role="radiogroup" className="grid grid-cols-2 gap-2">
              {(['TN-S', 'IT'] as const).map((sys) => {
                const aktiv = state.system === sys;
                return (
                  <button
                    key={sys}
                    type="button"
                    role="radio"
                    aria-checked={aktiv}
                    onClick={() => setState((s) => ({ ...s, system: sys }))}
                    className={`rounded-lg border px-3 py-2.5 font-mono text-sm transition-all duration-200 ease-out-quart ${
                      aktiv
                        ? 'border-copper-400/60 bg-copper-400/[0.10] text-copper-200'
                        : 'border-ink-700/40 bg-ink-900/40 text-ink-500 hover:border-copper-400/30 hover:text-ink-200'
                    }`}
                  >
                    {sys}
                  </button>
                );
              })}
            </div>
          </div>
          <Field
            label="kVA"
            symbol="S"
            value={state.trafo_kVA}
            onChange={(v) => setState((s) => ({ ...s, trafo_kVA: v }))}
          />
          <Field
            label="u_k"
            symbol="u_k"
            unit="%"
            value={state.uk_pst}
            onChange={(v) => setState((s) => ({ ...s, uk_pst: v }))}
          />
          <Field
            label="U_n linje"
            symbol="U_L"
            unit="V"
            value={state.Un_linje}
            onChange={(v) => setState((s) => ({ ...s, Un_linje: v }))}
          />
        </div>
      </fieldset>

      {/* Matekabel */}
      <fieldset className="mb-6">
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Matekabel (trafo → tavle)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Lengde"
            symbol="L"
            unit="m"
            value={state.mate_L}
            onChange={(v) => setState((s) => ({ ...s, mate_L: v }))}
          />
          <TverrsnittSelect
            label="Tverrsnitt"
            value={state.mate_A}
            onChange={(v) => setState((s) => ({ ...s, mate_A: v }))}
          />
        </div>
      </fieldset>

      {/* Kursliste */}
      <fieldset className="mb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <legend className="font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
            Kurser ({state.kurser.length})
          </legend>
          <button
            type="button"
            onClick={leggTilKurs}
            className="inline-flex items-center gap-1.5 rounded-full border border-copper-400/40 bg-copper-400/[0.06] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-copper-200 hover:bg-copper-400/[0.12] transition-colors duration-200 ease-out-quart"
          >
            + Legg til kurs
          </button>
        </div>
        <div className="space-y-4">
          {state.kurser.map((k, i) => (
            <KursForm
              key={k.id}
              kurs={k}
              onChange={(patch) => oppdaterKurs(i, patch)}
              onSlett={state.kurser.length > 1 ? () => slettKurs(i) : null}
            />
          ))}
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

      <ModuleResultView result={result} pending="Fyll inn trafo + minst én kurs for å analysere." />
    </section>
  );
}

function KursForm({
  kurs,
  onChange,
  onSlett,
}: {
  kurs: KursDraft;
  onChange: (patch: Partial<KursDraft>) => void;
  onSlett: (() => void) | null;
}) {
  return (
    <article className="rounded-xl border border-ink-700/40 bg-ink-950/40 p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <input
          type="text"
          value={kurs.navn}
          onChange={(e) => onChange({ navn: e.target.value })}
          className="calc-input flex-1 rounded-lg px-3 py-2 text-sm font-mono"
          aria-label="Kursnavn"
        />
        {onSlett && (
          <button
            type="button"
            onClick={onSlett}
            className="rounded-full border border-danger-400/40 bg-danger-400/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-danger-300 hover:bg-danger-400/[0.12] transition-colors duration-200 ease-out-quart"
            aria-label={`Slett kurs ${kurs.navn}`}
          >
            Slett
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <FasSelect
          value={kurs.fas}
          onChange={(v) => onChange({ fas: v, kabel: v === '1-fas' ? 'PFXP-2' : 'PFXP-3' })}
        />
        <Field label="P" symbol="P" unit="kW" value={kurs.P_kW} onChange={(v) => onChange({ P_kW: v })} />
        <Field
          label="cos φ"
          symbol="cosφ"
          value={kurs.cos_phi}
          onChange={(v) => onChange({ cos_phi: v })}
        />
        <Field label="Lengde" symbol="L" unit="m" value={kurs.L_m} onChange={(v) => onChange({ L_m: v })} />
        <TverrsnittSelect
          label="A"
          value={kurs.A_mm2}
          onChange={(v) => onChange({ A_mm2: v })}
        />
        <KabelSelect
          value={kurs.kabel}
          onChange={(v) => onChange({ kabel: v })}
          fas={kurs.fas}
        />
        <ForleggingsSelect
          value={kurs.forlegging}
          onChange={(v) => onChange({ forlegging: v })}
        />
        <CharSelect
          value={kurs.karakteristikk}
          onChange={(v) => onChange({ karakteristikk: v })}
        />
        <Field
          label="In vern"
          symbol="I_n"
          unit="A"
          value={kurs.In_A}
          onChange={(v) => onChange({ In_A: v })}
        />
        <Field
          label="Samtidighet c"
          symbol="c"
          value={kurs.samtidighet}
          onChange={(v) => onChange({ samtidighet: v })}
          hint="0..1"
        />
        <label className="flex items-center gap-2 self-end pb-2">
          <input
            type="checkbox"
            checked={kurs.kontinuerlig}
            onChange={(e) => onChange({ kontinuerlig: e.target.checked })}
            className="h-4 w-4 rounded border-ink-700 bg-ink-950 accent-copper-400"
          />
          <span className="text-sm text-ink-200">Kontinuerlig last</span>
        </label>
      </div>
    </article>
  );
}

function Field({
  label,
  symbol,
  unit,
  value,
  onChange,
  hint,
}: {
  label: string;
  symbol: string;
  unit?: string;
  value: string;
  onChange: (raw: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between">
        <span className="text-xs text-ink-500">
          <span className="font-mono text-copper-200 mr-1.5">{symbol}</span>
          {label}
        </span>
        {unit && <span className="font-mono text-[10px] text-ink-500">{unit}</span>}
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        className="calc-input w-full rounded-lg px-3 py-2 text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-[10px] text-ink-500">{hint}</p>}
    </label>
  );
}

const arrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23c97b43' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2rem',
} as const;

function TverrsnittSelect({
  label = 'Tverrsnitt',
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between">
        <span className="text-xs text-ink-500">{label}</span>
        <span className="font-mono text-[10px] text-ink-500">mm²</span>
      </span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3 py-2 text-base font-mono"
        style={arrowStyle}
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

function FasSelect({
  value,
  onChange,
}: {
  value: '1-fas' | '3-fas';
  onChange: (v: '1-fas' | '3-fas') => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-500">Fas</span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3 py-2 text-base"
        style={arrowStyle}
        value={value}
        onChange={(e) => onChange(e.target.value as '1-fas' | '3-fas')}
      >
        <option value="1-fas">1-fas</option>
        <option value="3-fas">3-fas</option>
      </select>
    </label>
  );
}

function KabelSelect({
  value,
  onChange,
  fas,
}: {
  value: KabelType;
  onChange: (v: KabelType) => void;
  fas: '1-fas' | '3-fas';
}) {
  const valg: Array<{ value: KabelType; label: string }> = [
    {
      value: fas === '1-fas' ? 'PFXP-2' : 'PFXP-3',
      label: fas === '1-fas' ? 'PFXP 2-leder' : 'PFXP 3-leder',
    },
    {
      value: fas === '1-fas' ? 'TFXP-2' : 'TFXP-3',
      label: fas === '1-fas' ? 'TFXP MR Flex 2-leder' : 'TFXP MR Flex 3-leder',
    },
  ];
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-500">Kabel</span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3 py-2 text-sm"
        style={arrowStyle}
        value={value}
        onChange={(e) => onChange(e.target.value as KabelType)}
      >
        {valg.map((v) => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ForleggingsSelect({
  value,
  onChange,
}: {
  value: Forlegging;
  onChange: (v: Forlegging) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-500">Forlegging</span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3 py-2 text-sm"
        style={arrowStyle}
        value={value}
        onChange={(e) => onChange(e.target.value as Forlegging)}
      >
        {FORLEGGINGS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CharSelect({
  value,
  onChange,
}: {
  value: 'B' | 'C' | 'D';
  onChange: (v: 'B' | 'C' | 'D') => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-500">Karakteristikk</span>
      <select
        className="calc-input w-full appearance-none rounded-lg bg-no-repeat px-3 py-2 text-base font-mono"
        style={arrowStyle}
        value={value}
        onChange={(e) => onChange(e.target.value as 'B' | 'C' | 'D')}
      >
        <option value="B">B (k = 5)</option>
        <option value="C">C (k = 10)</option>
        <option value="D">D (k = 20)</option>
      </select>
    </label>
  );
}
