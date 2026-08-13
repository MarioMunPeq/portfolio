import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
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
import { HudCorners } from './HudCorners'
import loadingBg from '../../assets/loading/loadingscreenbackground.webp'

const PROGRESS_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
const EXIT_EASE: [number, number, number, number] = [0.85, 0, 0.15, 1]
const LOAD_DURATION = 3.5

/** Antifaz de identidad (imagen PNG en public/). BASE_URL respeta el prefijo
 *  de despliegue (/portfolio/) tanto en dev como en build. */
const MASK_SRC = `${import.meta.env.BASE_URL}images/ui/persona-mask.png`

/** Fases de entrada del antifaz (fracciones de la carga simulada):
 *  AUSENCIA [0 – REVEAL_START]: sin antifaz; solo indicios (línea roja,
 *  barrido vertical).
 *  REVELADO [REVEAL_START – REVEAL_END]: el clip-path diagonal lo ensambla,
 *  el rim-light gana intensidad y una línea de escaneo lo cruza una vez.
 *  IMPACTO [≈IMPACT_AT]: micro-overshoot, destello radial y diamantes.
 *  ESTABILIZACIÓN [0.6 – 1]: respiración casi imperceptible.
 */
const REVEAL_START = 0.08
const REVEAL_END = 0.52
const IMPACT_AT = 0.55

let loadScreenShown = false

export function LoadScreen() {
  const reduced = useReducedMotion()
  const [hidden, setHidden] = useState(loadScreenShown)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [exitScan, setExitScan] = useState(false)
  const [impact, setImpact] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const ticksRef = useRef<HTMLDivElement>(null)

  const progress = useMotionValue(0)
  const exitProgress = useMotionValue(0)
  const impactScale = useMotionValue(1)
  const glowBoost = useMotionValue(0)

  // --- Entrada del antifaz (todo derivado del progreso real) ---
  const revealEdge = useTransform(progress, [REVEAL_START, REVEAL_END], [0, 100])
  const maskClip = useTransform(revealEdge, (x) =>
    `polygon(0% 0%, ${x}% 0%, ${x + 45}% 100%, 0% 100%)`,
  )
  const maskOpacity = useTransform(progress, [0, 0.09], [0, 1])
  const maskScale = useTransform(progress, [REVEAL_START, IMPACT_AT], [0.99, 1])
  const maskCombinedScale = useTransform(
    [maskScale, impactScale],
    (v: number[]) => v[0] * v[1],
  )
  const maskFilter = useTransform(progress, [0.25, IMPACT_AT], [
    'drop-shadow(0 0 8px rgba(230,0,18,0.16)) drop-shadow(0 0 2px rgba(230,0,18,0.18)) drop-shadow(7px 5px 0 rgba(230,0,18,0.14))',
    'drop-shadow(0 0 24px rgba(230,0,18,0.42)) drop-shadow(0 0 5px rgba(230,0,18,0.3)) drop-shadow(7px 5px 0 rgba(230,0,18,0.2))',
  ])
  const scanTop = useTransform(progress, [0.16, 0.5], ['0%', '100%'])
  const scanOpacity = useTransform(progress, [0.16, 0.2, 0.46, 0.5], [0, 0.55, 0.55, 0])

  // --- Salida (transición de escena hacia la HOME) ---
  const clipY = useTransform(exitProgress, (p) => `${-50 - p * 11}%`)
  const clipScale = useTransform(exitProgress, [0, 1], [1, 0.98])
  const rootClip = useTransform(exitProgress, (p) =>
    `polygon(0% 0%, 100% 0%, 100% ${100 - p * 45}%, 0% ${100 - p * 100}%)`,
  )
  const rootY = useTransform(exitProgress, [0, 1], [0, -44])

  const impactFired = useRef(false)
  const exitStarted = useRef(false)

  const hide = useCallback(() => {
    setHidden(true)
  }, [])

  const skip = useCallback(() => {
    if (!hidden) {
      setHidden(true)
      markBooted()
    }
  }, [hidden])

  /** Secuencia de salida: snap seco + barrido + levantar la escena. */
  const startExit = useCallback(() => {
    if (exitStarted.current) return
    exitStarted.current = true
    animate(impactScale, [1, 1.022, 1], { duration: 0.26, ease: 'easeOut' })
    setExitScan(true)
    window.setTimeout(() => setExiting(true), 170)
    window.setTimeout(hide, 980)
  }, [hide, impactScale])

  // Barra, porcentaje, cursor y ticks: escritura directa en el DOM
  // (sin re-renders de React por fotograma).
  useMotionValueEvent(progress, 'change', (value) => {
    if (pctRef.current) pctRef.current.textContent = String(Math.round(value * 100))
    if (barRef.current) barRef.current.style.width = `${value * 100}%`
    if (cursorRef.current) cursorRef.current.style.left = `calc(${value * 100}% - 4px)`
    if (ticksRef.current) {
      const lit = Math.round(value * 5)
      ticksRef.current.querySelectorAll<HTMLElement>('[data-tick]').forEach((tick, i) => {
        const on = i < lit
        tick.style.opacity = on ? '1' : '0.25'
        tick.style.backgroundColor = on
          ? 'var(--color-accent)'
          : 'rgba(245, 245, 240, 0.25)'
      })
    }
    if (value >= IMPACT_AT && !impactFired.current && !reduced) {
      impactFired.current = true
      animate(impactScale, [1, 1.018, 1], {
        duration: 0.34,
        times: [0, 0.4, 1],
        ease: 'easeOut',
      })
      animate(glowBoost, [0, 0.45, 0], {
        duration: 0.5,
        times: [0, 0.3, 1],
        ease: 'easeOut',
      })
      setImpact(true)
    }
  })

  useEffect(() => {
    setVisible(true)
  }, [])

  // Carga simulada 0 → 1 en LOAD_DURATION.
  useEffect(() => {
    if (!visible) return
    const controls = animate(progress, 1, {
      duration: LOAD_DURATION,
      ease: PROGRESS_EASE,
      onComplete: () => {
        markBooted()
        if (reduced) hide()
        else startExit()
      },
    })
    return () => controls.stop()
  }, [progress, visible, reduced, hide, startExit])

  // Levantar la escena: recorte diagonal + desplazamiento sutil.
  useEffect(() => {
    if (!exiting) return
    const controls = animate(exitProgress, 1, { duration: 0.7, ease: EXIT_EASE })
    return () => controls.stop()
  }, [exiting, exitProgress])

  if (hidden) return null

  return (
    <motion.div
      className="loadscreen-content fixed inset-0 z-[100] overflow-hidden bg-bg-hero text-paper"
      style={{ clipPath: rootClip, y: rootY }}
      onPointerDown={skip}
      aria-hidden="true"
    >
      {/* Fondo: skyline real con rampa de brillo (nace desde la oscuridad) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.88)), url(${loadingBg})`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
        }}
        initial={{ opacity: 0.55, scale: 1 }}
        animate={{ opacity: 1, scale: reduced ? 1 : 1.015 }}
        transition={{ duration: LOAD_DURATION, ease: 'easeOut' }}
      />

      {/* Rim-light rojo del horizonte, tenue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-[160px]"
        style={{
          top: '32%',
          background:
            'linear-gradient(to bottom, transparent, rgba(230,0,18,0.4) 50%, transparent)',
          filter: 'blur(48px)',
          mixBlendMode: 'screen',
          opacity: 0.24,
        }}
      />

      {/* FASE 1 — AUSENCIA: solo indicios (con movimiento permitido) */}
      {!reduced && (
        <>
          <div
            aria-hidden="true"
            className="load-scan-v pointer-events-none absolute inset-y-0 z-30 w-px bg-accent"
          />
          <div
            aria-hidden="true"
            className="load-core-line pointer-events-none absolute z-30 h-px -translate-x-1/2 -translate-y-1/2 bg-accent"
            style={{ left: '50%', top: '46%' }}
          />
        </>
      )}

      {/* Anillos: composición gráfica tenue que enmarca el antifaz */}
      <ConcentricRings revealed={impact} reduced={!!reduced} />

      {/* Antifaz protagonista */}
      <div
        aria-hidden="true"
        className="load-mask-float pointer-events-none absolute"
        style={{ left: '50%', top: '46%' }}
      >
        <motion.div
          className="relative w-[min(82vw,560px)] max-w-none"
          style={{
            x: '-50%',
            y: clipY,
            scale: clipScale,
            clipPath: reduced ? 'none' : maskClip,
          }}
        >
          <motion.img
            src={MASK_SRC}
            alt=""
            draggable={false}
            className="block w-full max-w-none"
            style={{
              scale: reduced ? 1 : maskCombinedScale,
              opacity: reduced ? 1 : maskOpacity,
              filter: reduced ? 'none' : maskFilter,
            }}
          />

          {/* FASE 2 — REVELADO: línea de escaneo cruzando el antifaz */}
          {!reduced && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-px bg-accent"
              style={{
                top: scanTop,
                opacity: scanOpacity,
                boxShadow: '0 0 12px rgba(230,0,18,0.65)',
              }}
            />
          )}
        </motion.div>

        {/* FASE 3 — IMPACTO: diamantes que saltan desde las esquinas */}
        {!reduced && impact && (
          <>
            <span
              className="load-impact-diamond absolute left-0 top-0 size-[5px] bg-accent"
              style={{ '--dx': '-22px', '--dy': '-22px' } as CSSProperties}
            />
            <span
              className="load-impact-diamond absolute right-0 top-0 size-[5px] bg-accent"
              style={{ '--dx': '22px', '--dy': '-22px' } as CSSProperties}
            />
            <span
              className="load-impact-diamond absolute bottom-0 left-0 size-[5px] bg-accent"
              style={{ '--dx': '-22px', '--dy': '22px' } as CSSProperties}
            />
            <span
              className="load-impact-diamond absolute bottom-0 right-0 size-[5px] bg-accent"
              style={{ '--dx': '22px', '--dy': '22px' } as CSSProperties}
            />
          </>
        )}
      </div>

      {/* Destello radial del impacto (detrás del antifaz) */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: glowBoost,
            background:
              'radial-gradient(ellipse at 50% 46%, rgba(230,0,18,0.4), transparent 55%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      <HudCorners />

      {/* HUD periférico superior — muy discreto */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.6 }}
      >
        <div className="flex items-center justify-between px-6 pt-6 text-label uppercase tracking-[0.3em] text-paper/45 md:px-10">
          <span className="flex items-center gap-2">
            <span className="inline-block size-[3px] bg-accent" />
            {profile.branding.system.toUpperCase()}
          </span>
          <span className="hidden sm:block">
            SISTEMA {profile.branding.version.toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* Micro-marcas laterales que encuadran el antifaz (solo escritorio) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 hidden flex-col items-center lg:flex"
        style={{ top: '46%', left: '20%', transform: 'translate(-50%, -50%)' }}
      >
        <span className="h-[44px] w-px bg-paper/12" />
        <span className="mt-[10px] h-[2px] w-[7px] bg-accent/60" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 hidden flex-col items-center lg:flex"
        style={{ top: '46%', right: '20%', transform: 'translate(50%, -50%)' }}
      >
        <span className="h-[44px] w-px bg-paper/12" />
        <span className="mt-[10px] h-[2px] w-[7px] bg-accent/60" />
      </div>

      {/* Barrido de salida (justo antes de levantar la escena) */}
      {exitScan && !reduced && (
        <div
          aria-hidden="true"
          className="load-exit-scan pointer-events-none absolute inset-x-0 z-40 h-[2px] bg-accent"
          style={{ boxShadow: '0 0 14px rgba(230,0,18,0.7)' }}
        />
      )}

      {/* Progreso — integrado y secundario respecto a la máscara */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.25 }}
      >
        <div className="w-[min(400px,82vw)] pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
          <div className="flex items-end justify-between font-anton">
            <span className="text-[0.95rem] leading-none tracking-[0.1em] text-accent">Q</span>
            <span className="flex items-baseline text-label leading-none tracking-[0.25em] text-paper/60">
              <span
                ref={pctRef}
                className="min-w-[2.5ch] text-right tabular-nums text-paper/80"
              >
                0
              </span>
              <span className="ml-0.5 text-accent">%</span>
            </span>
          </div>
          <div className="mt-2.5 [transform:skewX(-6deg)]">
            <div className="relative h-[4px] w-full bg-paper/12">
              <div
                ref={barRef}
                className={`absolute inset-y-0 left-0 w-0 bg-accent${reduced ? '' : ' bar-breathe'}`}
              />
              {!reduced && (
                <span
                  ref={cursorRef}
                  className="load-bar-cursor absolute top-1/2 size-[9px] [transform:translateY(-50%)_skewX(6deg)]"
                  style={{ left: '-4px' }}
                />
              )}
            </div>
            <div ref={ticksRef} className="mt-2 flex items-center justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  data-tick
                  className="h-[3px] w-[14px]"
                  style={{ opacity: 0.25, backgroundColor: 'rgba(245, 245, 240, 0.25)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
