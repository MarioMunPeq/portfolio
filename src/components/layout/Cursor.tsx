import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'

/**
 * Cursor decorativo del sistema (reticula + etiqueta SELECT).
 * Con `prefers-reduced-motion` o puntero táctil no se monta: se usa el
 * cursor nativo. Cuando está activo se marca `data-cursor-active` en el
 * documento y CSS oculta el cursor nativo (solo punteros finos).
 * La reticula crece y muestra "SELECT ▶" sobre elementos interactivos.
 * La posicion usa los MotionValues crudos (x/y) directamente: sin spring
 * ni interpolacion, la reticula queda bloqueada al puntero fisico.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    setEnabled(true)
    document.documentElement.setAttribute('data-cursor-active', 'true')

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
      document.documentElement.removeAttribute('data-cursor-active')
    }
  }, [reduced, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ x, y }}
    >
      <div className="relative -ml-[7px] -mt-[7px]">
        <motion.div
          className="flex h-[14px] w-[14px] items-center justify-center border-2"
          animate={{
            scale: active ? 1.9 : 1,
            rotate: active ? 45 : 0,
            borderColor: active ? '#f5f5f0' : '#e60012',
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <span
            className={`block h-[5px] w-[5px] transition-colors duration-200 ${
              active ? 'bg-accent' : 'bg-paper'
            }`}
          />
        </motion.div>

        <motion.span
          className="absolute left-4 top-2 flex items-center gap-1.5 bg-bg-hero px-2 py-1 text-label font-medium uppercase tracking-[0.22em] text-paper"
          animate={{ opacity: active ? 1 : 0, x: active ? 0 : 6 }}
          transition={{ duration: 0.15 }}
        >
          <span
            aria-hidden="true"
            className="block h-2 w-2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
          />
          SELECT
        </motion.span>
      </div>
    </motion.div>
  )
}
