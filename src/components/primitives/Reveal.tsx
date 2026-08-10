import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

interface RevealProps {
  children: ReactNode
  /** Desfase de inicio en segundos. */
  delay?: number
  /** Distancia vertical inicial en px. */
  y?: number
  /** Fracción del elemento visible que dispara la entrada. */
  amount?: number
  className?: string
}

/**
 * Entrada por bloque al entrar en viewport. Contenido discreto tras el
 * hero: opacidad + desplazamiento corto, una sola vez. Con
 * `prefers-reduced-motion` el contenido aparece sin animación.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  amount = 0.2,
  className,
}: RevealProps) {
  const reduced = useReducedMotion()

  const variants: Variants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE, delay },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
