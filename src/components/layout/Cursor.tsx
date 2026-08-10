import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

/**
 * Cursor decorativo (firma Persona) — DESACTIVADO EN ESTA FASE.
 * Se mantiene el componente completo para reintroducirlo fácilmente
 * montándolo en Layout. En la fase de pulido del Hero se usa SOLO el
 * cursor nativo del sistema: no debe montarse mientras dure esa fase.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.6 })

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    setEnabled(true)

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null
      const interactive = target?.closest(
        'a, button, [role="button"], [data-cursor]',
      )
      setActive(Boolean(interactive))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [reduced, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-1 -mt-1 flex h-2.5 w-2.5 items-center justify-center"
        animate={{ scale: active ? 2.2 : 1, rotate: active ? 45 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <span
          className={`block h-2.5 w-2.5 transition-colors duration-200 ${
            active ? 'bg-accent' : 'bg-paper/60'
          }`}
        />
      </motion.div>
    </motion.div>
  )
}
