import { formatNumber } from '../format';
import { getIz, type Forlegging, type KabelType } from '../calc/iz-lookup';
import { getResistansCu70 } from '../tables/resistans';
import type {
  ModuleMeta,
  ModuleResult,
  ModuleResultRow,
  ModuleResultSection,
  ModuleStatus,
} from './types';

export const INSTALLASJONSANALYSE_META: ModuleMeta = {
  id: 'installasjonsanalyse',
  slug: 'installasjonsanalyse',
  category: 'anlegg-system',
  title: 'Sammenhengende installasjonsanalyse',
  subtitle: 'Hele anlegget i én flyt — krav 1, krav 2, ΔU, Ik_min og utkobling',
  description:
    'Tar inn trafo, matekabel og alle kurser, og kjører helhetlig sjekk: belastning, kabelvalg (krav 1 og 2), spenningsfall, Ik_min, utkoblingstid, termisk kortslutningstoleranse og forenklet selektivitet. Resultatet er en punktvis rapport per kurs + samlet status.',
  whenToUse:
    'Når en oppgave gir hele anlegget (energisentral, bolig med alle kurser, industri) og krever at du verifiserer at HELE installasjonen er forskriftsmessig. Brukes ved å bygge opp kursene én etter én.',
  keywords: [
    'installasjonsanalyse',
    'helhet',
    'krav 1',
    'krav 2',
    'kurs',
    'samtidighet',
    'selektivitet',
    'I²t',
    'termisk',
    'energisentral',
    'samlet sjekk',
  ],
  source: 'NEK 400-4-43 / NEK 400-4-41 / NEK 400-525',
  glyph: '⌗',
  order: 5,
};

export type Kurs = {
  id: string;
  navn: string;
  P_kW: number;
  cos_phi: number;
  fas: '1-fas' | '3-fas';
  L_m: number;
  A_mm2: number;
  kabel: KabelType;
  forlegging: Forlegging;
  vern: { karakteristikk: 'B' | 'C' | 'D'; In_A: number };
  samtidighet: number;
  kontinuerlig: boolean;
};

export type AnalyseInput = {
  system: 'TN-S' | 'IT';
  trafo_kVA: number;
  uk_pst: number;
  Un_linje_V: number;
  matekabel: { L_m: number; A_mm2: number };
  kurser: Kurs[];
};

const KARAKTERISTIKK_K: Record<'B' | 'C' | 'D', number> = {
  B: 5,
  C: 10,
  D: 20,
};

// k-verdier (K²S²) for termisk dimensjonering iht. NEK 400-434
const K_VERDIER: Record<KabelType, number> = {
  'PFXP-2': 115,
  'PFXP-3': 115,
  'TFXP-2': 143,
  'TFXP-3': 143,
};

function kabelR(L_m: number, A_mm2: number): number {
  const R_per_km = getResistansCu70(A_mm2);
  if (R_per_km === undefined) return Number.NaN;
  return (R_per_km * L_m) / 1000;
}

type KursAnalyse = {
  kurs: Kurs;
  Ib: number;
  Ib_med_samtidighet: number;
  Iz: number | undefined;
  krav1Ok: boolean;
  krav2Ok: boolean;
  In_effektiv: number;
  delta_U_V: number;
  delta_U_pct: number;
  Ik_min: number;
  Ia: number;
  utkoblingOk: boolean;
  termiskOk: boolean | null;
  Z_total: number;
  status: ModuleStatus;
  feilmeldinger: string[];
};

function statusFor(ok: boolean): ModuleStatus {
  return ok ? 'ok' : 'fail';
}

export function computeInstallasjonsanalyse(input: AnalyseInput): ModuleResult {
  const { system, trafo_kVA, uk_pst, Un_linje_V, matekabel, kurser } = input;

  if (kurser.length === 0) {
    throw new Error('Legg til minst én kurs for å gjøre analyse.');
  }
  if (!Number.isFinite(trafo_kVA) || trafo_kVA <= 0) {
    throw new Error('Trafostørrelsen må være > 0 kVA.');
  }
  if (!Number.isFinite(uk_pst) || uk_pst <= 0) {
    throw new Error('u_k må være > 0 %.');
  }
  if (!Number.isFinite(Un_linje_V) || Un_linje_V <= 0) {
    throw new Error('Linjespenningen må være > 0 V.');
  }

  // Trafo og mate-impedans (fase-PE sløyfe)
  const S_VA = trafo_kVA * 1000;
  const Z_trafo = (uk_pst / 100) * (Un_linje_V * Un_linje_V) / S_VA;
  const R_mate = kabelR(matekabel.L_m, matekabel.A_mm2);
  if (!Number.isFinite(R_mate)) {
    throw new Error(`Tverrsnitt ${matekabel.A_mm2} mm² for matekabel ikke i tabellen.`);
  }
  const Z_loop_tavla = Z_trafo + 2 * R_mate;

  // Fasespenninger
  const Un_fase = system === 'IT' ? Un_linje_V : Un_linje_V / Math.sqrt(3);
  const C_min = 0.95;

  const analyser: KursAnalyse[] = kurser.map((kurs) => {
    const feilmeldinger: string[] = [];

    // Belastningsstrøm Ib
    let Ib: number;
    if (kurs.fas === '1-fas') {
      Ib = (kurs.P_kW * 1000) / (Un_fase * kurs.cos_phi);
    } else {
      Ib = (kurs.P_kW * 1000) / (Math.sqrt(3) * Un_linje_V * kurs.cos_phi);
    }
    const Ib_med_samtidighet = Ib * kurs.samtidighet;

    // Iz fra tabell
    const Iz = getIz(kurs.kabel, kurs.A_mm2, kurs.forlegging);
    if (Iz === undefined) {
      feilmeldinger.push(
        `Iz for ${kurs.kabel} ${kurs.A_mm2} mm² ${kurs.forlegging} mangler i tabellen — verifiser manuelt.`,
      );
    }

    // 80 %-regel for kontinuerlige laster (NEK 400-4-43)
    const In_effektiv = kurs.kontinuerlig ? kurs.vern.In_A * 0.8 : kurs.vern.In_A;

    // Krav 1: Ib ≤ In ≤ Iz
    const krav1Ok = Ib <= In_effektiv && (Iz === undefined ? false : kurs.vern.In_A <= Iz);
    if (!(Ib <= In_effektiv)) {
      feilmeldinger.push(
        `Ib (${formatNumber(Ib, 1)} A) overskrider effektivt In (${formatNumber(In_effektiv, 1)} A).`,
      );
    }
    if (Iz !== undefined && kurs.vern.In_A > Iz) {
      feilmeldinger.push(
        `In (${formatNumber(kurs.vern.In_A, 0)} A) overskrider kabelens Iz (${formatNumber(Iz, 1)} A).`,
      );
    }

    // Krav 2: I2 ≤ 1,45 × Iz, der I2 ≈ 1,45 × In for MCB iht. IEC 60898
    // Forenkles: In ≤ Iz (siden 1,45 × In ≤ 1,45 × Iz ↔ In ≤ Iz)
    const krav2Ok = Iz === undefined ? false : kurs.vern.In_A <= Iz;

    // Spenningsfall hele kjeden (frem + tilbake)
    const R_kurs = kabelR(kurs.L_m, kurs.A_mm2);
    if (!Number.isFinite(R_kurs)) {
      feilmeldinger.push(
        `Tverrsnitt ${kurs.A_mm2} mm² for kurs "${kurs.navn}" mangler i tabellen.`,
      );
    }
    const R_mate_kurs = R_mate + R_kurs;
    const delta_U_V =
      kurs.fas === '1-fas'
        ? 2 * Ib_med_samtidighet * R_mate_kurs * kurs.cos_phi
        : Math.sqrt(3) * Ib_med_samtidighet * R_mate_kurs * kurs.cos_phi;
    const delta_U_pct = (delta_U_V / Un_linje_V) * 100;

    // Ik_min ved kursend (1-fase fase-PE)
    const Z_total = Z_loop_tavla + 2 * R_kurs;
    const Ik_min = (C_min * Un_fase) / Z_total;

    // Utkoblingstid
    const Ia = KARAKTERISTIKK_K[kurs.vern.karakteristikk] * kurs.vern.In_A;
    const utkoblingOk = Ik_min >= Ia;
    if (!utkoblingOk) {
      feilmeldinger.push(
        `Ik_min (${formatNumber(Ik_min, 0)} A) er under I_a (${formatNumber(Ia, 0)} A) — vernet utløser ikke i tide.`,
      );
    }

    // Termisk: I²t ≤ k²S² (forenklet — vurder med utkoblingstid ≈ 0,1 s ved Ik)
    // For B/C/D MCB med kortslutning: t ≈ 0,1 s
    const k = K_VERDIER[kurs.kabel];
    const Ik_for_term = Number.isFinite(Ik_min) ? Ik_min : 0;
    const I2t_kabel = Math.pow(k * kurs.A_mm2, 2);
    const I2t_kortslutning = Ik_for_term * Ik_for_term * 0.1;
    const termiskOk = Number.isFinite(Ik_for_term) ? I2t_kortslutning <= I2t_kabel : null;
    if (termiskOk === false) {
      feilmeldinger.push(
        'Termisk kortslutningstoleranse ikke oppfylt — øk tverrsnittet eller velg vern med raskere utkobling.',
      );
    }

    // Spenningsfall-grense (3 % lys, 5 % motorlast)
    const dU_grense = 5;
    if (delta_U_pct > dU_grense) {
      feilmeldinger.push(
        `Spenningsfall ${formatNumber(delta_U_pct, 1)} % overskrider ${dU_grense} %.`,
      );
    }

    // Samlet status
    let status: ModuleStatus = 'ok';
    if (
      !krav1Ok ||
      !krav2Ok ||
      !utkoblingOk ||
      delta_U_pct > dU_grense ||
      termiskOk === false
    ) {
      status = 'fail';
    } else if (delta_U_pct > dU_grense * 0.8 || Ik_min < Ia * 1.2) {
      status = 'warn';
    }

    return {
      kurs,
      Ib,
      Ib_med_samtidighet,
      Iz,
      krav1Ok,
      krav2Ok,
      In_effektiv,
      delta_U_V,
      delta_U_pct,
      Ik_min,
      Ia,
      utkoblingOk,
      termiskOk,
      Z_total,
      status,
      feilmeldinger,
    };
  });

  // Hovedlast: sum av Ib × samtidighet for alle kurser (sterkt forenklet, men gir indikasjon)
  const total_P_kW = kurser.reduce((sum, k) => sum + k.P_kW * k.samtidighet, 0);
  const total_Ib =
    total_P_kW * 1000 /
    (system === 'IT' ? Un_linje_V * 0.9 : Math.sqrt(3) * Un_linje_V * 0.9);

  // Forenklet selektivitet: hovedvern må ha ≥ 1,6 × største kursvern
  const hoyesteIn = Math.max(...kurser.map((k) => k.vern.In_A));
  const selektivitetsAnbefaling = Math.ceil(hoyesteIn * 1.6);

  // Bygg seksjoner
  const sections: ModuleResultSection[] = [];

  sections.push({
    title: 'Hovedlast og system',
    rows: [
      { label: 'System', value: system },
      { label: 'Trafostørrelse', value: formatNumber(trafo_kVA, 0), unit: 'kVA' },
      {
        label: 'Z_trafo + matekabel ved tavla',
        value: formatNumber(Z_loop_tavla, 4),
        unit: 'Ω',
      },
      {
        label: 'Total dimensjonerende effekt (m/ samtidighet)',
        value: formatNumber(total_P_kW, 1),
        unit: 'kW',
        hint: 'Sum av P × c per kurs.',
      },
      {
        label: 'Beregnet hovedstrøm Ib',
        value: formatNumber(total_Ib, 0),
        unit: 'A',
        hint: 'Forenklet: total_P / (√3 × U_n × 0,9). Bruk korreksjon ved planlegging.',
      },
      {
        label: 'Anbefalt hovedvern',
        value: `${selektivitetsAnbefaling} A`,
        hint: `Selektivt mot største kursvern (${hoyesteIn} A × 1,6).`,
        status: 'info',
      },
    ],
  });

  // Per-kurs seksjoner
  analyser.forEach((a) => {
    const rows: ModuleResultRow[] = [
      {
        label: 'Belastningsstrøm Ib',
        value: formatNumber(a.Ib, 2),
        unit: 'A',
        hint:
          a.kurs.fas === '1-fas'
            ? 'Ib = P / (U_fase × cos φ)'
            : 'Ib = P / (√3 × U_L × cos φ)',
      },
      {
        label: 'Effektiv In (etter 80 %-regel)',
        value: formatNumber(a.In_effektiv, 1),
        unit: 'A',
        hint: a.kurs.kontinuerlig
          ? `In_effektiv = 0,8 × ${a.kurs.vern.In_A} A (kontinuerlig last).`
          : 'Ikke kontinuerlig — full In brukes.',
      },
      {
        label: 'Kabelens Iz',
        value: a.Iz !== undefined ? formatNumber(a.Iz, 1) : '—',
        unit: 'A',
        hint: `${a.kurs.kabel} ${a.kurs.A_mm2} mm², forlegging ${a.kurs.forlegging}`,
      },
      {
        label: 'Krav 1: Ib ≤ In ≤ Iz',
        value: a.krav1Ok ? 'Oppfylt' : 'IKKE oppfylt',
        status: statusFor(a.krav1Ok),
      },
      {
        label: 'Krav 2: In ≤ Iz',
        value: a.krav2Ok ? 'Oppfylt' : 'IKKE oppfylt',
        status: statusFor(a.krav2Ok),
      },
      {
        label: 'Spenningsfall ΔU',
        value: `${formatNumber(a.delta_U_V, 1)} V / ${formatNumber(a.delta_U_pct, 2)} %`,
        status:
          a.delta_U_pct > 5 ? 'fail' : a.delta_U_pct > 4 ? 'warn' : 'ok',
        hint: 'Grense 3 % (lys) eller 5 % (motorlast) iht. NEK 400-525.',
      },
      {
        label: 'Ik_min ved kursend',
        value: formatNumber(a.Ik_min, 0),
        unit: 'A',
        status: a.utkoblingOk ? 'ok' : 'fail',
      },
      {
        label: 'Utløserstrøm I_a',
        value: formatNumber(a.Ia, 0),
        unit: 'A',
        hint: `I_a = ${KARAKTERISTIKK_K[a.kurs.vern.karakteristikk]} × ${a.kurs.vern.In_A} A`,
      },
      {
        label: 'Termisk kontroll I²t',
        value:
          a.termiskOk === null
            ? '—'
            : a.termiskOk
            ? 'Oppfylt'
            : 'IKKE oppfylt',
        status: a.termiskOk === null ? 'info' : statusFor(a.termiskOk),
        hint: `k²S² for ${a.kurs.kabel} (k = ${K_VERDIER[a.kurs.kabel]}, S = ${a.kurs.A_mm2}).`,
      },
    ];

    sections.push({
      title: `Kurs: ${a.kurs.navn}  ·  ${a.kurs.vern.karakteristikk}${a.kurs.vern.In_A}, ${a.kurs.A_mm2} mm² ${a.kurs.kabel}`,
      rows,
      note:
        a.feilmeldinger.length > 0
          ? a.feilmeldinger.join(' ')
          : 'Alle hovedkrav oppfylt for denne kursen.',
    });
  });

  // Selektivitets-seksjon (forenklet)
  sections.push({
    title: 'Selektivitet (forenklet)',
    rows: [
      {
        label: 'Forhold hovedvern : største kurs',
        value: `${selektivitetsAnbefaling} : ${hoyesteIn}`,
        hint: 'Anbefalt minimum 1,6:1 for å oppnå strømselektivitet.',
        status: selektivitetsAnbefaling / hoyesteIn >= 1.6 ? 'ok' : 'warn',
      },
    ],
    note:
      'Reell selektivitetsanalyse krever kombinasjons-tabeller fra vernsleverandøren (ABB, Eaton, Schneider). Dette er en konservativ tommelfingerregel — for total selektivitet sjekk produsentens datablad.',
  });

  // Helhets-status
  const allOk = analyser.every((a) => a.status === 'ok');
  const anyFail = analyser.some((a) => a.status === 'fail');
  const verdict: ModuleResult['verdict'] = anyFail
    ? {
        status: 'fail',
        text: `${analyser.filter((a) => a.status === 'fail').length} av ${analyser.length} kurser har avvik`,
      }
    : allOk
    ? {
        status: 'ok',
        text: `Alle ${analyser.length} kurser oppfyller krav 1, krav 2, ΔU, Ik_min og termisk kontroll`,
      }
    : {
        status: 'warn',
        text: 'Alle krav oppfylt, men noen kurser har lav margin',
      };

  const recommendations: string[] = [];
  analyser.forEach((a) => {
    if (a.feilmeldinger.length > 0) {
      recommendations.push(`${a.kurs.navn}: ${a.feilmeldinger.join(' ')}`);
    }
  });
  if (recommendations.length === 0 && verdict.status === 'ok') {
    recommendations.push(
      'Anlegget er klart for sluttkontroll iht. NEK 400-6. Husk å dokumentere måleverdier i samsvarserklæringen.',
    );
  }

  return { verdict, sections, recommendations };
}
