import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * Indicador de progreso de scroll: línea vertical con marcador angular
 * rojo que recorre la altura de la página. Decorativo (aria-hidden).
 */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, (value) => `${value * 100}%`)

  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative h-44 w-px bg-paper/15">
        <motion.span
          className="absolute -left-1 h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
          style={{ top }}
        />
      </div>
      <p className="mt-4 rotate-0 text-label uppercase tracking-[0.3em] text-paper/40">
        Scroll
      </p>
    </div>
  )
}
