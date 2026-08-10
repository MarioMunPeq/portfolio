import { Reveal } from '../../components/primitives/Reveal'
import { SectionHeading } from '../../components/primitives/SectionHeading'
import { experience } from '../../data/experience'

export function Experience() {
  return (
    <section id="experiencia" className="bg-bg-content px-6 py-24 text-ink md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading label="Experiencia" title="Dónde he trabajado" />
        </Reveal>

        <ol className="mt-12 space-y-12 border-l border-ink/15 pl-6 md:pl-8">
          {experience.map((entry, index) => (
            <li key={entry.company} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[30px] top-1.5 block h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)] md:-left-[38px]"
              />
              <Reveal delay={index * 0.08}>
                <article>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-display text-2xl uppercase leading-tight">
                      {entry.role}
                    </h3>
                    <span className="text-caption uppercase tracking-[0.18em] text-ink/50">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{entry.company}</p>
                  <p className="mt-3 max-w-2xl text-body leading-relaxed">
                    {entry.summary}
                  </p>
                  {entry.highlights.length > 0 ? (
                    <ul className="mt-4 max-w-2xl space-y-2">
                      {entry.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-caption leading-relaxed text-ink/80"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
