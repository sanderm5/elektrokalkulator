import type { ElectroSymbol } from './types';

const VB = '0 0 60 60';

/**
 * Plantegnings-symboler iht. "Skarven Forlag — _A Elkraft 1-50".
 * Brukes på arkitekturtegninger 1:50 / 1:100.
 *
 * Alle SVG-paths bruker stroke="currentColor" så fargen styres av Tailwind.
 * strokeWidth standardiseres på 1.6, "round"-cap/join for konsistent stil.
 */

// Reusable bryter-arm: ledning fra bunn til kontakt-punkt, så arm 45° opp/høyre
function BryterBase({ count = 1 }: { count?: number }) {
  return (
    <>
      <line x1="30" y1="55" x2="30" y2="35" />
      <circle cx="30" cy="35" r="2.5" fill="currentColor" />
      <line x1="30" y1="35" x2="45" y2="20" />
      {count >= 2 && <line x1="32" y1="36" x2="45" y2="22" strokeWidth="1.2" />}
      {count >= 3 && <line x1="34" y1="37" x2="45" y2="24" strokeWidth="1.2" />}
    </>
  );
}

function StikkContact({ withGround = false }: { withGround?: boolean }) {
  // Halvsirkel åpen oppover representerer stikkontakt (IEC-stil i bruk i NEK)
  return (
    <>
      <line x1="30" y1="55" x2="30" y2="40" />
      <path d="M 18 40 A 12 12 0 0 1 42 40" fill="none" />
      {withGround && <line x1="18" y1="40" x2="42" y2="40" />}
    </>
  );
}

export const PLANTEGNING_SYMBOLER: ElectroSymbol[] = [
  // === BRYTERE (rad A og B fra PDF) =========================================
  {
    id: 'bryter-enpolet',
    name: 'Bryter, enpolet',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A1',
    keywords: ['bryter', 'enpolet', 'on/off'],
    description: 'Vanlig av/på-bryter for én belysningskrets.',
    viewBox: VB,
    paths: <BryterBase count={1} />,
  },
  {
    id: 'bryter-topolet',
    name: 'Bryter, topolet',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A2',
    keywords: ['bryter', 'topolet', '2-pol'],
    description: 'Bryter som bryter både fase og N — kreves f.eks. i IT-system og våtrom.',
    viewBox: VB,
    paths: <BryterBase count={2} />,
  },
  {
    id: 'bryter-kronevender',
    name: 'Kronevender / serievender',
    subtitle: 'A3',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A3',
    keywords: ['kronevender', 'serievender'],
    description: 'Styrer to belysningsgrupper uavhengig fra samme bryterpunkt.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="35" />
        <circle cx="30" cy="35" r="2.5" fill="currentColor" />
        <line x1="30" y1="35" x2="42" y2="22" />
        <line x1="30" y1="35" x2="18" y2="22" />
      </>
    ),
  },
  {
    id: 'bryter-vekselvender',
    name: 'Vekselvender',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A4',
    keywords: ['vekselvender', 'trappebryter', 'to-veis'],
    description: 'To bryterpunkter styrer samme lyspunkt — typisk i trapper og lange ganger.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="35" />
        <circle cx="30" cy="35" r="2.5" fill="currentColor" />
        <line x1="30" y1="35" x2="44" y2="24" />
        <line x1="30" y1="35" x2="44" y2="14" strokeWidth="0.9" strokeDasharray="2 2" />
      </>
    ),
  },
  {
    id: 'bryter-kryssvender',
    name: 'Kryssvender',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A5',
    keywords: ['kryssvender', '3-punkts'],
    description: 'Brukes i kombinasjon med vekselvendere for å styre lys fra tre eller flere punkter.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="35" />
        <circle cx="30" cy="35" r="2.5" fill="currentColor" />
        <line x1="30" y1="35" x2="45" y2="20" />
        <line x1="30" y1="35" x2="15" y2="20" />
        <line x1="22" y1="28" x2="38" y2="28" strokeWidth="1.1" />
      </>
    ),
  },
  {
    id: 'bryter-trepolet',
    name: 'Bryter, trepolet',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'B7',
    keywords: ['trepolet', '3-pol', 'trefase'],
    description: 'Bryter alle tre faser samtidig — for trefase laster.',
    viewBox: VB,
    paths: <BryterBase count={3} />,
  },
  {
    id: 'pulsbryter',
    name: 'Pulsbryter',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A7',
    keywords: ['pulsbryter', 'puls', 'momentan'],
    description: 'Returnerer til hvileposisjon — for impulsrelé eller trappetidur.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="35" />
        <circle cx="30" cy="35" r="2.5" fill="currentColor" />
        <line x1="30" y1="35" x2="45" y2="20" />
        <line x1="38" y1="22" x2="42" y2="18" strokeWidth="1.1" />
      </>
    ),
  },
  {
    id: 'bryter-nokkel',
    name: 'Bryter m/nøkkel',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A8',
    keywords: ['nøkkel', 'lås', 'sikret bryter'],
    description: 'Krever nøkkel for å operere — bruk på allmenne steder eller sikkerhets­kurser.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="35" />
        <circle cx="30" cy="35" r="4" fill="none" />
        <line x1="30" y1="35" x2="46" y2="20" />
        <line x1="30" y1="31" x2="30" y2="22" />
      </>
    ),
  },
  {
    id: 'trykknapp',
    name: 'Trykknapp',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'A99',
    keywords: ['trykknapp', 'knapp'],
    description: 'Momentanbryter — typisk for ringeklokke, lysstyring via impulsrelé.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="38" />
        <circle cx="30" cy="33" r="6" fill="none" />
      </>
    ),
  },
  {
    id: 'bryter-enpolet-lys',
    name: 'Bryter, enpolet m/lys',
    category: 'bryter',
    kind: 'plantegning',
    ref: 'B2',
    keywords: ['bryter m/lys', 'orienteringslys'],
    description: 'Bryter med innebygd orienteringslys — synlig i mørket.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="35" />
        <circle cx="30" cy="35" r="2.5" fill="currentColor" />
        <line x1="30" y1="35" x2="45" y2="20" />
        <circle cx="30" cy="35" r="6" fill="none" strokeDasharray="1.5 1.5" />
      </>
    ),
  },

  // === STIKKONTAKTER (rad B, C og D) =========================================
  {
    id: 'stikk-u-jord-enkel',
    name: 'Enkel stikkontakt u/jord',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'B9',
    keywords: ['stikkontakt', 'stikk', 'u/jord', 'uten jord'],
    description: 'Stikkontakt uten jord. Ikke tillatt i nyinstallasjon — eldre anlegg.',
    viewBox: VB,
    paths: <StikkContact withGround={false} />,
  },
  {
    id: 'stikk-u-jord-dobbel',
    name: 'Dobbel stikkontakt u/jord',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'C1',
    keywords: ['stikkontakt', 'dobbel', 'u/jord'],
    description: 'To uttak uten jord.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <path d="M 14 40 A 10 10 0 0 1 30 40" />
        <path d="M 30 40 A 10 10 0 0 1 46 40" />
      </>
    ),
  },
  {
    id: 'stikk-m-jord-enkel',
    name: 'Enkel stikkontakt m/jord',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'C4',
    keywords: ['stikkontakt', 'jordet', 'm/jord'],
    description: 'Standard stikkontakt med jord — krav i nye boliger.',
    viewBox: VB,
    paths: <StikkContact withGround={true} />,
  },
  {
    id: 'stikk-m-jord-dobbel',
    name: 'Dobbel stikkontakt m/jord',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'C5',
    keywords: ['stikkontakt', 'dobbel', 'jordet'],
    description: 'To uttak med jord — vanligste i bolig.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <path d="M 14 40 A 10 10 0 0 1 30 40" />
        <path d="M 30 40 A 10 10 0 0 1 46 40" />
        <line x1="14" y1="40" x2="46" y2="40" />
      </>
    ),
  },
  {
    id: 'stikk-m-jord-tredobbel',
    name: 'Tredobbel stikkontakt m/jord',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'C6',
    keywords: ['stikkontakt', 'tredobbel', '3-uttak'],
    description: 'Tre uttak med jord i samme boks.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="42" />
        <path d="M 8 42 A 7 7 0 0 1 22 42" />
        <path d="M 23 42 A 7 7 0 0 1 37 42" />
        <path d="M 38 42 A 7 7 0 0 1 52 42" />
        <line x1="8" y1="42" x2="52" y2="42" />
      </>
    ),
  },
  {
    id: 'stikk-m-bryter',
    name: 'Stikkontakt m/bryter m/jord',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'C9',
    keywords: ['stikkontakt', 'bryter', 'integrert'],
    description: 'Kombinert stikkontakt og bryter i samme boks.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <path d="M 18 40 A 12 12 0 0 1 42 40" />
        <line x1="18" y1="40" x2="42" y2="40" />
        <line x1="42" y1="30" x2="52" y2="22" />
        <circle cx="42" cy="30" r="1.8" fill="currentColor" />
      </>
    ),
  },
  {
    id: 'stikk-barnevern',
    name: 'Stikkontakt m/barnevern',
    category: 'stikk',
    kind: 'plantegning',
    ref: 'D7',
    keywords: ['barnevern', 'sikret', 'safe'],
    description: 'Stikkontakt med innebygd barnevern — pliktig i nye boliger.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <path d="M 18 40 A 12 12 0 0 1 42 40" />
        <line x1="18" y1="40" x2="42" y2="40" />
        <text x="30" y="30" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none">
          B
        </text>
      </>
    ),
  },
  {
    id: 'stikk-i-tak-m-jord',
    name: 'Stikkontakt i tak m/jord',
    category: 'tak-stikk',
    kind: 'plantegning',
    ref: 'D5',
    keywords: ['tak', 'stikk', 'takstikk', 'lyspunkt'],
    description: 'Tak-stikkontakt med jord — for lysarmatur eller takvifte.',
    viewBox: VB,
    paths: (
      <>
        <circle cx="30" cy="30" r="10" />
        <line x1="20" y1="30" x2="40" y2="30" />
        <line x1="30" y1="30" x2="30" y2="55" strokeDasharray="2 2" />
      </>
    ),
  },

  // === SVAKSTRØM-UTTAK (rad E) ==============================================
  {
    id: 'uttak-tv',
    name: 'Uttak for radio og TV',
    category: 'uttak-svakstrom',
    kind: 'plantegning',
    ref: 'E1',
    keywords: ['TV', 'antenne', 'radio'],
    description: 'Antenneuttak — koaksial-kabel.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <path d="M 22 40 L 30 30 L 38 40 Z" />
      </>
    ),
  },
  {
    id: 'uttak-telefon',
    name: 'Uttak for rikstelefon',
    category: 'uttak-svakstrom',
    kind: 'plantegning',
    ref: 'E2',
    keywords: ['telefon', 'rikstelefon'],
    description: 'Tradisjonelt telefonuttak.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <path d="M 22 40 L 30 30 L 38 40 Z" fill="currentColor" />
      </>
    ),
  },
  {
    id: 'uttak-data',
    name: 'Uttak for hustelefon / calling / data',
    category: 'uttak-svakstrom',
    kind: 'plantegning',
    ref: 'E3',
    keywords: ['data', 'nettverk', 'RJ45', 'calling'],
    description: 'Svakstrømsuttak — data eller intern­telefon.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="42" />
        <path d="M 22 42 L 30 32 L 38 42 Z" />
        <line x1="26" y1="42" x2="34" y2="42" strokeWidth="1.1" />
      </>
    ),
  },

  // === LYS (rad E, F) ========================================================
  {
    id: 'lampe-vegg',
    name: 'Lampe på vegg',
    category: 'lys',
    kind: 'plantegning',
    ref: 'F6',
    keywords: ['lampe', 'vegg', 'vegglampe'],
    description: 'Vegg­montert lyspunkt.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <circle cx="30" cy="33" r="8" />
        <line x1="22" y1="25" x2="38" y2="41" />
        <line x1="38" y1="25" x2="22" y2="41" />
        <line x1="20" y1="55" x2="40" y2="55" strokeWidth="2" />
      </>
    ),
  },
  {
    id: 'lampe-bryter',
    name: 'Lampe m/bryter',
    category: 'lys',
    kind: 'plantegning',
    ref: 'F7',
    keywords: ['lampe', 'bryter integrert'],
    description: 'Lampe med innebygd snorbryter.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="55" x2="30" y2="40" />
        <circle cx="30" cy="33" r="8" />
        <line x1="22" y1="25" x2="38" y2="41" />
        <line x1="38" y1="25" x2="22" y2="41" />
        <line x1="40" y1="33" x2="48" y2="25" />
      </>
    ),
  },
  {
    id: 'lyskaster-downlight',
    name: 'Lyskaster / downlight',
    category: 'lys',
    kind: 'plantegning',
    ref: 'F8',
    keywords: ['downlight', 'lyskaster', 'spotlight'],
    description: 'Innfelt downlight eller fast lyskaster.',
    viewBox: VB,
    paths: (
      <>
        <circle cx="30" cy="30" r="10" />
        <line x1="22" y1="22" x2="38" y2="38" />
        <line x1="38" y1="22" x2="22" y2="38" />
        <line x1="30" y1="40" x2="30" y2="48" strokeWidth="1.4" />
        <line x1="26" y1="48" x2="34" y2="48" strokeWidth="1.4" />
      </>
    ),
  },
  {
    id: 'signallampe',
    name: 'Signallampe',
    category: 'lys',
    kind: 'plantegning',
    ref: 'F9',
    keywords: ['signal', 'indikator', 'driftsignal'],
    description: 'Signal/indikator for driftstilstand.',
    viewBox: VB,
    paths: (
      <>
        <circle cx="30" cy="30" r="10" />
        <line x1="22" y1="22" x2="38" y2="38" />
        <line x1="38" y1="22" x2="22" y2="38" />
      </>
    ),
  },
  {
    id: 'lysarmatur-1-lysror',
    name: 'Lysarmatur m/1 lysrør',
    category: 'lys',
    kind: 'plantegning',
    ref: 'E4',
    keywords: ['lysrør', 'armatur', 'fluorescent'],
    description: 'Lysarmatur med ett lysrør — sjekk effekt på tegningen.',
    viewBox: '0 0 80 30',
    paths: (
      <>
        <rect x="10" y="10" width="60" height="6" rx="1" />
      </>
    ),
  },
  {
    id: 'lysarmatur-2-lysror',
    name: 'Lysarmatur m/2 lysrør',
    category: 'lys',
    kind: 'plantegning',
    ref: 'E5',
    keywords: ['lysrør', '2-rør', 'armatur'],
    description: 'Lysarmatur med to lysrør.',
    viewBox: '0 0 80 30',
    paths: (
      <>
        <rect x="10" y="6" width="60" height="6" rx="1" />
        <rect x="10" y="18" width="60" height="6" rx="1" />
      </>
    ),
  },
  {
    id: 'lysarmatur-3-lysror',
    name: 'Lysarmatur m/3 lysrør',
    category: 'lys',
    kind: 'plantegning',
    ref: 'E6',
    keywords: ['lysrør', '3-rør', 'armatur'],
    description: 'Lysarmatur med tre lysrør.',
    viewBox: '0 0 80 30',
    paths: (
      <>
        <rect x="10" y="3" width="60" height="5" rx="1" />
        <rect x="10" y="12.5" width="60" height="5" rx="1" />
        <rect x="10" y="22" width="60" height="5" rx="1" />
      </>
    ),
  },

  // === TAVLE OG MÅLEUTSTYR (rad G og H) ====================================
  {
    id: 'tavle-400',
    name: 'Tavle, bredde 400 mm',
    category: 'tavle',
    kind: 'plantegning',
    ref: 'G3',
    keywords: ['tavle', 'fordeling', 'sikringsskap'],
    description: 'Sikringsskap / fordelingstavle — bredde i målestokk.',
    viewBox: '0 0 80 40',
    paths: (
      <>
        <rect x="10" y="12" width="60" height="16" />
        <line x1="20" y1="12" x2="20" y2="28" strokeWidth="0.8" />
        <line x1="30" y1="12" x2="30" y2="28" strokeWidth="0.8" />
        <line x1="40" y1="12" x2="40" y2="28" strokeWidth="0.8" />
        <line x1="50" y1="12" x2="50" y2="28" strokeWidth="0.8" />
        <line x1="60" y1="12" x2="60" y2="28" strokeWidth="0.8" />
      </>
    ),
  },
  {
    id: 'termostat',
    name: 'Termostat',
    category: 'maling',
    kind: 'plantegning',
    ref: 'G8',
    keywords: ['termostat', 'temperatur'],
    description: 'Romtermostat — typisk for varmekabler eller panelovner.',
    viewBox: VB,
    paths: (
      <>
        <rect x="18" y="20" width="24" height="20" rx="2" />
        <text x="30" y="35" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none">
          °C
        </text>
      </>
    ),
  },
  {
    id: 'temperaturfoler-gulv',
    name: 'Temperaturføler i gulv',
    category: 'maling',
    kind: 'plantegning',
    ref: 'G7',
    keywords: ['temperatur', 'føler', 'gulv', 'varmekabel'],
    description: 'Føler i gulv for varmekabel-termostat.',
    viewBox: VB,
    paths: (
      <>
        <line x1="14" y1="45" x2="46" y2="45" strokeWidth="1.4" />
        <line x1="30" y1="45" x2="30" y2="20" />
        <rect x="22" y="12" width="16" height="10" rx="1" />
      </>
    ),
  },
  {
    id: 'jordfeilbryter-plantegning',
    name: 'Jordfeilbryter (RCD) — symbol',
    category: 'vern',
    kind: 'plantegning',
    ref: 'H4',
    keywords: ['jordfeil', 'RCD', 'jordfeilbryter'],
    description: 'Markering på plantegning for at kursen har RCD.',
    viewBox: VB,
    paths: (
      <>
        <rect x="14" y="16" width="32" height="28" rx="2" />
        <text x="30" y="35" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          I∆
        </text>
      </>
    ),
  },
  {
    id: 'gjennomstromningsovn',
    name: 'Gjennomstrømningsovn',
    subtitle: 'Effekt-merket på tegning',
    category: 'varme',
    kind: 'plantegning',
    ref: 'H6/I1',
    keywords: ['gjennomstrømningsovn', 'panelovn', 'varme'],
    description: 'Fast montert varmeovn — sjekk effekt-merke på tegning (40-2000 W).',
    viewBox: '0 0 80 30',
    paths: (
      <>
        <rect x="10" y="10" width="60" height="10" />
        <line x1="20" y1="10" x2="20" y2="20" strokeWidth="0.8" />
        <line x1="30" y1="10" x2="30" y2="20" strokeWidth="0.8" />
        <line x1="40" y1="10" x2="40" y2="20" strokeWidth="0.8" />
        <line x1="50" y1="10" x2="50" y2="20" strokeWidth="0.8" />
        <line x1="60" y1="10" x2="60" y2="20" strokeWidth="0.8" />
      </>
    ),
  },
  {
    id: 'reflektorovn',
    name: 'Reflektorovn',
    category: 'varme',
    kind: 'plantegning',
    ref: 'I9/J1',
    keywords: ['reflektorovn', 'varme', 'IR'],
    description: 'Reflektorovn / IR-varmer — typisk på bad eller terrasse.',
    viewBox: '0 0 80 30',
    paths: (
      <>
        <line x1="10" y1="20" x2="70" y2="20" strokeWidth="2" />
        <line x1="14" y1="20" x2="20" y2="10" strokeWidth="1" />
        <line x1="24" y1="20" x2="30" y2="10" strokeWidth="1" />
        <line x1="34" y1="20" x2="40" y2="10" strokeWidth="1" />
        <line x1="44" y1="20" x2="50" y2="10" strokeWidth="1" />
        <line x1="54" y1="20" x2="60" y2="10" strokeWidth="1" />
      </>
    ),
  },
];
