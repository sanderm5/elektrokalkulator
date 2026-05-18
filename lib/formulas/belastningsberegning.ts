import type { Formula } from './types';

export const BELASTNINGSBEREGNING_FORMULAS: Formula[] = [
  {
    id: 'dimensjonerende-effekt',
    category: 'belastningsberegning',
    title: 'Dimensjonerende effekt',
    subtitle: 'P_dim = ΣP · k_samt',
    latex: 'P_{\\mathrm{dim}} = \\sum P \\cdot k_{\\mathrm{samt}}',
    description:
      'Dimensjonerende effekt er total installert effekt multiplisert med samtidighetsfaktoren. Samtidighetsfaktoren tar hensyn til at ikke alle laster brukes samtidig, slik at hovedinntak og forsyningskabel kan dimensjoneres mindre enn summen av merkeeffektene.',
    whenToUse:
      'Når du dimensjonerer hovedinntak, fordelinger eller forsyningskabler. Sentralt i alle praktiske eksamensoppgaver med flere kurser — boliginstallasjon, garasje, næringsbygg.',
    inputs: [
      {
        symbol: 'P_inst',
        name: 'Total installert effekt (ΣP)',
        unit: 'W',
        defaultValue: 30127,
        hint: 'Summen av alle laster i anlegget, før samtidighet.',
        min: 0,
      },
      {
        symbol: 'k_samt',
        name: 'Samtidighetsfaktor',
        unit: '',
        defaultValue: 0.6,
        hint: 'Typisk: bolig 0,4–0,6, kontor 0,5, hytte 0,5, elbil-lader 1,0.',
        min: 0,
        max: 1,
      },
    ],
    output: { symbol: 'P_dim', name: 'Dimensjonerende effekt', unit: 'W', decimals: 2 },
    calculate: ({ P_inst, k_samt }) => P_inst * k_samt,
    examples: [
      {
        scenario:
          'Bolig har installert 30 127 W totalt, samtidighet 0,6. Hva er dimensjonerende effekt?',
        inputs: { P_inst: 30127, k_samt: 0.6 },
        steps: [
          { latex: 'P_{\\mathrm{dim}} = 30\\,127 \\cdot 0{,}6' },
          { latex: 'P_{\\mathrm{dim}} \\approx 18\\,076\\ \\mathrm{W}' },
        ],
        answer: 'P_dim ≈ 18 076 W',
      },
      {
        scenario:
          'Anlegg med varmepumpe og elbillader: 42 842 W installert, samtidighet 0,5.',
        inputs: { P_inst: 42842, k_samt: 0.5 },
        steps: [
          { latex: 'P_{\\mathrm{dim}} = 42\\,842 \\cdot 0{,}5' },
          { latex: 'P_{\\mathrm{dim}} = 21\\,421\\ \\mathrm{W}' },
        ],
        answer: 'P_dim = 21 421 W',
      },
    ],
    related: ['strom-fra-dimensjonerende-effekt', 'maks-effekt-fra-hovedvern'],
    keywords: ['samtidighet', 'dimensjonering', 'hovedinntak', 'P_dim', 'NEK 700'],
    source: 'NEK 700 / NEK 400 praksis',
  },
  {
    id: 'strom-fra-dimensjonerende-effekt',
    category: 'belastningsberegning',
    title: 'Strøm fra dimensjonerende effekt — trefase',
    subtitle: 'I = P_dim / (√3 · U)',
    latex: 'I = \\dfrac{P_{\\mathrm{dim}}}{\\sqrt{3} \\cdot U}',
    description:
      'Strømmen som hovedinntaket må tåle finner du ved å dele dimensjonerende effekt på √3 · U. Forutsetter symmetrisk trefase last og at P_dim er regnet uten cos φ (eller at cos φ ≈ 1 — typisk for bolig).',
    whenToUse:
      'Etter at du har funnet P_dim — for å sjekke om hovedvernet er tilstrekkelig. Brukes både for 230V IT 3-fas og 400V TN 3-fas anlegg.',
    inputs: [
      {
        symbol: 'P_dim',
        name: 'Dimensjonerende effekt',
        unit: 'W',
        defaultValue: 18076,
        min: 0,
      },
      {
        symbol: 'U',
        name: 'Systemspenning',
        unit: 'V',
        defaultValue: 230,
        hint: 'IT 3-fas: 230 V. TN 3-fas: 400 V.',
        min: 0,
      },
    ],
    output: { symbol: 'I', name: 'Strøm', unit: 'A', decimals: 2 },
    calculate: ({ P_dim, U }) => {
      const denom = Math.sqrt(3) * U;
      if (denom <= 0) throw new Error('Spenning må være > 0.');
      return P_dim / denom;
    },
    examples: [
      {
        scenario:
          'Bolig med P_dim = 18 076 W i 230V IT 3-fas. Hvor stor strøm må hovedinntaket tåle?',
        inputs: { P_dim: 18076, U: 230 },
        steps: [
          { latex: 'I = \\dfrac{18\\,076}{\\sqrt{3} \\cdot 230}' },
          { latex: 'I = \\dfrac{18\\,076}{398{,}37}' },
          { latex: 'I \\approx 45{,}4\\ \\mathrm{A}' },
        ],
        answer: 'I ≈ 45,4 A — over 40A hovedvern, må oppgraderes.',
      },
      {
        scenario:
          'Samme bolig i 400V TN 3-fas. Hvor stor strøm med samme dim. effekt?',
        inputs: { P_dim: 18076, U: 400 },
        steps: [
          { latex: 'I = \\dfrac{18\\,076}{\\sqrt{3} \\cdot 400} \\approx 26{,}1\\ \\mathrm{A}' },
        ],
        answer: 'I ≈ 26 A — 32A vern ville være rikelig.',
      },
    ],
    related: ['dimensjonerende-effekt', 'maks-effekt-fra-hovedvern', 'strom-fra-effekt-trefase'],
    keywords: ['strøm', 'dimensjonerende', 'hovedinntak', 'IT', 'TN'],
  },
  {
    id: 'maks-effekt-fra-hovedvern',
    category: 'belastningsberegning',
    title: 'Maks effekt fra hovedvern',
    subtitle: 'P_maks = √3 · U · I_n',
    latex: 'P_{\\mathrm{maks}} = \\sqrt{3} \\cdot U \\cdot I_{n}',
    description:
      'Hvor mye dimensjonerende effekt et trefase hovedvern kan forsyne. Forutsetter cos φ = 1 (boliglast er typisk ren resistiv). For å sammenligne med faktisk P_dim — hvis P_dim > P_maks må vernet oppgraderes.',
    whenToUse:
      'For å sjekke om eksisterende hovedvern tåler ny installasjon (varmepumpe, elbil-lader). Også for å foreslå riktig størrelse hovedvern.',
    inputs: [
      {
        symbol: 'U',
        name: 'Systemspenning',
        unit: 'V',
        defaultValue: 230,
        hint: 'IT 3-fas: 230 V. TN 3-fas: 400 V.',
        min: 0,
      },
      {
        symbol: 'I_n',
        name: 'Hovedvernets størrelse',
        unit: 'A',
        defaultValue: 80,
        hint: 'Typiske rekker: 40, 50, 63, 80, 100, 125, 160, 200 A.',
        min: 0,
      },
    ],
    output: { symbol: 'P_maks', name: 'Maks effekt', unit: 'W', decimals: 2 },
    calculate: ({ U, I_n }) => Math.sqrt(3) * U * I_n,
    examples: [
      {
        scenario:
          'Bolig 230V IT 3-fas oppgraderes til 80A hovedvern. Hvor stor dim. effekt tåler det?',
        inputs: { U: 230, I_n: 80 },
        steps: [
          { latex: 'P_{\\mathrm{maks}} = \\sqrt{3} \\cdot 230 \\cdot 80' },
          { latex: 'P_{\\mathrm{maks}} \\approx 31\\,832\\ \\mathrm{W}' },
        ],
        answer: 'P_maks ≈ 31 832 W — rom for varmepumpe i fremtiden.',
      },
      {
        scenario:
          'Næringsbygg 400V TN 3-fas med 250A hovedvern. Hvor stor dim. effekt?',
        inputs: { U: 400, I_n: 250 },
        steps: [
          { latex: 'P_{\\mathrm{maks}} = \\sqrt{3} \\cdot 400 \\cdot 250 \\approx 173\\,205\\ \\mathrm{W}' },
        ],
        answer: 'P_maks ≈ 173 kW',
      },
    ],
    related: ['dimensjonerende-effekt', 'strom-fra-dimensjonerende-effekt'],
    keywords: ['hovedvern', 'kapasitet', 'maks last', 'inntak'],
  },
];
