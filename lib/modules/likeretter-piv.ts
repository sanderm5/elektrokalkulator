import { formatNumber } from '../format';
import type { ModuleMeta, ModuleResult, ModuleResultRow } from './types';

export const LIKERETTER_PIV_META: ModuleMeta = {
  id: 'likeretter-piv',
  slug: 'likeretter-piv',
  category: 'anlegg-system',
  title: 'PIV per likeretter-topologi',
  subtitle: 'Velg topologi → U_dc, U_topp, PIV per diode',
  description:
    'Hurtig oversikt over hva hver diode må tåle (Peak Inverse Voltage) for de fire vanlige likeretter-topologiene. Også U_dc (middelverdi) og topp-spenning samt anbefalt dimensjoneringsmargin.',
  whenToUse:
    'På ELE2 ved oppgaver om strømforsyninger og frekvensomformere — særlig "hvilken PIV må dioden tåle". Også brukbart ved dimensjonering av reservedeler.',
  keywords: [
    'PIV',
    'peak inverse voltage',
    'likeretter',
    'diodebro',
    'halvbølge',
    'helbølge',
    'midtuttak',
    'trefase bro',
    'B6',
    'sperrespenning',
  ],
  source: 'ELE2 elektroteori',
  glyph: '⇒',
  order: 3,
};

export type Topologi = 'halvbolge' | 'helbolge-bro' | 'midtuttak' | 'trefase-bro';

export const TOPOLOGI_OPTIONS: ReadonlyArray<{ value: Topologi; label: string }> = [
  { value: 'halvbolge', label: 'Halvbølge enfase (1 diode)' },
  { value: 'helbolge-bro', label: 'Helbølge bro enfase (4 dioder)' },
  { value: 'midtuttak', label: 'Helbølge med midtuttak (2 dioder)' },
  { value: 'trefase-bro', label: 'Trefase bro / B6 (6 dioder)' },
];

type TopologiData = {
  label: string;
  beskrivelse: string;
  /** U_dc / U_rms (eller for trefase: U_dc / U_L) */
  U_dc_faktor: number;
  /** PIV / U_rms (eller PIV / U_L) — faktor for hva hver diode må tåle. */
  PIV_faktor: number;
  /** Antall dioder. */
  antall_dioder: number;
  /** I_diode (middelverdi) som faktor av I_dc — hvor stor del av tiden leder hver diode. */
  I_diode_faktor: number;
  /** Bruker U_L (linjespenning) for trefase, ellers U_rms. */
  bruk_linjespenning: boolean;
};

const TOPOLOGI_DATA: Record<Topologi, TopologiData> = {
  halvbolge: {
    label: 'Halvbølge enfase',
    beskrivelse: 'Én diode slipper kun positiv halvperiode gjennom — høy rippel, dårlig utnyttelse.',
    U_dc_faktor: 0.45,
    PIV_faktor: Math.SQRT2,
    antall_dioder: 1,
    I_diode_faktor: 1,
    bruk_linjespenning: false,
  },
  'helbolge-bro': {
    label: 'Helbølge bro enfase',
    beskrivelse: 'Diodebro med 4 dioder — likeretter begge halvperioder. Standard i DC-forsyninger.',
    U_dc_faktor: 0.9,
    PIV_faktor: Math.SQRT2,
    antall_dioder: 4,
    I_diode_faktor: 0.5,
    bruk_linjespenning: false,
  },
  midtuttak: {
    label: 'Helbølge med midtuttak',
    beskrivelse:
      'To dioder + trafosekundær med midtuttak. Hver diode ser fra topp-A til negativ topp-B → høyere PIV-krav.',
    U_dc_faktor: 0.9,
    PIV_faktor: 2 * Math.SQRT2,
    antall_dioder: 2,
    I_diode_faktor: 0.5,
    bruk_linjespenning: false,
  },
  'trefase-bro': {
    label: 'Trefase bro (B6)',
    beskrivelse: 'Seks dioder — gir mye glattere DC. Standard i frekvensomformere og store DC-forsyninger.',
    U_dc_faktor: 1.35,
    PIV_faktor: Math.SQRT2,
    antall_dioder: 6,
    I_diode_faktor: 1 / 3,
    bruk_linjespenning: true,
  },
};

export type PivInput = {
  topologi: Topologi;
  U_rms_V: number;
  I_dc_A?: number;
};

const MARGIN_PIV = 1.5;

export function computeLikeretterPiv({ topologi, U_rms_V, I_dc_A }: PivInput): ModuleResult {
  if (!Number.isFinite(U_rms_V) || U_rms_V <= 0) {
    throw new Error('Inngangsspenning må være > 0 V.');
  }
  const data = TOPOLOGI_DATA[topologi];
  const U_dc = data.U_dc_faktor * U_rms_V;
  const U_topp = Math.SQRT2 * U_rms_V;
  const PIV = data.PIV_faktor * U_rms_V;
  const PIV_anbefalt = PIV * MARGIN_PIV;
  const spenningsLabel = data.bruk_linjespenning ? 'Linjespenning U_L' : 'Effektivverdi U_rms';

  const rows: ModuleResultRow[] = [
    {
      label: spenningsLabel,
      value: formatNumber(U_rms_V, 1),
      unit: 'V',
    },
    {
      label: 'U_dc (middelverdi)',
      value: formatNumber(U_dc, 1),
      unit: 'V',
      hint: `U_dc = ${formatNumber(data.U_dc_faktor, 2)} × U`,
      status: 'info',
    },
    {
      label: 'U_topp (uten kondensator)',
      value: formatNumber(U_topp, 1),
      unit: 'V',
      hint: data.bruk_linjespenning
        ? 'U_topp = √2 × U_L for hvert linje-par.'
        : 'U_topp = √2 × U_rms (toppspenning på AC-siden).',
    },
    {
      label: 'PIV per diode',
      value: formatNumber(PIV, 1),
      unit: 'V',
      hint: `PIV = ${formatNumber(data.PIV_faktor, 2)} × U — sperrespenning hver diode må tåle.`,
      status: 'info',
    },
    {
      label: `Anbefalt PIV-margin (×${MARGIN_PIV})`,
      value: formatNumber(PIV_anbefalt, 1),
      unit: 'V',
      hint: 'Velg diode med PIV-tåleevne minst 1,5× faktisk verdi for transient-sikkerhet.',
      status: 'ok',
    },
  ];

  const sections: ModuleResult['sections'] = [
    {
      title: data.label,
      rows,
      note: data.beskrivelse,
    },
    {
      title: 'Diode-spesifikasjon',
      rows: [
        {
          label: 'Antall dioder',
          value: String(data.antall_dioder),
        },
        {
          label: 'I_diode (middelverdi)',
          value: Number.isFinite(I_dc_A) && I_dc_A! > 0
            ? formatNumber(I_dc_A! * data.I_diode_faktor, 2)
            : `${formatNumber(data.I_diode_faktor, 3)} × I_dc`,
          unit: Number.isFinite(I_dc_A) && I_dc_A! > 0 ? 'A' : '',
          hint: `Hver diode leder ${formatNumber(data.I_diode_faktor * 100, 0)} % av tiden.`,
        },
      ],
    },
  ];

  return {
    verdict: {
      status: 'info',
      text: `${data.label}: PIV ${formatNumber(PIV, 0)} V per diode`,
    },
    sections,
    recommendations: [
      `Velg diode med spesifisert PIV ≥ ${formatNumber(PIV_anbefalt, 0)} V for trygg drift med spennings-transienter.`,
      Number.isFinite(I_dc_A) && I_dc_A! > 0
        ? `Velg diode med I_F (forward middelverdi) ≥ ${formatNumber(I_dc_A! * data.I_diode_faktor * 1.5, 2)} A (med 50 % margin).`
        : 'Oppgi DC-strøm for å få anbefalt I_F per diode.',
      data.bruk_linjespenning
        ? 'Husk at B6 brukes i frekvensomformere — DC-bus blir typisk 540 V ved 400 V AC inn.'
        : 'Med glatningskondensator nærmer U_dc seg U_topp ved lav last.',
    ],
  };
}
