/** Radios de los anillos base (referencia estática, tenues). */
const BASELINE_RADII = [80, 140, 210, 290, 370]

/**
 * Radar de la pantalla de carga: anillos concéntricos alineados con el
 * punto de fuga del skyline (arriba-centro de la imagen, ~50%/46%) más dos
 * pulsos escalonados que crecen y se desvanecen en bucle. reduced-motion
 * deja solo los anillos estáticos (la regla global anula la animación).
 * Puramente decorativo.
 */
export function ConcentricRings() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '46%' }}
      >
        <svg viewBox="0 0 600 600" className="h-[min(76vh,760px)] w-[min(76vh,760px)]">
          {BASELINE_RADII.map((r) => (
            <circle
              key={r}
              cx="300"
              cy="300"
              r={r}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity="0.22"
            />
          ))}
          <circle cx="300" cy="300" r="5" fill="var(--color-accent)" opacity="0.5" />
          <circle
            className="radar-pulse"
            cx="300"
            cy="300"
            r="150"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
          <circle
            className="radar-pulse radar-pulse--b"
            cx="300"
            cy="300"
            r="150"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}
