import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLenis } from 'lenis/react'
import { motion, useReducedMotion } from 'motion/react'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

interface ScreenProps {
  children: ReactNode
  className?: string
}

/**
 * Contenedor de pantalla de ruta. Aporta la entrada/salida de la
 * transición entre rutas (junto a AnimatedRoutes y el Sweep) y resetea
 * el scroll al montar para que cada pantalla empiece arriba.
 */
export function Screen({ children, className }: ScreenProps) {
  const reduced = useReducedMotion()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [lenis])

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.55,
          ease: EASE,
          delay: reduced ? 0 : 0.3,
        },
      }}
      exit={{
        opacity: 0,
        y: -28,
        transition: { duration: 0.4, ease: EASE },
      }}
    >
      {children}
    </motion.div>
  )
}
