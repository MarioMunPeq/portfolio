import {
  faCircleQuestion,
  faCode,
  faGraduationCap,
  faMicrochip,
  faRobot,
  faTowerBroadcast,
} from '@fortawesome/free-solid-svg-icons'
import type { SkillIconKind } from '../../data/skill-tree'

type IconDef = typeof faRobot

/** Mapeo de cada campo del arbol a su icono solido de Font Awesome. */
const ICONS: Record<SkillIconKind, IconDef> = {
  cap: faGraduationCap,
  antenna: faTowerBroadcast,
  robot: faRobot,
  code: faCode,
  chip: faMicrochip,
  question: faCircleQuestion,
}

/**
 * Icono de campo de cada nodo del arbol: set solido de Font Awesome, con
 * fills gruesos que dan el peso grafico del resto de la UI Persona 5.
 * Hereda el color con currentColor y mantiene la proporcion del glifo.
 * 'question' (etapa futura) usa el mismo peso solido, ya no el circulo
 * de trazo fino anterior.
 */
export function NodeIcon({ kind, className = '' }: { kind: SkillIconKind; className?: string }) {
  const icon = ICONS[kind]
  const path = icon.icon[4]
  return (
    <svg
      viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {Array.isArray(path) ? path.map((d) => <path key={d} d={d} />) : <path d={path} />}
    </svg>
  )
}
