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
 * Comandos del menú principal — etiqueta grande de "sistema" (contexto de
 * juego) con el nombre real de la sección como subtítulo. Inicio no aparece
 * aquí: esta pantalla ES el menú principal. Los destinos salen de NAV_ITEMS.
 */
export const HERO_COMMANDS: HeroCommand[] = [
  {
    id: 'sobre-mi',
    icon: 'triangle',
    label: 'perfil',
    sub: 'Sobre mí',
    path: byId('sobre-mi'),
  },
  {
    id: 'proyectos',
    icon: 'square',
    label: 'inventario',
    sub: 'Proyectos',
    path: byId('proyectos'),
  },
  {
    id: 'experiencia',
    icon: 'circle',
    label: 'progreso',
    sub: 'Experiencia',
    path: byId('experiencia'),
  },
  {
    id: 'formacion',
    icon: 'cross',
    label: 'habilidades',
    sub: 'Formación',
    path: byId('formacion'),
  },
]
