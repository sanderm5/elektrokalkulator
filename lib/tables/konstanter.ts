import type { ReferenceTable } from './types';

export const KONSTANTER: ReferenceTable = {
  id: 'konstanter',
  slug: 'konstanter',
  title: 'Standardkonstanter — eksamen',
  description:
    'Materialkonstanter og standardverdier til norsk elektroinstallasjon. Kopierbart oppslag når en formel krever en konstant.',
  source: 'NEK 400 / Montørhåndboka / ELE2',
  verifyStatus: 'verifisert',
  topic: 'likestrom',
  glyph: 'k',
  order: 13,
  relatedFormulaIds: ['resistivitet', 'temperatur-motstand', 'ik-min', 'ik-maks'],
  columns: [
    { key: 'symbol', label: 'Symbol', align: 'left', primary: true },
    { key: 'verdi', label: 'Verdi', align: 'right', copyable: true },
    { key: 'enhet', label: 'Enhet', align: 'left' },
    { key: 'bruk', label: 'Bruk', align: 'left' },
  ],
  sections: [
    {
      id: 'materiale',
      title: 'Materialkonstanter',
      rows: [
        { id: 'rho-cu', cells: { symbol: 'ρ_Cu', verdi: '0,0175', enhet: 'Ω·mm²/m', bruk: 'Resistivitet kobber ved 20 °C' }, highlight: true },
        { id: 'rho-al', cells: { symbol: 'ρ_Al', verdi: '0,028', enhet: 'Ω·mm²/m', bruk: 'Resistivitet aluminium ved 20 °C' } },
        { id: 'alpha-cu', cells: { symbol: 'α_Cu', verdi: '0,004', enhet: '/°C', bruk: 'Temperaturkoeffisient kobber' }, highlight: true },
        { id: 'alpha-al', cells: { symbol: 'α_Al', verdi: '0,004', enhet: '/°C', bruk: 'Temperaturkoeffisient aluminium' } },
      ],
    },
    {
      id: 'kortslutning',
      title: 'Kortslutningskoeffisienter (EN 60909)',
      rows: [
        { id: 'cmin', cells: { symbol: 'c_min', verdi: '0,95', enhet: '', bruk: 'Spennings­koeffisient for I_k,min (verste tilfelle)' }, highlight: true },
        { id: 'cmaks', cells: { symbol: 'c_maks', verdi: '1,05', enhet: '', bruk: 'Spennings­koeffisient for I_k,maks (≤ 1 kV)' }, highlight: true },
        { id: 'ktemp', cells: { symbol: 'k_temp', verdi: '1,2', enhet: '', bruk: 'Temperaturfaktor for kabel i drift (70 °C)' } },
      ],
    },
    {
      id: 'fysikk',
      title: 'Fysiske konstanter',
      rows: [
        { id: 'mu0', cells: { symbol: 'μ₀', verdi: '4π·10⁻⁷', enhet: 'Vs/Am', bruk: 'Permeabilitet vakuum' } },
        { id: 'sqrt2', cells: { symbol: '√2', verdi: '1,414', enhet: '', bruk: 'Topp/RMS-forhold for sinus' } },
        { id: 'sqrt3', cells: { symbol: '√3', verdi: '1,732', enhet: '', bruk: 'Trefase: U_L/U_F og effekt' }, highlight: true },
        { id: 'fnett', cells: { symbol: 'f', verdi: '50', enhet: 'Hz', bruk: 'Norsk nettfrekvens' }, highlight: true },
      ],
    },
    {
      id: 'halvleder',
      title: 'Halvleder',
      rows: [
        { id: 'usi', cells: { symbol: 'U_Si', verdi: '0,7', enhet: 'V', bruk: 'Diodefall silisium (typisk)' } },
        { id: 'uge', cells: { symbol: 'U_Ge', verdi: '0,3', enhet: 'V', bruk: 'Diodefall germanium' } },
      ],
    },
  ],
  notes: [
    'Resistivitet ved 70 °C drift: ρ_Cu(70) ≈ 0,021 Ω·mm²/m (= 1,2 × 0,0175).',
    'For aluminium ved 70 °C: ρ_Al(70) ≈ 0,034 Ω·mm²/m.',
    'c-koeffisienter brukes kun ved kortslutningsberegning — ikke i designstrøm.',
  ],
};
