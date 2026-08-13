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
import { ConcentricRings } from './ConcentricRings'
import { HudCorners } from './HudCorners'
import { DiamondMarker } from '../shared/DiamondMarker'
import loadingBg from '../../assets/loading/loadingscreenbackground.webp'

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
  '¿Sirven los fracasos como aprendiazaje?',
  '¿Sueles leer las notas del parche?',
  '¿La curiosidad cuenta como habilidad?',
  '¿Viaje antes que destino?',
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
    const next: StarBadgeState = value >= cat.finish ? 'full' : 'empty'
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
 * arranque del OS del portfolio. Fondo: imagen real (skyline en blanco y
 * negro, cover) con un degradado oscuro que garantiza el contraste y los
 * anillos concéntricos generados por código como acento. Se compone de
 * topbar, bloque central con acceso de usuario y categorías, y una zona
 * inferior que funciona como una composición única de menú de juego
 * (letra Q + pregunta, barra trapezoidal y porcentaje).
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
      {/* Fondo real: imagen + degradado de contraste con zoom lento y sutil
          (desactivado bajo reduced-motion) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.75), rgba(10,10,10,0.55) 40%, rgba(10,10,10,0.85)), url(${loadingBg})`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
        }}
        initial={{ scale: 1 }}
        animate={{ scale: reduced ? 1 : 1.015 }}
        transition={{ duration: LOAD_DURATION, ease: 'easeOut' }}
      />

      {/* Resplandor rojo tipo rim-light a lo largo del horizonte del skyline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-[160px]"
        style={{
          top: '32%',
          background:
            'linear-gradient(to bottom, transparent, rgba(230,0,18,0.55) 50%, transparent)',
          filter: 'blur(48px)',
          mixBlendMode: 'screen',
          opacity: 0.32,
        }}
      />

      {/* Radar: anillos de referencia + pulsos alineados al punto de fuga */}
      <ConcentricRings />

      {/* Corchetes HUD de las esquinas */}
      <HudCorners />

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

        {/* Bloque central: acceso de usuario + categorías (centrado verticalmente) */}
        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 flex items-center gap-2.5 font-display text-label uppercase tracking-[0.3em] text-accent">
            <DiamondMarker size={7} />
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
          <p className="mt-5 flex items-center gap-2 text-label uppercase tracking-[0.3em] text-paper/50">
            <DiamondMarker size={7} />
            {profile.branding.loading}
          </p>
        </div>

        {/* Zona inferior: composición única (letra Q + pregunta + barra + %) */}
        <div className="load-base absolute inset-x-0 bottom-0 h-[min(38vh,380px)] w-full">
          {/* Bloque compuesto único, capas: logo → pregunta → Q → barra → % */}
          <div className="pointer-events-none absolute bottom-12 right-6 z-20 w-[min(35rem,80vw)]">
            <div className="load-panel">
              <div className="load-panel-inner px-7 pb-6 pt-[6.5rem]">
                {/* Pregunta, con la Q a la izquierda; barra y % debajo */}
                <p
                  className="load-question max-w-full truncate pl-[2.5rem] text-left font-anton uppercase leading-[1.05] text-paper"
                  style={{ fontSize: 'clamp(1.3rem, 2.2vw, 2rem)' }}
                >
                  {question && (
                    <>
                      {question.slice(0, -1)}
                      <span className="text-accent">?</span>
                    </>
                  )}
                </p>

                {/* Q + barra + % */}
                <div className="load-bar-block relative mt-2 flex items-center pl-[2.5rem]">
                  {/* Letra Q suelta (sin contenedor), borde inferior solapando 2-4px la esquina sup-izq de la barra */}
                  <span
                    aria-hidden="true"
                    className="load-q absolute bottom-[50px] left-0 font-anton text-[5.5rem] leading-none text-paper [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,-3px_-3px_0_#000,3px_-3px_0_#000,-3px_3px_0_#000,3px_3px_0_#000]"
                  >
                    Q
                  </span>

                  {/* Barra trapezoidal larga y fina (~7:1) */}
                  <div className="relative h-[52px] w-full [transform:skewX(-6deg)]">
                    {/* Marco blanco + relleno rojo de progreso con pulso de
                        brillo/glow rítmico (solo con movimiento permitido;
                        reduced-motion lo deja estático) */}
                    <div className="absolute inset-0 bg-paper [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                      <div className="absolute inset-[3px] bg-bg-hero [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                        <div
                          ref={barRef}
                          className={`absolute inset-y-0 left-0 bg-accent${reduced ? '' : ' bar-breathe'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SÍ {porcentaje}% — caja de ancho fijo para que el
                      número a 1-3 dígitos nunca desplace la barra */}
                  <span className="load-pct ml-4 shrink-0 font-anton text-[3.5rem] leading-none text-accent [transform:skewX(-10deg)] [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,-3px_-3px_0_#000,3px_-3px_0_#000,-3px_3px_0_#000,3px_3px_0_#000,4px_4px_0_rgba(0,0,0,0.5)]">
                    SÍ{' '}
                    <span className="inline-block min-w-[4.5ch] text-right tabular-nums">
                      <span ref={pctRef}>0</span>%
                    </span>
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
