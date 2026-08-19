import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";

interface NavRowProps {
  /** Nombre visible de la fila (uno solo). */
  label: string;
  path: string;
  /** Fila seleccionada: colision de vigas cian/rojo + jitter continuo. */
  active?: boolean;
  onSelect?: () => void;
  setItemRef?: (el: HTMLAnchorElement | null) => void;
  /** Etiqueta de accion que aparece en hover/foco. */
  tag?: string;
}

/**
 * Fila de navegacion de inventario (sistema P5), variantes active/inactive.
 * Sin seleccionar es texto plano; seleccionada, su color sale de DOS vigas
 * sesgadas que se cruzan (cian/rojo con mix-blend screen) y jitterean en
 * bucle (clases .proj-row-* de tokens.css). El `li` declara el offset/
 * rotacion por fila en escritorio. Un unico nombre visible por fila.
 */
export function NavRow({
  label,
  path,
  active = false,
  onSelect,
  setItemRef,
  tag = "SELECCIONAR",
}: NavRowProps) {
  const reduced = useReducedMotion();

  return (
    <li className="proj-item">
      <Link
        to={path}
        ref={setItemRef}
        data-cursor="project"
        aria-current={active ? "true" : undefined}
        onMouseEnter={onSelect}
        onFocus={onSelect}
        className={`proj-row group relative flex items-center gap-3 py-3 pl-4 pr-3 md:gap-4 md:py-4 ${
          active ? "is-selected" : ""
        } ${active && !reduced ? "is-glitching" : ""}`}
      >
        <span
          className={`proj-row-name relative z-10 font-expose uppercase leading-none transition-colors duration-200 ${
            active
              ? "text-paper"
              : "text-outline-mid group-hover:text-outline group-focus-visible:text-outline"
          }`}
          style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.75rem)" }}
        >
          {label}
        </span>

        {active && (
          <span aria-hidden="true" className="proj-row-beams">
            <span className="proj-row-beam proj-row-beam--ghost">
              <span className="proj-row-beam__shape" />
            </span>
            <span className="proj-row-beam proj-row-beam--cyan">
              <span className="proj-row-beam__shape" />
            </span>
            <span className="proj-row-beam proj-row-beam--red">
              <span className="proj-row-beam__shape" />
            </span>
          </span>
        )}

        {!active && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-paper opacity-0 [clip-path:polygon(0_78%,100%_78%,100%_84%,0_84%)] group-hover:animate-[hero-glitch_0.22s_steps(3)_1] group-focus-visible:animate-[hero-glitch_0.22s_steps(3)_1]"
          />
        )}

        <span
          className={`relative z-10 ml-auto flex items-center gap-2 text-label uppercase tracking-[0.2em] transition-all duration-200 ${
            active
              ? "text-paper"
              : "text-paper/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
        >
          {tag}
          <span className="block h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]" />
        </span>
      </Link>
    </li>
  );
}
