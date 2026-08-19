import { Link } from "react-router-dom";

interface MenuOptionProps {
  index: string;
  label: string;
  path: string;
  /** Etiqueta de accion que aparece al hacer hover/focus (p. ej. "SELECCIONAR"). */
  tag?: string;
  current?: boolean;
}

/**
 * Opcion de menu de videojuego: fila con indice display, etiqueta enorme
 * (alterna solido/contorno), flecha roja que aparece al seleccionar y
 * desplazamiento del texto. El estado activo (pantalla actual) se marca
 * con bloque rojo sesgado. Interaccion por hover y por teclado (focus).
 */
export function MenuOption({
  index,
  label,
  path,
  tag = "SELECCIONAR",
  current = false,
}: MenuOptionProps) {
  const isOutline = Number(index) % 2 === 1;

  return (
    <li>
      <Link
        to={path}
        data-cursor="open"
        aria-current={current ? "page" : undefined}
        className="group flex items-center gap-4 border-b border-paper/15 py-3 transition-colors focus-visible:border-accent md:gap-6 md:py-4"
      >
        <span className="w-11 shrink-0 text-center md:w-14">
          <span
            className={`inline-block -skew-x-12 font-display text-xl leading-none transition-colors duration-200 md:text-2xl ${
              current
                ? "bg-accent px-2.5 py-1 text-paper"
                : "text-outline-faint group-hover:text-outline group-focus-visible:text-outline"
            }`}
          >
            <span className="inline-block skew-x-12">{index}</span>
          </span>
        </span>

        <span
          className={`font-display uppercase leading-none transition-transform duration-200 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2 ${
            isOutline
              ? "text-outline-faint group-hover:text-outline group-focus-visible:text-outline"
              : "text-paper/85 group-hover:text-accent group-focus-visible:text-accent"
          }`}
          style={{ fontSize: "clamp(1.6rem, 4.2vw, 3.25rem)" }}
        >
          {label}
        </span>

        <span
          aria-hidden="true"
          className={`ml-auto flex items-center gap-2 self-center transition-all duration-200 ${
            current
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
        >
          <span className="text-label uppercase tracking-[0.2em] text-paper/60">
            {tag}
          </span>
          <span className="block h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]" />
        </span>
      </Link>
    </li>
  );
}
