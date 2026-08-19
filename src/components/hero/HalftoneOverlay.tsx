/**
 * Trama de puntos halftone tenue con mascara radial (fondo del menu).
 * Decorativa (aria-hidden).
 */
export function HalftoneOverlay() {
  return (
    <div
      aria-hidden="true"
      className="hero-halftone pointer-events-none absolute inset-0 z-0 bg-halftone-dots opacity-35 [mask-image:radial-gradient(circle_at_75%_40%,black_0%,transparent_65%)]"
    />
  );
}
