// PLACEHOLDER — Contenido provisional. Sustituir por información real.
// Regla: no inventar roles, fechas ni responsabilidades presentadas como reales.

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  /** Rango temporal. PLACEHOLDER — confirmar fechas reales. */
  period: string
  /** Resumen de una o dos frases. PLACEHOLDER. */
  summary: string
  /** Responsabilidades concretas. PLACEHOLDER — no inventar. */
  highlights: string[]
  /** Metadato corto opcional (modalidad/contrato). PLACEHOLDER donde proceda. */
  meta?: string
  /** Ubicación / centro de trabajo. PLACEHOLDER donde proceda. */
  location?: string
  /** Capítulo futuro: mensaje "por desbloquear", no una experiencia cerrada. */
  upcoming?: boolean
  /** Logo/avatar opcional de la empresa (se muestra como avatar de chat). */
  logo?: string
  /** Texto alternativo del logo. */
  logoAlt?: string
}

export const experience: ExperienceEntry[] = [
  {
    id: 'synersight',
    company: 'Synersight',
    role: '[PLACEHOLDER: Puesto — pendiente de definir]',
    period: '[PLACEHOLDER: AAAA — AAAA]',
    summary: '[PLACEHOLDER] Resumen del puesto — pendiente de definir.',
    highlights: ['[PLACEHOLDER] Responsabilidad o logro real — pendiente.'],
    meta: '[PLACEHOLDER: Modalidad]',
    location: '[PLACEHOLDER: Ubicación]',
  },
  {
    id: 'michelin',
    company: 'Michelin',
    role: 'Desarrollador',
    period: '[PLACEHOLDER: AAAA — AAAA]',
    summary: '[PLACEHOLDER] Resumen del puesto — pendiente de definir.',
    highlights: ['[PLACEHOLDER] Responsabilidad o logro real — pendiente.'],
    meta: '[PLACEHOLDER: Modalidad]',
    location: '[PLACEHOLDER: Ubicación]',
  },
  {
    id: 'diputacion',
    company: 'Diputación de Valladolid',
    role: 'Desarrollador de Aplicaciones',
    period: '[PLACEHOLDER: AAAA — Actualidad]',
    summary: '[PLACEHOLDER] Resumen del puesto — pendiente de definir.',
    highlights: ['[PLACEHOLDER] Responsabilidad o logro real — pendiente.'],
    meta: 'Sector público',
    location: 'Valladolid, España',
  },
  {
    id: 'cognizant',
    company: 'Cognizant',
    role: '[PLACEHOLDER: Puesto — por desbloquear]',
    period: '[PLACEHOLDER: AAAA]',
    summary:
      'Próximo capítulo de la historia profesional. Este mensaje se desbloqueará cuando comience la nueva etapa.',
    highlights: ['[PLACEHOLDER] Responsabilidad o logro real — pendiente.'],
    meta: '[PLACEHOLDER: Modalidad]',
    location: '[PLACEHOLDER: Ubicación]',
    upcoming: true,
  },
]
