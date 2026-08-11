import { NAV_ITEMS } from '../navigation/nav-items'
import type { HeroIcon } from './CommandNavItem'

export interface HeroCommand {
  id: string
  icon: HeroIcon
  num: string
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
 * Comandos del menú principal — nomenclatura de "sistema" de la referencia
 * con subtítulo que indica la sección real. Los destinos salen de NAV_ITEMS.
 */
export const HERO_COMMANDS: HeroCommand[] = [
  {
    id: 'sobre-mi',
    icon: 'triangle',
    num: '01',
    label: 'Sobre mí',
    sub: '(perfil)',
    path: byId('sobre-mi'),
  },
  {
    id: 'proyectos',
    icon: 'square',
    num: '02',
    label: 'Inventario',
    sub: '(proyectos)',
    path: byId('proyectos'),
  },
  {
    id: 'experiencia',
    icon: 'circle',
    num: '03',
    label: 'Estadísticas',
    sub: '(experiencia)',
    path: byId('experiencia'),
  },
  {
    id: 'formacion',
    icon: 'cross',
    num: '04',
    label: 'Árbol de habilidades',
    sub: '(estudios)',
    path: byId('formacion'),
  },
]
