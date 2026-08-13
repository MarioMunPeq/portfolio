import { Link, useLocation } from 'react-router-dom'
import { profile } from '../../data/profile'

/**
 * HUD persistente del sistema: franja superior fija con la identidad de
 * marca, la ubicación y el año. Vive por encima del contenido pero bajo
 * el cargador, el barrido y el cursor. Es decorativa de la identidad de
 * juego, no reemplaza la nav. No se monta en el menú principal: esa
 * pantalla trae su propia topbar (hazard stripe + labels de sistema).
 */
export function HUD() {
  const location = useLocation()

  if (location.pathname === '/') return null

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
          {year}
        </span>
      </div>
    </div>
  )
}
