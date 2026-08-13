import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import type { Project } from '../../data/projects'

interface ProjectInventoryItemProps {
  project: Project
  index: number
  selected: boolean
  onSelect: () => void
  setItemRef: (el: HTMLAnchorElement | null) => void
}

/** Iconos de botón de mando (misma familia que la navegación del hero). */
const ROW_GLYPHS: ReadonlyArray<{ glyph: string; color: string }> = [
  { glyph: '△', color: 'text-face-tri' },
  { glyph: '□', color: 'text-face-sq' },
  { glyph: '○', color: 'text-face-cir' },
  { glyph: '✕', color: 'text-face-cross' },
]

/**
 * Fila del inventario tipo tarjeta angular (tratamiento .cmd del hero):
 * borde fino con esquina recortada y rotación/offset por fila. Al estar
 * seleccionada, un haz rojo sesgado la atraviesa con doble exposición de
 * aberración cromática. El estado activo se marca con aria-current.
 */
export function ProjectInventoryItem({
  project,
  index,
  selected,
  onSelect,
  setItemRef,
}: ProjectInventoryItemProps) {
  const reduced = useReducedMotion()
  const { glyph, color } = ROW_GLYPHS[index % ROW_GLYPHS.length]

  return (
    <li className="proj-item">
      <Link
        to={`/proyectos/${project.slug}`}
        ref={setItemRef}
        data-cursor
        aria-current={selected ? 'true' : undefined}
        onMouseEnter={onSelect}
        onFocus={onSelect}
        className={`proj-row group relative flex items-center gap-3 py-3 pl-4 pr-3 md:gap-4 md:py-4 ${
          selected ? 'is-selected' : ''
        }`}
      >
        {/* Fondo angular de la tarjeta */}
        <span aria-hidden="true" className="proj-row-track" />

        {/* Copias de aberración cromática tras el haz (solo seleccionado) */}
        {selected && !reduced && (
          <>
            <span aria-hidden="true" className="proj-beam-copy proj-beam-copy--cyan" />
            <span aria-hidden="true" className="proj-beam-copy proj-beam-copy--red" />
          </>
        )}

        {/* Haz rojo de selección */}
        <span
          aria-hidden="true"
          className={`proj-beam ${selected ? 'is-active' : ''}`}
        />

        {/* Icono de botón de mando */}
        <span
          aria-hidden="true"
          className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-bold ${color}`}
        >
          {glyph}
        </span>

        {/* Nombre del proyecto */}
        <span
          className={`relative z-10 font-display uppercase leading-none transition-colors duration-200 ${
            selected
              ? 'text-paper'
              : 'text-outline-mid group-hover:text-outline group-focus-visible:text-outline'
          }`}
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)' }}
        >
          {project.name}
        </span>

        {/* Píldora de acción con corte diagonal */}
        <span
          className={`relative z-10 ml-auto flex shrink-0 items-center gap-2 self-center px-3 py-1.5 text-label font-medium uppercase tracking-[0.2em] transition-opacity duration-200 [clip-path:polygon(0_0,92%_0,100%_100%,8%_100%)] ${
            selected
              ? 'bg-halftone-red text-paper'
              : 'border border-accent/70 text-paper/70 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:text-paper group-focus-visible:text-paper'
          }`}
        >
          SELECCIONAR
          <span className="text-[10px] leading-none">▲▼</span>
        </span>

        {/* Glitch-slice breve al hover en filas no seleccionadas */}
        {!selected && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-paper opacity-0 [clip-path:polygon(0_78%,100%_78%,100%_84%,0_84%)] group-hover:animate-[hero-glitch_0.22s_steps(3)_1] group-focus-visible:animate-[hero-glitch_0.22s_steps(3)_1]"
          />
        )}
      </Link>
    </li>
  )
}
