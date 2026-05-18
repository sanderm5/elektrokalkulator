import type { Formula } from './types';

export const MOTOR_FORMULAS: Formula[] = [
  {
    id: 'synkron-hastighet',
    category: 'motor',
    title: 'Synkron hastighet',
    subtitle: 'n_s = 60 · f / p',
    latex: 'n_{s} = \\dfrac{60 \\cdot f}{p}',
    description:
      'Den synkrone hastigheten til et roterende felt avhenger av frekvensen f og antall polpar p. I Norge (50 Hz) blir en 2-polet (p=1) motor 3000 rpm, 4-polet (p=2) blir 1500 rpm.',
    whenToUse:
      'For asynkronmotorer, der den faktiske rotorhastigheten er litt lavere enn n_s pga. sluring. Grunnlag for all motorberegning.',
    inputs: [
      { symbol: 'f', name: 'Frekvens', unit: 'Hz', defaultValue: 50, min: 0 },
      { symbol: 'p', name: 'Antall polpar', unit: '', defaultValue: 2, hint: '2-polet motor: p=1. 4-polet: p=2. 6-polet: p=3.', min: 1, step: 1 },
    ],
    output: { symbol: 'n_s', name: 'Synkron hastighet', unit: 'rpm', decimals: 2 },
    calculate: ({ f, p }) => {
      if (p <= 0) throw new Error('Antall polpar må være ≥ 1.');
      return (60 * f) / p;
    },
    examples: [
      {
        scenario: 'En 4-polet motor på 50 Hz. Hva er synkron hastighet?',
        inputs: { f: 50, p: 2 },
        steps: [
          { latex: 'n_{s} = \\dfrac{60 \\cdot 50}{2} = 1500\\ \\mathrm{rpm}' },
        ],
        answer: 'n_s = 1500 rpm',
      },
    ],
    related: ['sluring', 'moment-fra-effekt'],
    keywords: ['motor', 'synkron', 'hastighet', 'rpm', 'polpar'],
  },
  {
    id: 'sluring',
    category: 'motor',
    title: 'Sluring (slip)',
    subtitle: 's = (n_s − n) / n_s',
    latex: 's = \\dfrac{n_{s} - n}{n_{s}}',
    description:
      'Sluringen er forskjellen mellom synkron hastighet og faktisk rotorhastighet, uttrykt som forhold. Asynkronmotorer trenger sluring for å indusere strøm i rotoren. Typisk 2–5 % ved fullast.',
    whenToUse:
      'For å beregne faktisk rotorhastighet, eller for å vurdere belastning — økt sluring betyr økt last.',
    inputs: [
      { symbol: 'ns', name: 'Synkron hastighet', unit: 'rpm', defaultValue: 1500, min: 0 },
      { symbol: 'n', name: 'Faktisk hastighet', unit: 'rpm', defaultValue: 1455, min: 0 },
    ],
    output: { symbol: 's', name: 'Sluring', unit: '', decimals: 4 },
    calculate: ({ ns, n }) => {
      if (ns <= 0) throw new Error('n_s må være > 0.');
      return (ns - n) / ns;
    },
    examples: [
      {
        scenario: 'En motor har n_s = 1500 rpm og målt n = 1455 rpm. Hva er sluringen?',
        inputs: { ns: 1500, n: 1455 },
        steps: [
          { latex: 's = \\dfrac{1500 - 1455}{1500} = \\dfrac{45}{1500}' },
          { latex: 's = 0{,}03 = 3\\,\\%' },
        ],
        answer: 's = 3 %',
      },
    ],
    related: ['synkron-hastighet'],
    keywords: ['sluring', 'slip', 's', 'motor'],
  },
  {
    id: 'moment-fra-effekt',
    category: 'motor',
    title: 'Dreiemoment fra effekt og turtall',
    subtitle: 'M = 9550 · P / n',
    latex: 'M = \\dfrac{9550 \\cdot P}{n}',
    description:
      'Praktisk formel for dreiemomentet på akslingen, der P er avgitt effekt i kW og n er turtallet i rpm. Resultatet er i newtonmeter (Nm). Konstanten 9550 = 60 · 1000 / (2π).',
    whenToUse:
      'For å dimensjonere kobling, reduksjonsgir eller for å vurdere om motoren leverer det momentet en mekanisme trenger.',
    inputs: [
      { symbol: 'P', name: 'Effekt', unit: 'kW', defaultValue: 7.5, hint: 'I kilowatt (kW).', min: 0 },
      { symbol: 'n', name: 'Turtall', unit: 'rpm', defaultValue: 1455, min: 0 },
    ],
    output: { symbol: 'M', name: 'Dreiemoment', unit: 'Nm', decimals: 2 },
    calculate: ({ P, n }) => {
      if (n <= 0) throw new Error('Turtall må være > 0.');
      return (9550 * P) / n;
    },
    examples: [
      {
        scenario: 'En 7,5 kW motor går på 1455 rpm. Hva er momentet?',
        inputs: { P: 7.5, n: 1455 },
        steps: [
          { latex: 'M = \\dfrac{9550 \\cdot 7{,}5}{1455}' },
          { latex: 'M \\approx 49{,}2\\ \\mathrm{Nm}' },
        ],
        answer: 'M ≈ 49 Nm',
      },
    ],
    related: ['synkron-hastighet', 'motor-virkningsgrad'],
    keywords: ['moment', 'turtall', 'Nm', 'motor'],
  },
  {
    id: 'motor-virkningsgrad',
    category: 'motor',
    title: 'Motorens virkningsgrad (η)',
    subtitle: 'η = P_aksel / P_el',
    latex: '\\eta = \\dfrac{P_{\\mathrm{aksel}}}{P_{\\mathrm{el}}}',
    description:
      'Virkningsgraden er forholdet mellom mekanisk effekt på akselen (det motoren leverer) og elektrisk effekt motoren trekker. Typisk 0,85–0,95 for industrimotorer.',
    whenToUse:
      'For å vurdere energieffektivitet og for å regne tilbake fra merkeskilt-effekt (mekanisk) til elektrisk strøm.',
    inputs: [
      { symbol: 'Paksel', name: 'Akseleffekt', unit: 'W', defaultValue: 7500, hint: '7,5 kW = 7500 W.', min: 0 },
      { symbol: 'Pel', name: 'Elektrisk effekt', unit: 'W', defaultValue: 8800, min: 0 },
    ],
    output: { symbol: 'η', name: 'Virkningsgrad', unit: '', decimals: 4 },
    calculate: ({ Paksel, Pel }) => {
      if (Pel <= 0) throw new Error('P_el må være > 0.');
      return Paksel / Pel;
    },
    examples: [
      {
        scenario: 'En motor leverer 7,5 kW mekanisk og trekker 8,8 kW elektrisk. Virkningsgrad?',
        inputs: { Paksel: 7500, Pel: 8800 },
        steps: [
          { latex: '\\eta = \\dfrac{7500}{8800} \\approx 0{,}852' },
        ],
        answer: 'η ≈ 0,85 (85 %)',
      },
    ],
    related: ['transformator-virkningsgrad'],
    keywords: ['virkningsgrad', 'motor', 'eta'],
  },
  {
    id: 'motor-startstrom-yd',
    category: 'motor',
    title: 'Y/D-start: startstrøm-reduksjon',
    subtitle: 'I_Y = I_D / 3',
    latex: 'I_{Y} = \\dfrac{I_{D}}{3}',
    description:
      'En motor som startes i Y-kobling trekker bare 1/3 av startstrømmen den ville hatt i D-kobling. Når motoren har kommet opp i turtall, kobles den om til D for full effekt. Også momentet reduseres til 1/3.',
    whenToUse:
      'For større motorer (>5 kW) der startstrøm fra direkte start (DOL) ville utløst vern eller gitt for stort spenningsdykk på nettet.',
    inputs: [
      { symbol: 'ID', name: 'Startstrøm i D-kobling', unit: 'A', defaultValue: 150, min: 0 },
    ],
    output: { symbol: 'I_Y', name: 'Startstrøm i Y-kobling', unit: 'A', decimals: 2 },
    calculate: ({ ID }) => ID / 3,
    examples: [
      {
        scenario: 'En motor ville trukket 150 A ved DOL-start. Hva blir startstrømmen ved Y/D-start?',
        inputs: { ID: 150 },
        steps: [
          { latex: 'I_{Y} = \\dfrac{150}{3} = 50\\ \\mathrm{A}' },
        ],
        answer: 'I_Y = 50 A (1/3 av DOL)',
      },
    ],
    related: ['strom-fra-effekt-trefase'],
    keywords: ['Y/D', 'stjernetrekant', 'start', 'motor'],
  },
];
