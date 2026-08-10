import { Link } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Screen } from '../components/transition/Screen'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'

function ProjectVisual({ project }: { project: Project }) {
  const image = project.images?.[0]

  if (image) {
    return (
      <img src={image.src} alt={image.alt} className="block h-full w-full object-cover" />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full items-center justify-center overflow-hidden bg-halftone-ink"
    >
      <span
        aria-hidden="true"
        className="absolute -right-8 top-0 block h-1.5 w-40 -skew-x-12 bg-accent"
      />
      <span className="font-display text-6xl uppercase leading-none text-paper/15">
        {project.order}
      </span>
    </div>
  )
}

export function Projects() {
  return (
    <Screen className="min-h-dvh bg-bg-content-alt text-paper">
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute right-0 top-[18%] block h-1.5 w-40 -skew-x-12 bg-accent" />
          <span className="absolute left-0 top-0 h-2 w-full bg-stripes-red" />
          <span className="absolute bottom-10 right-6 hidden h-4 w-8 bg-halftone-red md:block" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <ScreenHeader
              index="03"
              label="Proyectos"
              title="Lo que construyo"
              onDark
            />
          </Reveal>

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Reveal delay={index * 0.08} className="h-full">
                  <Link
                    to={`/proyectos/${project.slug}`}
                    className="group flex h-full flex-col border border-paper/15 bg-bg-hero/40 transition-colors duration-300 hover:border-accent"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-paper/15">
                      <div className="h-full transition-transform duration-300 group-hover:scale-[1.03]">
                        <ProjectVisual project={project} />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h2 className="font-display text-xl uppercase leading-tight">
                          {project.name}
                        </h2>
                        <span className="font-display text-2xl leading-none text-accent">
                          {project.order}
                        </span>
                      </div>

                      <p className="mt-3 flex-1 text-caption leading-relaxed text-paper/70">
                        {project.summary}
                      </p>

                      {project.stack && project.stack.length > 0 ? (
                        <ul
                          className="mt-4 flex flex-wrap gap-1.5"
                          aria-label="Stack técnico"
                        >
                          {project.stack.map((tech) => (
                            <li
                              key={tech}
                              className="border border-paper/20 px-2 py-0.5 text-caption text-paper/60"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <span className="mt-5 inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.18em] text-paper/80 transition-colors group-hover:text-accent">
                        Ver proyecto
                        <span
                          aria-hidden="true"
                          className="block h-2 w-2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Screen>
  )
}
