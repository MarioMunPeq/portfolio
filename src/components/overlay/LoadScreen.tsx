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
import { StarBadge } from './StarBadge'
import phanSiteBadge from '../../assets/hero/phan-site-badge.png'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const PROGRESS_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
const LOAD_DURATION = 3.5

/** Recorte del panel de datos: esquinas cortadas en diagonal (arriba dcha. e
 *  izq. abajo), misma técnica de capas que hero-cmd. */
const PANEL_CLIP =
  'polygon(0 0, calc(100% - 1.25rem) 0, 100% 1.25rem, 100% 100%, 1.25rem 100%, 0 calc(100% - 1.25rem))'

/** Categorías del perfil. `finish` = fracción de la carga en la que la
 *  categoría termina (las cuatro arrancan a la vez y se completan
 *  escalonadas: IDENTIDAD → ... → HABILIDADES, esta justo al acabar). */
const CATEGORIES = [
  { label: 'IDENTIDAD', finish: 0.5 },
  { label: 'INVENTARIO', finish: 0.65 },
  { label: 'ESTADÍSTICAS', finish: 0.8 },
  { label: 'HABILIDADES', finish: 0.95 },
] as const

/** Preguntas tontas del marcador Q: se rota una al azar por carga. */
const SURVEY_QUESTIONS = [
  '¿Los patos programan en pareja?',
  '¿Los héroes leen las notas del parche?',
  '¿El nivel se sube sin farmear?',
]

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
 * Pantalla de carga — sistema de personaje estilo Persona 5: bloque central
 * "ACCEDIENDO A DATOS DE USUARIO" con el nombre y cuatro categorías del
 * perfil, cada una con un sello de estrella que se va rellenando en dorado
 * (escalonado). Arriba a la izquierda, la topbar de sistema; abajo a la
 * izquierda, el logotipo PHAN-SITE a gran tamaño como ancla; abajo a la
 * derecha, un marcador Q angular con una pregunta tonta sin respuesta y la
 * barra trapezoidal de carga global (CARGANDO SISTEMA + %).
 * Saltable con click o cualquier tecla. La salida reutiliza el barrido
 * diagonal rojo/negro (firma del proyecto). Con reduced-motion: todo
 * aparece completo un instante y desaparece, sin barrido.
 */
export function LoadScreen() {
  const reduced = useReducedMotion()
  const [hidden, setHidden] = useState(loadScreenShown)
  const [contentGone, setContentGone] = useState(false)
  const [question] = useState(
    () => SURVEY_QUESTIONS[Math.floor(Math.random() * SURVEY_QUESTIONS.length)],
  )
  const progress = useMotionValue(0)
  const sweep = useMotionValue(0)
  const progressControls = useRef<ReturnType<typeof animate> | null>(null)
  const exiting = useRef(false)
  const barPctRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const badgeRefs = useRef<Array<HTMLDivElement | null>>([])
  /** Progreso lineal (sin ease) que reparte el completado de los sellos de
   *  categoría de forma uniforme en el tiempo, en paralelo a la barra. */
  const badgeProgress = useMotionValue(0)
  const badgeControls = useRef<ReturnType<typeof animate> | null>(null)

  const xRed = useTransform(sweep, [0, 1], ['-160vw', '0vw'])
  const xBlack = useTransform(sweep, [0, 1], ['-160vw', '8vw'])

  useMotionValueEvent(progress, 'change', (value) => {
    const rounded = Math.round(value * 100)
    if (barPctRef.current) {
      barPctRef.current.textContent = String(rounded)
    }
    if (fillRef.current) {
      fillRef.current.style.width = `${rounded}%`
    }
  })

  useMotionValueEvent(badgeProgress, 'change', (value) => {
    badgeRefs.current.forEach((el, i) => {
      if (!el) return
      const finish = CATEGORIES[i].finish
      const state =
        value >= finish ? 'full' : value >= finish / 2 ? 'mid' : 'empty'
      if (el.getAttribute('data-state') !== state) {
        el.setAttribute('data-state', state)
      }
    })
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
    badgeControls.current?.stop()
    badgeControls.current = null
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
      badgeProgress.set(1)
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
    badgeControls.current = animate(badgeProgress, 1, {
      duration: LOAD_DURATION,
      ease: 'linear',
      onComplete: () => {
        badgeControls.current = null
      },
    })
    return () => {
      progressControls.current?.stop()
      progressControls.current = null
      badgeControls.current?.stop()
      badgeControls.current = null
    }
  }, [hidden, progress, badgeProgress, reduced, runExit])

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
            {/* Logotipo PHAN-SITE: ancla decorativa a gran escala, esquina inferior izquierda */}
            <img
              src={phanSiteBadge}
              alt=""
              aria-hidden="true"
              className="phan-site-anchor pointer-events-none absolute bottom-8 left-6 z-0 h-[170px] w-auto -rotate-6 md:left-10"
            />

            {/* Topbar de sistema */}
            <div className="relative flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/60">
              <span>{profile.branding.system}</span>
              <span>
                {profile.branding.system.split(' ')[0]} {profile.branding.version}
              </span>
            </div>

            {/* Bloque central: sistema de personaje con categorías del perfil */}
            <div className="relative flex flex-col items-center text-center">
              <p className="loadscreen-eyebrow mb-4 flex items-center gap-2.5 text-label uppercase tracking-[0.3em] text-accent">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
                />
                Accediendo a datos de usuario
              </p>
              <h2
                className="loadscreen-name font-display text-[2.1rem] uppercase leading-none tracking-[0.04em] text-paper md:text-[3.2rem]"
                style={{ textShadow: COMIC_SHADOW, transform: 'skewX(-6deg)' }}
              >
                {profile.name}
              </h2>
              <span aria-hidden="true" className="mt-5 h-0.5 w-16 bg-accent" />

              {/* Panel de datos: las cuatro categorías visibles a la vez, con sello de estrella */}
              <div className="mt-6 w-[min(34rem,84vw)]">
                <div
                  className="loadscreen-panel relative bg-paper/20 p-[3px]"
                  style={{ clipPath: PANEL_CLIP }}
                >
                  <div
                    className="bg-bg-hero/60 p-5 backdrop-blur-[2px] md:p-6"
                    style={{ clipPath: PANEL_CLIP }}
                  >
                    <ul className="divide-y divide-paper/10">
                      {CATEGORIES.map((cat, i) => (
                        <li
                          key={cat.label}
                          className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                        >
                          <span className="font-display text-lg uppercase leading-none tracking-[0.08em] text-paper/90 md:text-xl">
                            {cat.label}
                          </span>
                          <StarBadge
                            label={cat.label}
                            ref={(el) => {
                              badgeRefs.current[i] = el
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Esquina inferior derecha: marcador Q angular + barra de carga global */}
            <div className="survey-widget relative w-[min(26rem,72vw)] self-end">
              <div className="survey-widget__header flex items-center gap-4">
                {/* Marcador Q angular y en capas */}
                <div className="survey-widget__badge relative h-16 w-16 shrink-0">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-x-2 translate-y-2 rotate-45 bg-accent"
                  />
                  <span className="absolute inset-0 flex rotate-45 items-center justify-center border-[3px] border-paper bg-bg-hero">
                    <span className="-rotate-45 font-display text-3xl leading-none text-accent">
                      Q
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-accent [clip-path:polygon(0_0,100%_0,0_100%)]"
                  />
                </div>
                {/* Pregunta tonta, sin respuesta: se queda en el aire */}
                <p className="font-display text-[16px] uppercase leading-none tracking-[0.04em] text-paper">
                  {question.slice(0, -1)}
                  <span className="text-accent">?</span>
                </p>
              </div>

              {/* Barra trapezoidal de carga global (indicador principal de progreso) */}
              <div className="survey-widget__loader mt-5">
                <div className="mb-2 flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/50">
                  <span>Cargando sistema</span>
                  <span className="text-paper/90">
                    <span ref={barPctRef}>0</span>%
                  </span>
                </div>
                <div className="bar-frame relative h-[30px] w-full bg-paper [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                  <div className="bar-track absolute inset-[3px] bg-bg-hero [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                    <div ref={fillRef} className="bar-fill absolute inset-y-0 left-0 bg-accent" />
                  </div>
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
