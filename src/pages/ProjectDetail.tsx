import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { PreviewBox } from '../components/ui/PreviewBox'
import { projects } from '../data/projects'
import type { ProjectScreenshot } from '../data/projects'

const ROTATIONS = ['-1.5deg', '1deg', '-1deg', '1.5deg', '-0.5deg', '0.5deg']

/**
 * Angular framed image with clip-path border treatment. When the screenshot
 * has no `src` yet, PreviewBox renders the shared "Captura pendiente" slot.
 */
function GalleryImage({ screenshot }: { screenshot: ProjectScreenshot }) {
  return (
    <PreviewBox src={screenshot.src} alt={screenshot.alt} caption={screenshot.caption} className="relative">
      <span aria-hidden="true" className="absolute inset-0 bg-halftone-red/5" />
    </PreviewBox>
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
 * Small gold star mark used on the tech cards.
 */
function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
    >
      <polygon
        fill="var(--color-gold)"
        points="50,5 61,38 96,38 68,59 79,92 50,71 21,92 32,59 4,38 39,38"
      />
    </svg>
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
      <span className="flex items-center gap-2 text-body font-medium text-paper" style={{ transform: `rotate(${-parseFloat(rotation)}deg)` }}>
        <StarIcon />
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
      data-cursor="open"
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`group relative inline-flex items-center justify-center overflow-hidden border-2 border-accent px-6 py-4 font-expose text-base uppercase tracking-[0.1em] text-paper clip-[polygon(0_0,94%_0,100%_100%,6%_100%)] box-shadow-[3px_3px_0_var(--color-accent-deep)] transition-all duration-200 hover:border-accent hover:bg-accent hover:text-ink hover:box-shadow-[5px_5px_0_var(--color-paper)] focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink ${className}`}
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
 * Prev/next project navigation - two named cards (no numeric badges).
 */
function PrevNextNav({
  prev,
  next,
}: {
  prev: { slug: string; name: string } | null
  next: { slug: string; name: string } | null
}) {
  const linkClass = `group flex flex-col gap-2 border-2 border-paper/25 bg-bg-content-alt px-6 py-5 clip-cut-br transition-all duration-200 hover:border-accent hover:bg-accent hover:text-ink focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink`

  return (
    <nav aria-label="Navegacion entre proyectos">
      <div className="grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link to={`/proyectos/${prev.slug}`} data-cursor="project" className={linkClass}>
            <span className="flex items-center gap-2 font-expose text-label font-medium uppercase tracking-[0.3em] text-paper/50 transition-colors group-hover:text-ink/70 group-focus-visible:text-ink/70">
              <DiamondMarker size={6} />
              Anterior
            </span>
            <span className="font-expose text-2xl uppercase leading-tight text-paper transition-colors group-hover:text-ink group-focus-visible:text-ink">
              {prev.name}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link to={`/proyectos/${next.slug}`} data-cursor="project" className={`${linkClass} items-end text-right`}>
            <span className="flex items-center gap-2 font-expose text-label font-medium uppercase tracking-[0.3em] text-paper/50 transition-colors group-hover:text-ink/70 group-focus-visible:text-ink/70">
              Siguiente
              <DiamondMarker size={6} />
            </span>
            <span className="font-expose text-2xl uppercase leading-tight text-paper transition-colors group-hover:text-ink group-focus-visible:text-ink">
              {next.name}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
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
          <div className="relative">
            {/* Acento de fondo: nombre del proyecto grande, tenue y rotado,
                sangrando por el borde derecho del header */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-12 select-none font-expose uppercase leading-none text-outline-faint"
              style={{ fontSize: 'clamp(5rem, 13vw, 9rem)', transform: 'rotate(-4deg)' }}
            >
              {project.name}
            </span>

            <Reveal>
              <Link
                to="/projects"
                data-cursor="back"
                className="inline-flex items-center gap-3 font-expose text-label font-medium uppercase tracking-[0.22em] text-paper/80 hover:text-accent transition-colors group"
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
                className="mt-10 font-expose uppercase leading-[0.95] text-paper"
                style={{
                  fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
                  textShadow: '4px 4px 0 var(--color-accent-deep)',
                }}
              >
                {project.name}
              </h1>
            </Reveal>
          </div>

          {/* Diagonal divider */}
          <Reveal delay={0.1}>
            <SectionDivider className="mt-10" />
          </Reveal>

          {/* ===== SECTION 2 — Resumen ===== */}
          <Reveal delay={0.15}>
            <div className="mt-12 max-w-2xl">
              <div className="flex items-center gap-3">
                <DiamondMarker size={8} />
                <h2 className="font-expose text-label font-medium uppercase tracking-[0.22em] text-accent">
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

          {/* ===== SECTION 3 — Stack tecnico ===== */}
          {project.stack && project.stack.length > 0 && (
            <Reveal delay={0.2}>
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <DiamondMarker size={8} />
                  <h2 className="font-expose text-label font-medium uppercase tracking-[0.22em] text-accent">
                    Stack tecnico
                  </h2>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.stack.map((tech, index) => (
                    <Reveal key={tech} delay={0.22 + index * 0.06} y={16} amount={0.3}>
                      <StackCard tech={tech} index={index} />
                    </Reveal>
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

          {/* ===== SECTION 4 — Galeria ===== */}
          {project.screenshots && project.screenshots.length > 0 && (
            <Reveal delay={0.25}>
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <DiamondMarker size={8} />
                  <h2 className="font-expose text-label font-medium uppercase tracking-[0.22em] text-accent">
                    Galeria
                  </h2>
                </div>
                <div className="mt-10 space-y-20">
                  {project.screenshots.map((screenshot) => (
                    <div key={screenshot.src} className="relative">
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
          <Reveal delay={0.3}>
            <div className="mt-12">
              <div className="flex items-center gap-3">
                <DiamondMarker size={8} />
                <h2 className="font-expose text-label font-medium uppercase tracking-[0.22em] text-accent">
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
                    Codigo
                  </AngularButton>
                )}
              </div>
              {!project.links.demo && !project.links.github && (
                <p className="mt-4 text-label uppercase tracking-[0.25em] text-paper/40">
                  Sin enlaces publicos disponibles
                </p>
              )}
            </div>
          </Reveal>

          {/* Prev/Next navigation */}
          {prevProject || nextProject ? (
            <Reveal delay={0.35}>
              <div className="mt-16">
                <PrevNextNav prev={prevProject} next={nextProject} />
              </div>
            </Reveal>
          ) : null}

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