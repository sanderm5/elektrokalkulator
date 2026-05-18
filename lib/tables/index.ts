import type { ReferenceTable } from './types';
import { SAMTIDIGHET } from './samtidighet';
import { VERN_STANDARDREKKE } from './vern-standardrekke';
import { VERN_IA } from './vern-ia';
import { UTKOBLINGSTIDER } from './utkoblingstider';
import { SLUTTKONTROLL } from './sluttkontroll';
import { SPENNINGSFALL_KRAV } from './spenningsfall-krav';
import { RCD } from './rcd';
import { KABEL_BELASTNING } from './kabel-belastning';
import { RESISTANS } from './resistans';
import { KORREKSJONSFAKTORER } from './korreksjonsfaktorer';
import { KABELTYPER } from './kabeltyper';
import { K_VERDIER_TERMISK } from './k-verdier-termisk';
import { SONE_KRAV } from './sone-krav';
import { NEK_SPESIALROM } from './nek-spesialrom';
import { SYNKRONTURTALL } from './synkronturtall';
import { KONSTANTER } from './konstanter';
import { FORSKRIFT_FEL } from './forskrift-fel';
import { FORSKRIFT_FSE } from './forskrift-fse';
import { FORSKRIFT_FEK } from './forskrift-fek';
import { DE_5_SIKRE } from './de-5-sikre';
import { HALVLEDERKOMPONENTER } from './halvlederkomponenter';
import { NEK_52B_4 } from './nek-52b-4';

export const ALL_TABLES: ReferenceTable[] = [
  SAMTIDIGHET,
  VERN_STANDARDREKKE,
  VERN_IA,
  UTKOBLINGSTIDER,
  SLUTTKONTROLL,
  SPENNINGSFALL_KRAV,
  RCD,
  KABEL_BELASTNING,
  RESISTANS,
  KORREKSJONSFAKTORER,
  KABELTYPER,
  K_VERDIER_TERMISK,
  SONE_KRAV,
  NEK_SPESIALROM,
  SYNKRONTURTALL,
  KONSTANTER,
  FORSKRIFT_FEL,
  FORSKRIFT_FSE,
  FORSKRIFT_FEK,
  DE_5_SIKRE,
  HALVLEDERKOMPONENTER,
  NEK_52B_4,
];

export function getTable(slug: string): ReferenceTable | undefined {
  return ALL_TABLES.find((t) => t.slug === slug);
}
