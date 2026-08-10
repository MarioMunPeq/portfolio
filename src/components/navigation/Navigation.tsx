import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { Sweep } from '../primitives/Sweep'
import { NAV_ITEMS } from './nav-items'
import { profile } from '../../data/profile'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

/**
 * Navegación oculta: trigger discreto en la esquina inferior derecha
 * (se intensifica al hacer scroll o al pasar el cursor) y panel a
 * pantalla completa que se revela con el barrido diagonal firma.
 */
export function Navigation() {
  const reduced = useReducedMotion()
  const lenis = useLenis()

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progress = useMotionValue(0)
  const contentOpacity = useTransform(progress, [0.25, 0.55], [0, 1])

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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

  const goTo = useCallback(
    (id: string) => {
      lenis?.start()
      if (id === 'inicio') {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.1 })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        const el = document.getElementById(id)
        if (!el) return
        if (lenis) {
          lenis.scrollTo(el, { duration: 1.1 })
        } else {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
      close()
    },
    [close, lenis],
  )

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
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={mounted}
        className={`fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 border px-4 py-3 text-label font-medium uppercase tracking-[0.25em] transition-colors duration-300 ${
          scrolled
            ? 'border-accent text-paper'
            : 'border-paper/25 text-paper/60'
        } hover:border-accent hover:bg-accent hover:text-paper focus-visible:border-accent focus-visible:bg-accent focus-visible:text-paper`}
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
        />
        Menú
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
            <div className="flex items-center justify-between border-b border-paper/15 pb-4">
              <span className="text-label uppercase tracking-[0.3em] text-paper/60">
                Navegación
              </span>
              <button
                type="button"
                onClick={close}
                className="border border-paper/25 px-3 py-2 text-label font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:bg-accent hover:text-paper"
              >
                Cerrar
              </button>
            </div>

            <nav aria-label="Secciones del portfolio" className="flex flex-1 flex-col justify-center">
              <ul>
                {NAV_ITEMS.map((item, index) => (
                  <li key={item.id}>
                    <motion.button
                      type="button"
                      onClick={() => goTo(item.id)}
                      initial={reduced ? false : { opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduced ? 0 : 0.45 + index * 0.06,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      className="group flex w-full items-baseline gap-4 border-b border-paper/10 py-3 text-left md:py-4"
                    >
                      <span className="text-label tracking-[0.3em] text-accent">
                        {item.index}
                      </span>
                      <span className="font-display text-3xl uppercase leading-none text-paper transition-colors duration-200 group-hover:text-accent md:text-5xl">
                        {item.label}
                      </span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-4">
              <p className="text-label uppercase tracking-[0.3em] text-paper/50">
                {profile.alias} — {profile.role}
              </p>
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
