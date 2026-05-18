import type { Template } from './types';
import { KUNDEKOMMUNIKASJON_TEMPLATES } from './kundekommunikasjon';

export const ALL_TEMPLATES: Template[] = [...KUNDEKOMMUNIKASJON_TEMPLATES];

export function getTemplate(slug: string): Template | undefined {
  return ALL_TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplatesByKind(kind: Template['kind']): Template[] {
  return ALL_TEMPLATES.filter((t) => t.kind === kind).sort(
    (a, b) => a.order - b.order,
  );
}
