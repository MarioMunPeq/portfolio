export interface NavItem {
  id: string
  label: string
  index: string
  path: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', index: '01', path: '/' },
  { id: 'sobre-mi', label: 'Sobre mí', index: '02', path: '/about' },
  { id: 'proyectos', label: 'Proyectos', index: '03', path: '/projects' },
  { id: 'experiencia', label: 'Experiencia', index: '04', path: '/experience' },
  { id: 'formacion', label: 'Formación', index: '05', path: '/education' },
  { id: 'contacto', label: 'Contacto', index: '06', path: '/contact' },
]
