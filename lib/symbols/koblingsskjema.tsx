import type { ElectroSymbol } from './types';

const VB = '0 0 60 60';

/**
 * Koblingsskjema-symboler iht. IEC 60617 (gjelder for NEK 400).
 * Brukes på enlinjeskjema og flerlinjeskjema.
 */

export const KOBLINGSSKJEMA_SYMBOLER: ElectroSymbol[] = [
  // === VERN =================================================================
  {
    id: 'mcb',
    name: 'Automatsikring (MCB)',
    subtitle: 'B / C / D karakteristikk',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['MCB', 'automat', 'B', 'C', 'D', 'sikring'],
    description: 'Termisk-magnetisk overstrøms- og kortslutningsvern. Karakteristikk B (5·In), C (10·In), D (20·In).',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="22" />
        <rect x="22" y="22" width="16" height="20" rx="1" />
        <line x1="30" y1="42" x2="30" y2="58" />
        <line x1="26" y1="27" x2="34" y2="27" strokeWidth="1.1" />
        <line x1="26" y1="37" x2="34" y2="37" strokeWidth="1.1" />
        <text x="30" y="35" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          B
        </text>
      </>
    ),
  },
  {
    id: 'smeltesikring-gg',
    name: 'Smeltesikring (gG)',
    subtitle: 'Generell — IEC 60269',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['gG', 'smeltesikring', 'NH'],
    description: 'Smeltesikring med generell karakteristikk — bryter både overstrøm og kortslutning. Sjekk Krav 2 (1,6·In).',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="20" />
        <rect x="22" y="20" width="16" height="20" />
        <line x1="30" y1="40" x2="30" y2="58" />
      </>
    ),
  },
  {
    id: 'rcd-type-a',
    name: 'Jordfeilbryter (RCD) type A',
    subtitle: 'AC + pulserende DC',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['RCD', 'jordfeil', 'A', '30 mA'],
    description: 'Standard RCD i bolig. Reagerer på AC og pulserende DC. Typisk 30 mA.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="20" />
        <rect x="14" y="20" width="32" height="22" rx="1" />
        <line x1="30" y1="42" x2="30" y2="58" />
        <text x="30" y="34" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          I∆n
        </text>
      </>
    ),
  },
  {
    id: 'rcd-type-b',
    name: 'Jordfeilbryter (RCD) type B',
    subtitle: 'AC + DC (EV-lading)',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['RCD', 'type B', 'EV', 'DC', '722'],
    description: 'RCD som også fanger glatt DC. Krav for EV-lading (NEK 400-7-722), frekvensomformer og solcelle.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="20" />
        <rect x="14" y="20" width="32" height="22" rx="1" />
        <line x1="30" y1="42" x2="30" y2="58" />
        <text x="30" y="34" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          I∆B
        </text>
      </>
    ),
  },
  {
    id: 'rcbo',
    name: 'RCBO — kombinert vern',
    subtitle: 'MCB + RCD i ett',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['RCBO', 'jordfeilautomat', 'kombi'],
    description: 'Kombinert automatsikring og jordfeilbryter — én modul per kurs.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="18" />
        <rect x="14" y="18" width="32" height="26" rx="1" />
        <line x1="30" y1="44" x2="30" y2="58" />
        <text x="30" y="30" textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          B
        </text>
        <text x="30" y="40" textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          I∆
        </text>
      </>
    ),
  },
  {
    id: 'skillebryter-3p',
    name: 'Skillebryter, 3-polet',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['skillebryter', 'lastskillebryter', '3-pol'],
    description: 'Skiller anlegget galvanisk fra forsyningen — uten bryteevne ved last.',
    viewBox: VB,
    paths: (
      <>
        <line x1="14" y1="5" x2="14" y2="20" />
        <line x1="30" y1="5" x2="30" y2="20" />
        <line x1="46" y1="5" x2="46" y2="20" />
        <line x1="14" y1="20" x2="22" y2="35" />
        <line x1="30" y1="20" x2="38" y2="35" />
        <line x1="46" y1="20" x2="54" y2="35" strokeDasharray="2 2" />
        <line x1="14" y1="40" x2="14" y2="58" />
        <line x1="30" y1="40" x2="30" y2="58" />
        <line x1="46" y1="40" x2="46" y2="58" />
        <circle cx="14" cy="40" r="1.6" fill="currentColor" />
        <circle cx="30" cy="40" r="1.6" fill="currentColor" />
        <circle cx="46" cy="40" r="1.6" fill="currentColor" />
      </>
    ),
  },
  {
    id: 'kontaktor',
    name: 'Kontaktor, 3-polet',
    category: 'vern',
    kind: 'koblingsskjema',
    keywords: ['kontaktor', 'magnetbryter', 'motorbryter'],
    description: 'Elektromagnetisk styrt bryter — standard for motorstart.',
    viewBox: VB,
    paths: (
      <>
        <line x1="14" y1="5" x2="14" y2="20" />
        <line x1="30" y1="5" x2="30" y2="20" />
        <line x1="46" y1="5" x2="46" y2="20" />
        <line x1="14" y1="20" x2="22" y2="35" />
        <line x1="30" y1="20" x2="38" y2="35" />
        <line x1="46" y1="20" x2="54" y2="35" />
        <path d="M 12 18 Q 16 22 12 26" />
        <path d="M 28 18 Q 32 22 28 26" />
        <path d="M 44 18 Q 48 22 44 26" />
        <line x1="14" y1="40" x2="14" y2="58" />
        <line x1="30" y1="40" x2="30" y2="58" />
        <line x1="46" y1="40" x2="46" y2="58" />
      </>
    ),
  },

  // === MASKINER ==============================================================
  {
    id: 'motor-trefase',
    name: 'Motor, trefase asynkron',
    subtitle: 'M ~3',
    category: 'maskin',
    kind: 'koblingsskjema',
    keywords: ['motor', 'asynkron', 'M', 'trefase'],
    description: 'Standard trefase induksjons­motor. Vises som sirkel med "M".',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="14" />
        <circle cx="30" cy="30" r="16" />
        <text x="30" y="29" textAnchor="middle" fontSize="11" fontFamily="serif" fontStyle="italic" fontWeight="700" fill="currentColor" stroke="none">
          M
        </text>
        <text x="30" y="40" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
          3∼
        </text>
      </>
    ),
  },
  {
    id: 'transformator',
    name: 'Transformator (2-vikling)',
    category: 'maskin',
    kind: 'koblingsskjema',
    keywords: ['trafo', 'transformator', 'omformer'],
    description: 'To viklinger som overlapper. For 3-fas trafo: bruk 3 par.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="18" />
        <circle cx="30" cy="24" r="6" />
        <circle cx="30" cy="36" r="6" />
        <line x1="30" y1="42" x2="30" y2="55" />
      </>
    ),
  },
  {
    id: 'generator',
    name: 'Generator',
    subtitle: 'G ~',
    category: 'maskin',
    kind: 'koblingsskjema',
    keywords: ['generator', 'G', 'aggregat'],
    description: 'Vekselstrøm-generator (aggregat / nødstrøm).',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="14" />
        <circle cx="30" cy="30" r="16" />
        <text x="30" y="33" textAnchor="middle" fontSize="12" fontFamily="serif" fontStyle="italic" fontWeight="700" fill="currentColor" stroke="none">
          G
        </text>
      </>
    ),
  },

  // === JORD ==================================================================
  {
    id: 'jord-pe',
    name: 'Beskyttelsesjord (PE)',
    category: 'jord',
    kind: 'koblingsskjema',
    keywords: ['PE', 'jord', 'beskyttelsesjord'],
    description: 'Beskyttelsesleder — gulgrønn i kabelen.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="32" />
        <line x1="14" y1="32" x2="46" y2="32" strokeWidth="2" />
        <line x1="20" y1="38" x2="40" y2="38" strokeWidth="1.4" />
        <line x1="26" y1="44" x2="34" y2="44" strokeWidth="1" />
      </>
    ),
  },
  {
    id: 'jord-pen',
    name: 'Felles jord/N (PEN)',
    category: 'jord',
    kind: 'koblingsskjema',
    keywords: ['PEN', 'PEL', 'kombinert', 'TN-C'],
    description: 'Kombinert PE og N — kun i TN-C-systemet, forbudt etter fordeling.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="32" />
        <line x1="14" y1="32" x2="46" y2="32" strokeWidth="2" />
        <line x1="20" y1="38" x2="40" y2="38" strokeWidth="1.4" />
        <line x1="26" y1="44" x2="34" y2="44" strokeWidth="1" />
        <text x="48" y="30" fontSize="7" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          PEN
        </text>
      </>
    ),
  },
  {
    id: 'utjevningsforbindelse',
    name: 'Utjevningsforbindelse',
    category: 'jord',
    kind: 'koblingsskjema',
    keywords: ['utjevning', 'lokal', 'våtrom'],
    description: 'Lokal utjevningsforbindelse — krav i våtrom (§701).',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="32" />
        <line x1="10" y1="32" x2="50" y2="32" strokeWidth="2" />
        <line x1="14" y1="42" x2="22" y2="42" />
        <line x1="26" y1="42" x2="34" y2="42" />
        <line x1="38" y1="42" x2="46" y2="42" />
      </>
    ),
  },

  // === KOBLINGSELEMENTER (linjer/kryssninger) ===============================
  {
    id: 'krysning-uten-kontakt',
    name: 'Krysning uten kontakt',
    category: 'kobling',
    kind: 'koblingsskjema',
    keywords: ['krysning', 'bro', 'uten kontakt'],
    description: 'To linjer som krysser uten elektrisk forbindelse — bro­markering.',
    viewBox: VB,
    paths: (
      <>
        <line x1="5" y1="30" x2="25" y2="30" />
        <path d="M 25 30 Q 30 22 35 30" fill="none" />
        <line x1="35" y1="30" x2="55" y2="30" />
        <line x1="30" y1="10" x2="30" y2="50" />
      </>
    ),
  },
  {
    id: 'kobling-t',
    name: 'T-forbindelse (kontakt)',
    category: 'kobling',
    kind: 'koblingsskjema',
    keywords: ['kobling', 'forbindelse', 'T-kobling'],
    description: 'Elektrisk forbindelse mellom linjer — markert med fyllt punkt.',
    viewBox: VB,
    paths: (
      <>
        <line x1="5" y1="30" x2="55" y2="30" />
        <line x1="30" y1="30" x2="30" y2="55" />
        <circle cx="30" cy="30" r="2.5" fill="currentColor" />
      </>
    ),
  },

  // === MÅLER ================================================================
  {
    id: 'kwh-maler',
    name: 'kWh-måler',
    category: 'maling',
    kind: 'koblingsskjema',
    keywords: ['måler', 'kWh', 'forbruksmåler'],
    description: 'Energimåler — kWh-teller.',
    viewBox: VB,
    paths: (
      <>
        <line x1="30" y1="5" x2="30" y2="14" />
        <circle cx="30" cy="30" r="16" />
        <text x="30" y="33" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
          kWh
        </text>
      </>
    ),
  },
];
