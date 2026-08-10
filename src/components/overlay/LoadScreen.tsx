import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { markBooted } from '../../lib/boot'
import { profile } from '../../data/profile'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

// Solo se muestra una vez por carga completa de la página (protege del
// doble montaje de StrictMode en desarrollo).
let loadScreenShown = false

/**
 * Pantalla de carga inicial con estética de "cargando menú": nombre en
 * Anton, barra de progreso angular y porcentaje. Breve y nunca bloqueante.
 * Con reduced-motion no se muestra.
 */
export function LoadScreen() {
  const reduced = useReducedMotion()
  const [hidden, setHidden] = useState(loadScreenShown)
  const [exit, setExit] = useState(false)
  const progress = useMotionValue(0)
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    loadScreenShown = true
  }, [])

  useMotionValueEvent(progress, 'change', (value) => {
    if (pctRef.current) {
      pctRef.current.textContent = String(Math.round(value * 100)).padStart(2, '0')
    }
  })

  useEffect(() => {
    if (hidden) {
      markBooted()
      return
    }
    if (reduced) {
      markBooted()
      setHidden(true)
      return
    }
    const controls = animate(progress, 1, {
      duration: 1.1,
      ease: EASE,
      onComplete: () => {
        markBooted()
        setExit(true)
      },
    })
    return () => controls.stop()
  }, [hidden, progress, reduced])

  useEffect(() => {
    if (!exit) return
    const id = setTimeout(() => setHidden(true), 700)
    return () => clearTimeout(id)
  }, [exit])

  if (hidden) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-bg-hero text-paper"
      animate={exit ? { x: '145%', skewX: -10 } : { x: '0%', skewX: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute -right-10 top-1/4 h-2 w-44 rotate-[24deg] bg-accent" />
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-full bg-stripes-red" />
      <span className="pointer-events-none absolute right-10 bottom-24 hidden h-5 w-10 bg-halftone-red md:block" />

      <div className="flex h-full flex-col justify-between px-6 py-8 md:px-10">
        <div className="flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/60">
          <span>{profile.alias}</span>
          <span>{profile.branding.cvViviente}</span>
        </div>

        <div>
          <p className="flex items-center gap-2.5 text-label uppercase tracking-[0.3em] text-accent">
            <span
              aria-hidden="true"
              className="h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
            />
            {profile.branding.system}
          </p>
          <p className="mt-4 font-display text-6xl uppercase leading-none md:text-8xl">
            {profile.alias}
          </p>
          <div className="mt-10 flex items-center gap-5">
            <div className="relative h-1 w-44 overflow-hidden bg-paper/15 md:w-72">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ scaleX: progress, transformOrigin: 'left' }}
              />
            </div>
            <span
              ref={pctRef}
              className="font-display text-3xl leading-none text-paper"
            >
              00
            </span>
            <span className="text-label uppercase tracking-[0.3em] text-paper/60">
              {profile.branding.loading}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/60">
          <span>© 2026 {profile.name}</span>
          <span>{profile.hero.region}</span>
        </div>
      </div>
    </motion.div>
  )
}
