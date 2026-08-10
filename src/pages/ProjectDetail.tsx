import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'

function ProjectHero({ project }: { project: Project }) {
  const image = project.images?.[0]

  if (image) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        className="block h-auto w-full border border-ink"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border border-ink bg-bg-hero text-paper"
    >
      <span
        aria-hidden="true"
        className="absolute -right-10 top-0 block h-1.5 w-52 -skew-x-12 bg-accent"
      />
      <span className="font-display text-hero uppercase leading-none text-paper/15">
        {project.order}
      </span>
    </div>
  )
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/404" replace />
  }

  const hasImages = project.images && project.images.length > 0
  const gallery = hasImages ? project.images!.slice(1) : []

  return (
    <section className="min-h-dvh bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Link
            to="/#proyectos"
            className="inline-block text-label uppercase tracking-[0.18em] underline decoration-accent underline-offset-4 hover:text-accent"
          >
            Volver a proyectos
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-10 font-display text-3xl text-accent">{project.order}</p>
          <h1 className="mt-2 font-display text-section-title uppercase leading-none">
            {project.name}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-body leading-relaxed">
            {project.description}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10">
            <ProjectHero project={project} />
          </div>
        </Reveal>

        {gallery.length > 0 ? (
          <Reveal delay={0.1}>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {gallery.map((image) => (
                <li key={image.src}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="block h-auto w-full border border-ink"
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:gap-14">
          {project.stack && project.stack.length > 0 ? (
            <Reveal delay={0.08}>
              <div>
                <h2 className="text-label font-medium uppercase tracking-[0.22em]">
                  Stack
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech} className="border border-ink px-3 py-1 text-caption">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}

          {project.links.demo || project.links.github ? (
            <Reveal delay={0.12}>
              <div>
                <h2 className="text-label font-medium uppercase tracking-[0.22em]">
                  Enlaces
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {project.links.demo ? (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-accent px-5 py-3 font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-accent-alt"
                    >
                      Ver demo
                    </a>
                  ) : null}
                  {project.links.github ? (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block border border-ink px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
                    >
                      Código
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}
