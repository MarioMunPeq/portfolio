import { useState } from 'react'
import { Screen } from '../components/transition/Screen'
import { ProjectPreview } from '../components/projects/ProjectPreview'
import { ProjectInventory } from '../components/projects/ProjectInventory'
import { SectionTitle } from '../components/ui/SectionTitle'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'

/**
 * Capa gráfica de fondo del inventario: estrellas de contorno por toda la
 * página, palabra fantasma, cuñas diagonales y scanlines. Todo
 * decorativo y detrás del contenido (z-10).
 */
function ProjectsGraphicLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Estrellas de contorno sutiles de fondo */}
      <span className="absolute inset-0 bg-stars opacity-70" />

      <span
        className="absolute right-[-3rem] top-[3%] -rotate-6 select-none font-display uppercase leading-none text-outline-faint opacity-25"
        style={{ fontSize: 'clamp(6rem, 13vw, 12rem)' }}
      >
        Inventario
      </span>

      <span className="absolute -left-16 top-[46%] block h-2 w-[36rem] -rotate-[6deg] bg-accent/50" />
      <span className="absolute left-[26%] top-[72%] block h-px w-[30rem] -rotate-[3deg] bg-paper/15" />

      <span className="absolute inset-0 bg-scanlines" />
    </div>
  )
}

/**
 * Pantalla de proyectos = inventario del sistema. La gran captura del
 * proyecto seleccionado domina la izquierda; a la derecha, el selector
 * tipo inventario: filas de texto plano donde la seleccionada se pinta
 * con la colisión de dos vigas sesgadas (cian + rojo). Hover/foco
 * selecciona, clic abre la ficha (/proyectos/:slug).
 */
export function Projects() {
  const [selected, setSelected] = useState<Project>(projects[0])

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative min-h-dvh overflow-x-hidden">
        <ProjectsGraphicLayer />

        <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-24 pt-24 md:px-10 lg:px-14">
          <SectionTitle label="Inventario de proyectos" title="INVENTARIO" persona />

          <div className="grid flex-1 items-center gap-x-10 py-8 lg:grid-cols-[1.06fr_1fr] xl:gap-x-16 xl:py-10">
            <ProjectPreview project={selected} />
            <ProjectInventory
              projects={projects}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
      </section>
    </Screen>
  )
}
