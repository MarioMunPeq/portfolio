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
import { ConcentricRings } from './ConcentricRings'
import { Skyline } from './Skyline'

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
 * con contorno tipo cómic como protagonista (reducido a 2/3 para dejar aire),
 * sobre un fondo combinado de anillos concéntricos generados por código y una
 * silueta de skyline en la base. Abajo a la derecha, una barra de "encuesta"
 * tipo Phan-Site (bloque sesgado con icono Q, contorno grueso, relleno rojo
 * ligado al contador, pregunta con palabra clave en rojo y "SÍ %" grande).
 * Saltable con click o cualquier tecla. La salida reutiliza el barrido
 * diagonal rojo/negro (firma del proyecto). Con reduced-motion: aparece 100
 * estático un instante y desaparece, sin barrido.
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
  const barPctRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  const xRed = useTransform(sweep, [0, 1], ['-160vw', '0vw'])
  const xBlack = useTransform(sweep, [0, 1], ['-160vw', '8vw'])

  useMotionValueEvent(progress, 'change', (value) => {
    const rounded = Math.round(value * 100)
    if (pctRef.current) {
      pctRef.current.textContent = String(rounded).padStart(2, '0')
    }
    if (barPctRef.current) {
      barPctRef.current.textContent = String(rounded)
    }
    if (fillRef.current) {
      fillRef.current.style.width = `${rounded}%`
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
      progress.set(1)
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
          {/* Marco superior */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-full bg-hazard" />

          {/* Fondo combinado: anillos concéntricos (código) + skyline */}
          <ConcentricRings />
          <Skyline />

          <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-10">
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
                  fontSize: 'clamp(7.5rem, 17.5vw, 17.5rem)',
                  textShadow: COMIC_SHADOW,
                  transform: 'skewX(-6deg)',
                }}
              >
                00
              </span>
              <p className="mt-8 font-display text-2xl uppercase tracking-[0.05em] text-paper/70 md:text-3xl">
                {profile.name}
              </p>
            </div>

            {/* Barra de encuesta tipo Phan-Site — un único bloque, esquina inferior derecha */}
            <div className="flex flex-col items-end self-end">
              <div className="flex items-center">
                <span
                  aria-hidden="true"
                  className="-mr-4 flex h-20 w-20 shrink-0 -rotate-12 items-center justify-center rounded-full border-[3px] border-paper bg-bg-hero font-display text-[2.5rem] leading-none text-accent"
                >
                  Q
                </span>
                <p className="relative z-10 text-right font-display text-[17px] uppercase leading-none tracking-[0.04em]">
                  <span className="text-paper">¿Café antes de programar? — </span>
                  <span className="text-accent">OBLIGATORIO</span>
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="bar-frame relative h-[50px] w-[330px] bg-paper [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                  <div className="bar-track absolute inset-[3px] bg-bg-hero [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                    <div ref={fillRef} className="bar-fill absolute inset-y-0 left-0 bg-accent" />
                  </div>
                </div>
                <div className="flex shrink-0 items-baseline gap-2 [transform:skewX(-10deg)]">
                  <span className="font-display text-[26px] leading-none text-paper">SÍ</span>
                  <span className="font-display text-5xl leading-none text-accent">
                    <span ref={barPctRef}>0</span>%
                  </span>
                </div>
              </div>
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
