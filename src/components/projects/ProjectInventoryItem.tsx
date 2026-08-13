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
 * Fila del inventario. Sin seleccionar es texto plano (sin tarjeta, sin
 * borde ni fondo). Seleccionada, todo su color sale de DOS vigas
 * sesgadas que se cruzan a un ligero ángulo (modelo P5), no de un
 * banner sólido debajo: cian (#00E5FF) asomando por la izquierda, rojo
 * (#FF1E1E) por la derecha, con mix-blend screen para que el solape se
 * aclare en un tono pálido donde queda el nombre; un eco fantasma
 * (cian apagado, desplazado y sin blend) da profundidad. Con movimiento
 * permitido, ambas vigas jitterean en loops CSS infinite independientes
 * (clase is-glitching, sin temporizadores JS); bajo reduced-motion se
 * renderizan estáticas y la fila queda quieta. El estado seleccionado
 * se marca con aria-current.
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
        {/* Nombre del proyecto (sobre la colisión cuando está
            seleccionada) */}
        <span
          className={`proj-row-name relative z-10 font-expose uppercase leading-none transition-colors duration-200 ${
            selected
              ? 'text-paper'
              : 'text-outline-mid group-hover:text-outline group-focus-visible:text-outline'
          }`}
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)' }}
        >
          {project.name}
        </span>

        {/* Colisión de vigas (solo fila seleccionada): no hay forma
            sólida debajo; el color visible ES la unión de estas vigas.
            Cian a la izquierda, rojo a la derecha (se solapan con
            screen en un tono pálido) y eco fantasma detrás. El jitter
            continuo corre con is-glitching; bajo reduced-motion quedan
            en su pose estática */}
        {selected && (
          <span aria-hidden="true" className="proj-row-beams">
            <span className="proj-row-beam proj-row-beam--ghost">
              <span className="proj-row-beam__shape" />
            </span>
            <span className="proj-row-beam proj-row-beam--cyan">
              <span className="proj-row-beam__shape" />
            </span>
            <span className="proj-row-beam proj-row-beam--red">
              <span className="proj-row-beam__shape" />
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
