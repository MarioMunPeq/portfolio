import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../navigation/nav-items'
import { profile } from '../../data/profile'

function toCounter(value: number) {
  return String(value).padStart(2, '0')
}

/**
 * HUD persistente del sistema: franja superior fija con la identidad de
 * marca, la ubicación y el contador de pantalla (página actual / total).
 * Vive por encima del contenido pero bajo el cargador, el barrido y el
 * cursor. Es decorativa de la identidad de juego, no reemplaza la nav.
 */
export function HUD() {
  const location = useLocation()

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path),
  )
  const current = activeIndex >= 0 ? activeIndex : 0
  const year = new Date().getFullYear()

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-paper/10 bg-bg-hero text-paper">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 md:px-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.25em]"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)] transition-transform duration-200 group-hover:translate-x-0.5"
          />
          <span className="text-paper/80 transition-colors group-hover:text-accent">
            {profile.branding.system}
          </span>
        </Link>

        <span className="hidden text-label uppercase tracking-[0.25em] text-paper/50 md:inline">
          {profile.location}
        </span>

        <span className="text-label font-medium uppercase tracking-[0.25em] text-paper/70">
          {toCounter(current + 1)}/{toCounter(NAV_ITEMS.length)} · {year}
        </span>
      </div>
    </div>
  )
}
