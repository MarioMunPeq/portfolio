import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { StarBadge } from '../components/overlay/StarBadge'
import { projects } from '../data/projects'
import type { ProjectScreenshot } from '../data/projects'

const OUTLINE_BLACK = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero)`

/**
 * Ghost number for gallery sections - reuses the faint outline numeral treatment.
 */
function GhostNumber({ order }: { order: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display uppercase leading-none text-outline-faint"
      style={{ fontSize: 'clamp(10rem, 25vw, 20rem)' }}
    >
      {order}
    </span>
  )
}

/**
 * Angular framed image with clip-path border treatment.
 */
function GalleryImage({ screenshot }: { screenshot: ProjectScreenshot }) {
  return (
    <figure className="relative proj-frame border-2 border-paper bg-bg-content-alt overflow-hidden">
      <img
        src={screenshot.src}
        alt={screenshot.alt}
        className="block h-auto w-full object-cover"
      />
      {screenshot.caption && (
        <figcaption className="absolute left-0 right-0 bottom-0 px-4 py-3 bg-halftone-red/80 border-t border-paper/20">
          <span className="text-label font-medium uppercase tracking-[0.22em] text-paper">
            {screenshot.caption}
          </span>
        </figcaption>
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-halftone-red/5" />
    </figure>
  )
}

/**
 * Tech stack card with star icon - angular card style.
 */
function StackCard({ tech }: { tech: string }) {
  return (
    <div className="relative flex items-center gap-3 border border-paper/30 bg-bg-content-alt px-4 py-3 clip-cut-br min-w-[160px]">
      <StarBadge state="full" label={`${tech} — dominado`} />
      <span className="text-body font-medium text-paper">{tech}</span>
    </div>
  )
}

/**
 * Angular button matching ENTRAR AL SISTEMA treatment.
 */
function AngularButton({ children, href, external = false, className = '' }: {
  children: React.ReactNode
  href: string
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`group relative inline-flex items-center justify-center overflow-hidden border-2 border-accent px-6 py-4 font-display text-base uppercase tracking-[0.1em] text-paper clip-[polygon(0_0,94%_0,100%_100%,6%_100%)] box-shadow-[3px_3px_0_var(--color-accent-deep)] transition-all duration-200 hover:border-accent hover:bg-accent hover:text-ink hover:box-shadow-[5px_5px_0_var(--color-paper)] focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-paper opacity-0 clip-[polygon(0_84%,100%_84%,100%_88%,0_88%)] group-hover:animate-[hero-glitch_0.22s_steps(3)_1] group-focus-visible:animate-[hero-glitch_0.22s_steps(3)_1]"
      />
      <span className="relative">{children}</span>
    </a>
  )
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/404" replace />
  }

  const sectionLabel = project.slug === 'cosmere-archive' ? 'INVENTARIO' : 'INVENTARIO'

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* ===== SECTION 1 — Header ===== */}
          <Reveal>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-paper/70 hover:text-accent transition-colors"
            >
              <span aria-hidden="true" className="h-2 w-2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]" />
              VOLVER A {sectionLabel}
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-10 font-display text-3xl text-accent">{project.order}</p>
            <h1
              className="mt-2 font-display uppercase leading-none text-paper"
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
                textShadow: `${OUTLINE_BLACK}, 6px 6px 0 var(--color-accent-deep)`,
              }}
            >
              {project.name}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-body leading-relaxed text-paper/80">
              {project.description}
            </p>
          </Reveal>

          {/* ===== SECTION 2 — Resumen ===== */}
          <Reveal delay={0.15}>
            <div className="mt-16 pt-10 border-t border-paper/10">
              <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                Resumen
              </h2>
              <p className="mt-4 max-w-2xl text-body leading-relaxed text-paper/70">
                {project.description}
              </p>
            </div>
          </Reveal>

          {/* ===== SECTION 3 — Stack técnico ===== */}
          {project.stack && project.stack.length > 0 && (
            <Reveal delay={0.2}>
              <div className="mt-16 pt-10 border-t border-paper/10">
                <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                  Stack técnico
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.stack.map((tech) => (
                    <StackCard key={tech} tech={tech} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ===== SECTION 4 — Galería ===== */}
          {project.screenshots && project.screenshots.length > 0 && (
            <Reveal delay={0.25}>
              <div className="mt-16 pt-10 border-t border-paper/10">
                <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                  Galería
                </h2>
                <div className="mt-8 space-y-16">
                  {project.screenshots.map((screenshot, index) => (
                    <div key={screenshot.src} className="relative">
                      <GhostNumber order={String(index + 1).padStart(2, '0')} />
                      <GalleryImage screenshot={screenshot} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ===== SECTION 5 — Cierre / enlaces ===== */}
          {(project.links.demo || project.links.github) && (
            <Reveal delay={0.3}>
              <div className="mt-16 pt-10 border-t border-paper/10">
                <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                  Enlaces
                </h2>
                <div className="mt-6 flex flex-wrap gap-4">
                  {project.links.demo && (
                    <AngularButton href={project.links.demo} external>
                      Ver demo
                    </AngularButton>
                  )}
                  {project.links.github && (
                    <AngularButton href={project.links.github} external>
                      Código
                    </AngularButton>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </Screen>
  )
}