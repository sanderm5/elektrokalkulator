/**
 * Enlinjeskjema for industri-anlegg på IT-nett:
 * isolert trafo → IMD (isolasjonsovervåkning) → hovedvern → motorkurser
 * med frekvensomformer og termovern. Demonstrerer typisk IT-installasjon.
 */
export function SchematicIndustriIt() {
  return (
    <div className="glass rounded-2xl p-4 sm:p-6 overflow-x-auto">
      <svg
        viewBox="0 0 520 540"
        className="w-full text-copper-300"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        role="img"
        aria-label="Enlinjeskjema for industri på IT-nett"
      >
        {/* === Isolert trafo === */}
        <circle cx="240" cy="40" r="20" />
        <circle cx="280" cy="40" r="20" />
        <text
          x="312"
          y="44"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Isolert trafo 400/230 V IT
        </text>
        <line x1="260" y1="60" x2="260" y2="85" />

        {/* === IMD (isolasjonsovervåkning) === */}
        <rect x="220" y="85" width="80" height="40" rx="2" />
        <text
          x="260"
          y="105"
          textAnchor="middle"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          IMD
        </text>
        <text
          x="260"
          y="118"
          textAnchor="middle"
          fontSize="8"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Bender ISOMETER
        </text>
        <text
          x="312"
          y="110"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Isolasjonsovervåkning
        </text>
        <line x1="260" y1="125" x2="260" y2="160" />

        {/* === Hovedvern === */}
        <rect x="235" y="160" width="50" height="35" rx="2" />
        <line x1="245" y1="172" x2="275" y2="172" strokeWidth="1.1" />
        <line x1="245" y1="184" x2="275" y2="184" strokeWidth="1.1" />
        <text
          x="312"
          y="182"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Hovedvern MCCB 250 A
        </text>
        <line x1="260" y1="195" x2="260" y2="225" />

        {/* === Hovedsamleskinne === */}
        <line x1="40" y1="225" x2="480" y2="225" strokeWidth="2.4" />
        <circle cx="260" cy="225" r="2.5" fill="currentColor" />
        <text
          x="40"
          y="217"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Hovedsamleskinne IT 230 V
        </text>

        {/* === Motorkurser === */}
        {[
          { x: 90, label: 'M1', vern: 'D63', kabel: '16 mm²', P: '22 kW', extra: 'FU + termovern' },
          { x: 220, label: 'M2', vern: 'D50', kabel: '10 mm²', P: '15 kW', extra: 'DOL-start + termorelé' },
          { x: 350, label: 'M3', vern: 'D32', kabel: '6 mm²', P: '7,5 kW', extra: 'FU' },
          { x: 460, label: 'UPS', vern: 'C25', kabel: '4 mm²', P: '5 kW', extra: 'Kritisk last' },
        ].map((kurs) => (
          <g key={kurs.label}>
            <line x1={kurs.x} y1="225" x2={kurs.x} y2="255" />
            <circle cx={kurs.x} cy="225" r="2" fill="currentColor" />
            {/* Vern */}
            <rect x={kurs.x - 12} y="255" width="24" height="28" rx="1" />
            <text
              x={kurs.x}
              y="273"
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
              fill="currentColor"
              stroke="none"
            >
              {kurs.vern}
            </text>
            <line x1={kurs.x} y1="283" x2={kurs.x} y2="310" />
            {/* Frekvensomformer-blokk (kun M1, M3, UPS som har FU) */}
            {(kurs.label === 'M1' || kurs.label === 'M3') && (
              <>
                <rect x={kurs.x - 14} y="310" width="28" height="22" rx="1" />
                <text
                  x={kurs.x}
                  y="324"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="currentColor"
                  stroke="none"
                >
                  FU
                </text>
                <line x1={kurs.x} y1="332" x2={kurs.x} y2="360" />
              </>
            )}
            {/* Termovern (kun M2 DOL) */}
            {kurs.label === 'M2' && (
              <>
                <rect x={kurs.x - 14} y="310" width="28" height="22" rx="1" />
                <text
                  x={kurs.x}
                  y="324"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="currentColor"
                  stroke="none"
                >
                  TH
                </text>
                <line x1={kurs.x} y1="332" x2={kurs.x} y2="360" />
              </>
            )}
            {/* UPS direkte til last */}
            {kurs.label === 'UPS' && <line x1={kurs.x} y1="283" x2={kurs.x} y2="360" />}
            {/* Motor-symbol */}
            <circle cx={kurs.x} cy="380" r="16" />
            <text
              x={kurs.x}
              y="385"
              textAnchor="middle"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="700"
              fill="currentColor"
              stroke="none"
            >
              {kurs.label === 'UPS' ? 'UPS' : 'M'}
            </text>
            {/* Kurs-merke */}
            <text
              x={kurs.x}
              y="416"
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.P}
            </text>
            <text
              x={kurs.x}
              y="428"
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.kabel}
            </text>
            <text
              x={kurs.x}
              y="442"
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.extra}
            </text>
          </g>
        ))}

        {/* === Utjevningsskinne (IT har ikke PEN — egen jordingselektrode + utjevning) === */}
        <line x1="40" y1="488" x2="480" y2="488" strokeWidth="2.4" />
        <line x1="46" y1="496" x2="64" y2="496" strokeWidth="1.4" />
        <line x1="50" y1="504" x2="60" y2="504" strokeWidth="1" />
        <text
          x="76"
          y="500"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Utjevning til byggets jordsystem (R_a {'<'} 50 Ω)
        </text>
        <text
          x="200"
          y="522"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          IT — første jordfeil gir IKKE utløsning, men varsel via IMD
        </text>
      </svg>

      <figcaption className="mt-4 text-xs text-ink-500 leading-relaxed">
        <strong className="text-ink-200">Industri på IT-nett:</strong>{' '}
        Isolert nett gir kontinuerlig drift ved første jordfeil — IMD-en
        varsler så driftspersonellet kan rette feilen før den andre oppstår.
        Motorkurser har frekvensomformere (FU) eller termorelé som
        startstrøm­vern. UPS sikrer kritisk last. NB: i IT-nett må
        berøringsspenning U_b = I_jord × R_a holdes under 50 V iht. NEK 400-411.6.
      </figcaption>
    </div>
  );
}
