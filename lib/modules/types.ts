import type { CategoryId } from '../categories';

export type ModuleStatus = 'ok' | 'warn' | 'fail' | 'info';

export type ModuleResultRow = {
  label: string;
  value: string;
  unit?: string;
  status?: ModuleStatus;
  hint?: string;
};

export type ModuleResultSection = {
  title: string;
  rows: ModuleResultRow[];
  note?: string;
};

export type ModuleVerdict = {
  status: ModuleStatus;
  text: string;
};

export type ModuleResult = {
  sections: ModuleResultSection[];
  recommendations?: string[];
  verdict?: ModuleVerdict;
};

export type ModuleMeta = {
  id: string;
  slug: string;
  category: Extract<CategoryId, 'diagnose' | 'anlegg-system'>;
  title: string;
  subtitle?: string;
  description: string;
  whenToUse: string;
  keywords?: string[];
  source?: string;
  glyph?: string;
  order: number;
};
