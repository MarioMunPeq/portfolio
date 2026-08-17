export interface ExperienceEntry {
  id: string
  company: string
  role: string
  /** Rango temporal. */
  period: string
  /** Resumen de una o dos frases. */
  summary: string
  /** Responsabilidades concretas. */
  highlights: string[]
  /** Metadato corto opcional (modalidad/contrato/duración). */
  meta?: string
  /** Ubicación / centro de trabajo. */
  location?: string
  /** Tecnologías y herramientas empleadas. */
  tech?: string[]
  /** Logo/avatar opcional de la empresa (se muestra como avatar de chat). */
  logo?: string
  /** Texto alternativo del logo. */
  logoAlt?: string
}

export const experience: ExperienceEntry[] = [
  {
    id: 'synersight',
    company: 'Synersight, S.L.',
    role: 'Técnico — Prácticas Grado Superior ARI',
    period: 'Mar 2022 — Jun 2022',
    summary:
      'Participación activa en reuniones, relacionada con automatización y robotica industrial.',
    highlights: [],
    meta: 'Prácticas',
    tech: ['SEE Electrical', 'Robots', 'AGV'],
  },
  {
    id: 'michelin',
    company: 'Michelin',
    role: 'Técnico — Prácticas Grado Superior DAM',
    period: 'Mar 2024 — Jun 2024',
    summary:
      'Participación en tareas relacionadas con desarrollo de aplicaciones, análisis de datos y herramientas de Microsoft y entornos industriales.',
    highlights: [],
    meta: 'Prácticas',
    tech: ['Power Apps', 'Power BI', 'PI Vision', 'Python', 'SharePoint'],
  },
  {
    id: 'qualentum',
    company: 'Qualentum',
    role: 'Bootcamp de Inteligencia Artificial',
    period: 'Jun 2024 — Ene 2025',
    summary: 'Bootcamp de inteligencia artificial.',
    highlights: [],
    meta: '450 horas',
    tech: ['Inteligencia Artificial'],
  },
  {
    id: 'diputacion',
    company: 'Diputación de Valladolid',
    role: 'Desarrollador web',
    period: 'Feb 2026 — Actualidad',
    summary: 'Desarrollo web Liferay, Odoo y soporte técnico.',
    highlights: [
      'Desarrollo web con Liferay',
      'Desarrollo con Odoo',
      'Soporte técnico',
    ],
    meta: 'Sector público',
    location: 'Valladolid, España',
    tech: ['Liferay', 'Odoo', 'Desarrollo web', 'Soporte técnico'],
  },
]
