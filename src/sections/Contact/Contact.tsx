import { Reveal } from '../../components/primitives/Reveal'
import { SectionHeading } from '../../components/primitives/SectionHeading'
import { profile } from '../../data/profile'

export function Contact() {
  const { links, contact, alias } = profile

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-bg-content-alt px-6 py-24 text-paper md:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute right-0 top-[22%] block h-1.5 w-40 -skew-x-12 bg-accent" />
      </div>

      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading label="Contacto" title="Hablemos" onDark />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-body leading-relaxed text-paper/80">
            {contact.intro}
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="mt-10 flex flex-wrap gap-3">
            {links.github ? (
              <li>
                <a
                  href={links.github.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border border-paper/30 px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
                >
                  GitHub
                </a>
              </li>
            ) : null}
            {links.linkedin ? (
              <li>
                <a
                  href={links.linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border border-paper/30 px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
                >
                  LinkedIn
                </a>
              </li>
            ) : null}
            {links.email ? (
              <li>
                <a
                  href={links.email.url}
                  className="inline-block border border-paper/30 px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
                >
                  Email
                </a>
              </li>
            ) : null}
            {links.cvPdf ? (
              <li>
                <a
                  href={links.cvPdf}
                  download
                  className="inline-block bg-accent px-5 py-3 font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-accent-alt"
                >
                  Descargar CV
                </a>
              </li>
            ) : null}
          </ul>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-16 text-label uppercase tracking-[0.3em] text-paper/40">
            {alias} — {profile.role}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
