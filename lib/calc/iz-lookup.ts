import { KABEL_BELASTNING } from '../tables/kabel-belastning';

export type KabelType = 'PFXP-2' | 'PFXP-3' | 'TFXP-2' | 'TFXP-3';
export type Forlegging = 'A2' | 'B2' | 'C' | 'D2' | 'E';

const SECTION_BY_KABELTYPE: Record<KabelType, string> = {
  'PFXP-2': 'pfxp-2leder',
  'PFXP-3': 'pfxp-3leder',
  'TFXP-2': 'tfxp-2leder',
  'TFXP-3': 'tfxp-3leder',
};

/**
 * Returnerer strømføringsevne Iz i ampere for en gitt kabeltype, tverrsnitt og
 * forlegningsmetode. Returnerer undefined hvis kombinasjonen ikke finnes
 * (typisk fordi tabellen ikke er fullstendig verifisert for den kolonnen).
 */
export function getIz(
  kabelType: KabelType,
  A_mm2: number,
  forlegging: Forlegging,
): number | undefined {
  const sectionId = SECTION_BY_KABELTYPE[kabelType];
  const section = KABEL_BELASTNING.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const row = section.rows.find((r) => Number(r.cells.A) === A_mm2);
  if (!row) return undefined;
  const cell = row.cells[forlegging];
  if (typeof cell === 'number') return cell;
  return undefined;
}
