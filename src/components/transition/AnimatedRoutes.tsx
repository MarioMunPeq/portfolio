import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from 'motion/react'
import { StarWipe } from './StarWipe'
import { Home } from '../../pages/Home'
import { About } from '../../pages/About'
import { Projects } from '../../pages/Projects'
import { Experience } from '../../pages/Experience'
import { Education } from '../../pages/Education'
import { ProjectDetail } from '../../pages/ProjectDetail'
import { NotFound } from '../../pages/NotFound'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const DURATION = 0.65

// 5-point star from StarBadge (same points used by StarWipe).
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

const MAX_FACTOR = 5

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
 * Rutas como pantallas independientes. Al cambiar de ruta, una estrella P5
 * se expande desde el centro como máscara: la página nueva se ve a través
 * de la estrella mientras la antigua permanece visible fuera de ella.
 */
export function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const prevPath = useRef(location.pathname)
  const [oldPath, setOldPath] = useState<string | null>(null)

  // Animated clip-path: star polygon expands from center (factor 0→5).
  const clipPath = useTransform(
    useTransform(progress, [0, 1], [0, MAX_FACTOR]),
    (f: number) =>
      `polygon(${STAR_POINTS.map(([x, y]) => `${(50 + (x - 50) * f).toFixed(1)}% ${(50 + (y - 50) * f).toFixed(1)}%`).join(', ')})`,
  )

  useEffect(() => {
    if (prevPath.current === location.pathname) return
    const old = prevPath.current
    prevPath.current = location.pathname

    if (reduced) {
      setOldPath(null)
      progress.set(0)
      return
    }

    setOldPath(old)
    progress.set(0)

    const anim = animate(progress, 1, {
      duration: DURATION,
      ease: EASE,
      onComplete: () => {
        setOldPath(null)
        progress.set(0)
      },
    })

    return () => anim.stop()
  }, [location.pathname, progress, reduced])

  const newPage = (
    <Routes location={location} key={location.pathname}>
      {ROUTE_ELEMENTS}
    </Routes>
  )

  if (reduced) {
    return <>{newPage}</>
  }

  return (
    <>
      {/* Old page — full viewport underneath, frozen (no Screen animations). */}
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

      {/* New page — on top, clipped to expanding star during transition. */}
      <motion.div
        className={oldPath ? 'fixed inset-0 z-[95]' : ''}
        style={oldPath ? { clipPath } : undefined}
      >
        {newPage}
      </motion.div>

      {/* Thin red star outline following the same expanding geometry. */}
      {oldPath && <StarWipe progress={progress} />}
    </>
  )
}
