import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { TransitionProvider } from './TransitionContext'
import { Home } from '../../pages/Home'
import { About } from '../../pages/About'
import { Projects } from '../../pages/Projects'
import { Experience } from '../../pages/Experience'
import { Education } from '../../pages/Education'
import { ProjectDetail } from '../../pages/ProjectDetail'
import { NotFound } from '../../pages/NotFound'

/* ------------------------------------------------------------------ */
/*  Star geometry — Persona 5 five-point star (viewBox 0 0 100 100)    */
/* ------------------------------------------------------------------ */

const STAR_POINTS_STR = '50,5 61,38 96,38 68,59 79,92 50,71 21,92 32,59 4,38 39,38'

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const DURATION = 800 // ms

/**
 * Custom easing: brief quadratic ease-in (~12 %), then cubic ease-out.
 * "Slight acceleration at the beginning, graceful deceleration at the end."
 */
function ease(t: number): number {
  if (t < 0.12) {
    const n = t / 0.12
    return 0.12 * n * n
  }
  const n = (t - 0.12) / 0.88
  return 0.12 + 0.88 * (1 - (1 - n) * (1 - n) * (1 - n))
}

/**
 * Minimum scale factor so every star point exits the viewport.
 * Worst case — valley at x = 39 %:
 *   50 − 11 · f < 0  →  f > 50/11 ≈ 4.55
 */
function calcMaxFactor(): number {
  if (typeof window === 'undefined') return 5
  const vw = window.innerWidth
  const vh = window.innerHeight
  const h = 50 / 11 // ≈ 4.55
  const v = 50 / 21 // ≈ 2.38
  const a = Math.max(vw, vh) / Math.min(vw, vh)
  return Math.max(h, v) * (a > 1.6 ? 1.15 : 1) + 0.45
}

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */

const ROUTE_ELEMENTS = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/experience" element={<Experience />} />
    <Route path="/education" element={<Education />} />
    <Route path="/proyectos/:slug" element={<ProjectDetail />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </>
)

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Star-mask iris transition.
 *
 * Layer stack:
 *   z-0    OLD PAGE    — frozen snapshot, visible everywhere (background)
 *   z-[1]  NEW PAGE    — normal document flow, visibility hidden during transition
 *   z-[95] NEW PAGE    — duplicate in transition layer, SVG mask applied
 *   z-[100] STAR EDGE  — subtle red SVG outline at mask boundary
 *
 * How it works:
 *   1. Old page stays visible as background (snapshot class)
 *   2. New page is rendered twice: once in normal flow (hidden during transition)
 *      and once in the transition layer with SVG mask
 *   3. SVG <mask> with black rect (hidden) + white star polygon (visible)
 *   4. Star polygon scales from 0 to cover viewport via <g transform>
 *   5. After star covers viewport: remove old page + transition layer,
 *      set normal-flow new page to visible — zero jump, zero remount
 */
export function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const prevPath = useRef(location.pathname)
  const [oldPath, setOldPath] = useState<string | null>(null)
  const maxFactor = useRef(calcMaxFactor())

  /* DOM refs — direct manipulation during animation (no React re-renders) */
  const maskGroupRef = useRef<SVGGElement>(null)
  const outlineRef = useRef<SVGSVGElement>(null)
  const starGroupRef = useRef<SVGGElement>(null)
  const echoGroupRef = useRef<SVGGElement>(null)
  const normalFlowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const t0Ref = useRef(0)

  /* ---- resize ---- */
  useEffect(() => {
    const onResize = () => {
      maxFactor.current = calcMaxFactor()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ---- route-change detection (synchronous, before paint) ---- */
  useLayoutEffect(() => {
    if (prevPath.current === location.pathname) return
    const old = prevPath.current
    prevPath.current = location.pathname

    if (reduced) {
      setOldPath(null)
      return
    }

    // Cancel running transition (rapid navigation)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }

    setOldPath(old)
    t0Ref.current = performance.now()
  }, [location.pathname, reduced])

  /* ---- star-mask animation ---- */
  useEffect(() => {
    if (oldPath === null) return

    const maxF = maxFactor.current

    const tick = (now: number) => {
      const t = Math.min((now - t0Ref.current) / DURATION, 1)
      const f = ease(t) * maxF

      // 1. SVG mask star polygon — scale via <g transform> (GPU-friendly)
      //    Transform: translate(0.5 0.5) scale(f) translate(-0.5 -0.5)
      //    This scales the star from its center in objectBoundingBox coords
      if (maskGroupRef.current) {
        maskGroupRef.current.setAttribute(
          'transform',
          `translate(0.5 0.5) scale(${f}) translate(-0.5 -0.5)`,
        )
      }

      // 2. Star outline — GPU-friendly <g> transform (non-scaling-stroke)
      if (starGroupRef.current) {
        starGroupRef.current.setAttribute(
          'transform',
          `translate(50 50) scale(${f}) translate(-50 -50)`,
        )
      }

      // 3. Echo outline — trails ~8 % behind, 96 % size
      if (echoGroupRef.current) {
        const ef = ease(Math.min(t * 1.08, 1)) * maxF * 0.96
        echoGroupRef.current.setAttribute(
          'transform',
          `translate(50 50) scale(${ef}) translate(-50 -50)`,
        )
      }

      // 4. Outline opacity — fade in at start, fade out at end
      if (outlineRef.current) {
        const o = t < 0.04 ? t / 0.04 : t > 0.88 ? (1 - t) / 0.12 : 1
        outlineRef.current.style.opacity = String(
          Math.max(0, Math.min(1, o)) * 0.9,
        )
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = 0
        setOldPath(null)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }
  }, [oldPath])

  /* ---- cleanup on unmount ---- */
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  /* ---- render ---- */

  const isActive = oldPath !== null

  const newPage = (
    <Routes location={location} key={location.pathname}>
      {ROUTE_ELEMENTS}
    </Routes>
  )

  if (reduced) return <>{newPage}</>

  return (
    <TransitionProvider value={isActive}>
      {/* SVG DEFINITIONS — mask and outline */}
      <svg
        ref={outlineRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0, width: 0, height: 0, position: 'fixed' }}
      >
        <defs>
          {/* Star mask: black = hidden, white = visible */}
          <mask
            id="star-mask"
            maskContentUnits="objectBoundingBox"
          >
            {/* Black rectangle — entire area hidden */}
            <rect x="0" y="0" width="1" height="1" fill="black" />
            {/* White star polygon — visible through mask */}
            <g ref={maskGroupRef} transform="translate(0.5 0.5) scale(0) translate(-0.5 -0.5)">
              <polygon
                points={STAR_POINTS_STR}
                fill="white"
                transform="scale(0.01)"
              />
            </g>
          </mask>
        </defs>
        {/* Echo — softer glow, trails behind */}
        <g ref={echoGroupRef}>
          <polygon
            points={STAR_POINTS_STR}
            fill="none"
            stroke="#E60012"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeOpacity={0.2}
          />
        </g>
        {/* Primary edge — thin, sharp */}
        <g ref={starGroupRef}>
          <polygon
            points={STAR_POINTS_STR}
            fill="none"
            stroke="#E60012"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* OLD PAGE — frozen snapshot, visible everywhere (background) */}
      {isActive && (
        <div
          className="snapshot fixed inset-0 z-0"
          aria-hidden="true"
        >
          <Routes
            location={{ ...location, pathname: oldPath }}
            key={oldPath}
          >
            {ROUTE_ELEMENTS}
          </Routes>
        </div>
      )}

      {/* NEW PAGE — normal document flow, hidden during transition */}
      <div
        ref={normalFlowRef}
        style={isActive ? { visibility: 'hidden' } : undefined}
      >
        {newPage}
      </div>

      {/* NEW PAGE — transition layer with SVG mask applied */}
      {isActive && (
        <div
          className="fixed inset-0 z-[95]"
          aria-hidden="true"
          style={{ mask: 'url(#star-mask)', WebkitMask: 'url(#star-mask)' }}
        >
          <Routes location={location} key={location.pathname}>
            {ROUTE_ELEMENTS}
          </Routes>
        </div>
      )}
    </TransitionProvider>
  )
}
