import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import {
  AnimatePresence,
  animate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'
import { Sweep } from '../primitives/Sweep'
import { Home } from '../../pages/Home'
import { About } from '../../pages/About'
import { Projects } from '../../pages/Projects'
import { Experience } from '../../pages/Experience'
import { Education } from '../../pages/Education'
import { ProjectDetail } from '../../pages/ProjectDetail'
import { NotFound } from '../../pages/NotFound'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

/**
 * Rutas como pantallas independientes. Al cambiar de ruta, el Sweep se
 * cubre (barrido diagonal rojo/negro) mientras la pantalla actual sale,
 * y se destapa cuando la nueva entra y se asienta. Es el mismo patrón de
 * "cambiar de menú" que la navegación.
 */
export function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (prevPath.current === location.pathname) return
    prevPath.current = location.pathname
    if (reduced) {
      progress.set(0)
      return
    }
    const cover = animate(progress, 1, { duration: 0.42, ease: EASE })
    const revealTimer = setTimeout(() => {
      animate(progress, 0, { duration: 0.55, ease: EASE })
    }, 470)
    return () => {
      cover.stop()
      clearTimeout(revealTimer)
    }
  }, [location.pathname, progress, reduced])

  const routes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/education" element={<Education />} />
      <Route path="/proyectos/:slug" element={<ProjectDetail />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  if (reduced) {
    return <>{routes}</>
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {routes}
      </AnimatePresence>
      <Sweep progress={progress} />
    </>
  )
}
