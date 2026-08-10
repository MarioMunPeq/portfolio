import { SectionHeading } from '../../components/primitives/SectionHeading'
import { experience } from '../../data/experience'

export function Experience() {
  return (
    <section id="experiencia" className="bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Experiencia" title="Dónde he trabajado" />
        <ol className="mt-10 space-y-10">
          {experience.map((entry) => (
            <li key={entry.company}>
              <article className="border-l-2 border-accent pl-6">
                <h3 className="font-display text-2xl uppercase leading-tight">
                  {entry.role}
                </h3>
                <p className="mt-1 font-medium">{entry.company}</p>
                <p className="mt-1 text-caption uppercase tracking-[0.18em] text-ink/60">
                  {entry.period}
                </p>
                <p className="mt-3 max-w-2xl text-body leading-relaxed">
                  {entry.summary}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
