import { Link, Navigate, useParams } from 'react-router-dom'
import { projects } from '../data/projects'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/404" replace />
  }

  return (
    <section className="min-h-dvh bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/#proyectos"
          className="inline-block text-label uppercase tracking-[0.18em] underline decoration-accent underline-offset-4 hover:text-accent"
        >
          Volver a proyectos
        </Link>
        <p className="mt-10 font-display text-3xl text-accent">{project.order}</p>
        <h1 className="mt-2 font-display text-section-title uppercase leading-none">
          {project.name}
        </h1>
        <p className="mt-6 max-w-2xl text-body leading-relaxed">
          {project.description}
        </p>
        {project.stack ? (
          <div className="mt-10">
            <h2 className="text-label uppercase tracking-[0.22em]">Stack</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-ink px-3 py-1 text-caption"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          {project.links.demo ? (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-accent px-5 py-3 font-medium uppercase tracking-[0.18em] text-paper hover:bg-accent-alt"
            >
              Ver demo
            </a>
          ) : null}
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-ink px-5 py-3 font-medium uppercase tracking-[0.18em] hover:border-accent hover:text-accent"
            >
              Código
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
