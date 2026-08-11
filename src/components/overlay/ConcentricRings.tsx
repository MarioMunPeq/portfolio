const RINGS = Array.from({ length: 11 }, (_, i) => ({
  r: 30 + i * 26,
  color: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-ink)',
  strokeWidth: i % 2 === 0 ? 3 : 1.5,
  opacity: Math.max(0.85 - i * 0.07, 0.12),
}))

/**
 * Anillos concéntricos tipo radar/onda expansiva, generados por código
 * (SVG), centrados detrás del contador de la pantalla de carga. Alternan
 * rojo y tinta y pierden opacidad hacia el borde para no competir con el
 * número. Una onda expansiva sutil (respetada por reduced-motion) refuerza
 * la metáfora del sistema arrancando. Puramente decorativo.
 */
export function ConcentricRings() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      <svg
        viewBox="0 0 600 600"
        className="h-[min(78vh,660px)] w-[min(78vh,660px)]"
      >
        {RINGS.map((ring) => (
          <circle
            key={ring.r}
            cx="300"
            cy="300"
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.strokeWidth}
            opacity={ring.opacity}
          />
        ))}
        <circle cx="300" cy="300" r="7" fill="var(--color-accent)" />
      </svg>
      <span className="loadscreen-wave absolute h-[280px] w-[280px] rounded-full border-[3px] border-accent" />
    </div>
  )
}
