// arbol de Habilidades — ruta academica real, de Telecomunicaciones a Bootcamp
// de IA. Centro, periodo y titulaciones proceden del CV. El nodo "locked" es
// decorativo (etapa futura, camino en construccion).

export type SkillNodeKind = "unlocked" | "locked";

export type SkillIconKind =
  "cap" | "antenna" | "robot" | "code" | "chip" | "question";

export interface SkillNode {
  id: string;
  /** Centro del nodo en % del contenedor del arbol. */
  x: number;
  y: number;
  /** Etiqueta corta bajo el nodo. */
  label: string;
  /** Titulo completo de la titulacion (panel de detalle). */
  title: string;
  icon: SkillIconKind;
  kind: SkillNodeKind;
  /** Texto del sello de estado del panel. */
  status: string;
  /** Nivel de la titulacion (Grado medio, Grado superior…). */
  level?: string;
  /** Nota destacada del expediente (TFG, horas…). */
  detail?: string;
  institution?: string;
  period?: string;
  description?: string;
}

export interface SkillEdge {
  from: string;
  to: string;
  /** solid = conexion real completada; future = trazo punteado decorativo. */
  kind: "solid" | "future";
}

export const SKILL_TREE: { nodes: SkillNode[]; edges: SkillEdge[] } = {
  nodes: [
    {
      id: "telecomunicaciones",
      x: 50,
      y: 82,
      label: "TELECO",
      title: "Instalaciones de Telecomunicaciones",
      icon: "antenna",
      kind: "unlocked",
      status: "Completado",
      level: "Grado medio",
      institution: "IES La Merced",
      period: "Septiembre 2018 — Junio 2020",
    },
    {
      id: "ari",
      x: 28,
      y: 50,
      label: "robotica",
      title: "Automatizacion y robotica Industrial",
      icon: "robot",
      kind: "unlocked",
      status: "Completado",
      level: "Grado superior",
      detail: "Sin TFG",
      institution: "IES Galileo",
      period: "Septiembre 2020 — Junio 2022",
    },
    {
      id: "dam",
      x: 72,
      y: 50,
      label: "DAM",
      title: "Desarrollo de Aplicaciones Multiplataforma",
      icon: "code",
      kind: "unlocked",
      status: "Completado",
      level: "Grado superior",
      detail: "mencion honorifica en el TFG",
      institution: "IES Julian Marias",
      period: "Septiembre 2022 — Junio 2024",
    },
    {
      id: "bootcamp",
      x: 72,
      y: 18,
      label: "BOOTCAMP IA",
      title: "Bootcamp de Inteligencia Artificial",
      icon: "chip",
      kind: "unlocked",
      status: "Completado",
      level: "Bootcamp",
      detail: "450 horas",
      institution: "Qualentum",
      period: "Junio 2024 — Enero 2025",
    },
    {
      id: "siguiente",
      x: 50,
      y: 18,
      label: "?",
      title: "Proxima etapa",
      icon: "question",
      kind: "locked",
      status: "En construccion",
    },
  ],
  edges: [
    { from: "telecomunicaciones", to: "ari", kind: "solid" },
    { from: "telecomunicaciones", to: "dam", kind: "solid" },
    { from: "dam", to: "bootcamp", kind: "solid" },
    { from: "bootcamp", to: "siguiente", kind: "future" },
  ],
};
