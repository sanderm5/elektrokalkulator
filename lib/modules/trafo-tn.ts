import { formatNumber } from '../format';
import { getResistansCu70, TVERRSNITT_REKKE } from '../tables/resistans';
import type { ModuleMeta, ModuleResult, ModuleResultRow } from './types';

export const TRAFO_TN_META: ModuleMeta = {
  id: 'trafo-tn',
  slug: 'trafo-tn',
  category: 'anlegg-system',
  title: 'Trafo til TN-nett',
  subtitle: 'Z_trafo, Ik3p_maks, Ik_min og utkobling',
  description:
    'Fra trafostørrelse, u_k og kabelkjede regnes Z ved trafoklemmer, maks 3-fase Ik for bryteevne-sjekk, og Ik_min ved kursenden for å verifisere at vernet utløser i tide.',
  whenToUse:
    'Når du skal dimensjonere et TN-anlegg fra trafostørrelsen — typisk på eksamen "fra netteierdata til kursenden, vis at vernet utløser".',
  keywords: [
    'trafo',
    'TN',
    'TN-S',
    'TN-C-S',
    'Ik',
    'Ik3p',
    'kortslutning',
    'bryteevne',
    'sløyfeimpedans',
    'kursend',
    'uk',
    'kortslutningsspenning',
  ],
  source: 'NEK 400-434 / NEK 400-411',
  glyph: '⌠',
  order: 2,
};

export const TVERRSNITT_OPTIONS = TVERRSNITT_REKKE;

export type TrafoTnInput = {
  trafo_kVA: number;
  Un_linje_V: number;
  uk_pst: number;
  L_mate_m: number;
  A_mate_mm2: number;
  L_kurs_m: number;
  A_kurs_mm2: number;
  In_vern_A: number;
  karakteristikk: 'B' | 'C' | 'D';
};

const C_MAX = 1.05;
const C_MIN = 0.95;

const KARAKTERISTIKK_K: Record<'B' | 'C' | 'D', number> = {
  B: 5,
  C: 10,
  D: 20,
};

/** Returnerer kabelens motstand i Ω: R/km × L/1000. */
function kabelR_Ohm(L_m: number, R_per_km: number): number {
  return (R_per_km * L_m) / 1000;
}

/** Anbefalte bryteevne-trinn i kA — typiske bygningsanlegg. */
function bryteevnetrinn(Ik3p_A: number): {
  trinn: string;
  hint: string;
  status: 'ok' | 'warn' | 'fail' | 'info';
} {
  const Ik_kA = Ik3p_A / 1000;
  if (Ik_kA <= 4.5) {
    return {
      trinn: '4,5 kA',
      hint: 'Standard boligvern (lcs = 4,5 kA) er tilstrekkelig.',
      status: 'ok',
    };
  }
  if (Ik_kA <= 6) {
    return {
      trinn: '6 kA',
      hint: 'Velg vern med bryteevne ≥ 6 kA — vanlig for større boliger og næringsbygg.',
      status: 'info',
    };
  }
  if (Ik_kA <= 10) {
    return {
      trinn: '10 kA',
      hint: 'Industri-vern med bryteevne ≥ 10 kA påkrevd.',
      status: 'warn',
    };
  }
  if (Ik_kA <= 25) {
    return {
      trinn: '25 kA',
      hint: 'Tungindustri-vern — bryteevne ≥ 25 kA.',
      status: 'warn',
    };
  }
  return {
    trinn: '> 25 kA',
    hint: 'Svært høy kortslutningsstrøm — sjekk vernkatalog, vurder serie-kombinasjoner.',
    status: 'fail',
  };
}

export function computeTrafoTn({
  trafo_kVA,
  Un_linje_V,
  uk_pst,
  L_mate_m,
  A_mate_mm2,
  L_kurs_m,
  A_kurs_mm2,
  In_vern_A,
  karakteristikk,
}: TrafoTnInput): ModuleResult {
  if (!Number.isFinite(trafo_kVA) || trafo_kVA <= 0) {
    throw new Error('Trafostørrelsen må være > 0 kVA.');
  }
  if (!Number.isFinite(Un_linje_V) || Un_linje_V <= 0) {
    throw new Error('Linjespenningen må være > 0 V.');
  }
  if (!Number.isFinite(uk_pst) || uk_pst <= 0) {
    throw new Error('u_k må være > 0 %.');
  }
  if (!Number.isFinite(In_vern_A) || In_vern_A <= 0) {
    throw new Error('Vernets merkestrøm må være > 0 A.');
  }

  const R_mate_per_km = getResistansCu70(A_mate_mm2);
  const R_kurs_per_km = getResistansCu70(A_kurs_mm2);
  if (R_mate_per_km === undefined) {
    throw new Error(`Tverrsnitt ${A_mate_mm2} mm² for matekabel finnes ikke i tabellen.`);
  }
  if (R_kurs_per_km === undefined) {
    throw new Error(`Tverrsnitt ${A_kurs_mm2} mm² for kurskabel finnes ikke i tabellen.`);
  }

  // Trafo-impedans, sett som ren resistans for forenklet håndberegning
  const S_VA = trafo_kVA * 1000;
  const Z_trafo = (uk_pst / 100) * (Un_linje_V * Un_linje_V) / S_VA;

  // Maks 3-fase Ik ved trafoklemmer — for bryteevne-sjekk
  const Ik3p_maks = (C_MAX * Un_linje_V) / (Math.sqrt(3) * Z_trafo);

  // Kabelmotstand. For 1-fase kortslutning (fase + PE) regnes 2× (frem + tilbake).
  const R_mate = kabelR_Ohm(L_mate_m, R_mate_per_km);
  const R_kurs = kabelR_Ohm(L_kurs_m, R_kurs_per_km);

  // Z_loop ved tavla og kursend (fase-PE sløyfe, antar PE = fase tverrsnitt)
  const Z_loop_tavla = Z_trafo + 2 * R_mate;
  const Z_loop_kursend = Z_loop_tavla + 2 * R_kurs;

  // Fasespenning for TN-S 230/400: 230 V
  const Un_fase = Un_linje_V / Math.sqrt(3);

  // Ik_min ved kursend (1-fase fase-PE kortslutning, konservativ)
  const Ik_min_kursend = (C_MIN * Un_fase) / Z_loop_kursend;

  // Krav: vernet utløser
  const k = KARAKTERISTIKK_K[karakteristikk];
  const Ia = k * In_vern_A;
  const utkoblingOk = Ik_min_kursend >= Ia;

  const bryteevne = bryteevnetrinn(Ik3p_maks);

  const verdict: ModuleResult['verdict'] = utkoblingOk
    ? {
        status: 'ok',
        text: `Vernet utløser i tide — Ik_min ${formatNumber(Ik_min_kursend, 0)} A ≥ I_a ${formatNumber(Ia, 0)} A`,
      }
    : {
        status: 'fail',
        text: `Ik_min ${formatNumber(Ik_min_kursend, 0)} A er for lav — vernet utløser ikke ved I_a ${formatNumber(Ia, 0)} A`,
      };

  const recommendations: string[] = [];
  if (!utkoblingOk) {
    const Z_maks = (C_MIN * Un_fase) / Ia;
    const Z_overskudd = Z_loop_kursend - Z_maks;
    recommendations.push(
      `Sløyfeimpedansen må reduseres med ${formatNumber(Z_overskudd, 3)} Ω (maks tillatt ${formatNumber(Z_maks, 3)} Ω).`,
    );
    if (karakteristikk !== 'B') {
      recommendations.push(
        'Vurder å bytte fra C/D til B-karakteristikk — gir lavere I_a og dermed mindre krav til Ik_min.',
      );
    }
    recommendations.push(
      'Øk tverrsnittet på kurskabelen — gir lavere R og dermed høyere Ik_min.',
      'Reduser kabellengden eller flytt fordelingen nærmere lasten.',
    );
  }
  if (bryteevne.status === 'warn' || bryteevne.status === 'fail') {
    recommendations.push(
      `Maks Ik3p (${formatNumber(Ik3p_maks / 1000, 1)} kA) krever vern med bryteevne ≥ ${bryteevne.trinn} (industri/tavle-vern).`,
    );
  }

  const sections: ModuleResult['sections'] = [
    {
      title: 'Trafo og hovedimpedans',
      rows: [
        { label: 'Trafostørrelse', value: formatNumber(trafo_kVA, 0), unit: 'kVA' },
        { label: 'Kortslutningsspenning u_k', value: formatNumber(uk_pst, 1), unit: '%' },
        { label: 'Nominell linjespenning', value: formatNumber(Un_linje_V, 0), unit: 'V' },
        {
          label: 'Z_trafo',
          value: formatNumber(Z_trafo, 4),
          unit: 'Ω',
          hint: 'Z_trafo = (u_k / 100) × U_n² / S — forenklet som ren resistans.',
        },
        {
          label: 'Ik3p_maks ved trafoklemmer',
          value: formatNumber(Ik3p_maks, 0),
          unit: 'A',
          hint: 'Maks 3-fase kortslutningsstrøm — brukes for bryteevne-vurdering.',
          status: 'info',
        },
        {
          label: 'Anbefalt bryteevne',
          value: bryteevne.trinn,
          hint: bryteevne.hint,
          status: bryteevne.status,
        },
      ],
    },
    {
      title: 'Kabelkjede til kursen',
      rows: [
        {
          label: 'Matekabel',
          value: `${L_mate_m} m × ${A_mate_mm2} mm²`,
          hint: `R/km Cu @ 70 °C = ${formatNumber(R_mate_per_km, 3)} Ω/km → R_mate = ${formatNumber(R_mate, 4)} Ω`,
        },
        {
          label: 'Kurskabel',
          value: `${L_kurs_m} m × ${A_kurs_mm2} mm²`,
          hint: `R/km Cu @ 70 °C = ${formatNumber(R_kurs_per_km, 3)} Ω/km → R_kurs = ${formatNumber(R_kurs, 4)} Ω`,
        },
        {
          label: 'Z_loop ved tavla',
          value: formatNumber(Z_loop_tavla, 4),
          unit: 'Ω',
          hint: 'Z_loop = Z_trafo + 2 × R_mate (fase + PE går samme vei).',
        },
        {
          label: 'Z_loop ved kursend',
          value: formatNumber(Z_loop_kursend, 4),
          unit: 'Ω',
          hint: 'Z_loop_kursend = Z_loop_tavla + 2 × R_kurs.',
        },
      ],
      note: 'Antar at PE-leder har samme tverrsnitt som fasen. Bruker R_70 °C for å være konservativ.',
    },
    {
      title: 'Utkobling ved kursenden',
      rows: [
        {
          label: 'Karakteristikk + I_n',
          value: `${karakteristikk}${formatNumber(In_vern_A, 0)}`,
          hint: `k = ${k} × I_n`,
        },
        {
          label: 'Utløserstrøm I_a',
          value: formatNumber(Ia, 0),
          unit: 'A',
          hint: `I_a = ${k} × ${formatNumber(In_vern_A, 0)} A`,
        },
        {
          label: 'Ik_min (1-fase, fase-PE)',
          value: formatNumber(Ik_min_kursend, 0),
          unit: 'A',
          hint: `Ik_min = (C_min × U_fase) / Z_loop_kursend = (${C_MIN} × ${formatNumber(Un_fase, 0)}) / ${formatNumber(Z_loop_kursend, 3)}`,
          status: utkoblingOk ? 'ok' : 'fail',
        },
      ],
    },
  ];

  // Marginal-info som ekstra rad i siste seksjon
  const margin = (Ik_min_kursend / Ia) * 100;
  const marginRow: ModuleResultRow = {
    label: 'Margin Ik_min / I_a',
    value: formatNumber(margin, 0),
    unit: '%',
    hint: 'Over 100 % betyr at vernet utløser. Under 100 % = ikke godkjent.',
    status: utkoblingOk ? (margin >= 150 ? 'ok' : 'warn') : 'fail',
  };
  sections[2].rows.push(marginRow);

  return { verdict, sections, recommendations };
}
