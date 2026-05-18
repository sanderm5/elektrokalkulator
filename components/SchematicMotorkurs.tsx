/**
 * Samme motor-kurs vist i to former side om side:
 *
 * Enlinjeskjema (én tråd representerer 3 faser):
 *   Innmating → 3-pol vern → 3-pol kontaktor → 3-pol motorvern → motor M
 *
 * Flerlinjet skjema (hver fase tegnes separat):
 *   L1/L2/L3 → tre brytere (vern) → tre kontaktorkontakter → tre termiske
 *   overload-relé → tre faser inn på motor.
 */
export function SchematicMotorkurs() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* === Enlinjeskjema === */}
      <figure className="glass rounded-2xl p-4 sm:p-6">
        <header className="mb-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-copper-300">
            Enlinjeskjema
          </p>
          <h3 className="font-display text-base text-ink-50 mt-0.5">
            Motorkurs, kompakt
          </h3>
        </header>
        <svg
          viewBox="0 0 200 380"
          className="w-full text-copper-300"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          role="img"
          aria-label="Enlinjeskjema for motorkurs"
        >
          {/* Innmating */}
          <line x1="100" y1="10" x2="100" y2="40" />
          <line x1="92" y1="18" x2="108" y2="18" />
          <line x1="94" y1="22" x2="106" y2="22" />
          <line x1="96" y1="26" x2="104" y2="26" />
          <text x="115" y="24" fontSize="10" fontFamily="monospace" fill="currentColor" stroke="none">
            L1/L2/L3 · 400 V
          </text>

          {/* 3-pol vern (Krav 1+2) */}
          <rect x="88" y="50" width="24" height="32" rx="1" />
          <text x="100" y="68" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">
            C16
          </text>
          <line x1="100" y1="82" x2="100" y2="110" />
          <text x="120" y="70" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none">
            3-pol vern
          </text>

          {/* Kontaktor (magnetbryter, K1) */}
          <rect x="88" y="110" width="24" height="28" rx="1" />
          <path d="M 86 117 Q 90 121 86 125" />
          <text x="120" y="128" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none">
            Kontaktor K1
          </text>
          <line x1="100" y1="138" x2="100" y2="165" />

          {/* Termisk overlast F2 */}
          <rect x="88" y="165" width="24" height="28" rx="1" />
          <line x1="92" y1="173" x2="108" y2="173" strokeWidth="1.1" />
          <line x1="92" y1="183" x2="108" y2="183" strokeWidth="1.1" />
          <text x="120" y="183" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none">
            Motorvern F2
          </text>
          <line x1="100" y1="193" x2="100" y2="225" />

          {/* Motor M */}
          <circle cx="100" cy="250" r="22" />
          <text x="100" y="248" textAnchor="middle" fontSize="12" fontFamily="serif" fontStyle="italic" fontWeight="700" fill="currentColor" stroke="none">
            M
          </text>
          <text x="100" y="260" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
            3∼
          </text>
          <text x="100" y="290" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none">
            Asynkron 4 kW
          </text>

          {/* PE-leder ved siden av */}
          <line x1="160" y1="40" x2="160" y2="225" strokeDasharray="3 2" />
          <line x1="160" y1="225" x2="100" y2="272" strokeDasharray="3 2" />
          <text x="165" y="48" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none">
            PE
          </text>

          {/* Jord-symbol */}
          <line x1="92" y1="320" x2="108" y2="320" strokeWidth="2" />
          <line x1="95" y1="326" x2="105" y2="326" strokeWidth="1.4" />
          <line x1="98" y1="332" x2="102" y2="332" strokeWidth="1" />
          <line x1="100" y1="272" x2="100" y2="320" strokeDasharray="3 2" />
        </svg>
        <figcaption className="mt-3 text-xs text-ink-500 leading-relaxed">
          Én linje representerer alle 3 faser. Komponentene står over hverandre.
          Brukes for oversikt over en kurs eller hel installasjon.
        </figcaption>
      </figure>

      {/* === Flerlinjet skjema === */}
      <figure className="glass rounded-2xl p-4 sm:p-6">
        <header className="mb-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-copper-300">
            Flerlinjet skjema
          </p>
          <h3 className="font-display text-base text-ink-50 mt-0.5">
            Samme motorkurs, utdetaljert
          </h3>
        </header>
        <svg
          viewBox="0 0 300 380"
          className="w-full text-copper-300"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          role="img"
          aria-label="Flerlinjet skjema for motorkurs"
        >
          {/* Tre faseledere på toppen */}
          <text x="70" y="20" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">L1</text>
          <text x="150" y="20" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">L2</text>
          <text x="230" y="20" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">L3</text>

          {/* 3-pol vern (3 brytere koblet sammen) */}
          {[70, 150, 230].map((x) => (
            <g key={`vern-${x}`}>
              <line x1={x} y1="30" x2={x} y2="60" />
              <circle cx={x} cy="60" r="2" fill="currentColor" />
              <line x1={x} y1="60" x2={x + 12} y2="80" />
              <circle cx={x} cy="90" r="2" fill="currentColor" />
              <line x1={x} y1="90" x2={x} y2="115" />
            </g>
          ))}
          {/* Stiplet linje binder de tre bryterne (mekanisk kobling) */}
          <line x1="70" y1="75" x2="230" y2="75" strokeDasharray="2 2" strokeWidth="0.9" />
          <text x="245" y="78" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none">F1 (C16)</text>

          {/* Kontaktor — 3 kontakter med felles betjening */}
          {[70, 150, 230].map((x) => (
            <g key={`kontakt-${x}`}>
              <line x1={x} y1="115" x2={x} y2="135" />
              <circle cx={x} cy="135" r="2" fill="currentColor" />
              <line x1={x} y1="135" x2={x + 12} y2="155" />
              <circle cx={x} cy="165" r="2" fill="currentColor" />
              <line x1={x} y1="165" x2={x} y2="195" />
            </g>
          ))}
          <line x1="70" y1="150" x2="230" y2="150" strokeDasharray="2 2" strokeWidth="0.9" />
          {/* Kontaktor-spole-bue */}
          <path d="M 68 142 Q 72 146 68 150" />
          <path d="M 148 142 Q 152 146 148 150" />
          <path d="M 228 142 Q 232 146 228 150" />
          <text x="245" y="153" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none">K1</text>

          {/* Termisk overlast — 3 elementer */}
          {[70, 150, 230].map((x) => (
            <g key={`overlast-${x}`}>
              <rect x={x - 8} y="195" width="16" height="24" rx="1" />
              <line x1={x - 5} y1="201" x2={x + 5} y2="201" strokeWidth="1.1" />
              <line x1={x - 5} y1="213" x2={x + 5} y2="213" strokeWidth="1.1" />
              <line x1={x} y1="219" x2={x} y2="245" />
            </g>
          ))}
          <text x="245" y="210" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none">F2</text>

          {/* Klemmer for motor (U/V/W) */}
          {[70, 150, 230].map((x) => (
            <g key={`klemme-${x}`}>
              <circle cx={x} cy="250" r="3" />
              <line x1={x} y1="253" x2={x} y2="280" />
            </g>
          ))}
          <text x="55" y="248" fontSize="8" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">U</text>
          <text x="135" y="248" fontSize="8" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">V</text>
          <text x="215" y="248" fontSize="8" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">W</text>

          {/* Motor — sirkel rundt alle tre */}
          <ellipse cx="150" cy="305" rx="80" ry="25" />
          <text x="150" y="304" textAnchor="middle" fontSize="14" fontFamily="serif" fontStyle="italic" fontWeight="700" fill="currentColor" stroke="none">M</text>
          <text x="150" y="318" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">3∼ 4 kW</text>

          {/* PE/jording */}
          <line x1="150" y1="330" x2="150" y2="350" strokeDasharray="3 2" />
          <line x1="142" y1="350" x2="158" y2="350" strokeWidth="2" />
          <line x1="145" y1="356" x2="155" y2="356" strokeWidth="1.4" />
          <line x1="148" y1="362" x2="152" y2="362" strokeWidth="1" />
        </svg>
        <figcaption className="mt-3 text-xs text-ink-500 leading-relaxed">
          Hver fase tegnes som egen linje. Stiplede mekaniske koblinger binder
          komponenter som opererer samtidig. Brukes for kobling og feilsøking.
        </figcaption>
      </figure>
    </div>
  );
}
