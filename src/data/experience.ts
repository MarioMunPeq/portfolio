// PLACEHOLDER — Contenido provisional. Sustituir por información real.
// Regla: no inventar roles, fechas ni responsabilidades presentadas como reales.

export interface ExperienceEntry {
  company: string
  role: string
  /** Rango temporal. PLACEHOLDER — confirmar fechas reales. */
  period: string
  /** Resumen de una o dos frases. PLACEHOLDER. */
  summary: string
  /** Responsabilidades concretas. PLACEHOLDER — no inventar. */
  highlights: string[]
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Diputación de Valladolid',
    role: 'Desarrollador de Aplicaciones',
    period: '[PLACEHOLDER: AAAA — Actualidad]',
    summary: '[PLACEHOLDER] Resumen del puesto — pendiente de definir.',
    highlights: ['[PLACEHOLDER] Responsabilidad o logro real — pendiente.'],
  },
  {
    company: 'Michelin',
    role: 'Desarrollador',
    period: '[PLACEHOLDER: AAAA — AAAA]',
    summary: '[PLACEHOLDER] Resumen del puesto — pendiente de definir.',
    highlights: ['[PLACEHOLDER] Responsabilidad o logro real — pendiente.'],
  },
]
