import type { Formula } from './types';

export const BELYSNING_FORMULAS: Formula[] = [
  {
    id: 'belysningsstyrke',
    category: 'belysning',
    title: 'Belysningsstyrke',
    subtitle: 'E = Φ / A',
    latex: 'E = \\dfrac{\\Phi}{A}',
    description:
      'Belysningsstyrke E er hvor mye lysstrøm som faller på en flate. Måles i lux (lm/m²). Φ er total lysstrøm fra lyskildene, A er romarealet. Norske krav: kontor 500 lx, lager 200 lx, korridor 100 lx.',
    whenToUse:
      'Når du dimensjonerer belysning i et rom — for å sjekke om antall armaturer gir nok lux iht. NS-EN 12464.',
    inputs: [
      { symbol: 'Phi', name: 'Total lysstrøm (Φ)', unit: 'lm', defaultValue: 12000, hint: 'Sum av alle armaturer.', min: 0 },
      { symbol: 'A', name: 'Romareal', unit: 'm²', defaultValue: 24, min: 0 },
    ],
    output: { symbol: 'E', name: 'Belysningsstyrke', unit: 'lx', decimals: 2 },
    calculate: ({ Phi, A }) => {
      if (A <= 0) throw new Error('Areal må være > 0 m².');
      return Phi / A;
    },
    examples: [
      {
        scenario: 'Et kontor på 24 m² har 4 armaturer à 3000 lm. Er belysningen nok?',
        inputs: { Phi: 12000, A: 24 },
        steps: [
          { latex: 'E = \\dfrac{12000}{24} = 500\\ \\mathrm{lx}' },
        ],
        answer: 'E = 500 lx — oppfyller kontor-krav.',
      },
    ],
    related: ['lysutbytte'],
    keywords: ['lux', 'belysning', 'lumen', 'lx'],
    source: 'NS-EN 12464-1',
  },
  {
    id: 'lysutbytte',
    category: 'belysning',
    title: 'Lysutbytte',
    subtitle: 'η = Φ / P',
    latex: '\\eta = \\dfrac{\\Phi}{P}',
    description:
      'Lysutbytte sier hvor mange lumen lyskilden gir per watt forbrukt effekt. LED: 100–180 lm/W. Lysrør: 60–90 lm/W. Glødelampe: 10–15 lm/W. Halogen: 15–25 lm/W.',
    whenToUse:
      'For å sammenligne lyskilder energimessig, eller for å regne ut total effekt for en belysningsplan.',
    inputs: [
      { symbol: 'Phi', name: 'Lysstrøm (Φ)', unit: 'lm', defaultValue: 3000, min: 0 },
      { symbol: 'P', name: 'Effekt', unit: 'W', defaultValue: 25, min: 0 },
    ],
    output: { symbol: 'η', name: 'Lysutbytte', unit: 'lm/W', decimals: 2 },
    calculate: ({ Phi, P }) => {
      if (P <= 0) throw new Error('Effekt må være > 0 W.');
      return Phi / P;
    },
    examples: [
      {
        scenario: 'En LED-armatur gir 3000 lm og bruker 25 W. Hva er lysutbytte?',
        inputs: { Phi: 3000, P: 25 },
        steps: [
          { latex: '\\eta = \\dfrac{3000}{25} = 120\\ \\mathrm{lm/W}' },
        ],
        answer: 'η = 120 lm/W (typisk LED)',
      },
    ],
    related: ['belysningsstyrke'],
    keywords: ['lysutbytte', 'lm/W', 'LED'],
  },
];
