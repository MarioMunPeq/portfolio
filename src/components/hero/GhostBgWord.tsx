interface GhostBgWordProps {
  children: string;
}

/**
 * Palabra fantasma gigante de fondo (contorno sin relleno, rotada).
 * Puramente decorativa, fuera del flujo de lectura.
 */
export function GhostBgWord({ children }: GhostBgWordProps) {
  return (
    <span
      aria-hidden="true"
      className="hero-ghost pointer-events-none absolute left-[38%] top-[8%] z-0 -rotate-4 select-none font-display uppercase leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:1.5px_var(--color-bg-content-alt)]"
      style={{ fontSize: "26vw" }}
    >
      {children}
    </span>
  );
}
