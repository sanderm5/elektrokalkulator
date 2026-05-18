import type { Formula } from './types';

/**
 * Nettsystemer er mer kvalitative enn formel-baserte. Vi lager
 * "kalkulatorer" som hjelper for det som er beregnbart, men det
 * meste av læringen ligger i forklaringene.
 */
export const NETTSYSTEMER_FORMULAS: Formula[] = [
  {
    id: 'driftsjording',
    category: 'nettsystemer',
    title: 'Driftsjording (R_b) — krav',
    subtitle: 'U_F = I_jord · R_b',
    latex: 'U_{F} = I_{\\mathrm{jord}} \\cdot R_{b}',
    description:
      'Driftsjordingen R_b skal være lav nok til at fasespenningen i et IT-system ikke gir farlig berøringsspenning ved første jordfeil. Sammen med beskyttelsesjordingen R_a definerer den sikkerhetsmarginen.',
    whenToUse:
      'For å verifisere at jordsystemet i et IT- eller TT-anlegg er tilstrekkelig — typisk del av en sluttkontroll.',
    inputs: [
      { symbol: 'Ijord', name: 'Jordfeilstrøm', unit: 'A', defaultValue: 1, hint: 'Total kapasitiv lekkasjestrøm i IT-nett, typisk 0,5–5 A.', min: 0 },
      { symbol: 'Rb', name: 'Driftsjording (R_b)', unit: 'Ω', defaultValue: 20, min: 0 },
    ],
    output: { symbol: 'U_F', name: 'Spenningsdrift mot jord', unit: 'V', decimals: 2 },
    calculate: ({ Ijord, Rb }) => Ijord * Rb,
    examples: [
      {
        scenario: 'I et IT-nett er total jordfeilstrøm 1 A og R_b = 20 Ω. Hva blir potensialet?',
        inputs: { Ijord: 1, Rb: 20 },
        steps: [
          { latex: 'U_{F} = 1 \\cdot 20 = 20\\ \\mathrm{V}' },
        ],
        answer: 'U_F = 20 V — under 50 V-grensa, OK.',
      },
    ],
    related: ['rcd-beroringsspenning', 'kortslutning-jord'],
    keywords: ['driftsjording', 'IT', 'jord', 'Rb'],
    source: 'NEK 400-4-41',
  },
  {
    id: 'beskyttelsesjording-tt',
    category: 'nettsystemer',
    title: 'Beskyttelsesjording i TT — krav til R_a',
    subtitle: 'R_a ≤ 50 V / I_a',
    latex: 'R_{a} \\leq \\dfrac{50\\,\\mathrm{V}}{I_{a}}',
    description:
      'I et TT-system må beskyttelsesjordingen R_a være lav nok til at en jordfeil ikke gir berøringsspenning over 50 V. I_a er strømmen vernet utløses ved (typisk 30 mA RCD).',
    whenToUse:
      'I TT-anlegg (vanlig på hytter og bygninger uten egen trafo) for å verifisere at jordingsmotstanden er innenfor kravet.',
    inputs: [
      { symbol: 'Ia', name: 'Utløserstrøm (typisk RCD)', unit: 'A', defaultValue: 0.03, hint: '30 mA RCD = 0,03 A.', min: 0 },
    ],
    output: { symbol: 'R_a,maks', name: 'Maks R_a', unit: 'Ω', decimals: 0 },
    calculate: ({ Ia }) => {
      if (Ia <= 0) throw new Error('I_a må være > 0.');
      return 50 / Ia;
    },
    examples: [
      {
        scenario: 'Med en 30 mA RCD, hva er maks tillatt R_a?',
        inputs: { Ia: 0.03 },
        steps: [
          { latex: 'R_{a} \\leq \\dfrac{50}{0{,}03}' },
          { latex: 'R_{a} \\leq 1666{,}7\\ \\Omega' },
        ],
        answer: 'R_a ≤ ~1667 Ω — sjelden et problem med 30 mA RCD.',
      },
    ],
    related: ['rcd-beroringsspenning'],
    keywords: ['TT', 'beskyttelsesjording', 'Ra', 'RCD'],
    source: 'NEK 400-4-41',
  },
  {
    id: 'it-beroringsspenning',
    category: 'nettsystemer',
    title: 'IT berøringsspenning — U_T ≤ 50 V',
    subtitle: 'U_T = I_jord · R_a',
    latex: 'U_{T} = I_{\\mathrm{jord}} \\cdot R_{a}',
    description:
      'Berøringsspenningen ved første jordfeil i et IT-system er produktet av jordfeilstrømmen og berøringsutstyrets jordingsmotstand. Kravet er U_T ≤ 50 V — eller ≤ 25 V i særskilte miljøer (medisinske rom, landbruk med dyr, våtrom). U_T > 50 V utløser advarsel.',
    whenToUse:
      'Når du verifiserer et IT-anlegg etter installasjon — typisk del av sluttkontroll i IT-system (vanlig i Norge for boliger). Måles indirekte via R_a og total kapasitiv lekkasjestrøm i nettet.',
    inputs: [
      { symbol: 'Ijord', name: 'Jordfeilstrøm', unit: 'A', defaultValue: 1.5, hint: 'Total kapasitiv lekkasje i IT-nett, typisk 0,5–5 A.', min: 0 },
      { symbol: 'Ra', name: 'Beskyttelsesjording (R_a)', unit: 'Ω', defaultValue: 20, hint: 'Målt jordingsmotstand på utstyret.', min: 0 },
    ],
    output: { symbol: 'U_T', name: 'Berøringsspenning', unit: 'V', decimals: 2 },
    calculate: ({ Ijord, Ra }) => {
      const Ut = Ijord * Ra;
      if (Ut > 50) throw new Error(`U_T = ${Ut.toFixed(2)} V > 50 V — IKKE GODKJENT. Reduser R_a eller installer RCD.`);
      return Ut;
    },
    examples: [
      {
        scenario: 'Bolig IT 230 V: total jordfeilstrøm 1,5 A, R_a = 20 Ω.',
        inputs: { Ijord: 1.5, Ra: 20 },
        steps: [
          { latex: 'U_{T} = 1{,}5 \\cdot 20 = 30\\ \\mathrm{V}' },
        ],
        answer: 'U_T = 30 V ≤ 50 V → OK. NB: > 25 V — ikke godkjent for våtrom/medisinske rom uten RCD.',
      },
      {
        scenario: 'Industri-IT: stor kapasitiv lekkasje I_jord = 3 A, R_a = 15 Ω.',
        inputs: { Ijord: 3, Ra: 15 },
        steps: [
          { latex: 'U_{T} = 3 \\cdot 15 = 45\\ \\mathrm{V}' },
        ],
        answer: 'U_T = 45 V — fortsatt under 50 V, men marginalt. Bør senke R_a.',
      },
    ],
    related: ['driftsjording', 'beskyttelsesjording-tt', 'rcd-beroringsspenning'],
    keywords: ['IT', 'berøringsspenning', 'UT', '50V', '25V'],
    source: 'NEK 400-4-41.1',
  },
];
