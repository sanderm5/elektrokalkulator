/**
 * Enlinjeskjema for typisk bolig-inntak (TN-S, 230 V 1-fas eller 400 V 3-fas):
 * netteier → hovedsikring → kWh-måler → hovedvern → RCD → grenkurser.
 *
 * Vises som SVG i copper-stroke matching app-identiteten. Etiketter til høyre
 * for hver komponent, skinne (busbar) som horisontal linje.
 */
export function SchematicBoligInntak() {
  // 1 cm = 10 SVG-enheter. Total bredde 480, høyde 460.
  return (
    <div className="glass rounded-2xl p-4 sm:p-6 overflow-x-auto">
      <svg
        viewBox="0 0 480 480"
        className="w-full text-copper-300"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        role="img"
        aria-label="Enlinjeskjema for bolig-inntak"
      >
        {/* === Inntak ovenfra === */}
        <line x1="240" y1="20" x2="240" y2="60" />
        <text
          x="252"
          y="40"
          fontSize="11"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Fra netteier · TN-S
        </text>

        {/* === kWh-måler === */}
        <circle cx="240" cy="80" r="20" />
        <text
          x="240"
          y="84"
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          kWh
        </text>
        <line x1="240" y1="100" x2="240" y2="125" />
        <text
          x="270"
          y="84"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Forbruksmåler
        </text>

        {/* === Hovedvern (3-fas eller 1-fas gG eller MCB) === */}
        <rect x="225" y="125" width="30" height="35" rx="1" />
        <line x1="232" y1="135" x2="248" y2="135" strokeWidth="1.1" />
        <line x1="232" y1="150" x2="248" y2="150" strokeWidth="1.1" />
        <text
          x="270"
          y="148"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Hovedvern 3-pol gG 50 A
        </text>
        <line x1="240" y1="160" x2="240" y2="185" />

        {/* === Hoved-RCD (typisk A, 30 mA, 4-pol) === */}
        <rect x="220" y="185" width="40" height="30" rx="1" />
        <text
          x="240"
          y="204"
          textAnchor="middle"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          I∆n
        </text>
        <text
          x="270"
          y="204"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          RCD type A · 30 mA · 4-pol
        </text>
        <line x1="240" y1="215" x2="240" y2="245" />

        {/* === Hovedsamleskinne === */}
        <line x1="50" y1="245" x2="430" y2="245" strokeWidth="2" />
        <circle cx="240" cy="245" r="2.5" fill="currentColor" />
        <text
          x="50"
          y="237"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Fordelings-samleskinne
        </text>

        {/* === 5 grenkurser === */}
        {[
          { x: 80, label: 'Lys', vern: 'B10', kabel: '1,5 mm²' },
          { x: 170, label: 'Stikk stue', vern: 'B16', kabel: '2,5 mm²' },
          { x: 260, label: 'Kjøkken', vern: 'C16', kabel: '2,5 mm²' },
          { x: 350, label: 'Varme', vern: 'B16', kabel: '2,5 mm²' },
          { x: 410, label: 'EV-lading', vern: 'B32', kabel: '6 mm²', rcdB: true },
        ].map((kurs) => (
          <g key={kurs.label}>
            <line x1={kurs.x} y1="245" x2={kurs.x} y2="275" />
            <circle cx={kurs.x} cy="245" r="2" fill="currentColor" />
            {/* Vern (MCB) */}
            <rect x={kurs.x - 10} y="275" width="20" height="26" rx="1" />
            <text
              x={kurs.x}
              y="292"
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
              fill="currentColor"
              stroke="none"
            >
              {kurs.vern}
            </text>
            <line x1={kurs.x} y1="301" x2={kurs.x} y2={kurs.rcdB ? '315' : '345'} />
            {/* Egen RCD type B for EV */}
            {kurs.rcdB && (
              <>
                <rect x={kurs.x - 12} y="315" width="24" height="20" rx="1" />
                <text
                  x={kurs.x}
                  y="328"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="currentColor"
                  stroke="none"
                >
                  I∆B
                </text>
                <line x1={kurs.x} y1="335" x2={kurs.x} y2="365" />
              </>
            )}
            {/* Last-symbol — sirkel for kurs */}
            <circle cx={kurs.x} cy={kurs.rcdB ? 380 : 365} r="12" />
            <text
              x={kurs.x}
              y={(kurs.rcdB ? 384 : 369)}
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.label.split(' ')[0]}
            </text>
            {/* Kabel-merke */}
            <text
              x={kurs.x}
              y={kurs.rcdB ? 410 : 395}
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.kabel}
            </text>
          </g>
        ))}

        {/* === PE-skinne === */}
        <line x1="50" y1="455" x2="430" y2="455" strokeWidth="2" />
        <line x1="56" y1="463" x2="74" y2="463" strokeWidth="1.4" />
        <line x1="60" y1="471" x2="70" y2="471" strokeWidth="1" />
        <text
          x="80"
          y="467"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          PE-skinne
        </text>
      </svg>

      <figcaption className="mt-4 text-xs text-ink-500 leading-relaxed">
        <strong className="text-ink-200">Bolig-inntak (enlinjeskjema):</strong>{' '}
        netteier → kWh-måler → hovedvern (gG) → hoved-RCD (type A) →
        samleskinne → grenkurser med egne MCB. EV-lading har egen RCD type B
        iht. NEK 400-7-722. Standard krav: 30 mA RCD, ≤ 32 A på stikk.
      </figcaption>
    </div>
  );
}
