import type { Formula } from './types';

export const ELEKTROMAGNETISME_FORMULAS: Formula[] = [
  {
    id: 'kondensator-energi',
    category: 'elektromagnetisme',
    title: 'Energi lagret i kondensator',
    subtitle: 'W = ½ · C · U²',
    latex: 'W = \\tfrac{1}{2} \\cdot C \\cdot U^{2}',
    description:
      'En kondensator lagrer energi i det elektriske feltet mellom platene. Energien øker med kapasitansen og kvadratet av spenningen.',
    whenToUse:
      'For å vurdere hvor mye energi som kan utlades fra en kondensator (sikkerhet!), eller for å designe energilager-løsninger.',
    inputs: [
      { symbol: 'C', name: 'Kapasitans', unit: 'F', defaultValue: 0.001, hint: '1 mF = 0,001 F.', min: 0 },
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 400, min: 0 },
    ],
    output: { symbol: 'W', name: 'Energi', unit: 'J', decimals: 4 },
    calculate: ({ C, U }) => 0.5 * C * U * U,
    examples: [
      {
        scenario: 'En 1 mF kondensator er ladet til 400 V. Hvor mye energi er lagret?',
        inputs: { C: 0.001, U: 400 },
        steps: [
          { latex: 'W = \\tfrac{1}{2} \\cdot 0{,}001 \\cdot 400^{2}' },
          { latex: 'W = \\tfrac{1}{2} \\cdot 0{,}001 \\cdot 160000' },
          { latex: 'W = 80\\ \\mathrm{J}' },
        ],
        answer: 'W = 80 J — kan gi farlig støt, husk å lade ut!',
      },
    ],
    related: ['spole-energi', 'tidskonstant-rc'],
    keywords: ['kondensator', 'energi', 'lagring'],
    relevans: 'sjelden',
  },
  {
    id: 'spole-energi',
    category: 'elektromagnetisme',
    title: 'Energi lagret i spole',
    subtitle: 'W = ½ · L · I²',
    latex: 'W = \\tfrac{1}{2} \\cdot L \\cdot I^{2}',
    description:
      'En spole lagrer energi i magnetfeltet rundt viklingene. Energien er proporsjonal med induktansen og kvadratet av strømmen.',
    whenToUse:
      'For å forstå hvorfor en spole gir høy spenning ved brudd (induksjon — magnetfeltet kollapser), og for å dimensjonere snubber-kretser.',
    inputs: [
      { symbol: 'L', name: 'Induktans', unit: 'H', defaultValue: 0.5, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
    ],
    output: { symbol: 'W', name: 'Energi', unit: 'J', decimals: 4 },
    calculate: ({ L, I }) => 0.5 * L * I * I,
    examples: [
      {
        scenario: 'En 500 mH spole fører 10 A. Hva er den lagrede energien?',
        inputs: { L: 0.5, I: 10 },
        steps: [
          { latex: 'W = \\tfrac{1}{2} \\cdot 0{,}5 \\cdot 10^{2}' },
          { latex: 'W = 0{,}25 \\cdot 100 = 25\\ \\mathrm{J}' },
        ],
        answer: 'W = 25 J',
      },
    ],
    related: ['kondensator-energi', 'tidskonstant-rl'],
    keywords: ['spole', 'induktans', 'magnetfelt', 'energi'],
    relevans: 'sjelden',
  },
  {
    id: 'tidskonstant-rc',
    category: 'elektromagnetisme',
    title: 'Tidskonstant RC-krets',
    subtitle: 'τ = R · C',
    latex: '\\tau = R \\cdot C',
    description:
      'Tidskonstanten τ (tau) sier hvor raskt en kondensator lades opp eller ut. Etter 1τ er kondensatoren ladet til 63 %, etter 5τ regnes den som fullt ladet (>99 %).',
    whenToUse:
      'For å beregne hvor lang tid det tar å lade en kondensator, eller for å designe filtre, timere og snubber-kretser.',
    inputs: [
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 1000, min: 0 },
      { symbol: 'C', name: 'Kapasitans', unit: 'F', defaultValue: 0.001, min: 0 },
    ],
    output: { symbol: 'τ', name: 'Tidskonstant', unit: 's', decimals: 4 },
    calculate: ({ R, C }) => R * C,
    examples: [
      {
        scenario: 'En 1 mF kondensator lades gjennom 1 kΩ. Hva er tidskonstanten?',
        inputs: { R: 1000, C: 0.001 },
        steps: [
          { latex: '\\tau = 1000 \\cdot 0{,}001 = 1\\ \\mathrm{s}' },
        ],
        answer: 'τ = 1 s — fullt ladet etter ca. 5 s.',
      },
    ],
    related: ['kondensator-energi', 'tidskonstant-rl'],
    keywords: ['tidskonstant', 'tau', 'RC', 'lade'],
    relevans: 'sjelden',
  },
  {
    id: 'tidskonstant-rl',
    category: 'elektromagnetisme',
    title: 'Tidskonstant RL-krets',
    subtitle: 'τ = L / R',
    latex: '\\tau = \\dfrac{L}{R}',
    description:
      'Tidskonstanten i en RL-krets sier hvor raskt strømmen bygger seg opp i en spole etter at spenningen er påslått. Etter 1τ er strømmen 63 % av maksverdi, etter 5τ ≈ 99 %.',
    whenToUse:
      'For å forstå start-transienter i motorer, kontaktorer og elektromagneter — hvor lang tid det tar før de når fullt magnetfelt.',
    inputs: [
      { symbol: 'L', name: 'Induktans', unit: 'H', defaultValue: 0.5, min: 0 },
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 50, min: 0 },
    ],
    output: { symbol: 'τ', name: 'Tidskonstant', unit: 's', decimals: 4 },
    calculate: ({ L, R }) => {
      if (R <= 0) throw new Error('R må være > 0.');
      return L / R;
    },
    examples: [
      {
        scenario: 'En spole har L = 500 mH og R = 50 Ω. Hva er tidskonstanten?',
        inputs: { L: 0.5, R: 50 },
        steps: [
          { latex: '\\tau = \\dfrac{0{,}5}{50} = 0{,}01\\ \\mathrm{s} = 10\\ \\mathrm{ms}' },
        ],
        answer: 'τ = 10 ms',
      },
    ],
    related: ['spole-energi', 'tidskonstant-rc'],
    keywords: ['tidskonstant', 'RL', 'spole'],
    relevans: 'sjelden',
  },
];
