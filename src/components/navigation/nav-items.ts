export interface NavItem {
  id: string
  label: string
  index: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', index: '01' },
  { id: 'sobre-mi', label: 'Sobre mí', index: '02' },
  { id: 'proyectos', label: 'Proyectos', index: '03' },
  { id: 'experiencia', label: 'Experiencia', index: '04' },
  { id: 'formacion', label: 'Formación', index: '05' },
  { id: 'contacto', label: 'Contacto', index: '06' },
]
