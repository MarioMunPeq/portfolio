import { profile } from '../../data/profile'
import { DiamondMarker } from '../shared/DiamondMarker'

interface BottomBarProps {
  /** Etiqueta de contexto de la pantalla actual (PERFIL, INVENTARIO…). */
  context: string
  /** Crédito de la esquina izquierda. Por defecto "© año + nombre". */
  credits?: string
}

/**
 * Barra inferior de sistema de las pantallas internas: dos slots
 * [créditos] [contexto]. La navegación vive en la TopBar; el footer no
 * repite "volver" para no duplicarla.
 */
export function BottomBar({ context, credits }: BottomBarProps) {
  const year = new Date().getFullYear()
  const credit = credits ?? `© ${year} ${profile.name}`

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-bg-hero text-paper">
      <div className="flex items-center justify-center gap-4 px-4 py-3 sm:justify-between md:px-6">
        <span className="hidden truncate text-label uppercase tracking-[0.2em] text-paper/50 sm:inline">
          {credit}
        </span>

        <span className="flex items-center gap-2 text-label uppercase tracking-[0.25em] text-paper/70">
          <DiamondMarker size={5} />
          {context}
        </span>
      </div>
    </div>
  )
}
