import { Reveal } from '../components/primitives/Reveal'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Screen } from '../components/transition/Screen'
import { profile } from '../data/profile'

export function About() {
  const { about, alias } = profile

  return (
    <Screen className="min-h-dvh bg-bg-content text-ink">
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute right-0 top-0 block h-1.5 w-28 -skew-x-12 bg-accent" />
          <span className="absolute bottom-0 left-0 block h-1.5 w-16 -skew-x-12 bg-ink/10" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <ScreenHeader index="02" label="Sobre mí" title="Quién está detrás" />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14">
              <div className="max-w-2xl space-y-4 text-body leading-relaxed">
                {about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-col gap-8">
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label="Intereses personales"
                >
                  {about.interests.map((interest) => (
                    <li
                      key={interest}
                      className="flex items-center gap-2 border border-ink px-3 py-1 text-label uppercase tracking-[0.18em]"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 bg-accent"
                      />
                      {interest}
                    </li>
                  ))}
                </ul>

                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 -top-3 h-16 w-16 border-r-2 border-t-2 border-accent"
                  />
                  {about.avatar ? (
                    <div className="border-2 border-ink">
                      <img
                        src={about.avatar.src}
                        alt={about.avatar.alt}
                        className="block h-auto w-full"
                      />
                    </div>
                  ) : (
                    <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden border-2 border-ink bg-bg-hero p-6 text-paper">
                      <span className="text-label uppercase tracking-[0.3em] text-paper/60">
                        {alias}
                      </span>
                      <span className="font-display text-5xl uppercase leading-none">
                        {alias}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute -right-6 top-1/2 block h-1.5 w-32 -skew-x-12 bg-accent"
                      />
                    </div>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -left-3 h-10 w-10 border-b-2 border-l-2 border-ink/30"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Screen>
  )
}
