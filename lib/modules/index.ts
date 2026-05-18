import type { CategoryId } from '../categories';
import type { ModuleMeta } from './types';
import { DIAGNOSE_META } from './diagnose';
import { TRAFO_IT_META } from './trafo-it';
import { TRAFO_TN_META } from './trafo-tn';
import { LIKERETTER_PIV_META } from './likeretter-piv';
import { INSTALLASJONSANALYSE_META } from './installasjonsanalyse';

export const ALL_MODULES: ModuleMeta[] = [
  DIAGNOSE_META,
  TRAFO_IT_META,
  TRAFO_TN_META,
  LIKERETTER_PIV_META,
  INSTALLASJONSANALYSE_META,
];

export function getModule(id: string): ModuleMeta | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getModulesByCategory(category: CategoryId): ModuleMeta[] {
  return ALL_MODULES.filter((m) => m.category === category).sort(
    (a, b) => a.order - b.order,
  );
}
