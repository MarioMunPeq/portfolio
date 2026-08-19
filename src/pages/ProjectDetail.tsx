import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { PreviewBox } from '../components/ui/PreviewBox'
import { projects } from '../data/projects'
import type { ProjectScreenshot } from '../data/projects'

/* ── Font Awesome icons ── */
import { faReact, faNodeJs, faPython, faAndroid, faGitAlt, faJs, faCss3 } from '@fortawesome/free-brands-svg-icons'
import { faDatabase, faBrain, faCode, faServer, faBolt, faGears, faGem, faCubes, faTerminal, faFlask } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

/* ── Clip-paths reused from the site's visual system ── */
const TAG_CLIP = 'polygon(0 0, calc(100% - 1rem) 0, 100% 1rem, 100% 100%, 0 100%)'

const STACK_CLIP = 'polygon(0 0, 100% 0, 100% calc(100% - 1rem), calc(100% - 1rem) 100%, 0 100%)'

const SUMMARY_CLIP = 'polygon(0 0, calc(100% - 1.5rem) 0, 100% 1.5rem, 100% 100%, 0 100%)'

const ROTATIONS = ['-1.8deg', '1.2deg', '-0.8deg', '1.6deg', '-0.4deg', '0.7deg']

const GALLERY_ROTATIONS = ['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg']

/* ── Tech icon + role mapping ── */
type TechRole = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'ORM' | 'LENGUAJE' | 'AI/ML' | 'MOVIL' | 'HERRAMIENTA'

interface TechMeta {
  icon: IconDefinition
  role: TechRole
}

const TECH_META: Record<string, TechMeta> = {
  React:          { icon: faReact,     role: 'FRONTEND' },
  'Node.js':      { icon: faNodeJs,    role: 'BACKEND' },
  PostgreSQL:     { icon: faDatabase,  role: 'DATABASE' },
  Prisma:         { icon: faGem,       role: 'ORM' },
  TypeScript:     { icon: faCode,      role: 'LENGUAJE' },
  'Tailwind CSS': { icon: faCss3,      role: 'FRONTEND' },
  Vite:           { icon: faBolt,      role: 'HERRAMIENTA' },
  Python:         { icon: faPython,    role: 'LENGUAJE' },
  'scikit-learn': { icon: faBrain,     role: 'AI/ML' },
  FastAPI:        { icon: faBolt,      role: 'BACKEND' },
  Android:        { icon: faAndroid,   role: 'MOVIL' },
  'HTML/CSS':     { icon: faJs,        role: 'FRONTEND' },
  'Git/GitHub':   { icon: faGitAlt,    role: 'HERRAMIENTA' },
  Liferay:        { icon: faServer,    role: 'BACKEND' },
  Odoo:           { icon: faGears,     role: 'BACKEND' },
  'Power Platform': { icon: faCubes,   role: 'HERRAMIENTA' },
  'Android Studio': { icon: faTerminal, role: 'HERRAMIENTA' },
  Unity:          { icon: faCubes,     role: 'HERRAMIENTA' },
  Godot:          { icon: faCubes,     role: 'HERRAMIENTA' },
  Firebase:       { icon: faFlask,     role: 'DATABASE' },
}

function getTechMeta(tech: string): TechMeta {
  return TECH_META[tech] ?? { icon: faCode, role: 'HERRAMIENTA' }
}

/* ── Section header — condensed/stencil style ── */
function SectionHead({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <DiamondMarker size={8} />
      <h2 className="font-display text-base font-normal uppercase tracking-[0.2em] text-accent">
        {label}
      </h2>
    </div>
  )
}

/* ── Gallery image with angular frame + hard shadow ── */
function GalleryImage({
  screenshot,
  rotation,
  index,
}: {
  screenshot: ProjectScreenshot
  rotation: string
  index: number
}) {
  const offsets = ['md:ml-[4%]', 'md:ml-[8%]', 'md:ml-[2%]', 'md:ml-[10%]', 'md:ml-[6%]']
  return (
    <div
      className={`relative ${offsets[index % offsets.length]}`}
      style={{ transform: `rotate(${rotation})`, zIndex: 10 + index }}
    >
      {/* Hard shadow behind */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{
          clipPath: STACK_CLIP,
          transform: 'translate(8px, 8px)',
        }}
      />
      {/* Frame */}
      <div
        className="relative border-2 border-paper/20 bg-bg-content-alt"
        style={{ clipPath: STACK_CLIP }}
      >
        <PreviewBox src={screenshot.src} alt={screenshot.alt} caption={screenshot.caption} className="relative">
          <span aria-hidden="true" className="absolute inset-0 bg-halftone-red/5" />
        </PreviewBox>
      </div>
    </div>
  )
}

/* ── Tech card — mini skill-deck card with icon + role ── */
function StackCard({ tech, index }: { tech: string; index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length]
  const { icon, role } = getTechMeta(tech)
  const [viewBoxW, viewBoxH] = [icon.icon[0], icon.icon[1]]
  const pathData = icon.icon[4]

  return (
    <div
      className="group/card relative"
      style={{ transform: `rotate(${rotation})` }}
    >
      {/* Hard shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{
          clipPath: TAG_CLIP,
          transform: 'translate(4px, 4px)',
        }}
      />
      {/* Card body */}
      <div
        className="relative flex items-center gap-3 border border-paper/40 bg-[linear-gradient(155deg,#1e1e1e_0%,#161616_55%,#101010_100%)] px-4 py-3 transition-all duration-200 group-hover/card:border-accent group-hover/card:[&_svg]:fill-accent"
        style={{ clipPath: TAG_CLIP }}
      >
        {/* Diagonal texture overlay */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.015)_0_2px,transparent_2px_6px)]"
        />
        {/* Red inner outline (like sdeck cards) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[3px] border border-accent/0 transition-colors duration-200 group-hover/card:border-accent/40"
          style={{ clipPath: TAG_CLIP }}
        />
        {/* Icon */}
        <svg
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          aria-hidden="true"
          className="relative h-5 w-5 shrink-0 fill-paper transition-colors duration-200"
        >
          <path d={pathData} />
        </svg>
        {/* Text */}
        <div className="relative flex flex-col">
          <span className="text-body font-semibold leading-tight text-paper transition-colors duration-200 group-hover/card:text-accent">
            {tech}
          </span>
          <span className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.18em] text-paper/35 transition-colors duration-200 group-hover/card:text-accent/60">
            {role}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Angular CTA button ── */
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
      className={`group relative inline-flex items-center justify-center overflow-hidden border-2 border-accent px-6 py-4 font-expose text-base uppercase tracking-[0.1em] text-paper clip-[polygon(0_0,94%_0,100%_100%,6%_100%)] transition-all duration-200 hover:bg-accent hover:text-ink ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-paper opacity-0 clip-[polygon(0_84%,100%_84%,100%_88%,0_88%)] group-hover:animate-[hero-glitch_0.22s_steps(3)_1] group-focus-visible:animate-[hero-glitch_0.22s_steps(3)_1]"
      />
      <span className="relative">{children}</span>
    </a>
  )
}

/* ── Prev / Next navigation ── */
function PrevNextNav({
  prev,
  next,
}: {
  prev: { slug: string; name: string } | null
  next: { slug: string; name: string } | null
}) {
  const linkClass = `group relative flex flex-col gap-2 border-2 border-paper/25 bg-bg-content-alt px-6 py-5 transition-all duration-200 hover:border-accent hover:bg-accent hover:text-ink focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ink`
  const clipLeft = 'polygon(0 0, 100% 0, calc(100% - 1rem) 100%, 0 100%)'
  const clipRight = 'polygon(0 0, 100% 0, 100% 100%, 1rem 100%)'

  return (
    <nav aria-label="Navegacion entre proyectos">
      <div className="grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/proyectos/${prev.slug}`}
            data-cursor="project"
            className={linkClass}
            style={{ clipPath: clipLeft }}
          >
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
          <Link
            to={`/proyectos/${next.slug}`}
            data-cursor="project"
            className={`${linkClass} items-end text-right`}
            style={{ clipPath: clipRight }}
          >
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

/* ════════════════════════════════════════════════════════════════
   MAIN TEMPLATE — shared by all four project detail pages
   ════════════════════════════════════════════════════════════════ */
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

  const stackCount = project.stack?.length ?? 0
  const screenshotCount = project.screenshots?.length ?? 0

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      {/* ── Background decorative layers ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-[40vw] max-w-[600px] hidden lg:block"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--color-accent) 100%)',
          opacity: 0.03,
          clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-[1.5rem] bg-halftone-red opacity-10 hidden lg:block"
      />

      <section className="relative px-6 py-20 md:px-10 md:py-24 pb-40">
        <div className="mx-auto max-w-5xl relative z-10">

          {/* ═══ SECTION 1 — HEADER (full-width) ═══ */}
          <div className="relative">
            {/* Ghost text watermark */}
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

            {/* Skewed red accent bar under title */}
            <Reveal delay={0.08}>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-2 w-32 -skew-x-12 bg-accent" />
                <span className="h-3 w-3 rotate-45 bg-gold" />
              </div>
            </Reveal>

            {/* Status bar — project metadata */}
            <Reveal delay={0.1}>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[0.65rem] uppercase tracking-[0.18em] text-paper/30">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rotate-45 bg-accent/60" />
                  Stack: {stackCount} {stackCount === 1 ? 'tecnologia' : 'tecnologias'}
                </span>
                {screenshotCount > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rotate-45 bg-gold/60" />
                    Galeria: {screenshotCount} capturas
                  </span>
                )}
                {project.links.demo && (
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rotate-45 bg-green-500/60" />
                    Demo disponible
                  </span>
                )}
                {project.links.github && (
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rotate-45 bg-blue-400/60" />
                    Codigo abierto
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          {/* ═══ TWO-COLUMN LAYOUT — from Resumen downward ═══ */}
          <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:mt-16 lg:grid-cols-[1fr_420px] lg:gap-10">

            {/* ── LEFT COLUMN: Resumen + Stack Técnico ── */}
            <div className="flex flex-col gap-10">
              {/* Summary card — angular-cut with red left edge */}
              <Reveal delay={0.15}>
                <div className="relative max-w-2xl">
                  {/* Hard offset shadow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black"
                    style={{
                      clipPath: SUMMARY_CLIP,
                      transform: 'translate(10px, 10px)',
                    }}
                  />
                  {/* Outer panel (black border) */}
                  <div
                    className="relative p-[6px] md:p-[7px] bg-black"
                    style={{ clipPath: SUMMARY_CLIP }}
                  >
                    {/* Inner content */}
                    <div className="relative bg-white px-6 py-5 md:px-8 md:py-6">
                      {/* Red left edge accent */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
                      />
                      <div className="flex items-center gap-3">
                        <DiamondMarker size={7} />
                        <h2 className="font-display text-base font-normal uppercase tracking-[0.2em] text-ink">
                          Resumen
                        </h2>
                      </div>
                      <p className="mt-4 text-body leading-relaxed text-ink/70">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Tech Stack */}
              {project.stack && project.stack.length > 0 && (
                <Reveal delay={0.2}>
                  <div>
                    <SectionHead label="Stack tecnico" />
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {project.stack.map((tech, index) => (
                        <Reveal key={tech} delay={0.22 + index * 0.06} y={16} amount={0.3}>
                          <StackCard tech={tech} index={index} />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Ghost decorative element — fills empty space in left column */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative hidden lg:block"
                style={{ height: '120px' }}
              >
                <span
                  className="absolute -left-8 top-0 select-none font-display uppercase leading-none text-paper/[0.03]"
                  style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', transform: 'rotate(-6deg)' }}
                >
                  {project.name}
                </span>
                {/* Diagonal stripes */}
                <span
                  className="absolute right-0 top-4 h-24 w-full opacity-[0.02]"
                  style={{
                    background: 'repeating-linear-gradient(-45deg, var(--color-accent) 0 2px, transparent 2px 12px)',
                  }}
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN: Gallery (sticky on desktop) ── */}
            {project.screenshots && project.screenshots.length > 0 && (
              <Reveal delay={0.25}>
                <div className="lg:sticky lg:top-24">
                  <SectionHead label="Galeria" />
                  <div className="mt-6 space-y-14 md:space-y-10">
                    {project.screenshots.map((screenshot, i) => (
                      <GalleryImage
                        key={screenshot.src}
                        screenshot={screenshot}
                        rotation={GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* ═══ LINKS (full-width) ═══ */}
          <Reveal delay={0.3}>
            <div className="mt-16 border-t border-paper/10 pt-10">
              <SectionHead label="Enlaces" />
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

          {/* ═══ PREV / NEXT (full-width) ═══ */}
          {prevProject || nextProject ? (
            <Reveal delay={0.35}>
              <div className="mt-12">
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
