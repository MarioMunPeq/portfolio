import { Reveal } from '../components/primitives/Reveal'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { profile } from '../data/profile'

export function About() {
  const { about, alias, hero, location, branding } = profile

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-28">
        {/* Fondo: estrellas de contorno sutiles (mismo patrón que el inventario) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-stars"
        />

        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <ScreenHeader label="Sobre mí" title="PERFIL" usePersonaFont />
          </Reveal>

          {/* Divisor de corte diagonal entre cabecera y contenido */}
          <div aria-hidden="true" className="mt-12 flex items-center gap-4">
            <span className="h-px flex-1 bg-paper/20" />
            <span className="h-1.5 w-16 -skew-x-12 bg-accent" />
            <span className="h-px flex-1 bg-paper/20" />
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14">
            <div className="max-w-2xl space-y-4 text-body leading-relaxed text-paper/80">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={0.05 * index}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <div className="flex flex-col gap-8">
              <Reveal delay={0.1}>
                <ul
                  className="flex flex-wrap gap-2.5"
                  aria-label="Intereses personales"
                >
                  {about.interests.map((interest) => (
                    <li
                      key={interest}
                      className="flex items-center gap-2.5 border border-paper/30 bg-bg-content-alt px-4 py-2 text-label font-medium uppercase tracking-[0.18em] clip-cut-br transition-all duration-300 hover:border-accent hover:bg-bg-hero/50 hover:scale-[1.02] hover:shadow-[0_0_0_1px_var(--color-accent)]"
                    >
                      <DiamondMarker size={6} />
                      {interest}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.16}>
                {/* Tarjeta de perfil del sistema: marco angular, corchetes HUD
                    y trama halftone sutil. No es el hueco del retrato duotono. */}
                <div className="relative border border-paper/25 bg-bg-content-alt clip-cut-br p-7">
                  {/* Trama halftone sutil en el lateral derecho */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-halftone-dots opacity-25"
                  />

                  {/* Corchetes HUD de marco (estilo pantalla de carga) */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-4 h-5 w-5"
                  >
                    <span className="absolute left-0 top-0 h-[2px] w-5 bg-accent" />
                    <span className="absolute left-0 top-0 h-5 w-[2px] bg-accent" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-4 h-5 w-5"
                  >
                    <span className="absolute right-0 top-0 h-[2px] w-5 bg-accent" />
                    <span className="absolute right-0 top-0 h-5 w-[2px] bg-accent" />
                  </span>

                  <div className="relative">
                    <p className="flex items-center gap-2 text-label uppercase tracking-[0.3em] text-paper/50">
                      <DiamondMarker size={6} />
                      {branding.system}
                    </p>
                    <p className="mt-5 font-display text-4xl uppercase leading-[0.95] text-paper">
                      {alias}
                    </p>
                    <p className="mt-3 text-label font-medium uppercase tracking-[0.22em] text-accent">
                      {hero.eyebrow}
                    </p>
                    <p className="mt-1.5 text-caption uppercase tracking-[0.18em] text-paper/50">
                      {location}
                    </p>

                    <span
                      aria-hidden="true"
                      className="mt-6 block h-1.5 w-24 -skew-x-12 bg-accent/70"
                    />

                    <ul className="mt-5 space-y-2.5">
                      <li className="flex items-center gap-2.5 text-label uppercase tracking-[0.18em] text-paper/80">
                        <DiamondMarker size={5} />
                        {hero.roleLine}
                      </li>
                      <li className="flex items-center gap-2.5 text-label uppercase tracking-[0.18em] text-paper/80">
                        <DiamondMarker size={5} />
                        {hero.credentialLine}
                      </li>
                    </ul>

                    <p className="mt-6 text-caption uppercase tracking-[0.3em] text-paper/35">
                      {hero.coordinates}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </Screen>
  )
}
