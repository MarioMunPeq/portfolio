import type { Project } from '../../data/projects'
import { DiamondMarker } from '../shared/DiamondMarker'

const OUTLINE = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero)`

/**
 * Panel de captura del inventario: la gran imagen del proyecto
 * seleccionado en un marco angular (esquinas cortadas) con sombra roja
 * dura, sello del número sobre la esquina y franja de rayas en el pie.
 * Mientras no exista captura real (project.images), se muestra un
 * placeholder claramente identificable que deja patente dónde irá la
 * futura captura. Debajo, el título en grande y una frase muy corta.
 */
function Placeholder({ project }: { project: Project }) {
  return (
    <div
      role="img"
      aria-label={`Placeholder de captura de ${project.name}`}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-halftone-ink"
    >
      <span
        aria-hidden="true"
        className="absolute -left-10 -top-8 block h-[130%] w-14 -skew-x-[16deg] bg-accent/20"
      />
      <div className="relative flex items-center gap-2 bg-halftone-red px-4 py-2.5 clip-notch border-l-4 border-accent">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
        />
        <span className="text-label font-medium uppercase tracking-[0.22em] text-paper">
          [PROJECT PREVIEW PLACEHOLDER]
        </span>
      </div>
      <span
        className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-accent px-3 py-1.5 text-label font-medium uppercase tracking-[0.22em] text-paper -rotate-3"
      >
        <DiamondMarker size={6} />
        Captura pendiente
      </span>
    </div>
  )
}

export function ProjectPreview({ project }: { project: Project }) {
  const image = project.images?.[0]

  return (
    <div className="relative w-full max-w-[42rem]">
      <div className="relative">
        {/* Sombra dura roja desplazada tras el marco */}
        <span
          aria-hidden="true"
          className="proj-frame absolute right-3 top-4 block h-full w-full bg-accent"
        />

        <figure className="proj-frame relative border-2 border-paper bg-bg-content-alt">
          <div className="relative aspect-[16/10] overflow-hidden">
            {image ? (
              <img
                src={image.src}
                alt={image.alt}
                className="block h-full w-full object-cover"
              />
            ) : (
              <Placeholder project={project} />
            )}
          </div>

          {/* Corchetes HUD en las cuatro esquinas del marco */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 z-10 text-accent opacity-70"
          >
            <span className="absolute left-0 top-0 h-5 w-5">
              <span className="absolute left-0 top-0 h-[2px] w-full bg-current" />
              <span className="absolute left-0 top-0 h-full w-[2px] bg-current" />
            </span>
            <span className="absolute right-0 top-0 h-5 w-5">
              <span className="absolute right-0 top-0 h-[2px] w-full bg-current" />
              <span className="absolute right-0 top-0 h-full w-[2px] bg-current" />
            </span>
            <span className="absolute bottom-0 left-0 h-5 w-5">
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-current" />
              <span className="absolute bottom-0 left-0 h-full w-[2px] bg-current" />
            </span>
            <span className="absolute bottom-0 right-0 h-5 w-5">
              <span className="absolute bottom-0 right-0 h-[2px] w-full bg-current" />
              <span className="absolute bottom-0 right-0 h-full w-[2px] bg-current" />
            </span>
          </span>

          <span aria-hidden="true" className="flex h-2 overflow-hidden">
            <span className="h-full w-1/3 bg-stripes-red" />
            <span className="h-full flex-1 bg-accent" />
          </span>
        </figure>

        {/* Bandera "SELECCIONADO" sobre el marco */}
        <span
          aria-hidden="true"
          className="absolute -top-3 right-5 z-10 inline-flex items-center gap-1.5 bg-halftone-red px-3 py-1 text-label font-medium uppercase tracking-[0.2em] text-paper [clip-path:polygon(0_0,100%_0,92%_100%,8%_100%)]"
        >
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          SELECCIONADO
        </span>
      </div>

      <div className="relative mt-10">
        <div>
          <h2
            className="font-display uppercase leading-[0.95] text-paper"
            style={{
              fontSize: 'clamp(2rem, 3.4vw, 3.25rem)',
              textShadow: OUTLINE,
            }}
          >
            {project.name}
          </h2>
          <p className="mt-2 max-w-md text-caption leading-relaxed text-paper/70">
            {project.summary}
          </p>
        </div>
        <span aria-hidden="true" className="mt-4 flex items-center gap-3">
          <span className="block h-2 w-32 -skew-x-12 bg-accent" />
        </span>
      </div>
    </div>
  )
}
