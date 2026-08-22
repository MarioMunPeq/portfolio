import { profile } from "../../data/profile";
import { MusicPlayer } from "../audio/MusicPlayer";

const linkClass =
  "inline-flex items-center gap-1.5 text-label uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-accent";

/**
 * Footer global de sistema: la misma barra en todas las pantallas —
 * BGM player integrado a la izquierda, enlaces externos ◆ GITHUB ◆
 * LINKEDIN a la derecha. Se monta siempre, incluido el menu principal.
 */
export function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-bg-hero">
      <div className="flex flex-col gap-y-1 px-3 py-2 sm:flex-row sm:items-center sm:gap-y-0 sm:px-5 sm:py-3">
        <MusicPlayer />
        <div className="flex shrink-0 items-center gap-x-4 sm:ml-auto">
          {profile.links.github && (
            <a
              href={profile.links.github.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="contact"
              className={linkClass}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rotate-45 bg-accent"
              />
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
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rotate-45 bg-accent"
              />
              {profile.links.linkedin.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
