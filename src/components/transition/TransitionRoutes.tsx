import { useState, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Routes, useLocation } from 'react-router-dom'
import { transitionBus } from './transition-bus'

interface TransitionRoutesProps {
  children: ReactNode
}

/**
 * Manages route transitions via the video overlay.
 *
 * The video plays ONLY when navigating from the home page to a section.
 * Navigating back to home or between non-home pages is instant.
 *
 * Flow on each navigation:
 *   1. Destination page mounts + overlay appears (same frame via rAF).
 *   2. Video plays; transparent areas reveal the destination underneath.
 *   3. When the video ends, the overlay is removed by VideoTransition.
 *   4. Destination page is now fully visible.
 *
 * Falls back to instant swap when a transition is already in progress.
 * Also skips if the transition was started externally (by CommandNavItem).
 */
export function TransitionRoutes({ children }: TransitionRoutesProps) {
  const location = useLocation()
  const [displayed, setDisplayed] = useState(location)
  const transitioning = useRef(false)

  useLayoutEffect(() => {
    if (location.key === displayed.key) return

    if (transitioning.current) {
      setDisplayed(location)
      return
    }

    /* If CommandNavItem already started the transition externally,
       just mount the destination — the video is already playing. */
    if (transitionBus.consumeExternallyStarted()) {
      transitioning.current = true
      flushSync(() => {
        setDisplayed(location)
      })
      window.scrollTo(0, 0)
      transitionBus.play(() => {
        transitioning.current = false
      })
      return
    }

    const isFromHome = displayed.pathname === '/'
    const isToHome = location.pathname === '/'
    const shouldPlayVideo = isFromHome && !isToHome

    if (!shouldPlayVideo) {
      setDisplayed(location)
      window.scrollTo(0, 0)
      return
    }

    transitioning.current = true

    requestAnimationFrame(() => {
      flushSync(() => {
        setDisplayed(location)
      })
      window.scrollTo(0, 0)

      transitionBus.play(() => {
        transitioning.current = false
      })
    })
  }, [location, displayed])

  return (
    <Routes location={displayed}>
      {children}
    </Routes>
  )
}
