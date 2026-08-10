// PLACEHOLDER — Contenido provisional. Sustituir por información real.
// Regla: no inventar stack, descripciones ni URLs presentadas como reales.

export interface ProjectImage {
  src: string
  alt: string
}

export interface Project {
  slug: string
  /** Numeración visible del proyecto ("01", "02", …). */
  order: string
  name: string
  /** Descripción de una o dos frases para la card. PLACEHOLDER. */
  summary: string
  /** Descripción completa para la página de detalle. PLACEHOLDER. */
  description: string
  /** Stack técnico real de ESTE proyecto. null = pendiente de confirmar. */
  stack: string[] | null
  links: {
    demo: string | null
    github: string | null
  }
  /** Capturas. null = placeholder visual (no crear assets falsos). */
  images: ProjectImage[] | null
}

export const projects: Project[] = [
  {
    slug: 'cosmere-archive',
    order: '01',
    name: 'Cosmere Archive',
    summary:
      '[PLACEHOLDER] Descripción breve del proyecto — pendiente de definir.',
    description:
      '[PLACEHOLDER] Descripción completa para la página del proyecto — pendiente de definir.',
    stack: null,
    links: { demo: null, github: null },
    images: null,
  },
  {
    slug: 'dungeon-archive',
    order: '02',
    name: 'Dungeon Archive',
    summary:
      '[PLACEHOLDER] Descripción breve del proyecto — pendiente de definir.',
    description:
      '[PLACEHOLDER] Descripción completa para la página del proyecto — pendiente de definir.',
    stack: null,
    links: { demo: null, github: null },
    images: null,
  },
  {
    slug: 'lol-recommender',
    order: '03',
    name: 'Recomendador de Campeones',
    summary:
      '[PLACEHOLDER] Descripción breve del proyecto — pendiente de definir.',
    description:
      '[PLACEHOLDER] Descripción completa para la página del proyecto — pendiente de definir.',
    stack: null,
    links: { demo: null, github: null },
    images: null,
  },
]
