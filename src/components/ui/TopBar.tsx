import { profile } from '../../data/profile'
import { Wordmark } from './Wordmark'

interface TopBarProps {
  /** Etiqueta de contexto de la pantalla actual (PERFIL, INVENTARIO…). */
  context: string
}

/**
 * Barra superior de sistema de las pantallas internas: franja diagonal
 * rojo/negro (hazard) + tres slots fijos [◀ MARCA] [contexto] [SISTEMA V.2026].
 * Sustituye a la HUD genérica: fija, decorativa de la identidad de juego.
 */
export function TopBar({ context }: TopBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div aria-hidden="true" className="h-[14px] w-full bg-hazard" />
      <div className="border-b border-paper/10 bg-bg-hero text-paper">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 md:px-6">
          <Wordmark />

          <span className="hidden truncate text-label uppercase tracking-[0.25em] text-paper/60 md:inline">
            {context}
          </span>

          <span className="text-label font-medium uppercase tracking-[0.25em] text-paper/70">
            {profile.branding.system.split(' ')[0]} {profile.branding.version}
          </span>
        </div>
      </div>
    </div>
  )
}
