import type { ReactNode } from 'react'

interface VisualPanelProps {
  children?: ReactNode
  /** Borde y tono base. */
  tone?: 'ink' | 'paper'
  /** indice display grande en la esquina superior izquierda. */
  index?: string
  /** Etiqueta pequeña con rayas rojas bajo el panel. */
  tag?: string
  className?: string
}

const toneClass = {
  ink: 'border-ink bg-paper',
  paper: 'border-paper bg-bg-hero/40',
} as const

const cornerClass = {
  ink: 'border-ink',
  paper: 'border-paper',
} as const

/**
 * Panel enmarcado tipo "viñeta de comic": borde doble angular con esquinas
 * cortadas, numeral display y franja de rayas rojas bajo el pie. Es el
 * contenedor base para tarjetas y bloques destacados del sistema P5.
 */
export function VisualPanel({
  children,
  tone = 'ink',
  index,
  tag,
  className = '',
}: VisualPanelProps) {
  return (
    <div className={`relative ${className}`}>
      <div className={`relative border-2 ${toneClass[tone]}`}>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 ${cornerClass[tone]}`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 ${cornerClass[tone]}`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 ${cornerClass[tone]}`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 ${cornerClass[tone]}`}
        />

        {index ? (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -top-4 left-2 select-none font-display uppercase leading-none ${
              tone === 'ink' ? 'text-ink/25' : 'text-paper/25'
            }`}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            {index}
          </span>
        ) : null}

        <div className="relative p-5 md:p-7">{children}</div>
      </div>

      {tag ? (
        <div aria-hidden="true" className="mt-1 flex h-2 overflow-hidden">
          <span className="h-full w-2/5 bg-stripes-red" />
          <span className="h-full flex-1 bg-accent" />
        </div>
      ) : null}
    </div>
  )
}
