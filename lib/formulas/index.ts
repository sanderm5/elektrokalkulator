import type { CategoryId } from '../categories';
import type { Formula } from './types';
import { LIKESTROM_FORMULAS } from './likestrom';
import { VEKSELSTROM_FORMULAS } from './vekselstrom-enfase';
import { TREFASE_FORMULAS } from './trefase';
import { SPENNINGSFALL_FORMULAS } from './spenningsfall';
import { KORTSLUTNING_FORMULAS } from './kortslutning';
import { VERN_FORMULAS } from './vern';
import { KABEL_FORMULAS } from './kabel-dimensjonering';
import { BELASTNINGSBEREGNING_FORMULAS } from './belastningsberegning';
import { NETTSYSTEMER_FORMULAS } from './nettsystemer';
import { TRANSFORMATOR_FORMULAS } from './transformator';
import { MOTOR_FORMULAS } from './motor';
import { LIKERETTER_FORMULAS } from './likeretter';
import { BELYSNING_FORMULAS } from './belysning';
import { ENERGI_VARME_FORMULAS } from './energi-varme';
import { ELEKTROMAGNETISME_FORMULAS } from './elektromagnetisme';

export const ALL_FORMULAS: Formula[] = [
  ...LIKESTROM_FORMULAS,
  ...VEKSELSTROM_FORMULAS,
  ...TREFASE_FORMULAS,
  ...SPENNINGSFALL_FORMULAS,
  ...KORTSLUTNING_FORMULAS,
  ...VERN_FORMULAS,
  ...KABEL_FORMULAS,
  ...BELASTNINGSBEREGNING_FORMULAS,
  ...NETTSYSTEMER_FORMULAS,
  ...TRANSFORMATOR_FORMULAS,
  ...MOTOR_FORMULAS,
  ...LIKERETTER_FORMULAS,
  ...BELYSNING_FORMULAS,
  ...ENERGI_VARME_FORMULAS,
  ...ELEKTROMAGNETISME_FORMULAS,
];

export function getFormula(id: string): Formula | undefined {
  return ALL_FORMULAS.find((f) => f.id === id);
}

export function getFormulasByCategory(category: CategoryId): Formula[] {
  return ALL_FORMULAS.filter((f) => f.category === category);
}
