import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'

type CursorColor = 'red' | 'white'

interface CursorState {
  active: boolean
  label: string
  color: CursorColor
}

const RED = '#e60012'
const PAPER = '#f5f5f0'

// Etiqueta y color según el contexto (data-cursor). El color del aro
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

// Transición rápida y cortante (ease-out exponencial, ~180 ms).
const SNAP: { duration: number; ease: [number, number, number, number] } = {
  duration: 0.18,
  ease: [0.16, 1, 0.3, 1],
}

// Octágono asimétrico: dos esquinas opuestas recortadas con distinto corte.
const RETICLE_CLIP = '[clip-path:polygon(0_37%,38%_0,100%_0,100%_82%,82%_100%,0_100%)]'

// Marcas geométricas que se abren hacia fuera al hover.
const TICKS: Array<{ cls: string; style: CSSProperties }> = [
  { cls: 'h-[4px] w-[1.5px]', style: { top: -4, left: 'calc(50% - 0.75px)', transform: 'skewX(-16deg)' } },
  { cls: 'h-[4px] w-[1.5px]', style: { bottom: -4, left: 'calc(50% - 0.75px)', transform: 'skewX(14deg)' } },
  { cls: 'h-[1.5px] w-[4px]', style: { left: -4, top: 'calc(50% - 0.75px)', transform: 'skewY(16deg)' } },
  { cls: 'h-[1.5px] w-[4px]', style: { right: -4, top: 'calc(50% - 0.75px)', transform: 'skewY(-14deg)' } },
]

/**
 * Cursor decorativo del sistema, re diseñado como HUD de Persona 5.
 * Con `prefers-reduced-motion` o puntero táctil no se monta: se usa el
 * cursor nativo. Cuando está activo se marca `data-cursor-active` en el
 * documento y CSS oculta el cursor nativo (solo punteros finos).
 * La retícula queda bloqueada al puntero físico (MotionValues crudos,
 * sin spring). Al hover se transforma ella misma (crece, gira, cambia
 * rojo/blanco, abre marcas angulares y muestra la etiqueta contextual
 * con data-cursor). Al clic, una ráfaga geométrica confirma la acción.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [cursor, setCursor] = useState<CursorState>({
    active: false,
    label: 'SELECCIONAR',
    color: 'white',
  })
  const [burstKey, setBurstKey] = useState(0)

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
      setBurstKey((key) => key + 1)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      document.documentElement.removeAttribute('data-cursor-active')
    }
  }, [reduced, x, y])

  if (!enabled) return null

  const strokeColor = cursor.active ? (cursor.color === 'red' ? RED : PAPER) : RED
  const dotColor = cursor.active ? (cursor.color === 'red' ? PAPER : RED) : PAPER

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ x, y }}
    >
      <div className="relative -ml-[9px] -mt-[9px]">
        {/* Reticula */}
        <motion.div
          className="relative flex h-[18px] w-[18px] items-center justify-center"
          animate={{
            scale: cursor.active ? 1.55 : 1,
            rotate: cursor.active ? 70 : 45,
          }}
          transition={SNAP}
        >
          {/* Ráfaga de confirmación al clic (detrás de la retícula) */}
          <span className="absolute inset-0 flex items-center justify-center">
            {burstKey > 0 && (
              <motion.span
                key={burstKey}
                className="flex h-[26px] w-[26px] items-center justify-center"
                initial={{ opacity: 1, scale: 0.45, rotate: 0 }}
                animate={{ opacity: 0, scale: 1.9, rotate: 16 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <svg viewBox="0 0 24 24" className="h-full w-full">
                  {[45, 135, 225, 315].map((angle, index) => (
                    <rect
                      key={angle}
                      x="10.75"
                      y="3"
                      width="2.5"
                      height="6"
                      fill={index % 2 === 0 ? RED : PAPER}
                      transform={`rotate(${angle} 12 12)`}
                    />
                  ))}
                  <rect
                    x="10.25"
                    y="10.25"
                    width="3.5"
                    height="3.5"
                    fill={RED}
                    transform="rotate(45 12 12)"
                  />
                </svg>
              </motion.span>
            )}
          </span>

          {/* Aro exterior (color de estado) */}
          <motion.span
            className={`absolute inset-0 p-[2px] ${RETICLE_CLIP}`}
            animate={{ backgroundColor: strokeColor }}
            transition={SNAP}
          >
            <span className={`block h-full w-full bg-black ${RETICLE_CLIP}`} />
          </motion.span>

          {/* Punto central */}
          <motion.span
            className="relative block h-[5px] w-[5px] rotate-45"
            animate={{ backgroundColor: dotColor }}
            transition={SNAP}
          />

          {/* Marcas geométricas que se abren al hover */}
          {TICKS.map((tick, index) => (
            <motion.span
              key={index}
              className={`absolute ${tick.cls}`}
              style={tick.style}
              animate={{
                opacity: cursor.active ? 1 : 0,
                backgroundColor: strokeColor,
              }}
              transition={SNAP}
            />
          ))}
        </motion.div>

        {/* Etiqueta contextual tipo P5 */}
        <motion.span
          className="pointer-events-none absolute left-[30px] top-[-3px]"
          animate={{
            opacity: cursor.active ? 1 : 0,
            x: cursor.active ? 0 : 8,
            rotate: cursor.active ? -1.5 : 0,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <span className="relative block bg-black px-3 py-[5px] [clip-path:polygon(0_0,100%_0,calc(100%_-_6px)_100%,6px_100%)]">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[3px] bg-accent"
            />
            <span className="block pl-2 font-display text-[11px] uppercase leading-none tracking-[0.2em] text-paper">
              {cursor.label}
            </span>
          </span>
        </motion.span>
      </div>
    </motion.div>
  )
}
