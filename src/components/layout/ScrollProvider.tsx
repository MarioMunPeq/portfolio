import { useReducedMotion } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

interface ScrollProviderProps {
  children: ReactNode
}

/**
 * Scroll suave cinematográfico (Lenis). Con `prefers-reduced-motion`
 * se omite por completo y el navegador usa el scroll nativo.
 */
export function ScrollProvider({ children }: ScrollProviderProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.09,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
