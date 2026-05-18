import { formatNumber } from '../format';
import type { Formula } from './types';

const STANDARD_VERN_A = [
  6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630,
] as const;

/** Praktisk bruksbeskrivelse per standardvern — brukt i interpret-meldinger. */
const VERN_BRUK: Record<number, string> = {
  6: 'liten belysningskurs',
  10: 'belysning / svake stikk',
  13: 'UK-standard (sjelden i NO)',
  16: 'standard stikkontaktkurs',
  20: 'kraftige stikk / oppvask',
  25: 'komfyr / varmtvannsbereder',
  32: 'elbil-lader, sterke kurser',
  40: 'lite hovedvern eller undersentral',
  50: 'hovedvern stor bolig',
  63: 'hovedvern enebolig m/ varmepumpe',
  80: 'hovedvern stor bolig m/ elbil',
  100: 'boligblokk-inntak per leilighet',
  125: 'næringsbygg',
  160: 'større næring (NH1)',
  200: 'industri / lite næringsbygg',
  250: 'industri (NH2)',
  315: 'stor industri',
  400: 'trafostasjon-utgang (NH3)',
  500: 'industri',
  630: 'trafostasjon (NH3)',
};

function nextStandardVern(I: number): number | undefined {
  return STANDARD_VERN_A.find((v) => v >= I);
}

/** Typiske skap-størrelser (DIN-moduler). */
const SKAP_STORRELSER = [12, 18, 24, 36, 48, 72] as const;
function nextPraktiskSkap(N: number): number | undefined {
  return SKAP_STORRELSER.find((s) => s >= N);
}

export const VERN_FORMULAS: Formula[] = [
  {
    id: 'ov-dimensjonering-trefase',
    category: 'vern',
    title: 'OV-dimensjonering — trefase',
    subtitle: 'I_ov = (P · k_samt · k_res) / (√3 · U)',
    latex:
      'I_{\\mathrm{ov}} = \\dfrac{P_{\\mathrm{total}} \\cdot k_{\\mathrm{samt}} \\cdot k_{\\mathrm{res}}}{\\sqrt{3} \\cdot U}',
    description:
      'Beregner nødvendig OV-strøm for et trefase hovedinntak. Resultatet må alltid rundes opp til neste standardstørrelse — bruk «Valg av sikring».',
    whenToUse:
      'Når du dimensjonerer hovedvern for et trefase anlegg. Samtidighetsfaktor slås opp i tabell 5.4c. Reservefaktoren 1,2 (20 %) er bransjepraksis fra Montørhåndboka — noen læreverk bruker 1,3. Skap-plass-reserve er en separat regel — se «Skap-reserve».',
    inputs: [
      {
        symbol: 'P_total',
        name: 'Total installert effekt',
        unit: 'W',
        defaultValue: 25000,
        hint: 'Summen av alle laster i anlegget før samtidighet (ΣP).',
        min: 0,
        validate: (v) => {
          if (v === 0) return null;
          if (v < 5000)
            return {
              status: 'warning',
              message: 'Veldig lav effekt for en hel installasjon — sjekk om enheten er W (ikke kW).',
            };
          if (v > 500000)
            return {
              status: 'warning',
              message: 'Svært høy effekt (> 500 kW) — sjekk om enheten er W og ikke kW.',
            };
          if (v > 80000)
            return {
              status: 'info',
              message: 'Større næringsbygg / industri-nivå.',
            };
          return {
            status: 'ok',
            message: 'Typisk område for bolig (15–50 kW) eller mindre næring.',
          };
        },
      },
      {
        symbol: 'k_samt',
        name: 'Samtidighetsfaktor (k_samt)',
        unit: '',
        defaultValue: 0.6,
        hint: 'Slå opp i tabell 5.4c (per antall kurser) eller per kurstype. Bolig 7 kurser ≈ 0,6.',
        min: 0,
        max: 1,
        validate: (v) => {
          if (v <= 0) return null;
          if (v < 0.3)
            return {
              status: 'warning',
              message: 'Uvanlig lav samtidighet — sjekk tabell 5.4c. Typisk bolig 0,5–0,7.',
            };
          if (v >= 0.95)
            return {
              status: 'info',
              message: 'Nær 1,0 — typisk for installasjoner dominert av kontinuerlig last (varmepumpe, elbil, varmtvann).',
            };
          if (v >= 0.4 && v <= 0.8)
            return {
              status: 'ok',
              message: 'Typisk område for bolig (0,5–0,7) og næring (0,5–0,8).',
            };
          return { status: 'info', message: 'Innenfor mulig område — sjekk at det matcher anleggstype og fasit.' };
        },
      },
      {
        symbol: 'U',
        name: 'Linjespenning (U)',
        unit: 'V',
        defaultValue: 230,
        hint: 'IT 3-fas: 230 V. TN 3-fas (3P/3P+N): 400 V.',
        min: 0,
        validate: (v) => {
          if (v === 230)
            return {
              status: 'info',
              message: 'Tolkes som IT-nett (230 V mellom faser).',
            };
          if (v === 400)
            return {
              status: 'info',
              message: 'Tolkes som TN-nett (400 V mellom faser).',
            };
          if (v > 0 && v < 100)
            return {
              status: 'warning',
              message: 'For lav spenning for en linjespenning — typisk er 230 V (IT) eller 400 V (TN).',
            };
          if (v > 1000)
            return {
              status: 'warning',
              message: 'Over lavspenningsområdet (≤ 1000 V) — sjekk verdien.',
            };
          return {
            status: 'warning',
            message: 'Uvanlig linjespenning. Vanligvis 230 V (IT) eller 400 V (TN).',
          };
        },
      },
      {
        symbol: 'k_res',
        name: 'Reservefaktor (k_res)',
        unit: '',
        defaultValue: 1.2,
        hint: '1,2 (20 %) = bransjepraksis (Montørhåndbok). 1,3 (30 %) brukes i enkelte læreverk. Ikke eksplisitt NEK-krav — bruk verdien fasit/oppgaven oppgir.',
        min: 1,
        validate: (v) => {
          if (v === 1)
            return {
              status: 'warning',
              message: 'Ingen reserve — bryter med vanlig praksis. Standard er 1,2 (20 %).',
            };
          if (v >= 1.15 && v <= 1.35)
            return {
              status: 'ok',
              message: '1,2 (20 %) er standardpraksis. 1,3 (30 %) brukes i enkelte læreverk.',
            };
          if (v > 1.5)
            return {
              status: 'warning',
              message: 'Veldig høy reserve — sjekk fasit. Vanlige verdier er 1,2 eller 1,3.',
            };
          return null;
        },
      },
    ],
    output: { symbol: 'I_ov,beregnet', name: 'Beregnet OV-strøm', unit: 'A', decimals: 2 },
    calculate: ({ P_total, k_samt, U, k_res }) => {
      const denom = Math.sqrt(3) * U;
      if (denom <= 0) throw new Error('Spenning må være > 0.');
      return (P_total * k_samt * k_res) / denom;
    },
    interpret: (Iov, { U }) => {
      const next = nextStandardVern(Iov);
      if (next === undefined)
        return {
          status: 'warning',
          message: `Beregnet OV (${formatNumber(Iov, 1)} A) overstiger standardrekken (630 A). Krever effektbryter (MCCB) eller spesialdimensjonering.`,
        };
      const bruk = VERN_BRUK[next] ?? '';
      const nett = U === 230 ? 'IT' : U === 400 ? 'TN' : 'anlegget ditt';
      const bruksText = bruk ? ` (${bruk})` : '';
      if (Iov < 16)
        return {
          status: 'info',
          message: `Velg ${next} A som hovedvern${bruksText}. Så lav OV på trefase er uvanlig — vurder om enfase passer bedre for ${nett}-anlegget.`,
        };
      return {
        status: 'ok',
        message: `Anbefalt vern: ${next} A${bruksText} fra standardrekken. Avstand til beregnet verdi: ${formatNumber(next - Iov, 1)} A reserve.`,
      };
    },
    examples: [
      {
        scenario:
          'Bolig på IT-anlegg, total effekt 25 000 W, 7 kurser → k_samt = 0,6 (tabell 5.4c). Hva blir beregnet OV?',
        inputs: { P_total: 25000, k_samt: 0.6, U: 230, k_res: 1.2 },
        steps: [
          { latex: '25\\,000 \\cdot 0{,}6 = 15\\,000\\ \\mathrm{W}' },
          { latex: '\\sqrt{3} \\cdot 230 \\approx 397{,}7\\ \\mathrm{V}' },
          { latex: 'I = \\dfrac{15\\,000}{397{,}7} \\approx 37{,}7\\ \\mathrm{A}' },
          { latex: 'I_{\\mathrm{ov}} = 37{,}7 \\cdot 1{,}2 \\approx 45{,}2\\ \\mathrm{A}' },
        ],
        answer: 'I_ov ≈ 45,2 A → rundes opp til 50 A OV.',
      },
      {
        scenario:
          'Næringsbygg TN 3-fas, 50 000 W installert, k_samt = 0,7. Beregnet OV?',
        inputs: { P_total: 50000, k_samt: 0.7, U: 400, k_res: 1.2 },
        steps: [
          { latex: '50\\,000 \\cdot 0{,}7 = 35\\,000\\ \\mathrm{W}' },
          { latex: '\\sqrt{3} \\cdot 400 \\approx 692{,}8\\ \\mathrm{V}' },
          { latex: 'I = \\dfrac{35\\,000}{692{,}8} \\approx 50{,}5\\ \\mathrm{A}' },
          { latex: 'I_{\\mathrm{ov}} = 50{,}5 \\cdot 1{,}2 \\approx 60{,}6\\ \\mathrm{A}' },
        ],
        answer: 'I_ov ≈ 60,6 A → rundes opp til 63 A OV.',
      },
    ],
    related: [
      'ov-dimensjonering-enfase',
      'valg-av-sikring',
      'skap-reserve',
      'dimensjonerende-effekt',
      'kontinuerlig-belastning',
    ],
    keywords: [
      'OV',
      'overbelastningsvern',
      'hovedvern',
      'trefase',
      'IT',
      'TN',
      'samtidighet',
      'dimensjonering',
      'fasit',
      'tabell 5.4c',
    ],
    source: 'Montørhåndbok / bransjepraksis (NEK 400-4-43 normerer ikke 1,2-faktoren eksplisitt)',
  },
  {
    id: 'ov-dimensjonering-enfase',
    category: 'vern',
    title: 'OV-dimensjonering — enfase / tofase',
    subtitle: 'I_ov = (P · k_samt · k_res) / U',
    latex:
      'I_{\\mathrm{ov}} = \\dfrac{P_{\\mathrm{total}} \\cdot k_{\\mathrm{samt}} \\cdot k_{\\mathrm{res}}}{U}',
    description:
      'Beregner nødvendig OV-strøm for et enfase- eller tofase-anlegg. Som 3-fas, men uten √3 — du deler direkte på spenningen. Resultatet rundes opp til neste standardstørrelse.',
    whenToUse:
      'For enfase-installasjon (leilighet, lite anlegg) eller tofase-kurs. Reservefaktoren 1,2 er bransjepraksis (Montørhåndboka). Skap-plass-reserve er en egen regel — se «Skap-reserve».',
    inputs: [
      {
        symbol: 'P_total',
        name: 'Total installert effekt',
        unit: 'W',
        defaultValue: 7000,
        hint: 'Summen av alle laster på den aktuelle delen av anlegget før samtidighet.',
        min: 0,
        validate: (v) => {
          if (v === 0) return null;
          if (v < 1000)
            return {
              status: 'warning',
              message: 'Veldig lav effekt — sjekk om enheten er W (1 000 W = 1 kW).',
            };
          if (v > 30000)
            return {
              status: 'warning',
              message: 'Over 30 kW på enfase/tofase er uvanlig — vurder om trefase passer bedre.',
            };
          if (v >= 2000 && v <= 15000)
            return {
              status: 'ok',
              message: 'Typisk område for leilighet/hytte eller en sterk enkelt-last (varmtvann, elbil).',
            };
          return null;
        },
      },
      {
        symbol: 'k_samt',
        name: 'Samtidighetsfaktor (k_samt)',
        unit: '',
        defaultValue: 0.8,
        hint: 'Slå opp i samtidighetstabellen. For en enkelt kontinuerlig last (varmtvann, elbil) brukes 1,0.',
        min: 0,
        max: 1,
        validate: (v) => {
          if (v <= 0) return null;
          if (v === 1)
            return {
              status: 'info',
              message: 'k_samt = 1,0 betyr kontinuerlig last (varmtvann, elbil, varmepumpe).',
            };
          if (v < 0.3)
            return {
              status: 'warning',
              message: 'Uvanlig lav samtidighet — sjekk tabellen.',
            };
          if (v >= 0.4 && v <= 0.9)
            return {
              status: 'ok',
              message: 'Typisk område for enfase-installasjon.',
            };
          return null;
        },
      },
      {
        symbol: 'U',
        name: 'Spenning (U)',
        unit: 'V',
        defaultValue: 230,
        hint: 'TN enfase: 230 V (fase ↔ N). TN tofase: 400 V (mellom to faser). IT tofase: 230 V.',
        min: 0,
        validate: (v) => {
          if (v === 230)
            return {
              status: 'info',
              message: 'Tolkes som TN enfase (fase ↔ N) eller IT tofase.',
            };
          if (v === 400)
            return {
              status: 'info',
              message: 'Tolkes som TN tofase (mellom to faser).',
            };
          if (v > 0 && v < 100)
            return {
              status: 'warning',
              message: 'For lav spenning — typisk er 230 V eller 400 V.',
            };
          if (v > 1000)
            return {
              status: 'warning',
              message: 'Over lavspenningsområdet (≤ 1000 V) — sjekk verdien.',
            };
          return {
            status: 'warning',
            message: 'Uvanlig spenning. Vanligvis 230 V eller 400 V.',
          };
        },
      },
      {
        symbol: 'k_res',
        name: 'Reservefaktor (k_res)',
        unit: '',
        defaultValue: 1.2,
        hint: '1,2 (20 %) = bransjepraksis (Montørhåndbok). 1,3 (30 %) brukes i enkelte læreverk. Ikke eksplisitt NEK-krav — bruk verdien fasit/oppgaven oppgir.',
        min: 1,
        validate: (v) => {
          if (v === 1)
            return {
              status: 'warning',
              message: 'Ingen reserve — bryter med vanlig praksis. Standard er 1,2 (20 %).',
            };
          if (v >= 1.15 && v <= 1.35)
            return {
              status: 'ok',
              message: '1,2 (20 %) er standardpraksis. 1,3 (30 %) brukes i enkelte læreverk.',
            };
          if (v > 1.5)
            return {
              status: 'warning',
              message: 'Veldig høy reserve — sjekk fasit. Vanlige verdier er 1,2 eller 1,3.',
            };
          return null;
        },
      },
    ],
    output: { symbol: 'I_ov,beregnet', name: 'Beregnet OV-strøm', unit: 'A', decimals: 2 },
    calculate: ({ P_total, k_samt, U, k_res }) => {
      if (U <= 0) throw new Error('Spenning må være > 0.');
      return (P_total * k_samt * k_res) / U;
    },
    interpret: (Iov) => {
      const next = nextStandardVern(Iov);
      if (next === undefined)
        return {
          status: 'warning',
          message: `Beregnet OV (${formatNumber(Iov, 1)} A) overstiger standardrekken (630 A) — uvanlig stort for enfase, vurder trefase.`,
        };
      const bruk = VERN_BRUK[next] ?? '';
      const bruksText = bruk ? ` (${bruk})` : '';
      if (Iov > 80)
        return {
          status: 'warning',
          message: `Anbefalt vern: ${next} A${bruksText}. Så høy enfase-OV er uvanlig — sjekk om trefase passer bedre.`,
        };
      return {
        status: 'ok',
        message: `Anbefalt vern: ${next} A${bruksText} fra standardrekken. Avstand til beregnet verdi: ${formatNumber(next - Iov, 1)} A reserve.`,
      };
    },
    examples: [
      {
        scenario:
          'Liten leilighet på TN enfase 230 V, 7 000 W installert, k_samt = 0,8. Hva blir beregnet OV?',
        inputs: { P_total: 7000, k_samt: 0.8, U: 230, k_res: 1.2 },
        steps: [
          { latex: '7\\,000 \\cdot 0{,}8 = 5\\,600\\ \\mathrm{W}' },
          { latex: 'I = \\dfrac{5\\,600}{230} \\approx 24{,}3\\ \\mathrm{A}' },
          { latex: 'I_{\\mathrm{ov}} = 24{,}3 \\cdot 1{,}2 \\approx 29{,}2\\ \\mathrm{A}' },
        ],
        answer: 'I_ov ≈ 29,2 A → rundes opp til 32 A OV.',
      },
      {
        scenario:
          'Varmtvannsbereder kontinuerlig drift, TN tofase 400 V, 9 000 W. k_samt = 1,0.',
        inputs: { P_total: 9000, k_samt: 1.0, U: 400, k_res: 1.2 },
        steps: [
          { latex: 'I = \\dfrac{9\\,000 \\cdot 1{,}0}{400} = 22{,}5\\ \\mathrm{A}' },
          { latex: 'I_{\\mathrm{ov}} = 22{,}5 \\cdot 1{,}2 = 27{,}0\\ \\mathrm{A}' },
        ],
        answer: 'I_ov = 27,0 A → rundes opp til 32 A OV (25 A er for lite).',
      },
    ],
    related: [
      'ov-dimensjonering-trefase',
      'valg-av-sikring',
      'skap-reserve',
      'dimensjonerende-effekt',
      'kontinuerlig-belastning',
    ],
    keywords: [
      'OV',
      'overbelastningsvern',
      'enfase',
      'tofase',
      'samtidighet',
      'dimensjonering',
      'leilighet',
      'varmtvann',
    ],
    source: 'Montørhåndbok / bransjepraksis (NEK 400-4-43 normerer ikke 1,2-faktoren eksplisitt)',
  },
  {
    id: 'valg-av-sikring',
    category: 'vern',
    title: 'Valg av sikring — avrund opp til standardrekken',
    subtitle: 'I_n ≥ I_beregnet (neste standardverdi)',
    latex: 'I_{n,\\mathrm{valgt}} = \\min\\{I_n \\in \\text{standardrekken} \\mid I_n \\geq I_{\\mathrm{beregnet}}\\}',
    description:
      'Etter at du har beregnet nødvendig strøm (f.eks. fra OV-dimensjonering) må du rundes opp til neste verdi i standardrekken iht. IEC 60898 (MCB) og IEC 60269 (gG-smelt). Rekken som brukes: 6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630 A.',
    whenToUse:
      'Det siste steget i OV-dimensjonering — etter at I_beregnet er funnet. Aldri rund ned: vern må alltid være ≥ beregnet strøm. Bruk «Bruk forrige» fra OV-dimensjoneringen for å koble flyten i ett klikk.',
    inputs: [
      {
        symbol: 'I_beregnet',
        name: 'Beregnet strøm',
        unit: 'A',
        defaultValue: 45.2,
        hint: 'Strømmen fra OV-dimensjoneringen — verdien som skal beskyttes.',
        min: 0,
        validate: (v) => {
          if (v === 0) return null;
          if (v < 1)
            return {
              status: 'warning',
              message: 'Svært lav strøm — sjekk om enheten er A og ikke mA.',
            };
          if (v > 630)
            return {
              status: 'error',
              message: 'Over 630 A — krever effektbryter (MCCB) eller dedikert NH-sikring, ikke standardrekken.',
            };
          if (v >= 6 && v <= 100)
            return {
              status: 'ok',
              message: 'Typisk område for kurser og hovedvern i bolig.',
            };
          if (v > 100)
            return {
              status: 'info',
              message: 'Næringsbygg / industri-nivå — vern over 125 A bruker NH-sikringer.',
            };
          return null;
        },
      },
    ],
    output: { symbol: 'I_n,valgt', name: 'Valgt vern (standard)', unit: 'A', decimals: 0 },
    calculate: ({ I_beregnet }) => {
      if (!Number.isFinite(I_beregnet) || I_beregnet < 0) {
        throw new Error('Beregnet strøm må være ≥ 0.');
      }
      const next = STANDARD_VERN_A.find((v) => v >= I_beregnet);
      if (next === undefined) {
        throw new Error(
          `I_beregnet (${I_beregnet} A) overstiger 630 A — bruk effektbryter (MCCB) eller dedikert NH-sikring.`,
        );
      }
      return next;
    },
    interpret: (In, { I_beregnet }) => {
      const bruk = VERN_BRUK[In] ?? '';
      const reserve = In - I_beregnet;
      const reservePct = (reserve / In) * 100;
      const bruksText = bruk ? ` — typisk for ${bruk}` : '';
      if (reservePct < 5)
        return {
          status: 'warning',
          message: `${In} A valgt${bruksText}. Margin til beregnet er bare ${formatNumber(reserve, 1)} A (${reservePct.toFixed(0)} %) — sjekk samtidighet og reserve nøye.`,
        };
      if (In >= 125)
        return {
          status: 'info',
          message: `${In} A valgt${bruksText}. Over 125 A: bruk NH-sikring (gG) eller effektbryter (MCCB) — ikke standard MCB.`,
        };
      return {
        status: 'ok',
        message: `${In} A valgt${bruksText}. Margin til beregnet: ${formatNumber(reserve, 1)} A (${reservePct.toFixed(0)} %).`,
      };
    },
    examples: [
      {
        scenario: 'Beregnet OV fra fasit-eksemplet er 45,2 A. Hvilket standardvern velger vi?',
        inputs: { I_beregnet: 45.2 },
        steps: [
          { latex: '45{,}2 \\in (40,\\ 50]' },
          { latex: 'I_{n,\\mathrm{valgt}} = 50\\ \\mathrm{A}' },
        ],
        answer: '50 A OV — første standardverdi som er ≥ 45,2 A.',
      },
      {
        scenario: 'En kurs gir I_beregnet = 14,3 A. Velg vern.',
        inputs: { I_beregnet: 14.3 },
        steps: [
          { latex: '14{,}3 \\in (13,\\ 16]' },
          { latex: 'I_{n,\\mathrm{valgt}} = 16\\ \\mathrm{A}' },
        ],
        answer: '16 A vern — standard for stikkontaktkurs.',
      },
      {
        scenario: 'Næringsbygg: I_beregnet = 78 A.',
        inputs: { I_beregnet: 78 },
        steps: [
          { latex: '78 \\in (63,\\ 80]' },
          { latex: 'I_{n,\\mathrm{valgt}} = 80\\ \\mathrm{A}' },
        ],
        answer: '80 A — NH00 sikring eller MCCB.',
      },
    ],
    related: ['ov-dimensjonering-trefase', 'ov-dimensjonering-enfase', 'kontinuerlig-belastning'],
    keywords: [
      'sikring',
      'vern',
      'standardrekke',
      'avrunding',
      'IEC 60898',
      'IEC 60269',
      'MCB',
      'gG',
    ],
    source: 'IEC 60898 (MCB) / IEC 60269 (gG-sikring)',
  },
  {
    id: 'skap-reserve',
    category: 'vern',
    title: 'Skap-reserve — 30 % ledig plass i sikringsskapet',
    subtitle: 'N_total ≥ N_brukt / 0,70',
    latex:
      'N_{\\mathrm{total}} \\geq \\left\\lceil \\dfrac{N_{\\mathrm{brukt}}}{0{,}70} \\right\\rceil',
    description:
      'NEK 400-8-823 §823.810.512.01 (innført i NEK 400:2018) krever minst 30 % ledig reserveplass i sikringsskapet i en ny bolig-installasjon, slik at det er plass til fremtidig ettermontering av kurser og utstyr. Tolkningen er at 30 % av skapets totale modulkapasitet skal være ledig — altså at brukt kapasitet maksimalt skal være 70 % av totalkapasiteten. Typiske sikringsskap kommer i 12, 18, 24, 36, 48 eller 72 DIN-moduler.',
    whenToUse:
      'Når du dimensjonerer størrelsen på sikringsskap i en ny boliginstallasjon. Tell antall DIN-moduler du planlegger å bruke (hovedvern + jordfeil + alle kurser + tilleggsutstyr som overspenningsvern, kontaktor, tidsbryter), og bruk denne formelen for å finne minimum skap-kapasitet. Gjelder kun bolig — for næring er det andre regler.',
    inputs: [
      {
        symbol: 'N_brukt',
        name: 'Antall planlagte DIN-moduler',
        unit: 'mod',
        defaultValue: 20,
        hint: 'Summen av alle moduler i bruk: hovedvern, jordfeilbrytere, alle kurssikringer, kontaktorer, overspenningsvern, evt. timer/tidsbryter.',
        min: 0,
        step: 1,
        validate: (v) => {
          if (v === 0) return null;
          if (!Number.isInteger(v))
            return {
              status: 'warning',
              message: 'DIN-moduler er hele tall. Avrund opp til neste hele.',
            };
          if (v < 5)
            return {
              status: 'warning',
              message: 'Veldig få moduler for en hel bolig — har du fått med hovedvern, jordfeilbryter og alle kurser?',
            };
          if (v > 100)
            return {
              status: 'info',
              message: 'Stort anlegg — vurder undersentral eller flere skap.',
            };
          if (v >= 12 && v <= 50)
            return {
              status: 'ok',
              message: 'Typisk størrelse for normal til stor enebolig.',
            };
          return null;
        },
      },
    ],
    output: { symbol: 'N_total,min', name: 'Minimum skap-størrelse', unit: 'mod', decimals: 0 },
    calculate: ({ N_brukt }) => {
      if (!Number.isFinite(N_brukt) || N_brukt < 0) {
        throw new Error('Antall moduler må være ≥ 0.');
      }
      return Math.ceil(N_brukt / 0.7);
    },
    interpret: (N_min, { N_brukt }) => {
      const praktisk = nextPraktiskSkap(N_min);
      if (praktisk === undefined)
        return {
          status: 'warning',
          message: `Trenger > ${N_min} moduler — over standard skap-størrelser (12, 18, 24, 36, 48, 72). Bruk to skap eller dedikert tavle.`,
        };
      const ledig = praktisk - N_brukt;
      const ledigPct = ((ledig / praktisk) * 100).toFixed(0);
      const rader = Math.ceil(praktisk / 12);
      return {
        status: 'ok',
        message: `Velg ${praktisk}-moduler skap (${rader} rader á 12). Det gir ${ledig} ledige moduler (${ledigPct} % reserve) — oppfyller 30 %-kravet.`,
      };
    },
    examples: [
      {
        scenario:
          'Normal enebolig: hovedvern + jordfeil + 18 kurssikringer = 20 moduler planlagt. Hvor stort skap?',
        inputs: { N_brukt: 20 },
        steps: [
          { latex: 'N_{\\mathrm{total,min}} = \\left\\lceil \\dfrac{20}{0{,}70} \\right\\rceil = \\lceil 28{,}57 \\rceil = 29\\ \\mathrm{mod}' },
        ],
        answer: 'Minst 29 moduler — i praksis 36-moduler skap (3 rader á 12). Gir 16 ledige (44 %).',
      },
      {
        scenario: 'Mindre leilighet: 14 moduler planlagt.',
        inputs: { N_brukt: 14 },
        steps: [
          { latex: 'N_{\\mathrm{total,min}} = \\left\\lceil \\dfrac{14}{0{,}70} \\right\\rceil = 20\\ \\mathrm{mod}' },
        ],
        answer: '20 moduler er minimum — velg 24-moduler skap (2 rader) for komfortabel margin.',
      },
      {
        scenario: 'Stor bolig med varmepumpe, elbil, varmekabler: 32 moduler planlagt.',
        inputs: { N_brukt: 32 },
        steps: [
          { latex: 'N_{\\mathrm{total,min}} = \\left\\lceil \\dfrac{32}{0{,}70} \\right\\rceil = \\lceil 45{,}71 \\rceil = 46\\ \\mathrm{mod}' },
        ],
        answer: 'Minst 46 moduler — velg 48-moduler skap (4 rader á 12).',
      },
    ],
    related: ['ov-dimensjonering-trefase', 'ov-dimensjonering-enfase', 'kontinuerlig-belastning'],
    keywords: [
      'skap',
      'sikringsskap',
      'fordelingstavle',
      'reserveplass',
      'DIN-modul',
      'NEK 400-8-823',
      '30 prosent',
      'bolig',
    ],
    source: 'NEK 400-8-823 §823.810.512.01 (innført i NEK 400:2018)',
  },
  {
    id: 'kontinuerlig-belastning',
    category: 'vern',
    title: 'Kontinuerlig belastning — 80%-regel',
    subtitle: 'I_drift ≤ k_kont · I_n',
    latex: 'I_{\\mathrm{drift}} \\leq k_{\\mathrm{kont}} \\cdot I_{n}',
    description:
      'For laster som går kontinuerlig (≥ 3 timer), tillater NEK 400-4-43 maksimalt 80 % av vernets merkestrøm. Det er for å unngå at vernet utløses på termisk grunnlag. Eksempler: elbil-lader, varmtvannsbereder, varmekabel. Visse produsenter (Eaton FAZ, ABB) deklarerer at deres vern tåler 100 % kontinuerlig — sjekk databladet.',
    whenToUse:
      'Alltid ved dimensjonering av elbil-lader, varmtvannsbereder, varmekabel — eller andre laster som planlegges å gå over flere timer. Også relevant ved valg av motorvern.',
    inputs: [
      {
        symbol: 'I_n',
        name: 'Vernets merkestrøm',
        unit: 'A',
        defaultValue: 32,
        hint: 'Den valgte automatsikringen, f.eks. 32A for elbillader.',
        min: 0,
      },
      {
        symbol: 'k_kont',
        name: 'Kontinuitetsfaktor (k_kont)',
        unit: '',
        defaultValue: 0.8,
        hint: '0,8 standard (NEK 400-4-43). 1,0 hvis produsent dekler 100% (Eaton FAZ, ABB).',
        min: 0,
        max: 1,
      },
    ],
    output: { symbol: 'I_drift,maks', name: 'Maks driftsstrøm', unit: 'A', decimals: 2 },
    calculate: ({ I_n, k_kont }) => I_n * k_kont,
    examples: [
      {
        scenario:
          'Elbil-lader skal kobles til 32A automat med standard 80%-regel. Hva er maks strøm?',
        inputs: { I_n: 32, k_kont: 0.8 },
        steps: [
          { latex: 'I_{\\mathrm{drift,maks}} = 0{,}8 \\cdot 32' },
          { latex: 'I_{\\mathrm{drift,maks}} = 25{,}6\\ \\mathrm{A}' },
        ],
        answer: 'Maks 25,6 A — nedjuster laderen til 26 A.',
      },
      {
        scenario:
          'Samme elbil-lader, men 32A automat er en Eaton FAZ med 100% dekleration.',
        inputs: { I_n: 32, k_kont: 1.0 },
        steps: [
          { latex: 'I_{\\mathrm{drift,maks}} = 1{,}0 \\cdot 32 = 32\\ \\mathrm{A}' },
        ],
        answer: 'Maks 32 A — full belastning tillatt.',
      },
    ],
    related: ['utkoblingstid', 'vern-mot-overlast'],
    keywords: ['80%', 'kontinuerlig', 'elbil', 'kontinuitet', 'NEK 400-4-43'],
    source: 'NEK 400-4-43',
  },
  {
    id: 'utkoblingstid',
    category: 'vern',
    title: 'Utløserstrøm for automatsikring',
    subtitle: 'I_a = k · I_n',
    latex: 'I_{a} = k \\cdot I_{n}',
    description:
      'Den strømmen som garantert utløser et automatvern innen 0,1 s avhenger av karakteristikken. B = 3–5·I_n, C = 5–10·I_n, D = 10–20·I_n. Bruk øvre grense ved beregning av sløyfeimpedans.',
    whenToUse:
      'Når du skal beregne om en kurs er korrekt beskyttet — øvre grense gir verste-fall I_a som vernet trenger for å bryte i tide.',
    inputs: [
      { symbol: 'In', name: 'Merkestrøm (I_n)', unit: 'A', defaultValue: 16, hint: 'Vernets merkeverdi, f.eks. 16 A.', min: 0 },
      { symbol: 'k', name: 'Karakteristikk-faktor (k)', unit: '', defaultValue: 5, hint: 'B: 5. C: 10. D: 20 (bruk øvre grense).', min: 0 },
    ],
    output: { symbol: 'I_a', name: 'Utløserstrøm', unit: 'A', decimals: 2 },
    calculate: ({ In, k }) => In * k,
    examples: [
      {
        scenario: 'En B16 — hva er garantert utløserstrøm (verste fall)?',
        inputs: { In: 16, k: 5 },
        steps: [
          { latex: 'I_{a} = 5 \\cdot 16 = 80\\ \\mathrm{A}' },
        ],
        answer: 'I_a = 80 A',
      },
      {
        scenario: 'En C25 — hva er garantert utløserstrøm?',
        inputs: { In: 25, k: 10 },
        steps: [
          { latex: 'I_{a} = 10 \\cdot 25 = 250\\ \\mathrm{A}' },
        ],
        answer: 'I_a = 250 A',
      },
    ],
    related: ['maks-sloyfeimpedans', 'rcd-beroringsspenning'],
    keywords: ['vern', 'karakteristikk', 'B', 'C', 'D'],
    source: 'IEC 60898 / NEK 400-4-43',
  },
  {
    id: 'rcd-beroringsspenning',
    category: 'vern',
    title: 'Berøringsspenning ved jordfeil',
    subtitle: 'U_b = I_a · R_a',
    latex: 'U_{b} = I_{a} \\cdot R_{a}',
    description:
      'Berøringsspenningen er den spenningen som kan oppstå mellom utsatte ledende deler og jord ved feil. For å unngå farlige spenninger må R_a (beskyttelsesjording) være liten nok eller jordfeilbryter må bryte før spenningen overstiger 50 V.',
    whenToUse:
      'I TT-anlegg der jordfeilbryter er hovedbeskyttelsen. For å vurdere om en RCD med I_Δn = 30 mA eller 300 mA er nok ved målt R_a.',
    inputs: [
      { symbol: 'Ia', name: 'RCD utløserstrøm', unit: 'A', defaultValue: 0.03, hint: '30 mA = 0,03 A. 300 mA = 0,3 A.', min: 0 },
      { symbol: 'Ra', name: 'Beskyttelsesjording (R_a)', unit: 'Ω', defaultValue: 100, min: 0 },
    ],
    output: { symbol: 'U_b', name: 'Berøringsspenning', unit: 'V', decimals: 2 },
    calculate: ({ Ia, Ra }) => Ia * Ra,
    examples: [
      {
        scenario: 'En RCD 30 mA og R_a = 100 Ω. Er det trygt?',
        inputs: { Ia: 0.03, Ra: 100 },
        steps: [
          { latex: 'U_{b} = 0{,}03 \\cdot 100 = 3\\ \\mathrm{V}' },
        ],
        answer: 'U_b = 3 V — godt under 50 V-grensen.',
      },
      {
        scenario: 'En RCD 300 mA og R_a = 200 Ω. Trygt?',
        inputs: { Ia: 0.3, Ra: 200 },
        steps: [
          { latex: 'U_{b} = 0{,}3 \\cdot 200 = 60\\ \\mathrm{V}' },
        ],
        answer: 'U_b = 60 V — IKKE trygt, må forbedres.',
      },
    ],
    related: ['utkoblingstid'],
    keywords: ['RCD', 'berøringsspenning', 'jordfeil', 'TT'],
    source: 'NEK 400-4-41',
  },
];
