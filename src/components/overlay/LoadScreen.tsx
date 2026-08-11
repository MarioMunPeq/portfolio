import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { markBooted } from '../../lib/boot'
import { profile } from '../../data/profile'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const PROGRESS_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
const LOAD_DURATION = 3.5

/** Contorno tipo cómic: blanco con borde negro grueso (8 direcciones) + offset rojo. */
const COMIC_SHADOW = [
  '-0.035em 0 0 var(--color-ink)',
  '0.035em 0 0 var(--color-ink)',
  '0 -0.035em 0 var(--color-ink)',
  '0 0.035em 0 var(--color-ink)',
  '-0.035em -0.035em 0 var(--color-ink)',
  '0.035em 0.035em 0 var(--color-ink)',
  '-0.035em 0.035em 0 var(--color-ink)',
  '0.035em -0.035em 0 var(--color-ink)',
  '0.085em 0.085em 0 var(--color-accent)',
].join(', ')

// Solo se muestra una vez por carga completa de la página (protege del
// doble montaje de StrictMode en desarrollo).
let loadScreenShown = false

/**
 * Pantalla de carga — cambio de día estilo Persona 5: contador 0→100 gigante
 * con contorno tipo cómic como protagonista absoluto, sobre energía de hazard
 * stripe, speed-lines y trazo diagonal. Saltable con click o cualquier tecla.
 * La salida reutiliza el barrido diagonal rojo/negro (firma del proyecto).
 * Con reduced-motion: aparece 100 estático un instante y desaparece, sin barrido.
 */
export function LoadScreen() {
  const reduced = useReducedMotion()
  const [hidden, setHidden] = useState(loadScreenShown)
  const [contentGone, setContentGone] = useState(false)
  const progress = useMotionValue(0)
  const sweep = useMotionValue(0)
  const pctRef = useRef<HTMLSpanElement>(null)
  const progressControls = useRef<ReturnType<typeof animate> | null>(null)
  const exiting = useRef(false)

  const xRed = useTransform(sweep, [0, 1], ['-160vw', '0vw'])
  const xBlack = useTransform(sweep, [0, 1], ['-160vw', '8vw'])

  useMotionValueEvent(progress, 'change', (value) => {
    if (pctRef.current) {
      pctRef.current.textContent = String(Math.round(value * 100)).padStart(2, '0')
    }
  })

  const runExit = useCallback(() => {
    if (exiting.current) return
    exiting.current = true
    animate(sweep, 1, {
      duration: 0.5,
      ease: EASE,
      onComplete: () => {
        setContentGone(true)
        animate(sweep, 0, {
          duration: 0.6,
          ease: EASE,
          onComplete: () => {
            markBooted()
            setHidden(true)
          },
        })
      },
    })
  }, [sweep])

  const skip = useCallback(() => {
    if (hidden) return
    if (reduced) {
      markBooted()
      setHidden(true)
      return
    }
    if (exiting.current) return
    progressControls.current?.stop()
    progressControls.current = null
    runExit()
  }, [hidden, reduced, runExit])

  useEffect(() => {
    loadScreenShown = true
  }, [])

  useEffect(() => {
    if (hidden) {
      markBooted()
      return
    }
    if (reduced) {
      markBooted()
      if (pctRef.current) pctRef.current.textContent = '100'
      const id = setTimeout(() => setHidden(true), 650)
      return () => clearTimeout(id)
    }
    progressControls.current = animate(progress, 1, {
      duration: LOAD_DURATION,
      ease: PROGRESS_EASE,
      onComplete: () => {
        progressControls.current = null
        runExit()
      },
    })
    return () => {
      progressControls.current?.stop()
      progressControls.current = null
    }
  }, [hidden, progress, reduced, runExit])

  useEffect(() => {
    if (hidden) return
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      skip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hidden, skip])

  if (hidden) return null

  return (
    <>
      {!contentGone && (
        <motion.div
          className="loadscreen-content fixed inset-0 z-[100] bg-bg-hero text-paper"
          onPointerDown={skip}
          aria-hidden="true"
        >
          {/* Energía de fondo: hazard + speed-lines + trazo rojo + halftone */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-full bg-hazard" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-speed-lines" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 top-[22%] h-2 w-56 rotate-[24deg] bg-accent" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[16%] right-[14%] hidden h-6 w-12 bg-halftone-red md:block" />

          <div className="flex h-full flex-col justify-between px-6 py-8 md:px-10">
            {/* Topbar de sistema */}
            <div className="flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/60">
              <span>{profile.branding.system}</span>
              <span>
                {profile.branding.system.split(' ')[0]} {profile.branding.version}
              </span>
            </div>

            {/* Contador protagonista */}
            <div className="flex flex-col items-center">
              <p className="mb-4 flex items-center gap-2.5 text-label uppercase tracking-[0.3em] text-accent">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
                />
                {profile.branding.loading}
              </p>
              <span
                ref={pctRef}
                className="loadscreen-counter font-display uppercase leading-none text-paper"
                style={{
                  fontSize: 'clamp(11rem, 26vw, 26rem)',
                  textShadow: COMIC_SHADOW,
                  transform: 'skewX(-6deg)',
                }}
              >
                00
              </span>
              <div className="relative mt-10 h-1 w-52 overflow-hidden bg-paper/15 md:w-72">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ scaleX: progress, transformOrigin: 'left' }}
                />
              </div>
              <p className="mt-8 font-display text-2xl uppercase tracking-[0.05em] text-paper/70 md:text-3xl">
                {profile.name}
              </p>
            </div>

            {/* Footer de sistema */}
            <div className="flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/60">
              <span>
                © {new Date().getFullYear()} {profile.name}
              </span>
              <span>{profile.hero.region}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Barrido diagonal rojo/negro de salida (misma firma que la transición de rutas) */}
      <motion.div
        aria-hidden="true"
        className="loadscreen-sweep pointer-events-none fixed inset-0 z-[120] overflow-hidden"
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-[135vw] bg-accent"
          style={{ x: xRed, skewX: -10 }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-[135vw] bg-bg-hero"
          style={{ x: xBlack, skewX: -10 }}
        />
      </motion.div>
    </>
  )
}
