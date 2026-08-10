import { Link } from 'react-router-dom'
import { Reveal } from '../../components/primitives/Reveal'
import { SectionHeading } from '../../components/primitives/SectionHeading'
import { projects } from '../../data/projects'
import type { Project } from '../../data/projects'

function ProjectVisual({ project }: { project: Project }) {
  const image = project.images?.[0]

  if (image) {
    return <img src={image.src} alt={image.alt} className="block h-full w-full object-cover" />
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full items-center justify-center overflow-hidden bg-bg-hero"
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
    <section
      id="proyectos"
      className="bg-bg-content-alt px-6 py-24 text-paper md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading label="Proyectos" title="Lo que construyo" onDark />
        </Reveal>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
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
                      <h3 className="font-display text-xl uppercase leading-tight">
                        {project.name}
                      </h3>
                      <span className="font-display text-2xl leading-none text-accent">
                        {project.order}
                      </span>
                    </div>

                    <p className="mt-3 flex-1 text-caption leading-relaxed text-paper/70">
                      {project.summary}
                    </p>

                    {project.stack && project.stack.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack técnico">
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
  )
}
