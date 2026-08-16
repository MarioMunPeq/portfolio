// Árbol de Habilidades — ruta académica real, de ESO a Bootcamp de IA.
// Regla: no inventar estudios ni fechas presentados como reales. Centro,
// periodo y descripción quedan como [PLACEHOLDER] hasta definir los datos.
// El nodo "locked" es decorativo (etapa futura, camino en construcción).

export type SkillNodeKind = 'unlocked' | 'locked'

export type SkillIconKind = 'cap' | 'antenna' | 'robot' | 'code' | 'chip' | 'question'

export interface SkillNode {
  id: string
  /** Centro del nodo en % del contenedor del árbol. */
  x: number
  y: number
  /** Etiqueta corta bajo el nodo. */
  label: string
  /** Título completo de la titulación (panel de detalle). */
  title: string
  icon: SkillIconKind
  kind: SkillNodeKind
  /** Texto del sello de estado del panel. */
  status: string
  institution?: string
  period?: string
  description?: string
}

export interface SkillEdge {
  from: string
  to: string
  /** solid = conexión real completada; future = trazo punteado decorativo. */
  kind: 'solid' | 'future'
}

export const SKILL_TREE: { nodes: SkillNode[]; edges: SkillEdge[] } = {
  nodes: [
    {
      id: 'eso',
      x: 9,
      y: 50,
      label: 'ESO',
      title: 'Educación Secundaria Obligatoria (ESO)',
      icon: 'cap',
      kind: 'unlocked',
      status: 'Completado',
      institution: '[PLACEHOLDER: Centro — pendiente de definir]',
      period: '[PLACEHOLDER: AAAA — AAAA]',
      description: '[PLACEHOLDER] Etapa formativa base — pendiente de definir.',
    },
    {
      id: 'teleco',
      x: 30,
      y: 50,
      label: 'TELECO',
      title: 'Grado Medio en Telecomunicaciones',
      icon: 'antenna',
      kind: 'unlocked',
      status: 'Completado',
      institution: '[PLACEHOLDER: Centro — pendiente de definir]',
      period: '[PLACEHOLDER: AAAA — AAAA]',
      description:
        '[PLACEHOLDER] Formación en telecomunicaciones — pendiente de definir.',
    },
    {
      id: 'robotica',
      x: 52,
      y: 24,
      label: 'ROBÓTICA',
      title: 'Grado Superior en Robótica',
      icon: 'robot',
      kind: 'unlocked',
      status: 'Completado',
      institution: '[PLACEHOLDER: Centro — pendiente de definir]',
      period: '[PLACEHOLDER: AAAA — AAAA]',
      description: '[PLACEHOLDER] Formación en robótica — pendiente de definir.',
    },
    {
      id: 'dam',
      x: 52,
      y: 76,
      label: 'DAM',
      title: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
      icon: 'code',
      kind: 'unlocked',
      status: 'Completado',
      institution: '[PLACEHOLDER: Centro — pendiente de definir]',
      period: '[PLACEHOLDER: AAAA — AAAA]',
      description:
        '[PLACEHOLDER] Formación en desarrollo de aplicaciones multiplataforma — pendiente de definir.',
    },
    {
      id: 'bootcamp',
      x: 74,
      y: 76,
      label: 'BOOTCAMP IA',
      title: 'Bootcamp de Inteligencia Artificial',
      icon: 'chip',
      kind: 'unlocked',
      status: 'Completado',
      institution: '[PLACEHOLDER: Centro — pendiente de definir]',
      period: '[PLACEHOLDER: AAAA — AAAA]',
      description:
        '[PLACEHOLDER] Formación en inteligencia artificial — pendiente de definir.',
    },
    {
      id: 'siguiente',
      x: 90,
      y: 46,
      label: '?',
      title: 'Próxima etapa',
      icon: 'question',
      kind: 'locked',
      status: 'En construcción',
      description:
        '[PLACEHOLDER] Siguiente etapa formativa — camino en construcción.',
    },
  ],
  edges: [
    { from: 'eso', to: 'teleco', kind: 'solid' },
    { from: 'teleco', to: 'robotica', kind: 'solid' },
    { from: 'teleco', to: 'dam', kind: 'solid' },
    { from: 'dam', to: 'bootcamp', kind: 'solid' },
    { from: 'bootcamp', to: 'siguiente', kind: 'future' },
  ],
}
