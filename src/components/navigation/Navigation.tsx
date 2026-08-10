import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { Sweep } from '../primitives/Sweep'
import { Annotation } from '../primitives/Annotation'
import { NAV_ITEMS } from './nav-items'
import { profile } from '../../data/profile'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

const ROW_SIZE = 'clamp(2rem, 5vw, 4rem)'

/**
 * Navegación principal: menú a pantalla completa con estética de menú de
 * videojuego. La pantalla activa se marca con bloque rojo sesgado, el
 * resto alterna texto sólido / contorno fantasma. Abre y cierra con el
 * barrido diagonal firma; navegar entre rutas dispara el Sweep de ruta.
 */
export function Navigation() {
  const reduced = useReducedMotion()
  const lenis = useLenis()
  const navigate = useNavigate()
  const location = useLocation()

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progress = useMotionValue(0)
  const contentOpacity = useTransform(progress, [0.25, 0.55], [0, 1])

  const panelRef = useRef<HTMLDivElement>(null)

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path),
  )
  const activeLabel = NAV_ITEMS[activeIndex] ?? NAV_ITEMS[0]

  const open = useCallback(() => {
    setMounted(true)
    lenis?.stop()
    if (reduced) {
      progress.set(1)
      return
    }
    animate(progress, 1, { duration: 0.55, ease: EASE })
  }, [lenis, progress, reduced])

  const close = useCallback(() => {
    if (reduced) {
      setMounted(false)
      lenis?.start()
      return
    }
    animate(progress, 0, {
      duration: 0.45,
      ease: EASE,
      onComplete: () => {
        setMounted(false)
        lenis?.start()
      },
    })
  }, [lenis, progress, reduced])

  const go = useCallback(
    (path: string) => {
      setMounted(false)
      lenis?.start()
      navigate(path)
    },
    [lenis, navigate],
  )

  useEffect(() => {
    setMounted(false)
    lenis?.start()
  }, [lenis, location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!lenis) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (!lenis) {
        document.body.style.overflow = ''
      }
    }
  }, [lenis, mounted])

  useEffect(() => {
    if (!mounted) return
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key === 'Tab') {
        const focusables =
          panelRef.current?.querySelectorAll<HTMLElement>(
            'button, a[href], [tabindex]:not([tabindex="-1"])',
          )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, mounted])

  const links = [profile.links.github, profile.links.linkedin, profile.links.email].filter(
    (link): link is NonNullable<typeof link> => link !== null,
  )

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={mounted}
        aria-label="Abrir menú de navegación"
        className={`fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 border px-4 py-3 text-label font-medium uppercase tracking-[0.25em] transition-colors duration-300 ${
          scrolled
            ? 'border-accent bg-bg-hero text-paper'
            : 'border-paper/25 text-paper/60'
        } hover:border-accent hover:bg-accent hover:text-paper focus-visible:border-accent focus-visible:bg-accent focus-visible:text-paper`}
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
        />
        <span>{activeLabel.index}</span>
        <span>Menú</span>
      </button>

      {mounted ? (
        <>
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-0 z-[70] flex flex-col bg-bg-hero px-6 py-5 text-paper md:px-10"
            style={{ opacity: contentOpacity }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <span className="absolute -right-[2%] top-[10%] -rotate-6 font-display uppercase leading-none text-outline-faint"
                style={{ fontSize: 'clamp(8rem, 24vw, 20rem)' }}>
                Menu
              </span>
              <span className="absolute right-[10%] top-0 h-2 w-40 -skew-x-12 bg-accent" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-paper/5" />
              <span className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-paper/15 md:left-5 md:top-5" />
              <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-paper/15 md:bottom-5 md:right-5" />
              <span className="absolute left-0 top-0 h-2 w-full bg-stripes-red" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-paper/15 pb-4">
              <span className="text-label uppercase tracking-[0.3em] text-paper/60">
                Navegación — {profile.branding.system}
              </span>
              <button
                type="button"
                onClick={close}
                className="border border-paper/25 px-3 py-2 text-label font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:bg-accent hover:text-paper"
              >
                Cerrar
              </button>
            </div>

            <nav
              aria-label="Secciones del portfolio"
              className="relative z-10 flex flex-1 flex-col justify-center"
            >
              <ul>
                {NAV_ITEMS.map((item, index) => {
                  const isActive = index === activeIndex
                  return (
                    <motion.li
                      key={item.id}
                      initial={reduced ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduced ? 0 : 0.45 + index * 0.06,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      className="border-b border-paper/10"
                    >
                      <Link
                        to={item.path}
                        onClick={() => go(item.path)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group block py-3 md:py-4 ${
                          index % 2 === 1 ? 'md:translate-x-[6%]' : ''
                        }`}
                      >
                        <span className="flex items-baseline gap-4 md:gap-6">
                          <span className="w-12 shrink-0">
                            {isActive ? (
                              <span className="inline-block -skew-x-12 bg-accent px-2.5 py-1 font-display text-xl leading-none text-paper md:text-2xl">
                                <span className="inline-block skew-x-12">
                                  {item.index}
                                </span>
                              </span>
                            ) : (
                              <span className="font-display text-2xl leading-none text-paper/30 transition-colors group-hover:text-accent md:text-3xl">
                                {item.index}
                              </span>
                            )}
                          </span>

                          <span
                            className="font-display uppercase leading-none"
                            style={{ fontSize: ROW_SIZE }}
                          >
                            {isActive ? (
                              <span className="relative inline-block -skew-x-6 bg-accent px-[0.14em] py-[0.02em] text-paper">
                                <span className="inline-block skew-x-6">
                                  {item.label}
                                </span>
                              </span>
                            ) : (
                              <span
                                className={`transition-colors ${
                                  index % 2 === 0
                                    ? 'text-paper/80 group-hover:text-accent'
                                    : 'text-outline-faint group-hover:text-outline'
                                }`}
                              >
                                {item.label}
                              </span>
                            )}
                          </span>

                          <span
                            aria-hidden="true"
                            className={`ml-auto self-center transition-all duration-200 ${
                              isActive
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:-translate-x-1 group-hover:opacity-100'
                            }`}
                          >
                            <span className="block h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]" />
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-4">
              <p className="text-label uppercase tracking-[0.3em] text-paper/50">
                {profile.alias} — {profile.role}
              </p>
              <Annotation tone="red" smile className="order-first w-full md:order-none md:w-auto">
                ¡Elige tu destino!
              </Annotation>
              <ul className="flex flex-wrap gap-3">
                {links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-label font-medium uppercase tracking-[0.25em] text-paper/80 underline decoration-accent underline-offset-4 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {profile.links.cvPdf ? (
                  <li>
                    <a
                      href={profile.links.cvPdf}
                      download
                      className="inline-block text-label font-medium uppercase tracking-[0.25em] text-paper/80 underline decoration-accent underline-offset-4 hover:text-accent"
                    >
                      CV
                    </a>
                  </li>
                ) : null}
              </ul>
            </footer>
          </motion.div>

          {reduced ? null : <Sweep progress={progress} fadeOutAt={0.9} />}
        </>
      ) : null}
    </>
  )
}
