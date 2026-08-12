import type { ReactNode } from 'react'

interface ScreenHeaderProps {
  index: string
  label: string
  title: ReactNode
  /** true si vive sobre fondo oscuro. */
  onDark?: boolean
  /** Use Persona 5 menu font for the title */
  usePersonaFont?: boolean
}

/**
 * Cabecera de pantalla de contenido: índice fantasma gigante, etiqueta
 * con marcador angular, título display y acento diagonal rojo. Enmarca
 * el bloque con esquinas de "viñeta de cómic" y remata con un guiño
 * de trama de puntos.
 */
export function ScreenHeader({ index, label, title, onDark = false, usePersonaFont = false }: ScreenHeaderProps) {
  return (
    <header className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 overflow-hidden">
        <span
          className={`block select-none font-display uppercase leading-none ${
            onDark ? 'text-paper/[0.06]' : 'text-ink/[0.06]'
          }`}
          style={{ fontSize: 'clamp(6rem, 17vw, 13rem)' }}
        >
          {index}
        </span>
      </div>

      {/* Esquinas de viñeta */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 ${
          onDark ? 'border-paper/30' : 'border-ink/30'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-3 left-24 h-6 w-6 border-b-2 border-l-2 ${
          onDark ? 'border-paper/30' : 'border-ink/30'
        }`}
      />

      <span
        className={`inline-flex items-center gap-2.5 text-label font-medium uppercase tracking-[0.22em] ${
          onDark ? 'text-paper' : 'text-ink'
        }`}
      >
        <span
          aria-hidden="true"
          className="inline-block h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
        />
        {label}
      </span>

      <h1
        className={`relative mt-4 max-w-[14ch] uppercase leading-none ${
          onDark ? 'text-paper' : 'text-ink'
        } ${usePersonaFont ? 'font-p5-menu' : 'font-display'}`}
        style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
      >
        {title}
      </h1>

      {/* Guiño de trama: banda diagonal + sello de puntos */}
      <span aria-hidden="true" className="relative mt-5 flex items-center gap-3">
        <span
          className={`block h-2 w-40 -skew-x-12 ${onDark ? 'bg-accent/80' : 'bg-accent'}`}
        />
        <span className="block h-3 w-8 bg-halftone-red" />
      </span>
    </header>
  )
}
