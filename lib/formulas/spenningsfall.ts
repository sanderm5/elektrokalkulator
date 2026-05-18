import type { Formula } from './types';

export const SPENNINGSFALL_FORMULAS: Formula[] = [
  {
    id: 'spenningsfall-enfase-forenklet',
    category: 'spenningsfall',
    title: 'Spenningsfall enfase (forenklet)',
    subtitle: 'ΔU = 2 · l · I · ρ / A',
    latex: '\\Delta U = \\dfrac{2 \\cdot l \\cdot I \\cdot \\rho}{A}',
    description:
      'Forenklet formel for spenningsfall i en enfase krets, brukt når cos φ ≈ 1 (resistiv last). Faktoren 2 fanger opp at strømmen går både til og fra lasten. ρ er resistiviteten (kobber: 0,0175 Ω·mm²/m).',
    whenToUse:
      'For belysning, varme, og rene resistive enfase kurser. Bruk denne på eksamen om ikke cos φ er oppgitt.',
    inputs: [
      { symbol: 'l', name: 'Kabellengde (én vei)', unit: 'm', defaultValue: 30, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
      { symbol: 'rho', name: 'Resistivitet (ρ)', unit: 'Ω·mm²/m', defaultValue: 0.0175, hint: 'Kobber: 0,0175. Aluminium: 0,028.', min: 0 },
      { symbol: 'A', name: 'Tverrsnitt', unit: 'mm²', defaultValue: 2.5, min: 0 },
    ],
    output: { symbol: 'ΔU', name: 'Spenningsfall', unit: 'V', decimals: 3 },
    calculate: ({ l, I, rho, A }) => {
      if (A <= 0) throw new Error('Tverrsnitt må være > 0.');
      return (2 * l * I * rho) / A;
    },
    examples: [
      {
        scenario: 'En 30 m lang kobber-kurs med 2,5 mm² fører 10 A. Hva er spenningsfallet?',
        inputs: { l: 30, I: 10, rho: 0.0175, A: 2.5 },
        steps: [
          { latex: '\\Delta U = \\dfrac{2 \\cdot 30 \\cdot 10 \\cdot 0{,}0175}{2{,}5}' },
          { latex: '\\Delta U = \\dfrac{10{,}5}{2{,}5}' },
          { latex: '\\Delta U = 4{,}2\\ \\mathrm{V}' },
        ],
        answer: 'ΔU = 4,2 V',
      },
    ],
    related: ['spenningsfall-trefase-forenklet', 'spenningsfall-prosent', 'spenningsfall-enfase-med-cosphi'],
    keywords: ['spenningsfall', 'enfase', 'kabel'],
  },
  {
    id: 'spenningsfall-enfase-med-cosphi',
    category: 'spenningsfall',
    title: 'Spenningsfall enfase med cos φ',
    subtitle: 'ΔU = 2 · l · I · (R·cos φ + X·sin φ)',
    latex: '\\Delta U = 2 \\cdot l \\cdot I \\cdot (R \\cos\\varphi + X \\sin\\varphi)',
    description:
      'Nøyaktig formel for spenningsfall i en enfase krets med faseforskyvning. Faktoren 2 fanger opp at strømmen går både til og fra lasten. R og X er ledermotstand og -reaktans per meter — slå opp i resistanstabellen.',
    whenToUse:
      'For 1-fase motorkurser, varmekabler med store reaktive komponenter, og kurser der cos φ < 0,95. Gir mer presist svar enn forenklet formel.',
    inputs: [
      { symbol: 'l', name: 'Kabellengde (én vei)', unit: 'm', defaultValue: 50, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 20, min: 0 },
      { symbol: 'R', name: 'Resistans per meter', unit: 'Ω/m', defaultValue: 0.0073, hint: '2,5 mm² Cu @ 70°C: ~0,0089. 4 mm²: ~0,0055. 6 mm²: ~0,0037.', min: 0 },
      { symbol: 'X', name: 'Reaktans per meter', unit: 'Ω/m', defaultValue: 0.0001, hint: 'Typisk 0,08–0,12 mΩ/m for små tverrsnitt.', min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.9, min: 0, max: 1 },
    ],
    output: { symbol: 'ΔU', name: 'Spenningsfall', unit: 'V', decimals: 3 },
    calculate: ({ l, I, R, X, cosphi }) => {
      const sinphi = Math.sqrt(1 - cosphi * cosphi);
      return 2 * l * I * (R * cosphi + X * sinphi);
    },
    examples: [
      {
        scenario: 'Enfase motor 230 V, 20 A, 50 m, 2,5 mm² Cu @ 70°C (R = 8,9 mΩ/m, X = 0,1 mΩ/m), cos φ = 0,9.',
        inputs: { l: 50, I: 20, R: 0.0089, X: 0.0001, cosphi: 0.9 },
        steps: [
          { latex: '\\sin\\varphi = \\sqrt{1 - 0{,}9^{2}} \\approx 0{,}436' },
          { latex: '\\Delta U = 2 \\cdot 50 \\cdot 20 \\cdot (0{,}0089 \\cdot 0{,}9 + 0{,}0001 \\cdot 0{,}436)' },
          { latex: '\\Delta U \\approx 16{,}1\\ \\mathrm{V} = 7{,}0\\,\\%' },
        ],
        answer: 'ΔU ≈ 16,1 V (7,0 %) → over 5 %-grensa, øk til 4 mm².',
      },
      {
        scenario: 'Same lengde, 4 mm² Cu @ 70°C (R = 5,5 mΩ/m), cos φ = 0,9.',
        inputs: { l: 50, I: 20, R: 0.0055, X: 0.0001, cosphi: 0.9 },
        steps: [
          { latex: '\\Delta U = 2 \\cdot 50 \\cdot 20 \\cdot (0{,}0055 \\cdot 0{,}9 + 0{,}0001 \\cdot 0{,}436)' },
          { latex: '\\Delta U \\approx 10{,}0\\ \\mathrm{V} = 4{,}3\\,\\%' },
        ],
        answer: 'ΔU ≈ 10 V (4,3 %) — innenfor 5 %.',
      },
    ],
    related: ['spenningsfall-enfase-forenklet', 'spenningsfall-trefase-med-cosphi', 'spenningsfall-prosent'],
    keywords: ['spenningsfall', 'enfase', 'cos phi', 'reaktans', 'motor'],
    source: 'NEK 400-5-525',
  },
  {
    id: 'spenningsfall-trefase-forenklet',
    category: 'spenningsfall',
    title: 'Spenningsfall trefase (forenklet)',
    subtitle: 'ΔU = √3 · l · I · ρ / A',
    latex: '\\Delta U = \\dfrac{\\sqrt{3} \\cdot l \\cdot I \\cdot \\rho}{A}',
    description:
      'Forenklet formel for spenningsfall i en symmetrisk trefase krets, brukt for resistive laster eller når cos φ er nær 1. I motsetning til enfase brukes √3 i stedet for 2.',
    whenToUse:
      'For trefase belysningskurser, varme og rene resistive 3-fase laster. Standardformel når cos φ ikke er oppgitt.',
    inputs: [
      { symbol: 'l', name: 'Kabellengde', unit: 'm', defaultValue: 50, min: 0 },
      { symbol: 'I', name: 'Strøm (linje)', unit: 'A', defaultValue: 16, min: 0 },
      { symbol: 'rho', name: 'Resistivitet (ρ)', unit: 'Ω·mm²/m', defaultValue: 0.0175, min: 0 },
      { symbol: 'A', name: 'Tverrsnitt', unit: 'mm²', defaultValue: 4, min: 0 },
    ],
    output: { symbol: 'ΔU', name: 'Spenningsfall', unit: 'V', decimals: 3 },
    calculate: ({ l, I, rho, A }) => {
      if (A <= 0) throw new Error('Tverrsnitt må være > 0.');
      return (Math.sqrt(3) * l * I * rho) / A;
    },
    examples: [
      {
        scenario: 'En 50 m trefase-kurs med 4 mm² kobber fører 16 A. Hva er spenningsfallet?',
        inputs: { l: 50, I: 16, rho: 0.0175, A: 4 },
        steps: [
          { latex: '\\Delta U = \\dfrac{\\sqrt{3} \\cdot 50 \\cdot 16 \\cdot 0{,}0175}{4}' },
          { latex: '\\Delta U = \\dfrac{24{,}25}{4}' },
          { latex: '\\Delta U \\approx 6{,}1\\ \\mathrm{V}' },
        ],
        answer: 'ΔU ≈ 6,1 V',
      },
      {
        scenario: 'Tilførsel garasje 230V IT: 20 m TFXP 4G6 mm² kobber, 26 A (elbil-lader). ΔU?',
        inputs: { l: 20, I: 26, rho: 0.0175, A: 6 },
        steps: [
          { latex: '\\Delta U = \\dfrac{\\sqrt{3} \\cdot 20 \\cdot 26 \\cdot 0{,}0175}{6}' },
          { latex: '\\Delta U \\approx 2{,}63\\ \\mathrm{V}' },
        ],
        answer: 'ΔU ≈ 2,6 V → 1,14 % av 230 V — godt innenfor 3 % (lys) og 5 % (kraft).',
      },
    ],
    related: ['spenningsfall-enfase-forenklet', 'spenningsfall-trefase-med-cosphi', 'spenningsfall-prosent'],
    keywords: ['spenningsfall', 'trefase', 'IT', 'TFXP'],
  },
  {
    id: 'spenningsfall-trefase-med-cosphi',
    category: 'spenningsfall',
    title: 'Spenningsfall trefase med cos φ',
    subtitle: 'ΔU = √3 · l · I · (R·cos φ + X·sin φ)',
    latex: '\\Delta U = \\sqrt{3} \\cdot l \\cdot I \\cdot (R \\cos\\varphi + X \\sin\\varphi)',
    description:
      'Nøyaktig formel for spenningsfall i trefase når lasten har faseforskyvning. R og X er ledermotstand og -reaktans per meter. Brukes for motorlast og induktive kurser der cos φ < 0,95.',
    whenToUse:
      'For motorkurser, transformator-mating, og induktive laster der den forenklede formelen vil undervurdere spenningsfallet.',
    inputs: [
      { symbol: 'l', name: 'Kabellengde', unit: 'm', defaultValue: 50, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 16, min: 0 },
      { symbol: 'R', name: 'Resistans per meter', unit: 'Ω/m', defaultValue: 0.0044, hint: 'For 4 mm² kobber: ~0,0044 Ω/m.', min: 0 },
      { symbol: 'X', name: 'Reaktans per meter', unit: 'Ω/m', defaultValue: 0.00008, hint: 'Typisk 0,08–0,1 mΩ/m for små tverrsnitt.', min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.85, min: 0, max: 1 },
    ],
    output: { symbol: 'ΔU', name: 'Spenningsfall', unit: 'V', decimals: 3 },
    calculate: ({ l, I, R, X, cosphi }) => {
      const sinphi = Math.sqrt(1 - cosphi * cosphi);
      return Math.sqrt(3) * l * I * (R * cosphi + X * sinphi);
    },
    examples: [
      {
        scenario: 'En motor på 400V TN: 50 m, 16 A, cos φ = 0,85. Kabel: 4 mm² kobber (R = 4,4 mΩ/m, X = 0,08 mΩ/m).',
        inputs: { l: 50, I: 16, R: 0.0044, X: 0.00008, cosphi: 0.85 },
        steps: [
          { latex: '\\sin\\varphi = \\sqrt{1 - 0{,}85^{2}} \\approx 0{,}527' },
          { latex: '\\Delta U = \\sqrt{3} \\cdot 50 \\cdot 16 \\cdot (0{,}0044 \\cdot 0{,}85 + 0{,}00008 \\cdot 0{,}527)' },
          { latex: '\\Delta U \\approx 5{,}24\\ \\mathrm{V}' },
        ],
        answer: 'ΔU ≈ 5,2 V (1,3 % av 400 V)',
      },
      {
        scenario: 'Industrimotor i 230V IT: 30 m, 25 A, cos φ = 0,8. Kabel 6 mm² kobber (R = 2,9 mΩ/m, X = 0,08 mΩ/m).',
        inputs: { l: 30, I: 25, R: 0.0029, X: 0.00008, cosphi: 0.8 },
        steps: [
          { latex: '\\sin\\varphi = \\sqrt{1 - 0{,}8^{2}} = 0{,}6' },
          { latex: '\\Delta U = \\sqrt{3} \\cdot 30 \\cdot 25 \\cdot (0{,}0029 \\cdot 0{,}8 + 0{,}00008 \\cdot 0{,}6)' },
          { latex: '\\Delta U \\approx 3{,}07\\ \\mathrm{V}' },
        ],
        answer: 'ΔU ≈ 3,1 V (1,3 % av 230 V) — innenfor 5 % kraftgrensa.',
      },
    ],
    related: ['spenningsfall-trefase-forenklet', 'spenningsfall-prosent'],
    keywords: ['spenningsfall', 'cos phi', 'motor', 'IT', 'TN'],
  },
  {
    id: 'spenningsfall-prosent',
    category: 'spenningsfall',
    title: 'Spenningsfall i prosent',
    subtitle: 'ΔU% = (ΔU / U_n) · 100',
    latex: '\\Delta U\\,[\\%] = \\dfrac{\\Delta U}{U_{n}} \\cdot 100',
    description:
      'Spenningsfall uttrykkes ofte i prosent av nominell spenning. NEK 400 krever ≤ 3 % for belysning og ≤ 5 % for stikkontakter/varme/motor — målt fra inntakssted til siste utstyr.',
    whenToUse:
      'For å sjekke om en kurs oppfyller NEK 400 sine spenningsfallskrav. Konverter alltid resultat fra ΔU-formel til prosent og sammenlign med grensa.',
    inputs: [
      { symbol: 'dU', name: 'Spenningsfall (ΔU)', unit: 'V', defaultValue: 6.1, min: 0 },
      { symbol: 'Un', name: 'Nominell spenning', unit: 'V', defaultValue: 400, hint: '230 V enfase, 400 V trefase linjespenning.', min: 0 },
    ],
    output: { symbol: 'ΔU%', name: 'Spenningsfall', unit: '%', decimals: 3 },
    calculate: ({ dU, Un }) => {
      if (Un <= 0) throw new Error('Spenning må være > 0.');
      return (dU / Un) * 100;
    },
    examples: [
      {
        scenario: 'En trefase-kurs har ΔU = 6,1 V ved U_n = 400 V. Er det innenfor NEK 400?',
        inputs: { dU: 6.1, Un: 400 },
        steps: [
          { latex: '\\Delta U\\,[\\%] = \\dfrac{6{,}1}{400} \\cdot 100' },
          { latex: '\\Delta U\\,[\\%] \\approx 1{,}53\\,\\%' },
        ],
        answer: '1,53 % — godt innenfor 5 %-grensa.',
      },
    ],
    related: ['spenningsfall-trefase-forenklet', 'spenningsfall-enfase-forenklet'],
    keywords: ['prosent', 'NEK 400', 'spenningsfall'],
    source: 'NEK 400-5-52 / NK 64 anbefalinger',
  },
];
