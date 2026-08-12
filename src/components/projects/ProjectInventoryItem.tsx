import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'

interface ProjectInventoryItemProps {
  project: Project
  selected: boolean
  onSelect: () => void
  setItemRef: (el: HTMLAnchorElement | null) => void
}

/**
 * Fila del inventario: número display (chip blanco al estar seleccionada,
 * fantasma en el resto), nombre gigante y haz rojo sesgado que atraviesa
 * la fila al seleccionarla. El estado activo se marca con aria-current.
 */
export function ProjectInventoryItem({
  project,
  selected,
  onSelect,
  setItemRef,
}: ProjectInventoryItemProps) {
  return (
    <li className="border-b border-paper/10 last:border-b-0">
      <Link
        to={`/proyectos/${project.slug}`}
        ref={setItemRef}
        data-cursor
        aria-current={selected ? 'true' : undefined}
        onMouseEnter={onSelect}
        onFocus={onSelect}
        className="group relative flex items-center gap-4 py-3.5 md:gap-6 md:py-4"
      >
        <span
          aria-hidden="true"
          className={`proj-beam ${selected ? 'is-active' : ''}`}
        />

        <span
          className={`relative z-10 font-display uppercase leading-none transition-colors duration-200 ${
            selected
              ? 'text-paper'
              : 'text-outline-faint group-hover:text-outline group-focus-visible:text-outline'
          }`}
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)' }}
        >
          {project.name}
        </span>

        <span
          aria-hidden="true"
          className={`relative z-10 ml-auto flex items-center gap-2 self-center transition-opacity duration-200 ${
            selected
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
          }`}
        >
          <span
            className={`text-label font-medium uppercase tracking-[0.2em] ${
              selected ? 'text-paper' : 'text-paper/60'
            }`}
          >
            SELECCIONAR
          </span>
          <span className="text-label font-medium leading-none text-accent">▲▼</span>
        </span>
      </Link>
    </li>
  )
}
