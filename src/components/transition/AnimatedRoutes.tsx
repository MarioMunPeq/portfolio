import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { TransitionProvider } from './TransitionContext'
import { StarWipe } from './StarWipe'
import { Home } from '../../pages/Home'
import { About } from '../../pages/About'
import { Projects } from '../../pages/Projects'
import { Experience } from '../../pages/Experience'
import { Education } from '../../pages/Education'
import { ProjectDetail } from '../../pages/ProjectDetail'
import { NotFound } from '../../pages/NotFound'

/* ------------------------------------------------------------------ */
/*  Star geometry — same 5-point polygon used by StarBadge             */
/* ------------------------------------------------------------------ */

const STAR_POINTS: [number, number][] = [
  [50, 5],
  [61, 38],
  [96, 38],
  [68, 59],
  [79, 92],
  [50, 71],
  [21, 92],
  [32, 59],
  [4, 38],
  [39, 38],
]

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const DURATION = 0.85 // seconds — long enough for smooth motion, fast enough to feel premium

/**
 * Calculate the minimum factor so every point of the star polygon
 * (including the two inner valleys at x=39% and x=61%) exits the
 * viewport.  The worst case is the valley closest to the centre:
 *   50 + (39−50)·f < 0   →   f > 50/11 ≈ 4.55
 * We add a safety margin and also account for non-square viewports
 * by scaling the vertical axis separately when needed.
 */
function calcMaxFactor(): number {
  if (typeof window === 'undefined') return 5
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Horizontal: need valley at x=39% to go below 0% and valley at x=61% above 100%
  const hFactor = 50 / 11 // ≈ 4.55
  // Vertical: need valley at y=71% to go above 100% → f > 50/21 ≈ 2.38
  const vFactor = 50 / 21
  // Aspect-ratio adjustment: tall viewports need more horizontal reach
  const aspect = Math.max(vw, vh) / Math.min(vw, vh)
  return Math.max(hFactor, vFactor) * (aspect > 1.6 ? 1.15 : 1) + 0.45
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

/**
 * Rutas como pantallas independientes.
 *
 * Arquitectura de la transición:
 *   z-90  OLD PAGE — snapshot congelado (sin animaciones Screen)
 *   z-95  NEW PAGE — recortada por clip-path de estrella expandiéndose
 *   z-100 STAR EDGE — contorno SVG rojo sutil sobre la máscara
 *
 * La página nueva se monta INMEDIATAMENTE y se renderiza por completo.
 * El clip-path de estrella actúa como máscara: lo que está DENTRO de la
 * estrella muestra la página nueva; lo que está FUERA muestra la antigua.
 * La estrella crece desde el centro hasta cubrir todo el viewport.
 */
export function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const prevPath = useRef(location.pathname)
  const [oldPath, setOldPath] = useState<string | null>(null)
  const maxFactor = useRef(calcMaxFactor())

  // Recalculate on resize so ultrawide/wide viewports are covered
  useEffect(() => {
    const onResize = () => {
      maxFactor.current = calcMaxFactor()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Animated clip-path: star polygon expands from centre.
  const clipPath = useTransform(
    useTransform(progress, [0, 1], [0, 1]),
    (t: number) => {
      const f = t * maxFactor.current
      return `polygon(${STAR_POINTS.map(([x, y]) => `${(50 + (x - 50) * f).toFixed(2)}% ${(50 + (y - 50) * f).toFixed(2)}%`).join(', ')})`
    },
  )

  /* ----- route-change handler ------------------------------------ */
  const transitionAnim = useRef<ReturnType<typeof animate> | null>(null)

  /**
   * Detect route changes SYNCHRONOUSLY via useLayoutEffect.
   * This runs after DOM commit but BEFORE the browser paints, so the
   * snapshot overlay + clip-path mask are in place on the very first
   * visible frame — no flash of the naked destination page.
   */
  useLayoutEffect(() => {
    if (prevPath.current === location.pathname) return
    const old = prevPath.current
    prevPath.current = location.pathname

    if (reduced) {
      setOldPath(null)
      progress.set(0)
      return
    }

    // Cancel any running transition (rapid navigation)
    if (transitionAnim.current) {
      transitionAnim.current.stop()
      transitionAnim.current = null
    }

    progress.set(0)
    setOldPath(old)
  }, [location.pathname, reduced, progress])

  /**
   * Start the expand animation once oldPath is set.
   * Using useEffect here is fine — the DOM is already correct (snapshot +
   * mask in place) from the useLayoutEffect above.  The animation just
   * needs to begin on the next frame.
   */
  useEffect(() => {
    if (oldPath === null) return

    transitionAnim.current = animate(progress, 1, {
      duration: DURATION,
      ease: EASE,
      onComplete: () => {
        setOldPath(null)
        progress.set(0)
        transitionAnim.current = null
      },
    })

    return () => {
      transitionAnim.current?.stop()
      transitionAnim.current = null
    }
  }, [oldPath, progress])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionAnim.current) {
        transitionAnim.current.stop()
        transitionAnim.current = null
      }
    }
  }, [])

  /* ----- render -------------------------------------------------- */

  const newPage = (
    <Routes location={location} key={location.pathname}>
      {ROUTE_ELEMENTS}
    </Routes>
  )

  if (reduced) {
    return <>{newPage}</>
  }

  const isActive = oldPath !== null

  return (
    <TransitionProvider value={isActive}>
      {/* ---- OLD PAGE: full-viewport snapshot underneath, frozen. ---- */}
      {oldPath && (
        <div className="snapshot fixed inset-0 z-[90]" aria-hidden="true">
          <Routes
            location={{ ...location, pathname: oldPath }}
            key={oldPath}
          >
            {ROUTE_ELEMENTS}
          </Routes>
        </div>
      )}

      {/* ---- NEW PAGE: clipped to expanding star mask. ---- */}
      <motion.div
        className={isActive ? 'fixed inset-0 z-[95]' : ''}
        style={isActive ? { clipPath } : undefined}
      >
        {newPage}
      </motion.div>

      {/* ---- STAR EDGE: thin red SVG outline following the mask. ---- */}
      {isActive && <StarWipe progress={progress} maxFactor={maxFactor.current} />}
    </TransitionProvider>
  )
}
