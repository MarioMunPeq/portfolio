import type { ReactNode } from 'react'
import { DiamondMarker } from '../shared/DiamondMarker'

interface ScreenHeaderProps {
  label: string
  title: ReactNode
  /** Use Persona 5 menu font for the title */
  usePersonaFont?: boolean
}

/**
 * Cabecera de pantalla de contenido: etiqueta con marcador angular
 * (diamante, para etiquetas no navegables), título display y acento
 * diagonal rojo. Enmarca el bloque con esquinas de "viñeta de cómic".
 * Vive sobre el tema oscuro del sistema.
 */
export function ScreenHeader({ label, title, usePersonaFont = false }: ScreenHeaderProps) {
  return (
    <header className="relative">
      {/* Esquinas de viñeta */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-paper/30"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-24 h-6 w-6 border-b-2 border-l-2 border-paper/30"
      />

      <span className="inline-flex items-center gap-2.5 text-label font-medium uppercase tracking-[0.22em] text-paper">
        <DiamondMarker size={8} />
        {label}
      </span>

      <h1
        className={`relative mt-4 max-w-[14ch] uppercase leading-none text-paper ${
          usePersonaFont ? 'font-p5-menu' : 'font-display'
        }`}
        style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
      >
        {title}
      </h1>

      {/* Guiño de trama: banda diagonal */}
      <span aria-hidden="true" className="relative mt-5 flex items-center gap-3">
        <span className="block h-2 w-40 -skew-x-12 bg-accent/80" />
      </span>
    </header>
  )
}
