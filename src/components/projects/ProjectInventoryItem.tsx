import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import type { Project } from '../../data/projects'

interface ProjectInventoryItemProps {
  project: Project
  selected: boolean
  onSelect: () => void
  setItemRef: (el: HTMLAnchorElement | null) => void
}

/**
 * Fila del inventario tipo tarjeta angular (tratamiento .cmd del hero):
 * borde fino con esquina recortada y rotación/offset por fila. Al estar
 * seleccionada, un haz rojo sesgado la atraviesa y, con movimiento
 * permitido, entra en un glitch continuo 100% CSS (sin temporizadores JS):
 * dos clones completos del banner en rojo #FF1E1E y cian #00E5FF ciclan
 * de forma ininterrumpida por posiciones de offset/skew con opacidad
 * media siempre activa, en loops infinitos de duración independiente para
 * que no se muevan en sincronía ni sus picos coincidan (evita el lavado a
 * blanco del mix-blend screen); el banner base se deforma con micro-skews
 * en otro loop continuo. Bajo reduced-motion no se renderiza nada y la
 * fila queda estática. El estado seleccionado se marca con aria-current.
 */
export function ProjectInventoryItem({
  project,
  selected,
  onSelect,
  setItemRef,
}: ProjectInventoryItemProps) {
  const reduced = useReducedMotion()

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
        } ${selected && !reduced ? 'is-glitching' : ''}`}
      >
        {/* Fondo angular de la tarjeta */}
        <span aria-hidden="true" className="proj-row-track" />

        {/* Haz rojo de selección */}
        <span
          aria-hidden="true"
          className={`proj-beam ${selected ? 'is-active' : ''}`}
        />

        {/* Nombre del proyecto */}
        <span
          className={`proj-row-name relative z-10 font-display uppercase leading-none transition-colors duration-200 ${
            selected
              ? 'text-paper'
              : 'text-outline-mid group-hover:text-outline group-focus-visible:text-outline'
          }`}
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)' }}
        >
          {project.name}
        </span>

        {/* Clones de glitch (solo seleccionado y con movimiento permitido):
            dos copias completas del banner (haz + texto), rojo #FF1E1E y
            cian #00E5FF, que ciclan en loops CSS infinite con opacity
            media siempre activa y posiciones escalonadas independientes */}
        {selected && !reduced && (
          <span aria-hidden="true" className="proj-glitch">
            <span className="proj-glitch__copy proj-glitch__copy--red">
              <span className="proj-glitch__copy-beam" />
              <span className="proj-glitch__copy-text">{project.name}</span>
            </span>
            <span className="proj-glitch__copy proj-glitch__copy--cyan">
              <span className="proj-glitch__copy-beam" />
              <span className="proj-glitch__copy-text">{project.name}</span>
            </span>
          </span>
        )}

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
