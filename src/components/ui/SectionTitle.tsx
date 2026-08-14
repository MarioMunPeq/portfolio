import type { ReactNode } from 'react'
import { DiamondMarker } from '../shared/DiamondMarker'

const OUTLINE = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero)`

interface SectionTitleProps {
  title: ReactNode
  /** Etiqueta pequeña con marcador angular bajo la que va el título. */
  label?: string
  /** Fuente Persona 5 (ransom-note) para el título. */
  persona?: boolean
  className?: string
}

/**
 * Título de sección unificado: etiqueta opcional + título grande (2 familias:
 * P5 Menu o display) + subrayado rojo sesgado + rombo dorado + corchetes de
 * retícula HUD en las esquinas. Reemplaza a ScreenHeader y a los bloques
 * de título inline de Perfil/Inventario.
 */
export function SectionTitle({ title, label, persona = false, className = '' }: SectionTitleProps) {
  return (
    <header className={`relative ${className}`}>
      {/* Corchetes de retícula HUD */}
      <span aria-hidden="true" className="pointer-events-none absolute -left-3 -top-3 h-6 w-6">
        <span className="absolute left-0 top-0 h-[2px] w-6 bg-accent/60" />
        <span className="absolute left-0 top-0 h-6 w-[2px] bg-accent/60" />
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-3 h-6 w-6">
        <span className="absolute right-0 top-0 h-[2px] w-6 bg-accent/60" />
        <span className="absolute right-0 top-0 h-6 w-[2px] bg-accent/60" />
      </span>

      {label ? (
        <p className="flex items-center gap-2.5 font-expose text-label font-medium uppercase tracking-[0.22em] text-accent">
          <DiamondMarker size={8} />
          {label}
        </p>
      ) : null}

      <h1
        className={`mt-3 uppercase leading-[0.95] text-paper ${
          persona ? 'font-p5-menu' : 'font-display'
        }`}
        style={{
          fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
          textShadow: `${OUTLINE}, 6px 6px 0 var(--color-accent-deep)`,
        }}
      >
        {title}
      </h1>

      <span aria-hidden="true" className="mt-4 flex items-center gap-3">
        <span className="block h-2 w-44 -skew-x-12 bg-accent" />
        <span className="block h-3 w-3 rotate-45 bg-gold" />
      </span>
    </header>
  )
}
