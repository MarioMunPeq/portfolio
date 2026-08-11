import { useReducedMotion } from 'motion/react'

/**
 * Speed-lines diagonales animadas — solo del menú principal. Con
 * `prefers-reduced-motion` no se monta.
 */
export function SpeedLines() {
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className="hero-speedlines pointer-events-none absolute -inset-[10%] z-[1] bg-speed-lines"
    />
  )
}
