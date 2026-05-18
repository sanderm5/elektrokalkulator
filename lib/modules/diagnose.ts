import { formatNumber } from '../format';
import type { ModuleMeta, ModuleResult, ModuleResultRow } from './types';

export const DIAGNOSE_META: ModuleMeta = {
  id: 'diagnose',
  slug: 'diagnose',
  category: 'diagnose',
  title: 'Diagnose fra måleverdier',
  subtitle: 'Måling → tolkning → tiltak',
  description:
    'Skriv inn det måleinstrumentet viser og få umiddelbar tolkning: er anlegget OK, finnes det avvik, og hvilket tiltak passer. Dekker isolasjonsmåling, kontinuitet i beskyttelsesleder, RCD-funksjonsprøving og sløyfeimpedans.',
  whenToUse:
    'Under sluttkontroll (NEK 400-6) og ved feilsøking på eksisterende anlegg. Brukes når sensor gir måleverdier og spør "hva betyr dette og hva gjør du?".',
  keywords: [
    'diagnose',
    'måling',
    'tolkning',
    'feilsøking',
    'isolasjon',
    'kontinuitet',
    'RCD',
    'sløyfeimpedans',
    'infinity',
    '∞',
    'jordfeil',
    'kortslutning',
    'brudd',
  ],
  source: 'NEK 400-6-61 / NEK EN 61557',
  glyph: '⌬',
  order: 1,
};

// =============================================================================
// 1. Isolasjonsmåling
// =============================================================================

export type IsolasjonInput = {
  R_iso_MOhm: number;
  mellom: 'faseledere' | 'fase-PE';
};

const ISOLASJON_KRAV_MOHM = 1;

export function diagnoseIsolasjon({ R_iso_MOhm, mellom }: IsolasjonInput): ModuleResult {
  if (!Number.isFinite(R_iso_MOhm) || R_iso_MOhm < 0) {
    throw new Error('Isolasjonsmotstand må være et positivt tall (MΩ).');
  }

  let verdict: ModuleResult['verdict'];
  const recommendations: string[] = [];
  let tolkning: string;
  let tolkningHint: string;

  if (R_iso_MOhm === 0) {
    verdict = {
      status: 'fail',
      text:
        mellom === 'faseledere'
          ? 'Kortslutning mellom faseledere'
          : 'Jordkortslutning mellom fase og PE',
    };
    tolkning = 'Kortslutning';
    tolkningHint = '0 Ω betyr direkte forbindelse — anlegget kan IKKE spenningssettes.';
    recommendations.push(
      'Ikke spenningssett kursen. Marker den som ute av drift og lås ut.',
      'Frakoble alt utstyr på kursen og mål på nytt — skiller mellom kabel- og utstyrsfeil.',
      'Lokaliser feilen ved sekvensiell utkobling av deler av kursen.',
    );
  } else if (R_iso_MOhm < ISOLASJON_KRAV_MOHM) {
    verdict = {
      status: 'fail',
      text:
        mellom === 'faseledere'
          ? 'Redusert isolasjon mellom faseledere'
          : 'Jordfeil — lav isolasjon mot PE',
    };
    tolkning = mellom === 'fase-PE' ? 'Jordfeil' : 'Degradert isolasjon';
    tolkningHint = `Under ${ISOLASJON_KRAV_MOHM} MΩ — kravet i NEK 400-6 er ikke oppfylt.`;
    recommendations.push(
      'Kursen kan ikke godkjennes. Tørr ut og kontroller om fukt eller forurensning er årsaken.',
      mellom === 'fase-PE'
        ? 'Spor jordfeilen ved å dele kursen opp og mål delene hver for seg, eller bruk jordfeilsporer.'
        : 'Kontroller skadet kabelmantel, klemming og at fasene ikke er kommet i kontakt.',
      'Frakoble laster og mål kabelen alene — skiller kabelfeil fra lastfeil.',
    );
  } else if (R_iso_MOhm < 10) {
    verdict = { status: 'warn', text: 'Akseptabelt, men lavt' };
    tolkning = 'Marginalt OK';
    tolkningHint = 'Over kravet, men i nedre del. Bør følges opp ved neste kontroll.';
    recommendations.push(
      'Resultatet oppfyller minimumskravet, men loggføres for trend-overvåkning.',
      'Vurder årsaken hvis verdien er vesentlig lavere enn forventet for kabeltype/lengde.',
    );
  } else {
    verdict = { status: 'ok', text: 'God isolasjon' };
    tolkning = 'OK';
    tolkningHint = 'Klart over kravet — typisk for nytt og tørt anlegg.';
  }

  return {
    verdict,
    sections: [
      {
        title: 'Måling',
        rows: [
          {
            label: 'Mellom',
            value:
              mellom === 'faseledere'
                ? 'Faseledere (L–L / L–N)'
                : 'Fase mot beskyttelsesleder (L–PE)',
          },
          {
            label: 'Målt isolasjon',
            value: formatNumber(R_iso_MOhm, 2),
            unit: 'MΩ',
            status: verdict.status,
          },
          {
            label: 'Krav',
            value: `≥ ${ISOLASJON_KRAV_MOHM} MΩ`,
            hint: 'NEK 400-6 — målt ved 500 V DC for 230/400 V-anlegg.',
            status: 'info',
          },
        ],
      },
      {
        title: 'Tolkning',
        rows: [
          {
            label: tolkning,
            value: '',
            hint: tolkningHint,
            status: verdict.status,
          },
        ],
      },
    ],
    recommendations,
  };
}

// =============================================================================
// 2. Kontinuitet i beskyttelsesleder
// =============================================================================

export type KontinuitetInput = {
  R_PE_Ohm: number;
  L_meter?: number;
  A_mm2?: number;
};

const PE_KRAV_OHM = 1;

export function diagnoseKontinuitet({
  R_PE_Ohm,
  L_meter,
  A_mm2,
}: KontinuitetInput): ModuleResult {
  if (!Number.isFinite(R_PE_Ohm) || R_PE_Ohm < 0) {
    throw new Error('PE-motstand må være et positivt tall (Ω).');
  }

  const recommendations: string[] = [];
  let verdict: ModuleResult['verdict'];
  let tolkning: string;
  let hint: string;

  let forventet: number | null = null;
  if (
    L_meter !== undefined &&
    A_mm2 !== undefined &&
    Number.isFinite(L_meter) &&
    Number.isFinite(A_mm2) &&
    L_meter > 0 &&
    A_mm2 > 0
  ) {
    forventet = (0.0175 * L_meter) / A_mm2;
  }

  if (R_PE_Ohm > 1000) {
    verdict = { status: 'fail', text: 'Brudd i beskyttelsesleder' };
    tolkning = 'Brudd';
    hint = 'Måleren viser tilnærmet uendelig — PE-lederen er ikke i kontakt med jordingsklemme.';
    recommendations.push(
      'Ikke spenningssett kursen — anlegget gir ingen beskyttelse ved feil.',
      'Spor bruddet: kontroller jordingsklemmer, sammenkoblinger, kabel-overganger.',
      'Mål delene av kursen for å lokalisere brudd-punktet.',
    );
  } else if (R_PE_Ohm > PE_KRAV_OHM) {
    verdict = { status: 'fail', text: 'Ikke godkjent — for høy motstand i PE' };
    tolkning = 'Over grenseverdi';
    hint = `Tommelfingerregel: R_PE ≤ ${PE_KRAV_OHM} Ω for vanlige kurser. Verdien indikerer dårlig forbindelse.`;
    recommendations.push(
      'Etterstram alle skrueforbindelser i PE-veien (klemme, koblingsboks, plint).',
      'Kontroller overgangsmotstand i hver klemme separat med kontinuitetsmåling.',
      'Vurder oksidert eller skitten kontaktflate — rens og remonter ved behov.',
    );
  } else if (forventet !== null && R_PE_Ohm > forventet * 2) {
    verdict = { status: 'warn', text: 'OK, men høyere enn forventet' };
    tolkning = 'Avvik fra teoretisk verdi';
    hint = `Forventet ca. ${formatNumber(forventet, 3)} Ω basert på kabel — målt verdi er over dobbelt. Kan tyde på dårlig forbindelse i en klemme.`;
    recommendations.push(
      'Resultatet er innenfor krav, men avviket bør undersøkes ved tilgjengelige klemmer.',
    );
  } else {
    verdict = { status: 'ok', text: 'OK — PE har god kontinuitet' };
    tolkning = 'Godkjent';
    hint = `Under ${PE_KRAV_OHM} Ω — beskyttelsesleder gir lav impedans til jord.`;
  }

  const rows: ModuleResultRow[] = [
    {
      label: 'Målt R_PE',
      value: formatNumber(R_PE_Ohm, 3),
      unit: 'Ω',
      status: verdict.status,
    },
    {
      label: 'Grenseverdi',
      value: `≤ ${PE_KRAV_OHM} Ω`,
      hint: 'Praktisk grense for godkjenning. NEK 400-6 krever lav nok motstand til at vernet utløser ved jordfeil.',
      status: 'info',
    },
  ];
  if (forventet !== null) {
    rows.push({
      label: 'Forventet (kabel-bidrag)',
      value: formatNumber(forventet, 3),
      unit: 'Ω',
      hint: `Beregnet for Cu ved 20 °C, ${L_meter} m × ${A_mm2} mm².`,
      status: 'info',
    });
  }

  return {
    verdict,
    sections: [
      { title: 'Måling', rows },
      {
        title: 'Tolkning',
        rows: [{ label: tolkning, value: '', hint, status: verdict.status }],
      },
    ],
    recommendations,
  };
}

// =============================================================================
// 3. RCD-funksjonsprøving
// =============================================================================

export type RcdInput = {
  I_merke_mA: number;
  t_ved_1x_ms: number;
  t_ved_5x_ms: number;
  I_utlosning_mA: number;
};

const RCD_T_MAX_1X_MS = 300;
const RCD_T_MAX_5X_MS = 40;

export function diagnoseRcd({
  I_merke_mA,
  t_ved_1x_ms,
  t_ved_5x_ms,
  I_utlosning_mA,
}: RcdInput): ModuleResult {
  if (!Number.isFinite(I_merke_mA) || I_merke_mA <= 0) {
    throw new Error('Merkestrøm IΔn må være > 0 mA.');
  }

  const t1xPresent = Number.isFinite(t_ved_1x_ms) && t_ved_1x_ms > 0;
  const t5xPresent = Number.isFinite(t_ved_5x_ms) && t_ved_5x_ms > 0;
  const IutPresent = Number.isFinite(I_utlosning_mA) && I_utlosning_mA > 0;

  const t1xOk = t1xPresent && t_ved_1x_ms <= RCD_T_MAX_1X_MS;
  const t5xOk = t5xPresent && t_ved_5x_ms <= RCD_T_MAX_5X_MS;

  const I_min_utlos = 0.5 * I_merke_mA;
  const I_max_utlos = 1.0 * I_merke_mA;
  const IutOk = IutPresent && I_utlosning_mA >= I_min_utlos && I_utlosning_mA <= I_max_utlos;

  const anyFail =
    (t1xPresent && t_ved_1x_ms > RCD_T_MAX_1X_MS) ||
    (t5xPresent && t_ved_5x_ms > RCD_T_MAX_5X_MS) ||
    (IutPresent && (I_utlosning_mA < I_min_utlos || I_utlosning_mA > I_max_utlos));

  const allPresent = t1xPresent && t5xPresent && IutPresent;
  const allOk = allPresent && t1xOk && t5xOk && IutOk;

  let verdict: ModuleResult['verdict'];
  const recommendations: string[] = [];

  if (allOk) {
    verdict = { status: 'ok', text: 'RCD oppfyller alle krav' };
  } else if (anyFail) {
    verdict = { status: 'fail', text: 'RCD oppfyller ikke krav — må byttes' };
    if (t1xPresent && t_ved_1x_ms > RCD_T_MAX_1X_MS) {
      recommendations.push(
        `Utløsningstiden ved 1×IΔn (${formatNumber(t_ved_1x_ms, 0)} ms) overstiger ${RCD_T_MAX_1X_MS} ms — RCD-en er for treg og må erstattes.`,
      );
    }
    if (t5xPresent && t_ved_5x_ms > RCD_T_MAX_5X_MS) {
      recommendations.push(
        `Utløsningstiden ved 5×IΔn (${formatNumber(t_ved_5x_ms, 0)} ms) overstiger ${RCD_T_MAX_5X_MS} ms — kritisk for personsikkerhet, må byttes.`,
      );
    }
    if (IutPresent && I_utlosning_mA < I_min_utlos) {
      recommendations.push(
        `Utløsningsstrøm (${formatNumber(I_utlosning_mA, 0)} mA) er under 0,5×IΔn — RCD er for følsom og kan gi uønskede utløsninger.`,
      );
    }
    if (IutPresent && I_utlosning_mA > I_max_utlos) {
      recommendations.push(
        `Utløsningsstrøm (${formatNumber(I_utlosning_mA, 0)} mA) er over IΔn — RCD utløser for sent ved farlig strøm. Må byttes.`,
      );
    }
  } else {
    verdict = { status: 'warn', text: 'Ufullstendig måling' };
    recommendations.push(
      'Fyll inn alle tre verdier (begge tider og utløsningsstrøm) for komplett vurdering.',
    );
  }

  return {
    verdict,
    sections: [
      {
        title: 'Måling',
        rows: [
          { label: 'Merkestrøm IΔn', value: formatNumber(I_merke_mA, 0), unit: 'mA' },
          {
            label: 'Tid ved 1×IΔn',
            value: t1xPresent ? formatNumber(t_ved_1x_ms, 0) : '—',
            unit: 'ms',
            status: t1xPresent ? (t1xOk ? 'ok' : 'fail') : 'info',
            hint: `Krav: ≤ ${RCD_T_MAX_1X_MS} ms`,
          },
          {
            label: 'Tid ved 5×IΔn',
            value: t5xPresent ? formatNumber(t_ved_5x_ms, 0) : '—',
            unit: 'ms',
            status: t5xPresent ? (t5xOk ? 'ok' : 'fail') : 'info',
            hint: `Krav: ≤ ${RCD_T_MAX_5X_MS} ms`,
          },
          {
            label: 'Utløsningsstrøm',
            value: IutPresent ? formatNumber(I_utlosning_mA, 0) : '—',
            unit: 'mA',
            status: IutPresent ? (IutOk ? 'ok' : 'fail') : 'info',
            hint: `Skal være mellom ${formatNumber(I_min_utlos, 0)} og ${formatNumber(I_max_utlos, 0)} mA (0,5–1,0 × IΔn).`,
          },
        ],
      },
    ],
    recommendations,
  };
}

// =============================================================================
// 4. Sløyfeimpedans
// =============================================================================

export type SloyfeImpedansInput = {
  Zs_malt_Ohm: number;
  Un_fase_V: number;
  In_vern_A: number;
  k_vern: number;
  karakteristikk: 'B' | 'C' | 'D';
};

export function diagnoseSloyfeimpedans({
  Zs_malt_Ohm,
  Un_fase_V,
  In_vern_A,
  k_vern,
  karakteristikk,
}: SloyfeImpedansInput): ModuleResult {
  if (!Number.isFinite(Zs_malt_Ohm) || Zs_malt_Ohm < 0) {
    throw new Error('Målt Zs må være ≥ 0 Ω.');
  }
  if (!Number.isFinite(Un_fase_V) || Un_fase_V <= 0) {
    throw new Error('Fasespenning må være > 0 V.');
  }
  if (!Number.isFinite(In_vern_A) || In_vern_A <= 0) {
    throw new Error('Vernets merkestrøm må være > 0 A.');
  }
  if (!Number.isFinite(k_vern) || k_vern <= 0) {
    throw new Error('Karakteristikk-faktor må være > 0.');
  }

  const Ia = k_vern * In_vern_A;
  const C_min = 0.95;
  const Zs_maks = (C_min * Un_fase_V) / Ia;
  const ok = Zs_malt_Ohm <= Zs_maks;

  let verdict: ModuleResult['verdict'];
  const recommendations: string[] = [];

  if (ok) {
    verdict = { status: 'ok', text: 'Utkobling innenfor kravet' };
  } else {
    verdict = { status: 'fail', text: 'Zs er for høy — vernet utløser ikke i tide' };
    const reduserMed = (1 - Zs_maks / Zs_malt_Ohm) * 100;
    recommendations.push(
      `Sløyfeimpedansen må reduseres med ca. ${formatNumber(reduserMed, 0)} % for å oppfylle kravet.`,
      'Tiltak: reduser kabellengden, øk tverrsnittet, eller velg vern med lavere I_a (f.eks. B-karakteristikk i stedet for C).',
      'Hvis kabelen ikke kan endres: vurder RCD med IΔn ≤ 30 mA som tilleggsbeskyttelse.',
    );
  }

  return {
    verdict,
    sections: [
      {
        title: 'Vernkrav',
        rows: [
          { label: 'Karakteristikk', value: karakteristikk },
          { label: 'Merkestrøm I_n', value: formatNumber(In_vern_A, 0), unit: 'A' },
          {
            label: 'Utløserstrøm I_a',
            value: formatNumber(Ia, 1),
            unit: 'A',
            hint: `I_a = ${formatNumber(k_vern, 0)} × I_n (øvre grense for ${karakteristikk}-karakteristikk).`,
          },
          { label: 'Fasespenning U_n', value: formatNumber(Un_fase_V, 0), unit: 'V' },
        ],
      },
      {
        title: 'Sløyfeimpedans',
        rows: [
          {
            label: 'Maks tillatt Zs',
            value: formatNumber(Zs_maks, 3),
            unit: 'Ω',
            hint: 'Zs ≤ (C_min × U_n) / I_a med C_min = 0,95 for å gi margin mot spenningsfall.',
          },
          {
            label: 'Målt Zs',
            value: formatNumber(Zs_malt_Ohm, 3),
            unit: 'Ω',
            status: ok ? 'ok' : 'fail',
          },
        ],
        note: ok
          ? 'Vernet utløser innen 0,4 s for boligkurser ≤ 32 A iht. NEK 400-411.3.'
          : 'Vernet rekker ikke å utløse innen kravet — feilstrømmen er for lav til å aktivere magnetutløseren.',
      },
    ],
    recommendations,
  };
}
