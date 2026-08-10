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
}

export const profile: Profile = {
  name: 'Mario Muñoz Pequeño',
  alias: 'xNaque',
  role: 'DEVELOPER',
  roleFull: 'Desarrollador de Aplicaciones',
  location: 'Valladolid, España',
  tagline: '[PLACEHOLDER] Título o frase corta para el hero — pendiente de definir.',
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
}
