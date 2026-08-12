import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { projects } from '../data/projects'
import type { ProjectScreenshot } from '../data/projects'

const OUTLINE_THICK = `-3px -3px 0 var(--color-bg-hero), 3px -3px 0 var(--color-bg-hero), -3px 3px 0 var(--color-bg-hero), 3px 3px 0 var(--color-bg-hero), -4px -4px 0 var(--color-bg-hero), 4px -4px 0 var(--color-bg-hero), -4px 4px 0 var(--color-bg-hero), 4px 4px 0 var(--color-bg-hero)`

const ROTATIONS = ['-1.5deg', '1deg', '-1deg', '1.5deg', '-0.5deg', '0.5deg']

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
 * Diagonal section divider - thin diagonal-cut line consistent with site's diagonal language.
 */
function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-px w-full overflow-visible ${className}`}
      style={{
        background: 'linear-gradient(90deg, transparent 0%, var(--color-paper) 10%, var(--color-paper) 90%, transparent 100%)',
        opacity: 0.08,
      }}
    >
      <span
        className="absolute -top-[1px] right-0 block h-[2px] w-[120px] bg-accent"
        style={{
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 8px 100%)',
          transform: 'skewX(-12deg)',
        }}
      />
    </div>
  )
}

/**
 * Tech stack card - angular card style with alternating rotation.
 */
function StackCard({ tech, index }: { tech: string; index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length]

  return (
    <div
      className={`relative flex items-center gap-3 border border-paper/30 bg-bg-content-alt px-4 py-3 clip-cut-br min-w-[160px] transition-all duration-300 hover:border-accent hover:bg-bg-hero/50 hover:scale-[1.02] hover:shadow-[0_0_0_1px_var(--color-accent)]`}
      style={{
        transform: `rotate(${rotation})`,
      }}
    >
      <span className="text-body font-medium text-paper" style={{ transform: `rotate(${-parseFloat(rotation)}deg)` }}>
        {tech}
      </span>
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

/**
 * Subtle diagonal red accent bleeding from right edge.
 */
function DiagonalEdgeAccent() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 h-full w-[40vw] max-w-[600px] hidden lg:block"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, var(--color-accent) 100%)',
        opacity: 0.03,
        clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
      }}
    />
  )
}

/**
 * Halftone accent strip along left edge.
 */
function HalftoneAccentStrip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 bottom-0 w-[1.5rem] bg-halftone-red opacity-10 hidden lg:block"
    />
  )
}

/**
 * Prev/next project navigation - named navigation instead of numbers.
 */
function PrevNextNav({ prev, next }: { prev: { slug: string; name: string } | null; next: { slug: string; name: string } | null }) {
  if (!prev && !next) return null

  return (
    <nav aria-label="Navegación entre proyectos" className="flex flex-wrap gap-4">
      {prev && (
        <Link
          to={`/proyectos/${prev.slug}`}
          className="group flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-paper/60 hover:text-accent transition-colors"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 bg-accent rotate-45 transition-transform duration-200 group-hover:-translate-x-1"
          />
          {prev.name}
        </Link>
      )}
      {next && (
        <Link
          to={`/proyectos/${next.slug}`}
          className="group ml-auto flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-paper/60 hover:text-accent transition-colors"
        >
          {next.name}
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 bg-accent rotate-45 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </nav>
  )
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/404" replace />
  }

  const sectionLabel = 'INVENTARIO'

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      {/* Background decorative elements */}
      <DiagonalEdgeAccent />
      <HalftoneAccentStrip />

      <section className="relative px-6 py-20 md:px-10 md:py-24 pb-40">
        <div className="mx-auto max-w-4xl relative z-10">
          {/* ===== SECTION 1 — Header ===== */}
          <Reveal>
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 text-label font-medium uppercase tracking-[0.22em] text-paper/80 hover:text-accent transition-colors group"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 bg-accent rotate-45 transition-transform duration-200 group-hover:-translate-x-1"
              />
              VOLVER A {sectionLabel}
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              className="mt-10 font-display uppercase leading-[0.95] text-paper"
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
                textShadow: `${OUTLINE_THICK}, 8px 8px 0 var(--color-accent-deep)`,
              }}
            >
              {project.name}
            </h1>
          </Reveal>

          {/* Placeholder image block */}
          <Reveal delay={0.08}>
            <div className="mt-8 relative proj-frame border-2 border-paper bg-bg-content-alt overflow-hidden aspect-[16/10]">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-halftone-ink">
                <span
                  aria-hidden="true"
                  className="absolute -left-10 -top-8 block h-[130%] w-14 -skew-x-[16deg] bg-accent/20"
                />
                <div className="relative flex items-center gap-2 bg-halftone-red px-4 py-2.5 clip-notch border-l-4 border-accent">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
                  />
                  <span className="text-label font-medium uppercase tracking-[0.22em] text-paper">
                    [PROJECT PREVIEW PLACEHOLDER]
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-accent px-3 py-1.5 text-label font-medium uppercase tracking-[0.22em] text-paper -rotate-3">
                  <span aria-hidden="true">◄</span>
                  Captura pendiente
                </span>
              </div>
              <span aria-hidden="true" className="flex h-2 overflow-hidden">
                <span className="h-full w-1/3 bg-stripes-red" />
                <span className="h-full flex-1 bg-accent" />
              </span>
            </div>
          </Reveal>

          {/* Diagonal divider */}
          <Reveal delay={0.1}>
            <SectionDivider className="mt-8" />
          </Reveal>

          {/* ===== SECTION 2 — Resumen ===== */}
          <Reveal delay={0.15}>
            <div className="mt-12 max-w-2xl">
              <div className="flex items-center gap-3">
                <DiamondMarker size={8} />
                <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                  Resumen
                </h2>
              </div>
              <p className="mt-5 text-body leading-relaxed text-paper/70 max-w-2xl">
                {project.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <SectionDivider />
          </Reveal>

          {/* ===== SECTION 3 — Stack técnico ===== */}
          {project.stack && project.stack.length > 0 && (
            <Reveal delay={0.2}>
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <DiamondMarker size={8} />
                  <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                    Stack técnico
                  </h2>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.stack.map((tech, index) => (
                    <StackCard key={tech} tech={tech} index={index} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {project.stack && project.stack.length > 0 && (
            <Reveal delay={0.22}>
              <SectionDivider className="mt-12" />
            </Reveal>
          )}

          {/* ===== SECTION 4 — Galería ===== */}
          {project.screenshots && project.screenshots.length > 0 && (
            <Reveal delay={0.25}>
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <DiamondMarker size={8} />
                  <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                    Galería
                  </h2>
                </div>
                <div className="mt-10 space-y-20">
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

          {project.screenshots && project.screenshots.length > 0 && (
            <Reveal delay={0.28}>
              <SectionDivider className="mt-14" />
            </Reveal>
          )}

          {/* ===== SECTION 5 — Cierre / enlaces ===== */}
          {(project.links.demo || project.links.github) && (
            <Reveal delay={0.3}>
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <DiamondMarker size={8} />
                  <h2 className="text-label font-medium uppercase tracking-[0.22em] text-accent">
                    Enlaces
                  </h2>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
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

          {/* Prev/Next navigation */}
          <Reveal delay={0.35}>
            <div className="mt-16">
              <PrevNextNav prev={prevProject} next={nextProject} />
            </div>
          </Reveal>

          {/* Bottom accent */}
          <div
            aria-hidden="true"
            className="mt-8 h-px bg-gradient-to-r from-transparent via-paper/10 to-transparent"
          />
        </div>
      </section>
    </Screen>
  )
}