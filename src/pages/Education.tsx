import { Reveal } from '../components/primitives/Reveal'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Screen } from '../components/transition/Screen'
import { education } from '../data/education'

export function Education() {
  return (
    <Screen className="min-h-dvh bg-bg-content text-ink">
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute right-0 top-0 h-2 w-full bg-stripes-faint" />
          <span className="absolute right-10 top-32 block h-4 w-8 bg-halftone-red" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <ScreenHeader index="05" label="Formación" title="HABILIDADES" usePersonaFont />
          </Reveal>

          <ol className="mt-14">
            {education.map((entry, index) => (
              <li key={entry.degree} className="border-t border-ink/15 py-6">
                <Reveal delay={index * 0.05}>
                  <div className="grid gap-2 md:grid-cols-[10rem_1fr] md:gap-8">
                    <div className="md:pt-1">
                      <span className="font-display text-2xl leading-none text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="mt-2 text-caption uppercase tracking-[0.18em] text-ink/50">
                        {entry.period}
                      </p>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl uppercase leading-tight">
                        {entry.degree}
                      </h2>
                      <p className="mt-1 font-medium">{entry.institution}</p>
                      <p className="mt-3 max-w-2xl text-body leading-relaxed text-ink/80">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Screen>
  )
}
