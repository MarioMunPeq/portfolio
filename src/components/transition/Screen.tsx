import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLenis } from 'lenis/react'

interface ScreenProps {
  children: ReactNode
  className?: string
}

/**
 * Contenedor de pantalla de ruta. Resetea el scroll al montar para que
 * cada pantalla empiece arriba. Sin animaciones de entrada/salida.
 */
export function Screen({ children, className }: ScreenProps) {
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [lenis])

  return <div className={className}>{children}</div>
}
