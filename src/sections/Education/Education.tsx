import { SectionHeading } from '../../components/primitives/SectionHeading'
import { education } from '../../data/education'

export function Education() {
  return (
    <section id="formacion" className="bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Formación" title="Dónde me he formado" />
        <ol className="mt-10 space-y-10">
          {education.map((entry) => (
            <li key={entry.degree}>
              <article className="border-l-2 border-accent pl-6">
                <h3 className="font-display text-2xl uppercase leading-tight">
                  {entry.degree}
                </h3>
                <p className="mt-1 font-medium">{entry.institution}</p>
                <p className="mt-1 text-caption uppercase tracking-[0.18em] text-ink/60">
                  {entry.period}
                </p>
                <p className="mt-3 max-w-2xl text-body leading-relaxed">
                  {entry.description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
