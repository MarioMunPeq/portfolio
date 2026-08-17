import { profile } from '../../data/profile'

const linkClass =
  'inline-flex items-center gap-1.5 text-label uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-accent'

/**
 * Footer global de sistema: la misma barra en todas las pantallas — solo
 * los enlaces externos ◆ GITHUB ◆ LINKEDIN, alineados a la derecha (centrados
 * en movil). Se monta siempre, incluidos el menu principal y Experiencia.
 */
export function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-bg-hero text-paper">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-3 sm:justify-end md:px-6">
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
      </div>
    </div>
  )
}
