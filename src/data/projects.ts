export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectScreenshot {
  /** null = captura pendiente: se muestra el placeholder en la galeria. */
  src: string | null;
  alt: string;
  /** Texto opcional que describe la captura. */
  caption?: string;
}

export interface ProjectFeature {
  name: string;
  description: string;
}

export interface ProjectConceptBlock {
  title: string;
  paragraphs: string[];
  highlights?: string[];
}

export interface ProjectArchitectureLayer {
  number: string;
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Subtitulo bajo el nombre (e.g. "D&D 5e companion · Mobile-first · Offline-first"). */
  tagline?: string;
  /** Version del proyecto (e.g. "0.1.0"). */
  version?: string;
  stack: string[] | null;
  links: {
    demo: string | null;
    github: string | null;
  };
  images: ProjectImage[] | null;
  screenshots: ProjectScreenshot[] | null;
  /** Lista de features clave del proyecto. */
  features?: ProjectFeature[];
  /** Bloque conceptual (e.g. "Why Offline-First?"). */
  conceptBlock?: ProjectConceptBlock;
  /** Seccion de design system / ingenieria. */
  designSystem?: {
    title: string;
    description: string;
    points: string[];
  };
  /** Arquitectura del proyecto. */
  architecture?: {
    title: string;
    description?: string;
    layers: ProjectArchitectureLayer[];
  };
  /** Linea de cierre (e.g. "Built to disappear into the table"). */
  closingLine?: string;
  /** Label del CTA final. */
  ctaLabel?: string;
  /** URL del CTA final. */
  ctaUrl?: string;
  /** Bloque "Mi rol / Aportacion". */
  role?: {
    title: string;
    items: string[];
  };
  /** Bloque "Retos tecnicos". */
  challenges?: {
    title: string;
    items: { label: string; detail: string }[];
  };
}

export const projects: Project[] = [
  {
    slug: "dungeon-archive",
    name: "Dungeon Archive",
    summary:
      "Una PWA rápida e instalable que pone la referencia de D&D 5e al alcance de la mesa sin depender de una conexión a Internet.",
    description:
      "Un compañero rápido, pensado primero para móvil y diseñado para funcionar sin conexión, para las sesiones de D&D 5e. Pone toda la referencia del juego —hechizos, monstruos, equipo, condiciones, acciones, objetos mágicos y dotes— en el teléfono que ya está sobre la mesa, y mantiene el contexto esencial de la partida —tu grupo, la sesión actual y el estado del combate— a un toque de distancia. Su único propósito es reducir el tiempo muerto en la mesa: el intervalo entre que surge una pregunta y se encuentra la respuesta.",
    tagline: "D&D 5e companion · Mobile-first · Offline-first",
    version: "0.1.0",
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Zustand",
      "PWA",
      "Firebase",
    ],
    links: {
      demo: "https://mariomunpeq.github.io/Dungeon-Archive/",
      github: "https://github.com/mariomunpeq/Dungeon-Archive",
    },
    images: [
      {
        src: "/portfolio/images/projects/dungeon-archive/home.png",
        alt: "Dungeon Archive home screen",
      },
    ],
    screenshots: [
      {
        src: "/portfolio/images/projects/dungeon-archive/home.png",
        alt: "Dungeon Archive home screen",
        caption: "Home",
      },
      {
        src: "/portfolio/images/projects/dungeon-archive/character.png",
        alt: "Character manager",
        caption: "Character",
      },
      {
        src: "/portfolio/images/projects/dungeon-archive/combat.png",
        alt: "Combat tracker",
        caption: "Combat",
      },
      {
        src: "/portfolio/images/projects/dungeon-archive/dice.png",
        alt: "Dice roller",
        caption: "Dice roller",
      },
      {
        src: "/portfolio/images/projects/dungeon-archive/backup.png",
        alt: "Cloud Backup screen",
        caption: "Backup",
      },
    ],
    features: [
      {
        name: "Búsqueda instantánea",
        description:
          "Una única búsqueda para todo el Compendio. Los resultados aparecen mientras escribes gracias a un índice construido previamente y mantenido en memoria, sin red ni servidor.",
      },
      {
        name: "Compendio sin conexión",
        description:
          "Toda la referencia del SRD de D&D 5e —hechizos, monstruos, equipo, condiciones, acciones, objetos mágicos y dotes— está integrada en la aplicación durante el proceso de compilación y disponible sin conexión.",
      },
      {
        name: "Relaciones entre entidades",
        description:
          "Las entidades están conectadas entre sí. Un hechizo muestra las condiciones relacionadas y un monstruo muestra los hechizos y el equipo que utiliza o referencia.",
      },
      {
        name: "Gestión de personajes",
        description:
          "Hojas de referencia ligeras para jugadores: nombre, clase, nivel, características y referencias a hechizos, armas y objetos mágicos conocidos.",
      },
      {
        name: "Seguimiento de combate",
        description:
          "Puntos de golpe por personaje con ajustes rápidos de daño y curación, panel de condiciones activables con un toque y acceso inmediato a las estadísticas de combate más consultadas.",
      },
      {
        name: "Tirada de dados",
        description:
          "Permite lanzar cualquier dado tantas veces como sea necesario, con modificador opcional. Los dados de daño de los hechizos también pueden lanzarse directamente desde la hoja de personaje.",
      },
      {
        name: "Marcadores de sesión",
        description:
          "Guarda monstruos, hechizos y objetos en la sesión actual con un solo toque y permite eliminarlos todos al finalizar la sesión.",
      },
      {
        name: "Favoritos y recientes",
        description:
          "Marca entidades como favoritas y recuerda lo que has consultado y buscado recientemente.",
      },
      {
        name: "Modo principiante",
        description:
          "Activa consejos que explican conceptos como el d20, las pruebas de característica y qué puedes hacer durante tu turno de combate.",
      },
      {
        name: "Referencia de reglas",
        description:
          "Una referencia integrada para turnos de combate, ataques, puntos de golpe, descansos y lanzamiento de hechizos, además de un glosario explicado en lenguaje sencillo.",
      },
      {
        name: "Copia de seguridad en la nube",
        description:
          "Inicio de sesión opcional con Google para subir y restaurar manualmente los datos locales mediante Firestore. El resto de la aplicación funciona completamente sin conexión.",
      },
      {
        name: "Aplicación web progresiva",
        description:
          "PWA instalable, con almacenamiento en caché sin conexión mediante un service worker. Funciona completamente offline y no requiere una cuenta.",
      },
    ],
    conceptBlock: {
      title: "¿Por qué funciona sin conexión?",
      paragraphs: [
        "Durante una sesión, la información suele estar repartida entre libros, PDFs y hojas de cálculo. Encontrar algo lleva tiempo y, mientras alguien busca la respuesta, la mesa espera.",
        "Dungeon Archive incluye todo el Compendio dentro de la propia aplicación, por lo que las consultas nunca dependen de la conexión a Internet.",
      ],
      highlights: [
        "Sin cuenta",
        "Sin conexión a Internet",
        "Datos almacenados localmente",
        "Copia de seguridad opcional en la nube",
      ],
    },
    designSystem: {
      title: "Sistema de diseño",
      description:
        "La interfaz sigue un sistema de diseño documentado en lugar de evolucionar como una colección de pantallas independientes.",
      points: [
        "Grid de espaciado de 4 px",
        "Radios consistentes por niveles",
        "Sistema de animaciones compartido",
        "Siete temas de acento",
        "Contraste WCAG AA",
        "Estados de foco visibles",
        "Diseño mobile-first",
      ],
    },
    architecture: {
      title: "Arquitectura",
      description:
        "Una aplicación cliente de una sola página dividida en tres capas desacopladas.",
      layers: [
        {
          number: "01",
          title: "Compendio",
          description:
            "Datos de referencia de D&D 5e generados durante el proceso de compilación: 7 categorías, identificadores canónicos estables e índice de relaciones entre entidades.",
        },
        {
          number: "02",
          title: "Estado del usuario",
          description:
            "Estado local versionado y persistido en localStorage. Incluye favoritos, marcadores de sesión, hojas de personaje y preferencias.",
        },
        {
          number: "03",
          title: "Aplicación React",
          description:
            "Páginas funcionales e interacciones coordinadas mediante React Router y construidas sobre el sistema de diseño.",
        },
      ],
    },
    closingLine:
      "La aplicación se consulta y después se aparta. Nunca debería ser el motivo por el que una sesión se ralentiza.",
    ctaLabel: "Abrir Dungeon Archive",
    ctaUrl: "https://mariomunpeq.github.io/Dungeon-Archive/",
    role: {
      title: "Mi rol / Aportación",
      items: [
        "Diseño y arquitectura completa de la aplicación, desde la estrategia offline-first hasta la estructura de componentes.",
        "Implementación del sistema de búsqueda: índice en memoria construido en tiempo de compilación para resultados instantáneos sin servidor.",
        "Diseño del sistema de diseño propio con grid de 4 px, temas de acento y animaciones compartidas.",
        "Gestión del estado local con Zustand y persistencia en localStorage con versionado.",
        "Configuración del service worker y estrategia de caché para funcionamiento completo sin conexión.",
      ],
    },
    challenges: {
      title: "Retos técnicos",
      items: [
        {
          label: "Offline-first",
          detail:
            "Diseñar una arquitectura que funcione completamente sin Internet, con sincronización opcional a la nube.",
        },
        {
          label: "Índice de búsqueda",
          detail:
            "Construir un índice en memoria durante la compilación que permita búsquedas instantáneas entre miles de entidades.",
        },
        {
          label: "Persistencia local",
          detail:
            "Implementar un sistema de versionado de estado en localStorage que mantenga la integridad de los datos entre sesiones.",
        },
        {
          label: "Service worker",
          detail:
            "Configurar una estrategia de caché que mantenga la aplicación funcional sin conexión y se actualice en segundo plano.",
        },
      ],
    },
  },
  {
    slug: "cosmere-archive",
    name: "Cosmere Archive",
    summary:
      "[PLACEHOLDER] Descripcion breve del proyecto — pendiente de definir.",
    description:
      "[PLACEHOLDER] Descripcion completa para la pagina del proyecto — pendiente de definir.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    links: { demo: null, github: null },
    images: null,
    screenshots: [
      {
        src: null,
        alt: "Captura pendiente de la vista principal de Cosmere Archive",
        caption: "Vista principal del archivo",
      },
      {
        src: null,
        alt: "Captura pendiente del catalogo de Cosmere Archive",
        caption: "Catalogo de obras",
      },
      {
        src: null,
        alt: "Captura pendiente de la ficha de lectura de Cosmere Archive",
        caption: "Ficha de lectura",
      },
    ],
  },
  {
    slug: "recomendador-campeones",
    name: "Recomendador de Campeones",
    summary:
      "[PLACEHOLDER] Descripcion breve del proyecto — pendiente de definir.",
    description:
      "[PLACEHOLDER] Descripcion completa para la pagina del proyecto — pendiente de definir.",
    stack: ["Python", "scikit-learn", "FastAPI", "React"],
    links: { demo: null, github: null },
    images: null,
    screenshots: [
      {
        src: null,
        alt: "Captura pendiente del selector de campeones",
        caption: "Selector de campeones",
      },
      {
        src: null,
        alt: "Captura pendiente de las recomendaciones generadas",
        caption: "Recomendaciones generadas",
      },
      {
        src: null,
        alt: "Captura pendiente del historial del recomendador",
        caption: "Historial de partidas",
      },
    ],
  },
  {
    slug: "gnu-health",
    name: "GNU Health",
    summary:
      "Participacion en un proyecto solidario para la ONG GNU Health, desarrollando una aplicacion Android.",
    description:
      "Participacion en un proyecto solidario para la ONG GNU Health, desarrollando una aplicacion Android.",
    stack: ["Android"],
    links: { demo: null, github: null },
    images: null,
    screenshots: null,
  },
];
