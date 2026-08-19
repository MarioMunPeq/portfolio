export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "inicio", label: "Inicio", path: "/" },
  { id: "sobre-mi", label: "Sobre mi", path: "/about" },
  { id: "proyectos", label: "Proyectos", path: "/projects" },
  { id: "experiencia", label: "Experiencia", path: "/experience" },
  { id: "formacion", label: "Formacion", path: "/education" },
];
