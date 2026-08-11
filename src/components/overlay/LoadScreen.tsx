import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { markBooted } from '../../lib/boot'
import { profile } from '../../data/profile'
import { StarBadge, type StarBadgeState } from './StarBadge'
import phanSiteBadge from '../../assets/hero/phan-site-badge.png'

const PROGRESS_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
const LOAD_DURATION = 3.5

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

let loadScreenShown = false

interface CategoryRowProps {
  cat: (typeof CATEGORIES)[number]
  progress: MotionValue<number>
}

/** Fila de categoría: sello de estrella que se va rellenando según el progreso
 *  de carga más el nombre de la categoría. */
function CategoryRow({ cat, progress }: CategoryRowProps) {
  const [state, setState] = useState<StarBadgeState>('empty')

  useMotionValueEvent(progress, 'change', (value) => {
    const next: StarBadgeState =
      value >= cat.finish ? 'full' : value >= cat.finish - 0.15 ? 'mid' : 'empty'
    setState((prev) => (prev === next ? prev : next))
  })

  return (
    <div className="flex w-[min(34rem,84vw)] items-center justify-between gap-3 rounded border border-paper/20 bg-bg-content-alt/60 px-4 py-3">
      <StarBadge state={state} label={cat.label} />
      <span className="text-label uppercase tracking-[0.3em] text-paper/60">{cat.label}</span>
    </div>
  )
}

/**
 * Pantalla de carga del sistema: capa fija sobre toda la app que simula el
 * arranque del OS del portfolio. Se compone de topbar, bloque central con
 * acceso de usuario y categorías, y una zona inferior que funciona como una
 * composición única de menú de juego (logo PHAN-SITE + bloque [Q] con
 * pregunta, barra y porcentaje).
 */
export function LoadScreen() {
  const reduced = useReducedMotion()
  const [hidden, setHidden] = useState(loadScreenShown)
  const [question, setQuestion] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const progress = useMotionValue(0)

  // --- Ciclo de vida: montaje visible, estado oculto y skip ---
  const hide = useCallback(() => {
    if (!hidden) setHidden(true)
  }, [hidden])

  const skip = useCallback(() => {
    if (!hidden) setHidden(true)
    markBooted()
  }, [hidden])

  // Selecciona una pregunta al azar cuando se monta.
  useEffect(() => {
    const i = Math.floor(Math.random() * SURVEY_QUESTIONS.length)
    setQuestion(SURVEY_QUESTIONS[i])
  }, [])

  // Arranca la carga simulada al montar.
  useEffect(() => {
    setVisible(true)
  }, [])

  // --- Carga simulada: 0 → 1 en LOAD_DURATION, marcando booted al salir ---
  useEffect(() => {
    if (!visible) return
    const controls = animate(progress, 1, {
      duration: LOAD_DURATION,
      ease: PROGRESS_EASE,
      onComplete: () => {
        markBooted()
        hide()
      },
    })
    return () => controls.stop()
  }, [progress, visible, hide])

  // Actualiza la barra y el porcentaje mientras progresa la carga.
  useMotionValueEvent(progress, 'change', (value) => {
    if (pctRef.current) pctRef.current.textContent = String(Math.round(value * 100))
    if (barRef.current) barRef.current.style.width = `${value * 100}%`
  })

  if (hidden) return null

  return (
    <div
      className="loadscreen-content fixed inset-0 z-[100] bg-bg-hero text-paper"
      onPointerDown={skip}
      aria-hidden="true"
    >
      <motion.div
        className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
      >
        {/* Topbar del sistema */}
        <div className="flex items-center justify-between text-label uppercase tracking-[0.3em] text-paper/60">
          <span>SISTEMA PERSONAL</span>
          <span className="hidden sm:block">SISTEMA V.2026</span>
        </div>

        {/* Bloque central: acceso de usuario + categorías */}
        <div className="relative flex flex-col items-center text-center">
          <p className="mb-4 flex items-center gap-2.5 text-label uppercase tracking-[0.3em] text-accent">
            <span aria-hidden="true" className="inline-block h-[7px] w-[7px] bg-accent" />
            ACCEDIENDO A DATOS DE USUARIO
          </p>
          <div className="font-display text-[2.1rem] uppercase leading-none tracking-[0.04em] text-paper md:text-[3.2rem]">
            {profile.name}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryRow key={cat.label} cat={cat} progress={progress} />
            ))}
          </div>
        </div>

        {/* Zona inferior: composición única (PNG PHAN-SITE + Q + pregunta + barra + %) */}
        <div className="load-base relative mt-6 h-[min(38vh,380px)] w-full">
          {/* Línea roja de anclaje y cuña tras el logo */}
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-[7px] w-[118%] -skew-x-12 bg-accent" />
          <span aria-hidden="true" className="absolute -bottom-2 -left-12 h-[34%] w-[44%] -skew-x-12 bg-accent" />

          {/* Bloque compuesto único: PNG pequeño detrás/arriba + Q + pregunta + barra + % */}
          <div className="load-composite pointer-events-none absolute -bottom-6 right-0 z-20 w-[min(60rem,94vw)]">
            {/* PHAN-SITE pequeño, parcialmente tapado por Q y pregunta */}
            <img
              src={phanSiteBadge}
              alt=""
              aria-hidden="true"
              className="load-phan pointer-events-none absolute -top-16 left-1/2 z-0 h-[min(24vh,220px)] w-auto -translate-x-1/2 -rotate-6"
            />

            <div className="relative z-10 flex items-end">
              {/* Q grande, a la izquierda */}
              <div className="load-q relative h-[13rem] w-[13rem] shrink-0 -rotate-3">
                <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rotate-45 bg-accent" />
                <span aria-hidden="true" className="absolute inset-0 rotate-45 border-4 border-paper bg-bg-hero" />
                <span aria-hidden="true" className="absolute inset-0 flex rotate-45 items-center justify-center">
                  <span aria-hidden="true" className="absolute inset-x-3 top-1/2 h-[6px] -translate-y-1/2 -skew-x-12 bg-accent" />
                  <span className="relative font-display text-[5.5rem] leading-none text-paper">Q</span>
                </span>
                <span aria-hidden="true" className="absolute -right-2.5 -top-3.5 h-6 w-6 bg-accent [clip-path:polygon(0_0,100%_0,0_100%)]" />
                <span aria-hidden="true" className="absolute -bottom-3 -left-2 h-5 w-5 bg-paper [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
              </div>

              {/* Columna derecha: estado + pregunta sobre la barra */}
              <div className="relative ml-[-3rem] w-full">
                <span className="load-status mb-1 block text-label uppercase tracking-[0.3em] text-paper/50 [transform:skewX(-10deg)]">
                  Cargando sistema
                </span>
                {/* Pregunta, pegada a la Q y solapando el borde superior de la barra */}
                <p
                  className="load-question -ml-4 -mb-2 text-left font-display uppercase leading-[1.05] text-paper"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)' }}
                >
                  {question && (
                    <>
                      {question.slice(0, -1)}
                      <span className="text-accent">?</span>
                    </>
                  )}
                </p>

                {/* Barra + % */}
                <div className="load-bar-block relative flex items-center">
                  <div className="relative h-[64px] w-full bg-paper [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)] [transform:skewX(-6deg)]">
                    <div className="absolute inset-[4px] bg-bg-hero [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                      <div ref={barRef} className="absolute inset-y-0 left-0 bg-accent" />
                    </div>
                  </div>
                  <span className="load-pct ml-4 shrink-0 font-display text-[4rem] leading-none text-accent [text-shadow:3px_3px_0_var(--color-accent-deep)]">
                    <span ref={pctRef}>0</span>
                    <span>%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
