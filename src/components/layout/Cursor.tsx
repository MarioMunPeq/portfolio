import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'

type CursorColor = 'red' | 'white'

interface CursorState {
  active: boolean
  label: string
  color: CursorColor
}

const RED = '#e60012'
const PAPER = '#f5f5f0'

// Etiqueta y color según el contexto (data-cursor). El color del contorno
// cambia rojo/blanco según la acción: VOLVER queda en rojo.
const CURSOR_STYLES: Record<string, CursorState> = {
  select: { active: true, label: 'SELECCIONAR', color: 'white' },
  open: { active: true, label: 'ABRIR', color: 'white' },
  project: { active: true, label: 'VER PROYECTO', color: 'white' },
  contact: { active: true, label: 'CONTACTO', color: 'white' },
  back: { active: true, label: 'VOLVER', color: 'red' },
}

function resolveCursor(target: Element): CursorState {
  const cursorEl = target.closest('[data-cursor]') as HTMLElement | null
  const key = cursorEl?.dataset.cursor
  const style = key ? CURSOR_STYLES[key] : undefined
  if (style) {
    const explicit = cursorEl?.dataset.cursorColor
    if (explicit === 'red' || explicit === 'white') return { ...style, color: explicit }
    return style
  }
  // Fallback por semántica cuando no hay data-cursor.
  const href = target.closest('a')?.getAttribute('href') ?? ''
  if (href.startsWith('mailto:')) return CURSOR_STYLES.contact
  if (href.includes('/proyectos')) return CURSOR_STYLES.project
  if (href.includes('/contacto')) return CURSOR_STYLES.contact
  if (href.split('#')[0].endsWith('/')) return CURSOR_STYLES.back
  return CURSOR_STYLES.select
}

// Curva rápida y cortante (ease-out exponencial).
const BEZIER: [number, number, number, number] = [0.16, 1, 0.3, 1]
// Transición de estado de la retícula (~160 ms).
const SNAP = { duration: 0.16, ease: BEZIER }
// Compresión al pulsar, aún más corta (~120 ms).
const PRESS = { duration: 0.12, ease: BEZIER }
// Entrada de la etiqueta contextual.
const LABEL_IN = { duration: 0.16, ease: BEZIER }
// Confirmación geométrica del clic.
const CONFIRM = { duration: 0.13, ease: 'easeOut' as const }

// Diamante: cuadrado girado 45° (vértices arriba/abajo/izquierda/derecha).
const DIAMOND = 'M 12 2.5 L 21.5 12 L 12 21.5 L 2.5 12 Z'
// Muesca de acento sobre la arista superior derecha (asimetría P5).
const TICK = 'M 12 2.5 L 15 5.5'

// Separación horizontal de la etiqueta respecto al puntero y ancho estimado
// (se reajusta con la medición real del DOM).
const LABEL_GAP = 24
const LABEL_EST = 150

/**
 * Cursor decorativo del sistema: un diamante geométrico fino inspirado en el
 * indicador de selección de Persona 5. Con `prefers-reduced-motion` o puntero
 * táctil no se monta: se usa el cursor nativo. Cuando está activo se marca
 * `data-cursor-active` en el documento y CSS oculta el cursor nativo (solo
 * punteros finos). La posición sigue al puntero mediante MotionValues crudos
 * (sin spring, sin lag, sin estado por fotograma).
 *
 * Estados: reposo = diamante rojo pequeño; hover = crece ~1.6x, gira y cambia
 * rojo/blanco según la acción, con muesca de acento y etiqueta contextual;
 * pulsación = compresión breve + anillo de confirmación geométrico (< 150 ms).
 * La etiqueta se recoloca al otro lado del puntero cerca de los bordes del
 * viewport y nunca sale de pantalla.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [cursor, setCursor] = useState<CursorState>({
    active: false,
    label: 'SELECCIONAR',
    color: 'white',
  })
  const [pressed, setPressed] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [lift, setLift] = useState(0)
  const [confirmKey, setConfirmKey] = useState(0)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const viewport = useRef({ w: 1280, h: 720 })
  const flipRef = useRef(false)
  const liftRef = useRef(0)
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const labelWidth = useRef(LABEL_EST)

  // Anchura real de la etiqueta (con margen) para el volteo en los bordes.
  useEffect(() => {
    labelWidth.current = labelRef.current
      ? Math.max(LABEL_EST, labelRef.current.offsetWidth + 10)
      : LABEL_EST
  }, [enabled, cursor.label])

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    setEnabled(true)
    document.documentElement.setAttribute('data-cursor-active', 'true')
    viewport.current = { w: window.innerWidth, h: window.innerHeight }

    const onResize = () => {
      viewport.current = { w: window.innerWidth, h: window.innerHeight }
    }

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)

      // Recolocación de la etiqueta según el borde del viewport. Solo se
      // actualiza el estado al cruzar el umbral (nunca por fotograma).
      const { w, h } = viewport.current
      const flip = event.clientX > w - labelWidth.current - LABEL_GAP - 24
      if (flip !== flipRef.current) {
        flipRef.current = flip
        setFlipped(flip)
      }
      let next = 0
      if (event.clientY < 64) next = 1
      else if (event.clientY > h - 56) next = -1
      if (next !== liftRef.current) {
        liftRef.current = next
        setLift(next)
      }
    }

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null
      const interactive = target?.closest('a, button, [role="button"], [data-cursor]')
      if (!interactive) {
        setCursor((prev) => (prev.active ? { ...prev, active: false } : prev))
        return
      }
      const next = resolveCursor(interactive)
      setCursor((prev) =>
        prev.active && prev.label === next.label && prev.color === next.color
          ? prev
          : next,
      )
    }

    const onDown = (event: MouseEvent) => {
      if (event.button !== 0) return
      setPressed(true)
      setConfirmKey((key) => key + 1)
    }

    const onUp = () => setPressed(false)

    const onLeave = () => {
      setPressed(false)
      setCursor((prev) => (prev.active ? { ...prev, active: false } : prev))
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('blur', onLeave)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('blur', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeAttribute('data-cursor-active')
    }
  }, [reduced, x, y])

  if (!enabled) return null

  // Reposo: contorno rojo, marcador papel. Hover (acción blanca): contorno
  // papel brillante con acento rojo. Hover (VOLVER): rojo con acento papel.
  const strokeColor = cursor.active && cursor.color === 'white' ? PAPER : RED
  const dotColor = cursor.active && cursor.color === 'white' ? RED : PAPER

  const labelX = flipped ? -(labelWidth.current + LABEL_GAP) : LABEL_GAP
  const labelY = lift === 1 ? 26 : lift === -1 ? -58 : -18

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ x, y }}
    >
      <div className="relative -ml-[9px] -mt-[9px]">
        {/* Retícula */}
        <motion.div
          className="relative flex h-[18px] w-[18px] items-center justify-center"
          animate={{
            scale: pressed ? (cursor.active ? 1.32 : 0.86) : cursor.active ? 1.6 : 1,
            rotate: cursor.active ? 9 : 0,
          }}
          transition={pressed ? PRESS : SNAP}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full">
            {/* Confirmación geométrica al pulsar: contracción breve */}
            {confirmKey > 0 && (
              <motion.path
                key={confirmKey}
                d={DIAMOND}
                fill="none"
                stroke={dotColor}
                strokeWidth="1.2"
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 0.55, opacity: 0 }}
                transition={CONFIRM}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            )}

            {/* Contorno del diamante */}
            <motion.path
              d={DIAMOND}
              fill="none"
              animate={{
                stroke: strokeColor,
                strokeWidth: cursor.active ? 1.6 : 1.2,
              }}
              transition={SNAP}
            />

            {/* Muesca de acento en la arista superior derecha */}
            <motion.path
              d={TICK}
              stroke={dotColor}
              strokeWidth="1.5"
              fill="none"
              animate={{ opacity: cursor.active ? 1 : 0 }}
              transition={SNAP}
            />

            {/* Marcador central diminuto */}
            <motion.g
              animate={{ scale: cursor.active ? 1.5 : 1 }}
              transition={SNAP}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <rect
                x="10.9"
                y="10.9"
                width="2.2"
                height="2.2"
                fill={dotColor}
                transform="rotate(45 12 12)"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Etiqueta contextual tipo P5 */}
        <motion.span
          className="pointer-events-none absolute left-0 top-0"
          animate={{
            opacity: cursor.active ? 1 : 0,
            scale: cursor.active ? 1 : 0.96,
            x: cursor.active ? labelX : labelX + (flipped ? -8 : 8),
            y: cursor.active ? labelY : labelY + 6,
          }}
          transition={LABEL_IN}
        >
          <span
            ref={labelRef}
            className={`relative block bg-[#010101] px-4 py-[7px] [clip-path:polygon(0_0,100%_0,calc(100%_-_8px)_100%,8px_100%)] ${
              flipped ? 'text-right' : ''
            }`}
          >
            {/* Línea estructural superior */}
            <span className="absolute inset-x-0 top-0 h-px bg-paper/60" />
            {/* Marcador direccional rojo */}
            <span
              className={`absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rotate-45 bg-accent ${
                flipped ? 'right-[7px]' : 'left-[7px]'
              }`}
            />
            <span
              className={`block whitespace-nowrap font-display text-[11px] uppercase leading-none tracking-[0.18em] text-paper ${
                flipped ? 'pr-4' : 'pl-4'
              }`}
            >
              {cursor.label}
            </span>
          </span>
        </motion.span>
      </div>
    </motion.div>
  )
}
