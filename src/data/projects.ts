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

export interface ProjectFeature {
  name: string
  description: string
}

export interface ProjectConceptBlock {
  title: string
  paragraphs: string[]
  highlights?: string[]
}

export interface ProjectArchitectureLayer {
  number: string
  title: string
  description: string
}

export interface Project {
  slug: string
  name: string
  summary: string
  description: string
  /** Subtitulo bajo el nombre (e.g. "D&D 5e companion · Mobile-first · Offline-first"). */
  tagline?: string
  /** Version del proyecto (e.g. "0.1.0"). */
  version?: string
  stack: string[] | null
  links: {
    demo: string | null
    github: string | null
  }
  images: ProjectImage[] | null
  screenshots: ProjectScreenshot[] | null
  /** Lista de features clave del proyecto. */
  features?: ProjectFeature[]
  /** Bloque conceptual (e.g. "Why Offline-First?"). */
  conceptBlock?: ProjectConceptBlock
  /** Seccion de design system / ingenieria. */
  designSystem?: {
    title: string
    description: string
    points: string[]
  }
  /** Arquitectura del proyecto. */
  architecture?: {
    title: string
    description?: string
    layers: ProjectArchitectureLayer[]
  }
  /** Linea de cierre (e.g. "Built to disappear into the table"). */
  closingLine?: string
  /** Label del CTA final. */
  ctaLabel?: string
  /** URL del CTA final. */
  ctaUrl?: string
}

export const projects: Project[] = [
  {
    slug: 'dungeon-archive',
    name: 'Dungeon Archive',
    summary:
      'Una PWA rápida e instalable que pone la referencia de D&D 5e al alcance de la mesa sin depender de una conexión a Internet.',
    description:
      'Un compañero rápido, pensado primero para móvil y diseñado para funcionar sin conexión, para las sesiones de D&D 5e. Pone toda la referencia del juego —hechizos, monstruos, equipo, condiciones, acciones, objetos mágicos y dotes— en el teléfono que ya está sobre la mesa, y mantiene el contexto esencial de la partida —tu grupo, la sesión actual y el estado del combate— a un toque de distancia.',
    tagline: 'D&D 5e companion · Mobile-first · Offline-first',
    version: '0.1.0',
    stack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'React Router', 'Zustand', 'PWA', 'Firebase'],
    links: {
      demo: 'https://mariomunpeq.github.io/Dungeon-Archive/',
      github: 'https://github.com/mariomunpeq/Dungeon-Archive',
    },
    images: [{ src: '/portfolio/images/projects/dungeon-archive/home.png', alt: 'Dungeon Archive home screen' }],
    screenshots: [
      { src: '/portfolio/images/projects/dungeon-archive/home.png', alt: 'Dungeon Archive home screen', caption: 'Home' },
      { src: '/portfolio/images/projects/dungeon-archive/character.png', alt: 'Character manager', caption: 'Character' },
      { src: '/portfolio/images/projects/dungeon-archive/combat.png', alt: 'Combat tracker', caption: 'Combat' },
      { src: '/portfolio/images/projects/dungeon-archive/dice.png', alt: 'Dice roller', caption: 'Dice roller' },
      { src: '/portfolio/images/projects/dungeon-archive/backup.png', alt: 'Cloud Backup screen', caption: 'Backup' },
    ],
    features: [
      { name: 'Instant Search', description: 'One search across the whole Compendium. As-you-type results from a prebuilt in-memory index; no network, no server.' },
      { name: 'Offline Compendium', description: 'The complete SRD reference for D&D 5e — spells, monsters, equipment, conditions, actions, magic items, and feats — compiled into the app at build time and available offline.' },
      { name: 'Entity Relationships', description: 'Entities link to each other. A spell shows its related conditions; a monster shows the spells and equipment it references.' },
      { name: 'Character Manager', description: 'Lightweight player reference sheets: name, class, level, ability scores, and references to known spells, weapons, and magic items.' },
      { name: 'Combat Tracker', description: 'Per-character hit points with quick damage/heal deltas, a tap-to-toggle condition tray, and the combat stats you consult most.' },
      { name: 'Dice Roller', description: 'Roll any die any number of times with an optional modifier. Spell damage rolls inline on tap from the Character sheet.' },
      { name: 'Session Pins', description: 'Pin monsters, spells, and items to the current session with one tap, and clear them all with End Session.' },
      { name: 'Favorites & Recents', description: 'Mark entities as favorites and let the app remember what you recently viewed and searched.' },
      { name: 'Beginner Mode', description: 'Toggle beginner tips that explain the d20, ability checks, and your turn in combat as you go.' },
      { name: 'Rules Reference', description: 'A built-in reference for combat turns, attacks, hit points, resting, and spellcasting — plus a plain-language glossary.' },
      { name: 'Cloud Backup', description: 'Optional Google Sign-In with manual upload/restore of your local data to Firestore. Everything else works with zero internet.' },
      { name: 'Progressive Web App', description: 'Installable, with offline caching via a service worker. Works fully offline, no account needed.' },
    ],
    conceptBlock: {
      title: 'Why offline-first?',
      paragraphs: [
        'During a session, information lives in books, PDFs and spreadsheets. Finding something takes time — and while someone looks, the table waits.',
        'Dungeon Archive ships the entire Compendium with the application, so lookups never depend on the network.',
      ],
      highlights: ['No account', 'No internet required', 'Local-first data', 'Optional cloud backup'],
    },
    designSystem: {
      title: 'Design system',
      description: 'The interface follows a documented design system rather than evolving as a collection of isolated screens.',
      points: [
        '4px spacing grid',
        'Consistent radius tiers',
        'Shared motion system',
        'Seven accent themes',
        'WCAG AA contrast',
        'Visible focus states',
        'Mobile-first design',
      ],
    },
    architecture: {
      title: 'Architecture',
      description: 'A single-page client application with three decoupled layers.',
      layers: [
        { number: '01', title: 'Compendium', description: 'Build-time generated D&D 5e reference data — 7 categories, stable canonical IDs, related-entities index.' },
        { number: '02', title: 'User State', description: 'Versioned local state persisted in localStorage. Favorites, session pins, character sheets, preferences.' },
        { number: '03', title: 'React App', description: 'Feature pages and interactions orchestrated through React Router, built on the design system.' },
      ],
    },
    closingLine: 'The app is consulted, then set aside. It should never be the reason a session slows down.',
    ctaLabel: 'Open Dungeon Archive',
    ctaUrl: 'https://mariomunpeq.github.io/Dungeon-Archive/',
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
