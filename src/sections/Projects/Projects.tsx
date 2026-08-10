import { Link } from 'react-router-dom'
import { SectionHeading } from '../../components/primitives/SectionHeading'
import { projects } from '../../data/projects'

export function Projects() {
  return (
    <section id="proyectos" className="bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Proyectos" title="Lo que construyo" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                to={`/proyectos/${project.slug}`}
                className="group block border border-ink p-5"
              >
                <span className="font-display text-3xl text-accent">
                  {project.order}
                </span>
                <h3 className="mt-3 font-display text-xl uppercase leading-tight">
                  {project.name}
                </h3>
                <p className="mt-2 text-caption leading-relaxed">
                  {project.summary}
                </p>
                <span className="mt-4 inline-block text-label uppercase tracking-[0.18em] underline decoration-accent underline-offset-4 group-hover:text-accent">
                  Ver proyecto
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
