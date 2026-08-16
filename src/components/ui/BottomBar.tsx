import { profile } from '../../data/profile'
import { DiamondMarker } from '../shared/DiamondMarker'

interface BottomBarProps {
  /** Etiqueta de contexto de la pantalla actual (INVENTARIO…). Opcional:
      sin contexto, el footer muestra solo el crédito y los enlaces. */
  context?: string
  /** Crédito de la esquina izquierda. Por defecto "© año + nombre + rol". */
  credits?: string
}

const linkClass =
  'inline-flex items-center gap-1.5 text-label uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-accent'

/**
 * Barra inferior de sistema de las pantallas internas: créditos con el rol,
 * enlaces externos (GitHub/LinkedIn) y contexto de pantalla. La navegación
 * vive en la TopBar; el footer no repite "volver" para no duplicarla.
 */
export function BottomBar({ context, credits }: BottomBarProps) {
  const year = new Date().getFullYear()
  const credit = credits ?? `© ${year} ${profile.name} · ${profile.roleFull}`

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-bg-hero text-paper">
      <div className="flex items-center justify-center gap-4 px-4 py-3 sm:justify-between md:px-6">
        <span className="hidden truncate text-label uppercase tracking-[0.2em] text-paper/50 sm:inline">
          {credit}
        </span>

        <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {profile.links.github && (
            <a
              href={profile.links.github.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="contact"
              className={linkClass}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
              {profile.links.github.label}
            </a>
          )}
          {profile.links.linkedin && (
            <a
              href={profile.links.linkedin.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="contact"
              className={linkClass}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
              {profile.links.linkedin.label}
            </a>
          )}
          {context ? (
            <span className="flex items-center gap-2 text-label uppercase tracking-[0.25em] text-paper/70">
              <DiamondMarker size={5} />
              {context}
            </span>
          ) : null}
        </span>
      </div>
    </div>
  )
}
