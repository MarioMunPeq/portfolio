// PLACEHOLDER — Contenido provisional. Sustituir por información real.
// Regla: no inventar logros ni datos presentados como reales.

export interface ProfileLink {
  label: string
  url: string
}

export interface Profile {
  name: string
  alias: string
  role: string
  roleFull: string
  location: string
  /** Frase corta del hero. PLACEHOLDER. */
  tagline: string
  /** Textos tipográficos del hero. */
  hero: {
    /** Primer bloque del nombre (sólido). */
    nameFirst: string
    /** Segundo bloque del nombre (contorno). */
    nameLast: string
    /** Región corta mostrada en la franja superior. */
    region: string
    /** Línea principal del bloque derecho. */
    roleLine: string
    /** Línea secundaria del bloque derecho. */
    credentialLine: string
    /** Coordenadas decorativas del bloque derecho. */
    coordinates: string
  }
  /** Textos de marca reutilizados en overlays (LoadScreen, hero). */
  branding: {
    /** Etiqueta tipo "Sistema personal". */
    system: string
    /** "CV viviente". */
    cvViviente: string
    /** "Cargando". */
    loading: string
  }
  /** Enlaces de contacto. url null = pendiente de definir. */
  links: {
    github: ProfileLink | null
    linkedin: ProfileLink | null
    email: ProfileLink | null
    /** Ruta pública del CV en PDF. null = pendiente de incorporar. */
    cvPdf: string | null
  }
  about: {
    /** Párrafos de la sección "Sobre mí". PLACEHOLDER. */
    paragraphs: string[]
    /** Intereses personales (aparecen de forma sutil). */
    interests: string[]
    /** Foto/avatar. null = usar placeholder visual. */
    avatar: { src: string; alt: string } | null
  }
  /** Sección de contacto. */
  contact: {
    /** Llamada inicial. PLACEHOLDER. */
    intro: string
  }
}

export const profile: Profile = {
  name: 'Mario Muñoz Pequeño',
  alias: 'xNaque',
  role: 'DEVELOPER',
  roleFull: 'Desarrollador de Aplicaciones',
  location: 'Valladolid, España',
  tagline: '[PLACEHOLDER] Título o frase corta para el hero — pendiente de definir.',
  hero: {
    nameFirst: 'Mario',
    nameLast: 'Muñoz Pequeño',
    region: 'Valladolid · Es',
    roleLine: 'Aplicaciones multiplataforma',
    credentialLine: 'F.P. Grado Superior — DAM',
    coordinates: '41.6523° N, 4.7245° O',
  },
  branding: {
    system: 'Sistema personal',
    cvViviente: 'CV Viviente',
    loading: 'Cargando',
  },
  links: {
    github: null,
    linkedin: null,
    email: null,
    cvPdf: null,
  },
  about: {
    paragraphs: [
      '[PLACEHOLDER] Párrafo 1 — Presentación breve: quién soy, qué hago y cómo trabajo.',
      '[PLACEHOLDER] Párrafo 2 — Personalidad, curiosidad y enfoque técnico.',
    ],
    interests: ['videojuegos', 'D&D', 'Cosmere'],
    avatar: null,
  },
  contact: {
    intro: '[PLACEHOLDER] Texto de contacto — pendiente de definir.',
  },
}
