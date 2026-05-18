import type { Formula } from './types';

export const TREFASE_FORMULAS: Formula[] = [
  {
    id: 'designstrom-enfase',
    category: 'trefase',
    title: 'Designstrøm enfase (I_b)',
    subtitle: 'I_b = P / (U · cos φ)',
    latex: 'I_{b} = \\dfrac{P}{U \\cdot \\cos\\varphi}',
    description:
      'Designstrømmen I_b er den forventede driftsstrømmen til en enfase last. Den er utgangspunktet for kabel- og verndimensjonering. U er fasespenningen (230 V i Norge). For rene resistive laster (varme, belysning med glødelamper) er cos φ ≈ 1; for elektronikk og induktive laster brukes oppgitt verdi.',
    whenToUse:
      'Første beregning når du dimensjonerer en ny enfase kurs. Brukes som input til Krav 1 (I_b ≤ I_n ≤ I_z) og videre for spenningsfallsberegning.',
    inputs: [
      { symbol: 'P', name: 'Aktiv effekt', unit: 'W', defaultValue: 4600, hint: '4,6 kW = 4600 W. Maks 1-fase i Norge typisk 4600 W ved 20 A.', min: 0 },
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, hint: '230 V i Norge (mellom fase og N i TN, eller mellom faser i IT).', min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.84, hint: 'Resistiv last: 1,0. Bolig blandet: 0,84–0,9. Motor: 0,7–0,85.', min: 0, max: 1 },
    ],
    output: { symbol: 'I_b', name: 'Designstrøm', unit: 'A', decimals: 3 },
    calculate: ({ P, U, cosphi }) => {
      const denom = U * cosphi;
      if (denom <= 0) throw new Error('Spenning og cos φ må være > 0.');
      return P / denom;
    },
    examples: [
      {
        scenario: 'Varmekabel på 2300 W ved 230 V (cos φ = 1, resistiv).',
        inputs: { P: 2300, U: 230, cosphi: 1.0 },
        steps: [
          { latex: 'I_{b} = \\dfrac{2300}{230 \\cdot 1{,}0}' },
          { latex: 'I_{b} = 10\\ \\mathrm{A}' },
        ],
        answer: 'I_b = 10 A → 16 A vern, 2,5 mm² kabel.',
      },
      {
        scenario: 'Stikkontaktkurs bolig: 4600 W ved 230 V med cos φ = 0,84.',
        inputs: { P: 4600, U: 230, cosphi: 0.84 },
        steps: [
          { latex: 'I_{b} = \\dfrac{4600}{230 \\cdot 0{,}84}' },
          { latex: 'I_{b} \\approx 23{,}8\\ \\mathrm{A}' },
        ],
        answer: 'I_b ≈ 23,8 A — vern 25 A duger med riktig kabel.',
      },
    ],
    related: ['strom-fra-effekt-trefase', 'krav-1-overlast', 'dimensjonerende-effekt'],
    keywords: ['designstrøm', 'Ib', 'enfase', 'kabeldim', '230V'],
    source: 'NEK 400-5-52',
  },
  {
    id: 'y-kobling-spenning',
    category: 'trefase',
    title: 'Y-kobling: linjespenning fra fasespenning',
    subtitle: 'U_L = √3 · U_F',
    latex: 'U_{L} = \\sqrt{3} \\cdot U_{F}',
    description:
      'I en stjernekobling (Y) er linjespenningen mellom to faser √3 ganger fasespenningen (faseleder til nøytral). I et 400/230 V system er linjespenningen 400 V og fasespenningen 230 V.',
    whenToUse:
      'Når du har et trefase TN-S anlegg og skal regne fra fasespenning til linjespenning, eller motsatt. Sentral i alle trefase-beregninger.',
    inputs: [
      { symbol: 'UF', name: 'Fasespenning', unit: 'V', defaultValue: 230, hint: '230 V i Norge (TN).', min: 0 },
    ],
    output: { symbol: 'U_L', name: 'Linjespenning', unit: 'V', decimals: 3 },
    calculate: ({ UF }) => Math.sqrt(3) * UF,
    examples: [
      {
        scenario: 'Fasespenning er 230 V. Hva er linjespenningen?',
        inputs: { UF: 230 },
        steps: [
          { latex: 'U_{L} = \\sqrt{3} \\cdot 230' },
          { latex: 'U_{L} \\approx 398{,}4\\ \\mathrm{V} \\approx 400\\ \\mathrm{V}' },
        ],
        answer: 'U_L ≈ 400 V',
      },
    ],
    related: ['d-kobling-strom', 'aktiv-effekt-trefase'],
    keywords: ['Y-kobling', 'stjerne', 'linjespenning', 'fasespenning'],
  },
  {
    id: 'd-kobling-strom',
    category: 'trefase',
    title: 'D-kobling: linjestrøm fra fasestrøm',
    subtitle: 'I_L = √3 · I_F',
    latex: 'I_{L} = \\sqrt{3} \\cdot I_{F}',
    description:
      'I en trekantkobling (D / Δ) er linjestrømmen √3 ganger fasestrømmen, mens linjespenningen er lik fasespenningen. Motsatt av Y-kobling der det er spenningen som forsterkes.',
    whenToUse:
      'For motorer koblet i trekant — typisk på driftsspenning. Også brukt i Y/D-startere for å redusere startstrømmen.',
    inputs: [
      { symbol: 'IF', name: 'Fasestrøm', unit: 'A', defaultValue: 10, min: 0 },
    ],
    output: { symbol: 'I_L', name: 'Linjestrøm', unit: 'A', decimals: 3 },
    calculate: ({ IF }) => Math.sqrt(3) * IF,
    examples: [
      {
        scenario: 'En trekantkoblet motor har fasestrøm 10 A i hver vikling. Hva er linjestrømmen?',
        inputs: { IF: 10 },
        steps: [
          { latex: 'I_{L} = \\sqrt{3} \\cdot 10' },
          { latex: 'I_{L} \\approx 17{,}3\\ \\mathrm{A}' },
        ],
        answer: 'I_L ≈ 17,3 A',
      },
    ],
    related: ['y-kobling-spenning'],
    keywords: ['D-kobling', 'trekant', 'delta', 'linjestrøm'],
  },
  {
    id: 'aktiv-effekt-trefase',
    category: 'trefase',
    title: 'Aktiv effekt — trefase',
    subtitle: 'P = √3 · U_L · I_L · cos φ',
    latex: 'P = \\sqrt{3} \\cdot U_{L} \\cdot I_{L} \\cdot \\cos\\varphi',
    description:
      'Aktiv trefase-effekt er formelen som binder linjespenning, linjestrøm og effektfaktor sammen. Den brukes uansett om motoren er koblet i Y eller D — vi måler ut fra linjestørrelsene.',
    whenToUse:
      'For alle trefase laster — motorer, varmeovner, transformatorer. Standardformelen for å regne effekt på 400/230 V-anlegg.',
    inputs: [
      { symbol: 'UL', name: 'Linjespenning', unit: 'V', defaultValue: 400, min: 0 },
      { symbol: 'IL', name: 'Linjestrøm', unit: 'A', defaultValue: 16, min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.85, min: 0, max: 1 },
    ],
    output: { symbol: 'P', name: 'Aktiv effekt', unit: 'W', decimals: 2 },
    calculate: ({ UL, IL, cosphi }) => Math.sqrt(3) * UL * IL * cosphi,
    examples: [
      {
        scenario: 'En motor trekker 16 A linjestrøm ved 400 V (TN) med cos φ = 0,85. Hva er effekten?',
        inputs: { UL: 400, IL: 16, cosphi: 0.85 },
        steps: [
          { latex: 'P = \\sqrt{3} \\cdot 400 \\cdot 16 \\cdot 0{,}85' },
          { latex: 'P \\approx 9420\\ \\mathrm{W} \\approx 9{,}4\\ \\mathrm{kW}' },
        ],
        answer: 'P ≈ 9,4 kW',
      },
      {
        scenario: 'Samme motor i 230V IT 3-fas anlegg (boligstandard i Norge). Hva blir effekten?',
        inputs: { UL: 230, IL: 16, cosphi: 0.85 },
        steps: [
          { latex: 'P = \\sqrt{3} \\cdot 230 \\cdot 16 \\cdot 0{,}85' },
          { latex: 'P \\approx 5418\\ \\mathrm{W} \\approx 5{,}4\\ \\mathrm{kW}' },
        ],
        answer: 'P ≈ 5,4 kW — merk at samme strøm i IT 230V gir mye lavere effekt enn TN 400V.',
      },
    ],
    related: ['tilsynelatende-effekt-trefase', 'reaktiv-effekt-trefase', 'strom-fra-effekt-trefase', 'maks-effekt-fra-hovedvern'],
    keywords: ['trefase', 'aktiv effekt', '400V', '230V', 'IT', 'TN'],
  },
  {
    id: 'tilsynelatende-effekt-trefase',
    category: 'trefase',
    title: 'Tilsynelatende effekt — trefase',
    subtitle: 'S = √3 · U_L · I_L',
    latex: 'S = \\sqrt{3} \\cdot U_{L} \\cdot I_{L}',
    description:
      'Tilsynelatende effekt i et trefasesystem er √3 · U_L · I_L. Brukes til å dimensjonere transformatorer og generatorer — disse oppgis i kVA, ikke kW.',
    whenToUse:
      'Når du velger transformator (kVA-ytelse) eller skal sammenligne tilsynelatende effekt mellom anlegg med ulik cos φ.',
    inputs: [
      { symbol: 'UL', name: 'Linjespenning', unit: 'V', defaultValue: 400, min: 0 },
      { symbol: 'IL', name: 'Linjestrøm', unit: 'A', defaultValue: 16, min: 0 },
    ],
    output: { symbol: 'S', name: 'Tilsynelatende effekt', unit: 'VA', decimals: 2 },
    calculate: ({ UL, IL }) => Math.sqrt(3) * UL * IL,
    examples: [
      {
        scenario: 'En motor trekker 16 A ved 400 V. Hva er S?',
        inputs: { UL: 400, IL: 16 },
        steps: [
          { latex: 'S = \\sqrt{3} \\cdot 400 \\cdot 16' },
          { latex: 'S \\approx 11086\\ \\mathrm{VA} \\approx 11{,}1\\ \\mathrm{kVA}' },
        ],
        answer: 'S ≈ 11,1 kVA',
      },
    ],
    related: ['aktiv-effekt-trefase'],
    keywords: ['trefase', 'tilsynelatende', 'kVA', 'S'],
  },
  {
    id: 'strom-fra-effekt-trefase',
    category: 'trefase',
    title: 'Designstrøm trefase (I_b)',
    subtitle: 'I_b = P / (√3 · U · cos φ)',
    latex: 'I = \\dfrac{P}{\\sqrt{3} \\cdot U_{L} \\cdot \\cos\\varphi}',
    description:
      'For å finne linjestrømmen som en trefase last vil trekke, deler du aktiv effekt på (√3 · linjespenning · cos φ). Forutsetter symmetrisk last.',
    whenToUse:
      'Når du har en motors merkeskilt-effekt (kW) og skal dimensjonere kabel og vern — du må først finne strømmen.',
    inputs: [
      { symbol: 'P', name: 'Aktiv effekt', unit: 'W', defaultValue: 9400, hint: 'I watt. 9,4 kW = 9400 W.', min: 0 },
      { symbol: 'UL', name: 'Linjespenning', unit: 'V', defaultValue: 400, min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.85, min: 0, max: 1 },
    ],
    output: { symbol: 'I', name: 'Linjestrøm', unit: 'A', decimals: 3 },
    calculate: ({ P, UL, cosphi }) => {
      const denom = Math.sqrt(3) * UL * cosphi;
      if (denom <= 0) throw new Error('Spenning og cos φ må være > 0.');
      return P / denom;
    },
    examples: [
      {
        scenario: 'En motor på 9,4 kW ved 400 V (TN) med cos φ = 0,85. Hva er linjestrømmen?',
        inputs: { P: 9400, UL: 400, cosphi: 0.85 },
        steps: [
          { latex: 'I = \\dfrac{9400}{\\sqrt{3} \\cdot 400 \\cdot 0{,}85}' },
          { latex: 'I \\approx 16{,}0\\ \\mathrm{A}' },
        ],
        answer: 'I ≈ 16 A',
      },
      {
        scenario: 'Elbil-lader 22 kW i 230V IT 3-fas (cos φ ≈ 1 for likeretter-last). Hva er linjestrømmen?',
        inputs: { P: 22000, UL: 230, cosphi: 1.0 },
        steps: [
          { latex: 'I = \\dfrac{22\\,000}{\\sqrt{3} \\cdot 230 \\cdot 1{,}0}' },
          { latex: 'I \\approx 55{,}2\\ \\mathrm{A}' },
        ],
        answer: 'I ≈ 55 A — krever 63A vern minimum.',
      },
    ],
    related: ['aktiv-effekt-trefase', 'strom-fra-dimensjonerende-effekt', 'designstrom-enfase', 'krav-1-overlast'],
    keywords: ['strøm', 'trefase', 'motor', 'kabeldim', 'IT', 'TN', 'designstrøm', 'Ib'],
  },
  {
    id: 'y-til-delta',
    category: 'trefase',
    title: 'Y → Δ konvertering',
    subtitle: 'R_Δ = 3 · R_Y (symmetrisk)',
    latex: 'R_{\\Delta} = 3 \\cdot R_{Y}',
    description:
      'For symmetrisk last er en motstand i trekant 3 ganger så stor som tilsvarende motstand i stjerne. Generell formel: R_Δab = (R_Ya·R_Yb + R_Yb·R_Yc + R_Yc·R_Ya) / R_Yc. Brukes for å forenkle 3-fase nettverk.',
    whenToUse:
      'I ELE2 når en trefase-last skal omregnes mellom Y og Δ. Også for å beregne effekt ved start av motor som starter i Y og bytter til Δ.',
    inputs: [
      { symbol: 'RY', name: 'Y-motstand (per fase)', unit: 'Ω', defaultValue: 10, min: 0 },
    ],
    output: { symbol: 'R_Δ', name: 'Δ-motstand', unit: 'Ω', decimals: 3 },
    calculate: ({ RY }) => 3 * RY,
    examples: [
      {
        scenario: 'En motor er koblet i Y med 10 Ω per fase. Hva ville tilsvarende Δ-kobling vært?',
        inputs: { RY: 10 },
        steps: [
          { latex: 'R_{\\Delta} = 3 \\cdot 10' },
          { latex: 'R_{\\Delta} = 30\\ \\Omega' },
        ],
        answer: 'R_Δ = 30 Ω — Y trekker 1/3 av strømmen ved samme spenning.',
      },
    ],
    related: ['delta-til-y', 'y-kobling-spenning', 'd-kobling-strom'],
    keywords: ['Y', 'Delta', 'trekant', 'stjerne', 'konvertering'],
    source: 'ELE2 elektroteori',
  },
  {
    id: 'delta-til-y',
    category: 'trefase',
    title: 'Δ → Y konvertering',
    subtitle: 'R_Y = R_Δ / 3 (symmetrisk)',
    latex: 'R_{Y} = \\dfrac{R_{\\Delta}}{3}',
    description:
      'For symmetrisk last er Y-motstanden 1/3 av Δ-motstanden. Brukes for å forenkle 3-fase nettverk, og forklarer hvorfor Y/Δ-start gir 1/3 startstrøm.',
    whenToUse:
      'Når en Δ-last skal regnes om til Y for analyse. Også for å forstå Y/Δ-startere (3-folds redusert startstrøm).',
    inputs: [
      { symbol: 'RD', name: 'Δ-motstand (per fase)', unit: 'Ω', defaultValue: 30, min: 0 },
    ],
    output: { symbol: 'R_Y', name: 'Y-motstand', unit: 'Ω', decimals: 3 },
    calculate: ({ RD }) => RD / 3,
    examples: [
      {
        scenario: 'Motor i Δ med 30 Ω per fase. Tilsvarende Y?',
        inputs: { RD: 30 },
        steps: [
          { latex: 'R_{Y} = \\dfrac{30}{3}' },
          { latex: 'R_{Y} = 10\\ \\Omega' },
        ],
        answer: 'R_Y = 10 Ω → Y-start gir derfor 1/3 av startstrømmen.',
      },
    ],
    related: ['y-til-delta', 'y-d-startstrom'],
    keywords: ['Delta', 'Y', 'stjerne', 'trekant', 'konvertering'],
    source: 'ELE2 elektroteori',
  },
];
