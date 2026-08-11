import { NAV_ITEMS } from '../navigation/nav-items'
import type { HeroIcon } from './CommandNavItem'

export interface HeroCommand {
  id: string
  icon: HeroIcon
  label: string
  sub: string
  path: string
}

const byId = (id: string) => {
  const item = NAV_ITEMS.find((entry) => entry.id === id)
  if (!item) throw new Error(`HeroCommand: ruta de nav "${id}" no encontrada`)
  return item.path
}

/**
 * Comandos del menú principal — etiquetas de sección con subtítulo de
 * "sistema" (contexto de juego). Inicio no aparece: esta pantalla ES el
 * menú principal. Los destinos salen de NAV_ITEMS.
 */
export const HERO_COMMANDS: HeroCommand[] = [
  {
    id: 'sobre-mi',
    icon: 'triangle',
    label: 'Sobre mí',
    sub: '(perfil)',
    path: byId('sobre-mi'),
  },
  {
    id: 'proyectos',
    icon: 'square',
    label: 'Proyectos',
    sub: '(inventario)',
    path: byId('proyectos'),
  },
  {
    id: 'experiencia',
    icon: 'circle',
    label: 'Experiencia',
    sub: '(estadísticas)',
    path: byId('experiencia'),
  },
  {
    id: 'formacion',
    icon: 'cross',
    label: 'Formación',
    sub: '(estudios)',
    path: byId('formacion'),
  },
  {
    id: 'contacto',
    icon: 'asterisk',
    label: 'Contacto',
    sub: '(mensaje)',
    path: byId('contacto'),
  },
]
