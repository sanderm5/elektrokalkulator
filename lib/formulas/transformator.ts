import type { Formula } from './types';

export const TRANSFORMATOR_FORMULAS: Formula[] = [
  {
    id: 'transformator-spenning',
    category: 'transformator',
    title: 'Omsetningsforhold — spenning',
    subtitle: 'U₁ / U₂ = N₁ / N₂',
    latex: '\\dfrac{U_{1}}{U_{2}} = \\dfrac{N_{1}}{N_{2}}',
    description:
      'I en ideell transformator er forholdet mellom primær- og sekundærspenning lik forholdet mellom antall viklinger. Når primærviklingen har flere viklinger, blir sekundærspenningen lavere — og motsatt.',
    whenToUse:
      'For å beregne sekundærspenningen i en kjent transformator, eller for å velge omsetningsforhold ved design.',
    inputs: [
      { symbol: 'U1', name: 'Primærspenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'N1', name: 'Primærviklinger', unit: '', defaultValue: 1000, min: 0 },
      { symbol: 'N2', name: 'Sekundærviklinger', unit: '', defaultValue: 100, min: 0 },
    ],
    output: { symbol: 'U₂', name: 'Sekundærspenning', unit: 'V', decimals: 3 },
    calculate: ({ U1, N1, N2 }) => {
      if (N1 <= 0) throw new Error('N₁ må være > 0.');
      return (U1 * N2) / N1;
    },
    examples: [
      {
        scenario: 'En transformator har 1000 primær- og 100 sekundærviklinger. Primær er 230 V. Hva er U₂?',
        inputs: { U1: 230, N1: 1000, N2: 100 },
        steps: [
          { latex: 'U_{2} = U_{1} \\cdot \\dfrac{N_{2}}{N_{1}} = 230 \\cdot \\dfrac{100}{1000}' },
          { latex: 'U_{2} = 23\\ \\mathrm{V}' },
        ],
        answer: 'U₂ = 23 V',
      },
    ],
    related: ['transformator-strom', 'transformator-virkningsgrad'],
    keywords: ['transformator', 'omsetning', 'viklinger'],
  },
  {
    id: 'transformator-strom',
    category: 'transformator',
    title: 'Omsetningsforhold — strøm',
    subtitle: 'I₁ / I₂ = N₂ / N₁',
    latex: '\\dfrac{I_{1}}{I_{2}} = \\dfrac{N_{2}}{N_{1}}',
    description:
      'Strømmen omsettes motsatt av spenningen i en ideell transformator. Stepper du spenningen ned, går sekundærstrømmen opp i samme forhold — energien (effekten) er bevart.',
    whenToUse:
      'For å beregne primærstrømmen når sekundærsiden trekker en kjent last, eller motsatt. Også grunnlag for å dimensjonere primærvern.',
    inputs: [
      { symbol: 'I2', name: 'Sekundærstrøm', unit: 'A', defaultValue: 50, min: 0 },
      { symbol: 'N1', name: 'Primærviklinger', unit: '', defaultValue: 1000, min: 0 },
      { symbol: 'N2', name: 'Sekundærviklinger', unit: '', defaultValue: 100, min: 0 },
    ],
    output: { symbol: 'I₁', name: 'Primærstrøm', unit: 'A', decimals: 3 },
    calculate: ({ I2, N1, N2 }) => {
      if (N1 <= 0) throw new Error('N₁ må være > 0.');
      return (I2 * N2) / N1;
    },
    examples: [
      {
        scenario: 'En trafo har 1000/100 viklinger. Sekundærsiden trekker 50 A. Hva er primærstrømmen?',
        inputs: { I2: 50, N1: 1000, N2: 100 },
        steps: [
          { latex: 'I_{1} = I_{2} \\cdot \\dfrac{N_{2}}{N_{1}} = 50 \\cdot \\dfrac{100}{1000}' },
          { latex: 'I_{1} = 5\\ \\mathrm{A}' },
        ],
        answer: 'I₁ = 5 A',
      },
    ],
    related: ['transformator-spenning'],
    keywords: ['transformator', 'strøm', 'primær', 'sekundær'],
  },
  {
    id: 'transformator-virkningsgrad',
    category: 'transformator',
    title: 'Virkningsgrad (η)',
    subtitle: 'η = P_ut / P_inn',
    latex: '\\eta = \\dfrac{P_{\\mathrm{ut}}}{P_{\\mathrm{inn}}}',
    description:
      'Virkningsgraden viser hvor stor andel av innmatet effekt som kommer ut som nytteeffekt — resten går tapt som varme (kobbertap + jerntap). Vanlige verdier: distribusjonstrafo 0,95–0,99.',
    whenToUse:
      'For å vurdere energieffektivitet, sammenligne trafo-design, eller beregne effekttap som varmes opp i trafo-rommet.',
    inputs: [
      { symbol: 'Put', name: 'Avgitt effekt (P_ut)', unit: 'W', defaultValue: 9500, min: 0 },
      { symbol: 'Pinn', name: 'Tilført effekt (P_inn)', unit: 'W', defaultValue: 10000, min: 0 },
    ],
    output: { symbol: 'η', name: 'Virkningsgrad', unit: '', decimals: 4 },
    calculate: ({ Put, Pinn }) => {
      if (Pinn <= 0) throw new Error('P_inn må være > 0.');
      return Put / Pinn;
    },
    examples: [
      {
        scenario: 'En trafo mates med 10 kW og leverer 9,5 kW. Hva er virkningsgraden?',
        inputs: { Put: 9500, Pinn: 10000 },
        steps: [
          { latex: '\\eta = \\dfrac{9500}{10000} = 0{,}95' },
          { latex: 'P_{\\mathrm{tap}} = 10000 - 9500 = 500\\ \\mathrm{W}' },
        ],
        answer: 'η = 0,95 (95 %). Tap = 500 W.',
      },
    ],
    related: ['motor-virkningsgrad'],
    keywords: ['virkningsgrad', 'eta', 'effekttap'],
  },
];
