import { Link } from "react-router-dom";
import { profile } from "../../data/profile";

/** Monograma derivado del nombre (Mario Muñoz Pequeño → MMP). */
const INITIALS = profile.name
  .trim()
  .split(/\s+/)
  .slice(0, 3)
  .map((part) => part.charAt(0) ?? "")
  .join("")
  .toUpperCase();

interface WordmarkProps {
  className?: string;
  /** Version estatica (solo menu principal): sin flecha ni enlace, la marca
      se renderiza como etiqueta fija — en Inicio el enlace "volver a inicio"
      seria redundante. */
  static?: boolean;
}

/**
 * Marca de sistema: monograma corto (MMP) sobre la etiqueta completa
 * "SISTEMA PERSONAL". Es el primer slot de la TopBar y de la barra del
 * menu principal; enlaza a la pantalla de inicio (salvo en la variante
 * estatica, que se usa precisamente en la pantalla de inicio).
 */
export function Wordmark({
  className = "",
  static: isStatic = false,
}: WordmarkProps) {
  if (isStatic) {
    return (
      <span
        aria-label={`${INITIALS} — ${profile.branding.system}`}
        className={`inline-flex items-center text-label font-medium uppercase tracking-[0.25em] ${className}`}
      >
        <span className="flex flex-col leading-none">
          <span className="font-display text-base tracking-[0.2em] text-paper">
            {INITIALS}
          </span>
          <span className="mt-0.5 text-[10px] tracking-[0.25em] text-paper/60">
            {profile.branding.system}
          </span>
        </span>
      </span>
    );
  }

  return (
    <Link
      to="/"
      data-cursor="back"
      className={`group inline-flex items-center text-label font-medium uppercase tracking-[0.25em] ${className}`}
    >
      <span className="flex flex-col leading-none">
        <span className="font-display text-base tracking-[0.2em] text-paper transition-colors duration-200 group-hover:text-accent">
          {INITIALS}
        </span>
        <span className="mt-0.5 text-[10px] tracking-[0.25em] text-paper/60">
          {profile.branding.system}
        </span>
      </span>
    </Link>
  );
}
