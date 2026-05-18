import type { Formula } from './types';

export const ENERGI_VARME_FORMULAS: Formula[] = [
  {
    id: 'varmemengde',
    category: 'energi-varme',
    title: 'Varmemengde for oppvarming',
    subtitle: 'Q = m · c · ΔT',
    latex: 'Q = m \\cdot c \\cdot \\Delta T',
    description:
      'Energien som trengs for å varme opp en masse m med temperaturendring ΔT. c er materialets spesifikke varmekapasitet. Vann: 4186 J/(kg·°C). Luft: 1005 J/(kg·°C).',
    whenToUse:
      'For å dimensjonere varmtvannsbereder, varmeovn for et rom, eller beregne hvor lang tid en oppvarming tar.',
    inputs: [
      { symbol: 'm', name: 'Masse', unit: 'kg', defaultValue: 100, hint: 'Vann: 1 liter = 1 kg.', min: 0 },
      { symbol: 'c', name: 'Spesifikk varmekapasitet', unit: 'J/(kg·°C)', defaultValue: 4186, hint: 'Vann: 4186. Luft: 1005. Stål: 460.', min: 0 },
      { symbol: 'dT', name: 'Temperaturendring (ΔT)', unit: '°C', defaultValue: 50, min: 0 },
    ],
    output: { symbol: 'Q', name: 'Varmemengde', unit: 'J', decimals: 0 },
    calculate: ({ m, c, dT }) => m * c * dT,
    examples: [
      {
        scenario: 'Hvor mye energi trengs for å varme 100 liter vann fra 10 °C til 60 °C?',
        inputs: { m: 100, c: 4186, dT: 50 },
        steps: [
          { latex: 'Q = 100 \\cdot 4186 \\cdot 50' },
          { latex: 'Q = 20\\,930\\,000\\ \\mathrm{J} \\approx 5{,}81\\ \\mathrm{kWh}' },
        ],
        answer: 'Q ≈ 5,81 kWh',
      },
    ],
    related: ['arbeid-energi', 'oppvarmingstid'],
    keywords: ['varme', 'vann', 'kWh', 'Q'],
  },
  {
    id: 'oppvarmingstid',
    category: 'energi-varme',
    title: 'Tid for oppvarming',
    subtitle: 't = Q / P',
    latex: 't = \\dfrac{Q}{P}',
    description:
      'Tiden det tar å varme noe opp er energien som trengs (Q) delt på effekten (P) som tilføres. Forutsetter at all effekt går til oppvarming (virkningsgrad = 1).',
    whenToUse:
      'For å beregne hvor lang tid en bereder eller varmtvannskolbe bruker på å varme opp vann.',
    inputs: [
      { symbol: 'Q', name: 'Energi som trengs', unit: 'J', defaultValue: 20930000, hint: 'Beregn først med Q = m·c·ΔT.', min: 0 },
      { symbol: 'P', name: 'Effekt', unit: 'W', defaultValue: 3000, min: 0 },
    ],
    output: { symbol: 't', name: 'Tid', unit: 's', decimals: 1 },
    calculate: ({ Q, P }) => {
      if (P <= 0) throw new Error('Effekt må være > 0 W.');
      return Q / P;
    },
    examples: [
      {
        scenario: 'En 3 kW bereder skal varme opp Q = 20,93 MJ vann. Hvor lang tid?',
        inputs: { Q: 20930000, P: 3000 },
        steps: [
          { latex: 't = \\dfrac{20{,}93 \\cdot 10^{6}}{3000}' },
          { latex: 't \\approx 6977\\ \\mathrm{s} \\approx 1\\text{ time } 56\\text{ min}' },
        ],
        answer: 't ≈ 1 t 56 min',
      },
    ],
    related: ['varmemengde'],
    keywords: ['tid', 'oppvarming', 'bereder'],
  },
  {
    id: 'varmekabel-serie',
    category: 'energi-varme',
    title: 'Varmekabel — serie',
    subtitle: 'P_tot = U² / (R_1 + R_2 + …)',
    latex: 'P_{\\mathrm{tot}} = \\dfrac{U^{2}}{R_{1} + R_{2}}',
    description:
      'Varmekabler i serie deler samme strøm, men motstandene summeres. Total effekt blir U² delt på sum av motstander. Brukes når 2-leder kabel brettes for å gi serie-effekt, eller når flere kabler kobles etter hverandre.',
    whenToUse:
      'For å sjekke effekten i en serie-kobling av varmekabel-elementer eller en lengre kabel sett som flere segmenter.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'R1', name: 'Motstand 1', unit: 'Ω', defaultValue: 50, min: 0 },
      { symbol: 'R2', name: 'Motstand 2', unit: 'Ω', defaultValue: 50, min: 0 },
    ],
    output: { symbol: 'P_tot', name: 'Total effekt', unit: 'W', decimals: 2 },
    calculate: ({ U, R1, R2 }) => {
      const Rtot = R1 + R2;
      if (Rtot <= 0) throw new Error('Sum av motstander må være > 0.');
      return (U * U) / Rtot;
    },
    examples: [
      {
        scenario: 'To varmekabel-segmenter på 50 Ω hver, koblet i serie ved 230 V.',
        inputs: { U: 230, R1: 50, R2: 50 },
        steps: [
          { latex: 'R_{\\mathrm{tot}} = 50 + 50 = 100\\ \\Omega' },
          { latex: 'P_{\\mathrm{tot}} = \\dfrac{230^{2}}{100} = 529\\ \\mathrm{W}' },
        ],
        answer: 'P_tot = 529 W (≈ 264 W per kabel).',
      },
    ],
    related: ['varmekabel-parallell', 'effekt-u2r', 'serie-motstand'],
    keywords: ['varmekabel', 'serie', 'gulvvarme'],
    source: 'ELE2 elektroteori',
  },
  {
    id: 'varmekabel-parallell',
    category: 'energi-varme',
    title: 'Varmekabel — parallell',
    subtitle: 'P_tot = P_1 + P_2 + … (samme U)',
    latex: 'P_{\\mathrm{tot}} = \\dfrac{U^{2}}{R_{1}} + \\dfrac{U^{2}}{R_{2}}',
    description:
      'Varmekabler i parallell deler samme spenning, og effektene summeres direkte. Dobles antallet kabler ved samme spenning, dobles effekten. Standardkonfigurasjon for de fleste gulvvarme-anlegg.',
    whenToUse:
      'Når du dimensjonerer parallelle varmekabler (typisk i gulvvarme-systemer) eller skal regne ut total effekt fra flere matter på samme kurs.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'R1', name: 'Motstand 1', unit: 'Ω', defaultValue: 50, min: 0 },
      { symbol: 'R2', name: 'Motstand 2', unit: 'Ω', defaultValue: 50, min: 0 },
    ],
    output: { symbol: 'P_tot', name: 'Total effekt', unit: 'W', decimals: 2 },
    calculate: ({ U, R1, R2 }) => {
      if (R1 <= 0 || R2 <= 0) throw new Error('Motstander må være > 0.');
      return (U * U) / R1 + (U * U) / R2;
    },
    examples: [
      {
        scenario: 'To 50 Ω matter i parallell på 230 V (typisk gulvvarme).',
        inputs: { U: 230, R1: 50, R2: 50 },
        steps: [
          { latex: 'P_{1} = \\dfrac{230^{2}}{50} = 1058\\ \\mathrm{W}' },
          { latex: 'P_{2} = 1058\\ \\mathrm{W}' },
          { latex: 'P_{\\mathrm{tot}} = 1058 + 1058 = 2116\\ \\mathrm{W}' },
        ],
        answer: 'P_tot ≈ 2,1 kW',
      },
      {
        scenario: 'Tre matter på 80, 100 og 100 Ω (forenklet to-input — bruk seriereduksjon for 3+).',
        inputs: { U: 230, R1: 80, R2: 50 },
        steps: [
          { latex: 'R_{ekv} \\text{ av to 100 Ω parallell} = 50\\ \\Omega' },
          { latex: 'P_{\\mathrm{tot}} = \\dfrac{230^{2}}{80} + \\dfrac{230^{2}}{50}' },
          { latex: 'P_{\\mathrm{tot}} = 661 + 1058 \\approx 1719\\ \\mathrm{W}' },
        ],
        answer: 'P_tot ≈ 1,72 kW',
      },
    ],
    related: ['varmekabel-serie', 'effekt-u2r', 'parallell-motstand'],
    keywords: ['varmekabel', 'parallell', 'gulvvarme', 'matte'],
    source: 'ELE2 elektroteori',
  },
];
