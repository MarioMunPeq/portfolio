/**
 * Corchetes HUD de la pantalla de carga: marcas "L" en las cuatro esquinas
 * del viewport (estilo visor/reticula). 2px, rojo acento, opacidad moderada.
 * Insertados 20px desde el borde para no chocar con las etiquetas del
 * topbar y de la fila inferior (que viven a 24-32px). Puramente decorativo.
 */
export function HudCorners() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 text-accent opacity-60"
    >
      <span data-hud-corner="tl" className="absolute left-5 top-5 h-9 w-9">
        <span className="absolute left-0 top-0 h-[2px] w-9 bg-current" />
        <span className="absolute left-0 top-0 h-9 w-[2px] bg-current" />
      </span>
      <span data-hud-corner="tr" className="absolute right-5 top-5 h-9 w-9">
        <span className="absolute right-0 top-0 h-[2px] w-9 bg-current" />
        <span className="absolute right-0 top-0 h-9 w-[2px] bg-current" />
      </span>
      <span data-hud-corner="bl" className="absolute bottom-5 left-5 h-9 w-9">
        <span className="absolute bottom-0 left-0 h-[2px] w-9 bg-current" />
        <span className="absolute bottom-0 left-0 h-9 w-[2px] bg-current" />
      </span>
      <span data-hud-corner="br" className="absolute bottom-5 right-5 h-9 w-9">
        <span className="absolute bottom-0 right-0 h-[2px] w-9 bg-current" />
        <span className="absolute bottom-0 right-0 h-9 w-[2px] bg-current" />
      </span>
    </div>
  );
}
