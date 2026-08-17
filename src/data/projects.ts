// PLACEHOLDER — Contenido provisional. Sustituir por informacion real.
// Regla: no inventar stack, descripciones ni URLs presentadas como reales.

export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectScreenshot {
  /** null = captura pendiente: se muestra el placeholder en la galeria. */
  src: string | null
  alt: string
  /** Texto opcional que describe la captura. */
  caption?: string
}

export interface Project {
  slug: string
  name: string
  /** Descripcion de una o dos frases para la card. PLACEHOLDER. */
  summary: string
  /** Descripcion completa para la pagina de detalle. PLACEHOLDER. */
  description: string
  /** Stack tecnico real de ESTE proyecto. null = pendiente de confirmar. */
  stack: string[] | null
  links: {
    demo: string | null
    github: string | null
  }
  /** Imagen principal (hero/preview). null = placeholder visual. */
  images: ProjectImage[] | null
  /** Capturas de la galeria de detalle. Cada una con caption opcional. */
  screenshots: ProjectScreenshot[] | null
}

export const projects: Project[] = [
  {
    slug: 'dungeon-archive',
    name: 'Dungeon Archive',
    summary:
      '[PLACEHOLDER] Descripcion breve del proyecto — pendiente de definir.',
    description:
      '[PLACEHOLDER] Descripcion completa para la pagina del proyecto — pendiente de definir.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
    links: { demo: null, github: null },
    images: null,
    screenshots: [
      {
        src: null,
        alt: 'Captura pendiente del mapa de Dungeon Archive',
        caption: 'Mapa del calabozo',
      },
      {
        src: null,
        alt: 'Captura pendiente del inventario de Dungeon Archive',
        caption: 'Inventario del personaje',
      },
      {
        src: null,
        alt: 'Captura pendiente de la sala del tesoro de Dungeon Archive',
        caption: 'Sala del tesoro',
      },
    ],
  },
  {
    slug: 'cosmere-archive',
    name: 'Cosmere Archive',
    summary:
      '[PLACEHOLDER] Descripcion breve del proyecto — pendiente de definir.',
    description:
      '[PLACEHOLDER] Descripcion completa para la pagina del proyecto — pendiente de definir.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    links: { demo: null, github: null },
    images: null,
    screenshots: [
      {
        src: null,
        alt: 'Captura pendiente de la vista principal de Cosmere Archive',
        caption: 'Vista principal del archivo',
      },
      {
        src: null,
        alt: 'Captura pendiente del catalogo de Cosmere Archive',
        caption: 'Catalogo de obras',
      },
      {
        src: null,
        alt: 'Captura pendiente de la ficha de lectura de Cosmere Archive',
        caption: 'Ficha de lectura',
      },
    ],
  },
  {
    slug: 'recomendador-campeones',
    name: 'Recomendador de Campeones',
    summary:
      '[PLACEHOLDER] Descripcion breve del proyecto — pendiente de definir.',
    description:
      '[PLACEHOLDER] Descripcion completa para la pagina del proyecto — pendiente de definir.',
    stack: ['Python', 'scikit-learn', 'FastAPI', 'React'],
    links: { demo: null, github: null },
    images: null,
    screenshots: [
      {
        src: null,
        alt: 'Captura pendiente del selector de campeones',
        caption: 'Selector de campeones',
      },
      {
        src: null,
        alt: 'Captura pendiente de las recomendaciones generadas',
        caption: 'Recomendaciones generadas',
      },
      {
        src: null,
        alt: 'Captura pendiente del historial del recomendador',
        caption: 'Historial de partidas',
      },
    ],
  },
  {
    slug: 'gnu-health',
    name: 'GNU Health',
    summary:
      'Participacion en un proyecto solidario para la ONG GNU Health, desarrollando una aplicacion Android.',
    description:
      'Participacion en un proyecto solidario para la ONG GNU Health, desarrollando una aplicacion Android.',
    stack: ['Android'],
    links: { demo: null, github: null },
    images: null,
    screenshots: null,
  },
]
