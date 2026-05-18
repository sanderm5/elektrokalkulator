import { formatNumber } from '../format';
import type { ModuleMeta, ModuleResult } from './types';

export const TRAFO_IT_META: ModuleMeta = {
  id: 'trafo-it',
  slug: 'trafo-it',
  category: 'anlegg-system',
  title: 'Trafo til IT-nett',
  subtitle: 'I_jord, U_b og maks R_a',
  description:
    'Beregner kapasitiv jordfeilstrøm fra trafostørrelsen og finner berøringsspenningen U_b ved den jordingsmotstanden anlegget faktisk har. Sjekker mot 50 V (tørt) eller 25 V (vått) iht. NEK 400-411.6 og foreslår maks R_a og passende beskyttelse (IMD + RCD).',
  whenToUse:
    'Når trafostørrelse + jordingsmotstand er kjent og du skal vise at IT-anlegget er trygt mot første jordfeil. Vanlig på eksamen ved tema "byggets stikkontaktsanlegg er IT — vis at U_b ≤ 50 V".',
  keywords: [
    'trafo',
    'IT',
    'IT-nett',
    'berøringsspenning',
    'jordfeil',
    'Ub',
    'I_jord',
    'IMD',
    'isolasjonsovervåkning',
    'kapasitiv strøm',
  ],
  source: 'NEK 400-411.6 / NEK 400-413',
  glyph: '⊺',
  order: 1,
};

export type TrafoItInput = {
  trafo_kVA: number;
  faktor_mA_per_kVA: number;
  Ra_Ohm: number;
  miljo: 'tort' | 'vatt';
};

export const FAKTOR_PRESETS = [
  { value: 0.5, label: '0,5 mA/kVA — lite/eldre IT-nett' },
  { value: 2, label: '2 mA/kVA — typisk industri' },
  { value: 6, label: '6 mA/kVA — stort anlegg, mye kapasitiv kobling' },
] as const;

function anbefaltIMD(trafo_kVA: number): string {
  if (trafo_kVA <= 50) {
    return 'IMD-modul for små anlegg (f.eks. Bender ISO685-S, ABB CM-IWM)';
  }
  if (trafo_kVA <= 500) {
    return 'IMD med varslingsutgang for tavlemontasje (Bender IRDH575, ABB CM-IWN)';
  }
  return 'IMD i industriversjon med BMS-integrasjon (Bender ISOMETER iso685 industri)';
}

function anbefaltRCD(I_jord_mA: number): string[] {
  const anbefalinger: string[] = [];
  if (I_jord_mA < 30) {
    anbefalinger.push('Personvern: RCD 30 mA på stikkontaktkurser ≤ 32 A iht. NEK 400-415.1.');
  } else if (I_jord_mA < 100) {
    anbefalinger.push(
      `Personvern: RCD 30 mA fortsatt nødvendig på sluttkurser. Verifiser at kapasitiv I_jord (${formatNumber(I_jord_mA, 0)} mA) ikke gir uønsket utløsning.`,
    );
  } else {
    anbefalinger.push(
      `Forventet kapasitiv I_jord (${formatNumber(I_jord_mA, 0)} mA) gir risiko for uønsket utløsning av 30 mA-RCD. Vurder type B (allstrømsfølsom) eller 100/300 mA grupperingsvern.`,
    );
  }
  anbefalinger.push('Hovedvern/gruppevern: 300 mA RCD som backup ved feil i IMD.');
  return anbefalinger;
}

export function computeTrafoIt({
  trafo_kVA,
  faktor_mA_per_kVA,
  Ra_Ohm,
  miljo,
}: TrafoItInput): ModuleResult {
  if (!Number.isFinite(trafo_kVA) || trafo_kVA <= 0) {
    throw new Error('Trafostørrelsen må være > 0 kVA.');
  }
  if (!Number.isFinite(faktor_mA_per_kVA) || faktor_mA_per_kVA <= 0) {
    throw new Error('Faktor for I_jord må være > 0 mA/kVA.');
  }
  if (!Number.isFinite(Ra_Ohm) || Ra_Ohm < 0) {
    throw new Error('Overgangsmotstand R_a må være ≥ 0 Ω.');
  }

  const I_jord_mA = trafo_kVA * faktor_mA_per_kVA;
  const I_jord_A = I_jord_mA / 1000;
  const U_b = I_jord_A * Ra_Ohm;
  const grense_V = miljo === 'vatt' ? 25 : 50;
  const ok = U_b <= grense_V;
  const maks_Ra = I_jord_A > 0 ? grense_V / I_jord_A : Number.POSITIVE_INFINITY;

  const verdict: ModuleResult['verdict'] = ok
    ? {
        status: 'ok',
        text: `Berøringsspenning ${formatNumber(U_b, 1)} V ≤ ${grense_V} V — trygt`,
      }
    : {
        status: 'fail',
        text: `Berøringsspenning ${formatNumber(U_b, 1)} V overskrider ${grense_V} V`,
      };

  const recommendations: string[] = [];
  if (!ok) {
    recommendations.push(
      `Reduser jordingsmotstanden til ≤ ${formatNumber(maks_Ra, 2)} Ω for å holde U_b under ${grense_V} V.`,
      'Tiltak: tilleggs-elektrode, lengre eller dypere jordspyd, sammenkobling til byggets utjevningssystem.',
    );
  }
  recommendations.push(
    `Isolasjonsovervåkning (IMD) er obligatorisk for IT-nett iht. NEK 400-413.1.1: ${anbefaltIMD(trafo_kVA)}.`,
  );
  recommendations.push(...anbefaltRCD(I_jord_mA));

  return {
    verdict,
    sections: [
      {
        title: 'Forutsigelse av jordfeilstrøm',
        rows: [
          { label: 'Trafostørrelse', value: formatNumber(trafo_kVA, 0), unit: 'kVA' },
          {
            label: 'Faktor I_jord per kVA',
            value: formatNumber(faktor_mA_per_kVA, 1),
            unit: 'mA/kVA',
            hint: 'Eldre/lite anlegg: 0,5 — typisk industri: 2 — stort anlegg: 6.',
          },
          {
            label: 'Beregnet I_jord',
            value: formatNumber(I_jord_mA, 1),
            unit: 'mA',
            hint: 'Kapasitiv strøm som flyter i jordfeil-banen ved første feil.',
          },
        ],
      },
      {
        title: 'Berøringsspenning U_b',
        rows: [
          { label: 'Overgangsmotstand R_a', value: formatNumber(Ra_Ohm, 2), unit: 'Ω' },
          {
            label: 'U_b = I_jord × R_a',
            value: formatNumber(U_b, 2),
            unit: 'V',
            status: ok ? 'ok' : 'fail',
          },
          {
            label: 'Grenseverdi',
            value: `${grense_V} V`,
            hint:
              miljo === 'vatt'
                ? 'Vått miljø: bad, utendørs, fuktige rom — krav 25 V.'
                : 'Tørt miljø — normal grense 50 V iht. NEK 400-411.6.',
            status: 'info',
          },
          {
            label: 'Maks tillatt R_a',
            value: Number.isFinite(maks_Ra) ? formatNumber(maks_Ra, 2) : '∞',
            unit: 'Ω',
            hint: `R_a ≤ ${grense_V} / I_jord for å holde U_b under grensen.`,
            status: ok ? 'info' : 'fail',
          },
        ],
        note:
          'I IT-nett oppstår ikke farlig berøringsspenning ved første jordfeil dersom R_a er liten nok. Ved andre jordfeil må vernet bryte.',
      },
    ],
    recommendations,
  };
}
