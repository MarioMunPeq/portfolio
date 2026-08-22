import { useEffect, useState } from "react";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { profile } from "../../data/profile";
import { MusicPlayer } from "../audio/MusicPlayer";

const linkClass =
  "inline-flex items-center gap-1.5 text-label uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-accent";

function BrandIcon({ icon }: { icon: typeof faGithub }) {
  const path = icon.icon[4];
  return (
    <svg
      viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
      aria-hidden="true"
      className="h-[14px] w-[14px] text-accent"
      fill="currentColor"
    >
      {Array.isArray(path) ? (
        path.map((d) => <path key={d} d={d} />)
      ) : (
        <path d={path} />
      )}
    </svg>
  );
}

interface ClockState {
  hours: string;
  minutes: string;
  dotVisible: boolean;
}

function getInitialClock(): ClockState {
  const now = new Date();
  return {
    hours: String(now.getHours()).padStart(2, "0"),
    minutes: String(now.getMinutes()).padStart(2, "0"),
    dotVisible: now.getSeconds() % 2 === 0,
  };
}

function DigitalClock() {
  const [clock, setClock] = useState<ClockState>(getInitialClock);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock({
        hours: String(now.getHours()).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        dotVisible: now.getSeconds() % 2 === 0,
      });
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="font-digital text-[15px] tracking-[0.15em] text-accent tabular-nums sm:block"
      aria-label="Reloj"
    >
      {clock.hours}
      <span className={clock.dotVisible ? "opacity-100" : "opacity-0"}>
        {" "}♦{" "}
      </span>
      {clock.minutes}
    </span>
  );
}

/**
 * Footer global de sistema: la misma barra en todas las pantallas —
 * BGM player integrado a la izquierda, reloj digital centrado,
 * enlaces externos con iconos FA brands a la derecha.
 * Se monta siempre, incluido el menu principal.
 */
export function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-bg-hero">
      <div className="relative flex flex-col gap-y-1 px-3 py-2 sm:flex-row sm:items-center sm:gap-y-0 sm:px-5 sm:py-3">
        <MusicPlayer />
        <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
          <DigitalClock />
        </span>
        <div className="flex shrink-0 items-center gap-x-4 sm:ml-auto">
          {profile.links.github && (
            <a
              href={profile.links.github.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="contact"
              className={linkClass}
            >
              <BrandIcon icon={faGithub} />
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
              <BrandIcon icon={faLinkedin} />
              {profile.links.linkedin.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
