import { useRef, type KeyboardEvent } from 'react'
import type { Project } from '../../data/projects'
import { ProjectInventoryItem } from './ProjectInventoryItem'

interface ProjectInventoryProps {
  projects: Project[]
  selected: Project
  onSelect: (project: Project) => void
}

/**
 * Selector tipo inventario: lista vertical de proyectos. Pasar el cursor
 * (o el foco) por encima selecciona la fila; las flechas arriba/abajo
 * mueven la selección con teclado y el clic navega a la ficha.
 */
export function ProjectInventory({
  projects,
  selected,
  onSelect,
}: ProjectInventoryProps) {
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])

  const setItemRef = (index: number) => (el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const index = projects.findIndex((p) => p.slug === selected.slug)
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const next = (index + direction + projects.length) % projects.length
    event.preventDefault()
    onSelect(projects[next])
    itemRefs.current[next]?.focus()
  }

  return (
    <nav aria-label="Inventario de proyectos" className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-20 select-none font-display uppercase leading-none text-outline-faint"
        style={{ fontSize: 'clamp(5rem, 10vw, 8.5rem)' }}
      >
        {selected.order}
      </span>

      <ol className="relative" onKeyDown={onKeyDown}>
        {projects.map((project, index) => (
          <ProjectInventoryItem
            key={project.slug}
            project={project}
            selected={project.slug === selected.slug}
            onSelect={() => onSelect(project)}
            setItemRef={setItemRef(index)}
          />
        ))}
      </ol>

      <p className="mt-4 text-label uppercase tracking-[0.22em] text-paper/40">
        {selected.order} / {String(projects.length).padStart(2, '0')} — Ficha
        seleccionada
      </p>
    </nav>
  )
}
