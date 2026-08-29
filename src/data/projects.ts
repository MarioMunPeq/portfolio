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
        src: "/images/projects/dungeon-archive/home.png",
        alt: "Dungeon Archive home screen",
      },
    ],
    screenshots: [
      {
        src: "/images/projects/dungeon-archive/home.png",
        alt: "Dungeon Archive home screen",
        caption: "Home",
      },
      {
        src: "/images/projects/dungeon-archive/character.png",
        alt: "Character manager",
        caption: "Character",
      },
      {
        src: "/images/projects/dungeon-archive/combat.png",
        alt: "Combat tracker",
        caption: "Combat",
      },
      {
        src: "/images/projects/dungeon-archive/dice.png",
        alt: "Dice roller",
        caption: "Dice roller",
      },
      {
        src: "/images/projects/dungeon-archive/backup.png",
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
    slug: "euromario",
    name: "Euromario",
    summary:
      "Un radar de noticias de videojuegos que filtra el ruido, agrupa las historias duplicadas y usa IA para resumir y priorizar solo lo que importa, publicado como web estática sin infraestructura de pago.",
    description:
      "Un digest de noticias de videojuegos automatizado y sin infraestructura, construido como proyecto de portafolio alrededor de una pregunta: «¿Qué ha pasado en los juegos que de verdad me interesan?». Recoge continuamente noticias de publicaciones especializadas, del feed oficial de Steam y de la comunidad de Reddit; las filtra contra una lista curada de juegos seguidos; agrupa los artículos relacionados en historias; enriquece las supervivientes con IA —resumen, relevancia del 1 al 5 y categoría— y publica el resultado como un frontend vanilla alojado en GitHub Pages. El proyecto evita deliberadamente un backend, una base de datos y cualquier infraestructura de pago: el repositorio actúa como almacén de datos, GitHub Actions como programador y GitHub Pages como servidor estático.",
    tagline: "Radar de noticias de videojuegos · Sin infraestructura · Actualizado cada hora",
    stack: [
      "Python",
      "JavaScript",
      "HTML/CSS",
      "RSS",
      "GitHub Actions",
      "GitHub Pages",
      "Ollama",
      "Groq",
    ],
    links: {
      demo: "https://mariomunpeq.github.io/Euromario/",
      github: "https://github.com/mariomunpeq/Euromario",
    },
    images: [
      {
        src: "/images/projects/euromario/main.png",
        alt: "Vista principal del radar de noticias de Euromario",
      },
    ],
    screenshots: [
      {
        src: "/images/projects/euromario/main.png",
        alt: "Captura de la vista principal del radar de noticias de Euromario",
        caption: "Logo",
      },
      {
        src: "/images/projects/euromario/banner.png",
        alt: "Banner de Euromario",
        caption: "Visualización principal",
      },
    ],
    features: [
      {
        name: "Múltiples fuentes de noticias",
        description:
          "IGN, Eurogamer, PC Gamer, Polygon y Rock Paper Shotgun vía RSS, el feed oficial de Steam a través de su API y la cobertura de la comunidad desde subreddits.",
      },
      {
        name: "Filtrado de ruido",
        description:
          "Patrones de exclusión de títulos y URLs, listas negras de juegos y emparejado con límites de palabra para evitar falsos positivos como GTA dentro de otra cadena.",
      },
      {
        name: "Seguimiento curado de juegos",
        description:
          "Cada juego seguido se configura en YAML con nombre canónico, alias, logo y plataformas. Añadir un juego no requiere tocar código Python.",
      },
      {
        name: "Agrupación de historias",
        description:
          "Cuando varias redacciones cubren el mismo evento, el pipeline agrupa los artículos en una única historia representativa antes de pasar a la IA.",
      },
      {
        name: "Resumen y puntuación con IA",
        description:
          "Cada historia sobreviviente recibe un resumen breve, una relevancia del 1 al 5 y una categoría: lanzamiento, actualización, rumor o análisis.",
      },
      {
        name: "Fallos controlados de IA",
        description:
          "La salida del modelo se valida antes de publicarse. Si Ollama falla, el pipeline cambia a Groq y reintenta sin romper la ejecución; Reddit siempre se publica como rumor sin esperar al modelo.",
      },
      {
        name: "Límite previo a la IA",
        description:
          "El tope de historias por juego se aplica antes y después de la inferencia: en una ejecución real redujo las llamadas de 64 a 13 sin sacrificar la selección final.",
      },
      {
        name: "Publicación sin infraestructura",
        description:
          "Sin backend ni base de datos: el repositorio actúa como almacén, GitHub Actions como programador y GitHub Pages como hosting estático a coste cero.",
      },
      {
        name: "Automatización por hora",
        description:
          "GitHub Actions ejecuta el pipeline cada hora, confirma los datos generados y despliega el frontend solo cuando todos los pasos han terminado correctamente.",
      },
      {
        name: "Frontend sin dependencias",
        description:
          "HTML, CSS y JavaScript vanilla sin framework ni paso de compilación, con estados de carga, error y vacío, filtros de juego, plataforma y categoría, y sincronización de la URL.",
      },
    ],
    conceptBlock: {
      title: "¿Por qué sin infraestructura?",
      paragraphs: [
        "Un digest de noticias vale por lo reciente que es: lo que tiene más de 48 horas no debería seguir ahí. Mantener un backend y una base de datos solo para servir un JSON que se renueva cada hora sería infraestructura sin sentido.",
        "El repositorio en sí es el almacén de datos, GitHub Actions es el programador y el encargado de publicar, y GitHub Pages sirve el frontend estático. El sistema se mantiene por sí solo y no hay servidor que mantener encendido.",
      ],
      highlights: [
        "Sin backend",
        "Sin base de datos",
        "Sin servidor siempre activo",
        "Coste cero",
        "Publicado cada hora",
      ],
    },
    designSystem: {
      title: "Frontend",
      description:
        "Una interfaz estática y ligera que carga un único JSON y se pinta en el cliente, sin framework ni paso de compilación.",
      points: [
        "HTML, CSS y JS vanilla",
        "Tema oscuro #0A0A0B",
        "Tipografía Archivo Black",
        "Estados de carga, error y vacío",
        "Semántica ARIA y roles",
        "Carousel de filtros responsive",
        "Vistas sincronizadas por URL",
      ],
    },
    architecture: {
      title: "Arquitectura",
      description:
        "Un pipeline Python por etapas que reduce el ruido de forma progresiva, seguido de un frontend estático que solo consume el JSON resultante.",
      layers: [
        {
          number: "01",
          title: "Recolección",
          description:
            "RSS de IGN, Eurogamer, PC Gamer, Polygon y Rock Paper Shotgun, la Steam News API y subreddits, normalizados a una representación común con límites por fuente, timeout y control de errores por servicio.",
        },
        {
          number: "02",
          title: "Selección",
          description:
            "Filtros de calidad, emparejado de juegos con inclusiones y exclusiones, agrupación de historias y un límite previo por juego que evita pagar inferencia por historias que se van a descartar.",
        },
        {
          number: "03",
          title: "Enriquecimiento y publicación",
          description:
            "La IA resume, puntúa y categoriza lo que sobrevive; el resultado se guarda en JSON atómico, se confirma en el repositorio y se despliega como web estática.",
        },
      ],
    },
    closingLine: "Menos ruido. Más juegos. Fresco cada hora.",
    ctaLabel: "Abrir Euromario",
    ctaUrl: "https://mariomunpeq.github.io/Euromario/",
    role: {
      title: "Mi rol / Aportación",
      items: [
        "Diseño y construcción completa del pipeline: recolección multi-fuente, normalización, emparejado de juegos, agrupación de historias y política de retención.",
        "Diseño de un contrato de IA neutral entre proveedores con validación estructurada de la salida y gestión de fallos: Ollama local con respaldo en Groq.",
        "Optimización de costes de inferencia aplicando el límite por juego antes y después de la IA, con una reducción de 64 a 13 llamadas en una ejecución real.",
        "Frontend vanilla sin dependencias con filtros, estados visuales y sincronización de la URL.",
        "Automatización e implementación: GitHub Actions ejecuta el pipeline cada hora, confirma los datos y despliega el frontend en GitHub Pages.",
        "Suite de pruebas pytest de 265 casos que cubren el núcleo del pipeline.",
      ],
    },
    challenges: {
      title: "Retos técnicos",
      items: [
        {
          label: "Emparejamiento robusto",
          detail:
            "Evitar falsos positivos de alias cortos como GTA usando límites de palabra y dando prioridad a la lista de exclusión sobre la de inclusión.",
        },
        {
          label: "Coste de la IA",
          detail:
            "Aplicar el tope por juego antes de la inferencia para no pagar llamadas que luego se descartan: de 64 a 13 en una ejecución real.",
        },
        {
          label: "IA impredecible",
          detail:
            "Validar cada respuesta estructurada, reintentar salidas inválidas y cambiar de proveedor ante fallos de infraestructura sin romper el run completo.",
        },
        {
          label: "Web estática viva",
          detail:
            "Conseguir un digest que se renueva cada hora sin backend: el repositorio es el almacén, GitHub Actions es el programador.",
        },
      ],
    },
  },
  {
    slug: "cosmere-archive",
    name: "Cosmere Archive",
    summary:
      "Archivo interactivo del Cosmere, el universo literario de Brandon Sanderson, pensado para explorar sus mundos, personajes, historias y sistemas a traves de una experiencia visual alejada del formato tradicional de una wiki.",
    description:
      "Un proyecto personal y fan de Brandon Sanderson que construye un archivo interactivo del Cosmere: en vez de listados estaticos, cada seccion es una experiencia visual. Hay un mapa galactico con mundos tridimensionales, sus esquirlas y las rutas de los trotamundos; una biblioteca con un lector 3D que extrae cada libro de su estanteria y pasa las paginas con animacion de vuelta; la escena 3D del Aharietiam con las hojas de los Heraldos; una cronologia cosmica con eras y eventos; un grafo de fuerzas (d3-force) para las relaciones entre personajes; un manuscrito de los sistemas de magia con la tabla alomantica; y un oceano interactivo en Canvas 2D que representa las almas de los personajes (Shadesmar). Desarrollado desde cero para practicar arquitectura frontend, modelado de datos, componentes reutilizables y despliegue continuo, con React, TypeScript, Vite y Tailwind, WebGL con Three.js, animaciones con GSAP y tests con Vitest.",
    tagline:
      "Exploracion interactiva del Cosmere · React · Three.js · d3-force · GSAP",
    version: "1.0.0",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "React Router",
      "Three.js",
      "React Three Fiber",
      "GSAP",
      "d3-force",
      "PWA",
      "GitHub Pages",
    ],
    links: {
      demo: "https://mariomunpeq.github.io/Cosmere-Archive/",
      github: "https://github.com/MarioMunPeq/Cosmere-Archive",
    },
    images: [
      {
        src: "/images/projects/cosmere-archive/main.png",
        alt: "Vista principal del mapa galactico de Cosmere Archive",
      },
    ],
    screenshots: [
      {
        src: "/images/projects/cosmere-archive/mapa-galaxia.png",
        alt: "Mapa galactico actual con los mundos del Cosmere",
        caption: "Mapa galactico",
      },
      {
        src: "/images/projects/cosmere-archive/biblioteca.png",
        alt: "Biblioteca virtual con los libros del archivo",
        caption: "Biblioteca",
      },
      {
        src: "/images/projects/cosmere-archive/personajes.png",
        alt: "Archivo biografico de personajes",
        caption: "Personajes",
      },
      {
        src: "/images/projects/cosmere-archive/ars-arcanum.png",
        alt: "Manuscrito Ars Arcanum de los sistemas de magia",
        caption: "Ars Arcanum",
      },
      {
        src: "/images/projects/cosmere-archive/aharietiam.png",
        alt: "Escena 3D del Aharietiam con las hojas de los Heraldos",
        caption: "Aharietiam",
      },
      {
        src: "/images/projects/cosmere-archive/mind-map.png",
        alt: "Mapa mental del archivo",
        caption: "Mapa mental",
      },
    ],
    features: [
      {
        name: "Mapa galactico de mundos",
        description:
          "Un mapa del Cosmere con los mundos y sus esquirlas, que permite seleccionar cada planeta para consultar su ficha, sus sagas y las rutas de los trotamundos (worldhoppers).",
      },
      {
        name: "Lector de libros en 3D",
        description:
          "Una biblioteca virtual donde cada libro se extrae de la estanteria y abre en un lector 3D con paginas que se vuelven, tambien esquinas plegadas y texto seleccionable.",
      },
      {
        name: "Escena 3D del Aharietiam",
        description:
          "Una escena tridimensional ceremonial con las hojas de los Heraldos, generadas como mallas 3D a partir de las imagenes: seleccion e inspeccion de cada hoja, particulas, iluminacion y audio de interaccion propio.",
      },
      {
        name: "Cronologia cosmica",
        description:
          "Una linea temporal horizontal con eras, mas de un centenar de eventos, vidas de personajes y viajes de trotamundos, con tarjetas de detalle e interaccion por era.",
      },
      {
        name: "Relaciones entre personajes",
        description:
          "Grafo de fuerzas con d3-force que conecta a los personajes por sus relaciones, con filtros por planeta y paneles de detalle vinculados entre fichas.",
      },
      {
        name: "Ars Arcanum: sistemas de magia",
        description:
          "Un manuscrito por mundo con sus sistemas de magia, referencias cruzadas y la tabla alomantica expandible de los metales.",
      },
      {
        name: "Shadesmar: oceano de almas",
        description:
          "Una experiencia interactiva en Canvas 2D donde cada planeta es una constelacion de almas: observar, enfocar e inspeccionar a personajes mediante un motor de fisica propio.",
      },
      {
        name: "Visor y estadisticas",
        description:
          "Un mapa mental en Canvas, un comparador de personajes y una pagina de estadisticas con graficas SVG y contadores animados para recorrer los datos del archivo.",
      },
    ],
    conceptBlock: {
      title: "¿Por que una exploracion visual?",
      paragraphs: [
        "La idea de Cosmere Archive es presentar el mundo del Cosmere de Brandon Sanderson de forma visual e interactiva, alejandose del formato tradicional de una wiki donde prima el texto.",
        "En vez de listados, cada apartado se convierte en una experiencia de exploracion: un mapa galactico, un lector 3D, una cronologia, un grafo de relaciones o un oceano de almas. El objetivo es que consultar la informacion se sienta como recorrer un archivo, no como leer una enciclopedia.",
      ],
      highlights: [
        "Exploracion interactiva",
        "Mapa galactico 3D",
        "Lector de libros 3D",
        "Grafo de relaciones",
        "Canvas 2D y WebGL",
      ],
    },
    designSystem: {
      title: "Identidad",
      description:
        "Una estetica entre manuscrito y cosmo: paneles tipo pergamino para la informacion, temas por esquirlas con paletas propias, fondos estelares y animaciones cosmicas en Tailwind y GSAP.",
      points: [
        "Temas por esquirlas",
        "Paneles tipo pergamino",
        "Fondos estelares",
        "Animaciones con GSAP",
        "Componentes reutilizables",
        "Paleta cosmica y calida",
        "Responsive",
      ],
    },
    architecture: {
      title: "Arquitectura",
      description:
        "Un frontend con paginas cargadas de forma perezosa (lazy), datos estaticos y generados, hooks propios para estado y metadatos SEO, y rutas con HashRouter para desplegar en GitHub Pages.",
      layers: [
        {
          number: "01",
          title: "Paginas y enrutado",
          description:
            "Cada seccion es una pagina cargada con lazy() y conectada con React Router mediante HashRouter, lo que permite enlaces directos y refrescos en GitHub Pages.",
        },
        {
          number: "02",
          title: "Datos",
          description:
            "Modelos estaticos en TypeScript y JSON: mundos, libros y sagas, eventos de la cronologia, sistemas de magia y registros de personajes generados.",
        },
        {
          number: "03",
          title: "Motores interactivos",
          description:
            "Escenas WebGL con Three.js y React Three Fiber (libros y Aharietiam), grafo de fuerzas con d3-force, y un motor Canvas 2D propio para Shadesmar con fisica y seleccion de entidades.",
        },
      ],
    },
    closingLine:
      "Un archivo que no solo guarda el Cosmere: te invita a recorrerlo.",
    role: {
      title: "Mi rol / Aportacion",
      items: [
        "Diseno e implementacion completa del proyecto desde cero como facu de desarrollo web moderno con React, TypeScript, Vite y Tailwind.",
        "Creacion de escenas 3D con Three.js y React Three Fiber (biblioteca y Aharietiam) con animaciones de extraccion y paso de pagina.",
        "Modelado de datos estaticos y generados: mundos, libros, sagas, eventos, sistemas de magia y personajes.",
        "Desarrollo de un grafo de fuerzas con d3-force para las relaciones entre personajes.",
        "Construccion de un motor Canvas 2D propio para la experiencia de Shadesmar con fisica, seleccion y constelaciones.",
        "Despliegue continuo con GitHub Actions en GitHub Pages y configuracion PWA con service worker.",
      ],
    },
    challenges: {
      title: "Retos tecnicos",
      items: [
        {
          label: "Hibrido HTML + WebGL",
          detail:
            "Mantener el texto seleccionable y accesible dentro de un lector 3D: el contenido se proyecta como overlay HTML sobre la geometria Three.js, no como textura.",
        },
        {
          label: "Paso de pagina 3D",
          detail:
            "Animar la curvatura de cada pagina con geometria BufferGeometry deformada por frame, conservando el rendimiento y el acabado de papel.",
        },
        {
          label: "Motor Canvas propio",
          detail:
            "Implementar la interaccion de Shadesmar (observar, enfocar, inspeccionar) con un sistema de fisica y seleccion propio sobre Canvas 2D, sin librerias extra.",
        },
        {
          label: "Enrutado y despliegue",
          detail:
            "Hacer que el cliente-routing funcione en GitHub Pages recurriendo a HashRouter, con prefijo BASE_URL en las rutas de los assets.",
        },
      ],
    },
  },
  {
    slug: "recomendador-campeones",
    name: "Recomendador de Campeones",
    summary:
      "Proyecto final del bootcamp de Qualentum: un modelo de machine learning en Python que recomienda campeones de League of Legends entrenado con datos reales de partidas obtenidos de la API de Riot Games.",
    description:
      "Un recomendador de campeones para League of Legends desarrollado como proyecto final del bootcamp de Qualentum. El proyecto obtiene datos reales de partidas a traves de la API de Riot Games (PUUID, historial y detalle de las partidas de un jugador), construye un dataset con las caracteristicas de cada partida (kills, deaths, assists, KDA ratio, rol, partidas jugadas y tasa de victoria) y entrena un clasificador Random Forest para estimar la probabilidad de cada campeon candidato. La funcion recommend_champions filtra los campeones ya jugados y por rol, y devuelve el Top-N de campeones con mayor probabilidad de ser elegidos. Todo el flujo esta documentado en notebooks de Jupyter con graficas de analisis exploratorio y de evaluacion del modelo.",
    tagline:
      "Proyecto Bootcamp Qualentum · Machine Learning · Riot Games API · Python",
    version: "1.0.0",
    stack: [
      "Python",
      "Jupyter Notebook",
      "pandas",
      "NumPy",
      "scikit-learn",
      "imblearn",
      "matplotlib",
      "seaborn",
      "Riot Games API",
      "requests",
    ],
    links: { demo: null, github: null },
    images: [
      {
        src: "/images/projects/recomendador-campeones/main.png",
        alt: "Grafica de la relacion entre el KDA ratio y la tasa de victoria",
      },
    ],
    screenshots: [
      {
        src: "/images/projects/recomendador-campeones/main.png",
        alt: "Relacion entre el KDA ratio y la tasa de victoria por campeon",
        caption: "KDA y tasa de victoria",
      },
      {
        src: "/images/projects/recomendador-campeones/eda-distribuciones.png",
        alt: "Distribucion de kills, deaths y assists en las partidas",
        caption: "Distribucion de estadisticas",
      },
      {
        src: "/images/projects/recomendador-campeones/frecuencia-campeones.png",
        alt: "Frecuencia de campeones jugados en el historial",
        caption: "Campeones mas jugados",
      },
      {
        src: "/images/projects/recomendador-campeones/frecuencia-roles.png",
        alt: "Frecuencia de roles jugados",
        caption: "Roles jugados",
      },
      {
        src: "/images/projects/recomendador-campeones/kda-ratio.png",
        alt: "Distribucion del KDA ratio en las partidas",
        caption: "Distribucion del KDA ratio",
      },
      {
        src: "/images/projects/recomendador-campeones/confusion-matrix.png",
        alt: "Matriz de confusion de la prediccion del modelo",
        caption: "Matriz de confusion",
      },
    ],
    features: [
      {
        name: "Datos reales de partidas",
        description:
          "Obtiene el PUUID del invocador, su historial de partidas y el detalle de cada una mediante la API de Riot Games con la libreria requests, partiendo de datos reales y no sinteticos.",
      },
      {
        name: "Caracteristicas del jugador",
        description:
          "Construye el dataset con kills, deaths, assists, KDA ratio, rol, partidas jugadas y tasa de victoria por campeon, convirtiendo el rol categorico a numerico con get_dummies.",
      },
      {
        name: "Campeones candidatos por rol",
        description:
          "Filtra los campeones todavia no jugados y los del rol indicado usando la etiqueta de rol de cada campeon de champions.json antes de ordenar por probabilidad.",
      },
      {
        name: "Aprendizaje con arboles aleatorios",
        description:
          "Entrena un clasificador Random Forest cuyos hiperparametros se ajustan con GridSearchCV y validacion cruzada de 5 pliegues.",
      },
      {
        name: "Balanceo de clases con SMOTE",
        description:
          "Aplica SMOTE para equilibrar las clases desbalanceadas del conjunto de entrenamiento, evitando sesgos hacia los campeones mas frecuentes.",
      },
      {
        name: "Evaluacion completa del modelo",
        description:
          "Mide accuracy, precision, recall, F1, matriz de confusion, curvas ROC (AUC) y log loss, e interpreta las curvas precision-recall y la importancia de las caracteristicas.",
      },
      {
        name: "Recomendacion Top-N",
        description:
          "La funcion recommend_champions(kills, deaths, assists, role, top_n) usa predict_proba y devuelve los N campeones con mayor probabilidad.",
      },
      {
        name: "Feedback interactivo",
        description:
          "Permite valorar las recomendaciones con ipywidgets (botones de me gusta) y guardar el feedback del usuario en user_feedback.json.",
      },
    ],
    conceptBlock: {
      title: "¿Por que un clasificador de probabilidad?",
      paragraphs: [
        "El proyecto es mi trabajo final del bootcamp de Qualentum y busca poner en practica un flujo completo de ciencia de datos: obtencion de datos reales, limpieza, analisis exploratorio, entrenamiento y evaluacion de un modelo.",
        "Elegi un clasificador Random Forest con predict_proba porque queremos ordenar a todos los campeones candidatos por su probabilidad relativa y quedarnos con el Top-N, en vez de predecir una unica clase. Combinarlo con GridSearchCV y SMOTE me permitio explorar el ajuste de hiperparametros y enfrentar el desbalanceo de clases propio de un historial real de partidas.",
      ],
      highlights: [
        "Datos reales de Riot Games",
        "Random Forest",
        "GridSearchCV + cross-validation",
        "SMOTE para clases desbalanceadas",
        "Recomendacion Top-N por probabilidad",
      ],
    },
    designSystem: {
      title: "Visualizacion",
      description:
        "Un flujo de trabajo documentado en notebooks de Jupyter, donde el analisis exploratorio y la evaluacion del modelo se apoyan en graficas de matplotlib y seaborn.",
      points: [
        "Jupyter Notebook",
        "Analisis exploratorio (EDA)",
        "Histogramas y boxplots",
        "Matrices de correlacion",
        "Curvas ROC y precision-recall",
        "Matriz de confusion",
        "Importancia de caracteristicas",
      ],
    },
    architecture: {
      title: "Flujo del proyecto",
      description:
        "Un pipeline de ciencia de datos que va desde la extraccion de partidas reales hasta la recomendacion final de campeones.",
      layers: [
        {
          number: "01",
          title: "Obtencion de datos",
          description:
            "La API de Riot Games proporciona el PUUID del invocador a partir de su Riot ID y, con el, el historial de partidas y el detalle de cada una.",
        },
        {
          number: "02",
          title: "Preparacion del dataset",
          description:
            "Se construye la tabla de partidas con kills, deaths, assists, KDA ratio, rol, partidas jugadas y tasa de victoria, y se cruza con champions.json para conocer el rol de cada campeon.",
        },
        {
          number: "03",
          title: "Entrenamiento y evaluacion",
          description:
            "Se aplican GridSearchCV con cross-validation y SMOTE al Random Forest, y el modelo se evalua con accuracy, precision, recall, F1, ROC-AUC, log loss y la matriz de confusion.",
        },
        {
          number: "04",
          title: "Recomendacion",
          description:
            "recommend_champions filtra los campeones sin jugar y del rol pedido, ordena por probabilidad de predict_proba y devuelve el Top-N solicitado.",
        },
      ],
    },
    closingLine:
      "Datos reales de partidas que se convierten en sugerencias de campeones con las que seguir mejorando tu partida.",
    role: {
      title: "Mi rol / Aportacion",
      items: [
        "Diseno e implementacion completa del pipeline de ciencia de datos como proyecto final del bootcamp de Qualentum.",
        "Integracion con la API de Riot Games para obtener datos reales de partidas de un invocador (PUUID, historial y detalle).",
        "Construccion y limpieza del dataset con pandas y NumPy, incluyendo la conversion del rol categorico a numerico.",
        "Entrenamiento de un Random Forest con GridSearchCV, validacion cruzada y SMOTE para balancear las clases.",
        "Evaluacion del modelo con metricas de clasificacion (accuracy, F1, ROC-AUC, log loss) y elaboracion de graficas de EDA con matplotlib y seaborn.",
        "Desarrollo de la funcion recomendadora Top-N y del mecanismo de feedback interactivo con ipywidgets.",
      ],
    },
    challenges: {
      title: "Retos tecnicos",
      items: [
        {
          label: "Limites de la API",
          detail:
            "La clave de Riot Games expira cada dia y las peticiones tienen limites de tasa, lo que obligo a estructurar la recogida de partidas por lotes y a manejar errores de la API.",
        },
        {
          label: "Datos desbalanceados",
          detail:
            "Algunos campeones se jugaban mucho mas que otros, asi que hubo que aplicar SMOTE para equilibrar las clases antes del entrenamiento.",
        },
        {
          label: "Recomendacion multiclase",
          detail:
            "Como queremos ordenar campeones por probabilidad en vez de predecir una clase, use predict_proba en lugar de un clasificador binario tradicional.",
        },
        {
          label: "Filtrado de candidatos",
          detail:
            "Habia que descartar los campeones ya jugados y los que no correspondian al rol pedido antes de calcular el Top-N, para que las sugerencias fueran utiles y novedosas.",
        },
      ],
    },
  },
  {
    slug: "proyecto-gambia",
    name: "Proyecto Gambia",
    summary:
      "Aplicacion Android nativa en Kotlin para la gestion de salud en Gambia, inspirada en MyGNUHealth e implementada como mi Trabajo de Fin de Grado de DAM, con datos medicos offline y sincronizacion a un servidor remoto.",
    description:
      "Una aplicacion nativa de Android en Kotlin que reproduce la filosofia de MyGNUHealth para acompanar la gestion de la salud en Gambia. La aplicacion registra datos medicos del paciente (peso, presion sanguinea, glucosa, saturacion de oxigeno, sueno, actividad fisica, actividades sociales, valor energetico y estado), de manera manual o mediante medicion directa con dispositivos Bluetooth de bajo consumo, los almacena de forma local en una base de datos SQLite y permite sincronizarlos contra un servidor remoto con autenticacion. El proyecto, desarrollado como mi Trabajo de Fin de Grado de Desarrollo de Aplicaciones Multiplataforma, sigue una arquitectura de actividad unica con fragments y paquetes por funcionalidad, y se apoya en la navegacion del Jetpack para conectar las distintas pantallas.",
    tagline:
      "TFG de DAM · Android nativo · Kotlin · MyGNUHealth · Offline-first",
    version: "1.0.0",
    stack: [
      "Kotlin",
      "Android",
      "Jetpack",
      "Navigation",
      "SQLite",
      "Retrofit",
      "Gson",
      "OkHttp",
      "MPAndroidChart",
      "Bluetooth LE",
      "Gradle",
      "jBCrypt",
    ],
    links: { demo: null, github: null },
    images: [
      {
        src: "/images/projects/proyecto-gambia/main.png",
        alt: "Logo de Proyecto Gambia",
      },
    ],
    screenshots: [
      {
        src: "/images/projects/proyecto-gambia/main.png",
        alt: "logo",
        caption: "logo",
      },
      {
        src: "/images/projects/proyecto-gambia/registro.png",
        alt: "Pantalla de registro de nuevo usuario",
        caption: "Registro",
      },
      {
        src: "/images/projects/proyecto-gambia/datos.png",
        alt: "Pantalla de introduccion manual de datos medicos",
        caption: "Datos manuales",
      },
      {
        src: "/images/projects/proyecto-gambia/servidor.png",
        alt: "Opciones del servidor, sincronizacion y libro de vida",
        caption: "Servidor",
      },
      {
        src: "/images/projects/proyecto-gambia/libro-vida.png",
        alt: "Pantalla del libro de vida del paciente",
        caption: "Libro de vida",
      },
      {
        src: "/images/projects/proyecto-gambia/perfil.png",
        alt: "Pantalla de perfil para modificar datos de usuario",
        caption: "Perfil",
      },
      {
        src: "/images/projects/proyecto-gambia/conexion.png",
        alt: "Ajustes de conexion con el servidor",
        caption: "Conexion",
      },
      {
        src: "/images/projects/proyecto-gambia/bluetooth.png",
        alt: "Conexion Bluetooth con tensiometro y termometro",
        caption: "Dispositivos Bluetooth",
      },
    ],
    features: [
      {
        name: "Registro de datos medicos",
        description:
          "Permite introducir de manera manual los datos de salud del paciente: peso, presion sanguinea, glucosa, saturacion de oxigeno, sueno, actividad fisica, actividades sociales, valor energetico y estado.",
      },
      {
        name: "Graficas interactivas",
        description:
          "Visualiza de forma grafica los datos del usuario activo mediante graficas de linea y de barras construidas con la libreria MPAndroidChart, con textos de inicio y fin de datos.",
      },
      {
        name: "Dispositivos Bluetooth de baja energia",
        description:
          "Lee la medicion en directo de un tensiometro y de un termometro conectados por Bluetooth LE, suscribiendose a las notificaciones de la caracteristica de medida medica (servicio 0x1810).",
      },
      {
        name: "Almacenamiento offline",
        description:
          "Guarda todos los registros en una base de datos SQLite local (con hash BCrypt para las credenciales) de forma que la aplicacion funciona sin conexion.",
      },
      {
        name: "Sincronizacion con servidor",
        description:
          "Sube las Pols pendientes al servidor remoto mediante Retrofit y OkHttp en una corrutina, controla la disponibilidad de red y notifica al usuario del resultado.",
      },
      {
        name: "Libro de vida",
        description:
          "Accede al libro de vida del paciente desde las opciones del servidor, integrado con el flujo de sincronizacion de los datos locales.",
      },
      {
        name: "Permisos segun la version",
        description:
          "Solicita los permisos de Bluetooth, localizacion e internet de forma adaptada a la version de Android (target 31), distinguiendo entre API anterior y posterior.",
      },
      {
        name: "Control de bloqueo de pantalla",
        description:
          "Gestiona el hilo de subida de datos para evitar errores al abandonar la aplicacion (onPause) mientras se sincroniza la informacion.",
      },
    ],
    conceptBlock: {
      title: "¿Por que una aplicacion Android nativa en Kotlin?",
      paragraphs: [
        "El proyecto es mi Trabajo de Fin de Grado de DAM y busca llevar la filosofia de GNU Health / MyGNUHealth a un acompanante movil para la gestion de salud en Gambia.",
        "Elegi Android nativo con Kotlin y arquitectura de actividad unica con fragments para mantener el codigo organizado por funcionalidades, y priorice el almacenamiento local offline con sincronizacion opcional, pensando en un escenario real donde la conectividad no siempre esta garantizada.",
      ],
      highlights: [
        "Android nativo",
        "Kotlin",
        "SQLite offline",
        "Sincronizacion remota",
        "Bluetooth Low Energy",
      ],
    },
    designSystem: {
      title: "Interfaz",
      description:
        "Una interfaz de Material Design basada en fragments, con navegacion guiada por el componente Navigation del Jetpack y paquetes por funcionalidad.",
      points: [
        "Material Design",
        "Actividad unica + fragments",
        "Navigation Component",
        "Paquetes por feature",
        "ViewModels por pantalla",
        "TextInputLayouts",
        "Orientacion portrait",
      ],
    },
    architecture: {
      title: "Arquitectura",
      description:
        "Una sola actividad con fragments conectados mediante el grafo de navegacion y paquetes organizados por funcionalidad.",
      layers: [
        {
          number: "01",
          title: "Capa de datos",
          description:
            "Base de datos SQLite con SQLiteOpenHelper propio (tablas de personas, instituciones, datos de salud y pols) mas cliente Retrofit con Gson y OkHttp para el servidor remoto.",
        },
        {
          number: "02",
          title: "Navegacion",
          description:
            "Un unico grafo de navegacion (main_graph) que conecta los fragments, arrancando por el menu principal y con acciones generadas automaticamente.",
        },
        {
          number: "03",
          title: "Vistas y ViewModels",
          description:
            "Fragments por pantalla, cada uno con su ViewModel, que mantienen la separacion entre la interfaz grafica y la logica de negocio.",
        },
      ],
    },
    closingLine:
      "Salud que se registra en el movil, se consulta en graficas y se sincroniza para acompañar a quien la necesita.",
    role: {
      title: "Mi rol / Aportacion",
      items: [
        "Diseno e implementacion completa de la aplicacion Android nativa en Kotlin como Trabajo de Fin de Grado.",
        "Modelado de la base de datos SQLite con tablas de personas, instituciones, datos de salud y pols, y hash de credenciales con BCrypt.",
        "Integracion de graficas interactivas con MPAndroidChart para la visualizacion de los datos medicos.",
        "Comunicacion Bluetooth Low Energy con tensiometro y termometro para lectura directa de mediciones.",
        "Sincronizacion de datos con el servidor remoto mediante Retrofit, Gson y OkHttp, con control de disponibilidad de red.",
        "Pruebas unitarias sobre las operaciones mas criticas de la base de datos y de la subida de datos.",
      ],
    },
    challenges: {
      title: "Retos tecnicos",
      items: [
        {
          label: "Arquitectura por fragments",
          detail:
            "Mantener una arquitectura de actividad unica con fragments y paquetes por funcionalidad, conectados mediante el grafo de navegacion.",
        },
        {
          label: "Bluetooth Low Energy",
          detail:
            "Leer la caracteristica medica de un tensiometro y un termometro (servicio 0x1810) suscribiendose a sus notificaciones y ordenando manualmente los datos recibidos.",
        },
        {
          label: "Sincronizacion remota",
          detail:
            "Subir las pols al servidor en una corrutina para no bloquear la interfaz, gestionando errores, conexion y el ciclo de vida de la actividad.",
        },
        {
          label: "Orden de los datos Bluetooth",
          detail:
            "No se conocia el orden en que se enviaban los datos de medicion, asi que hubo que ordenarlos manualmente y conservar el mas reciente.",
        },
      ],
    },
  },
];
