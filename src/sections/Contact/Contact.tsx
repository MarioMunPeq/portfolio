import { SectionHeading } from '../../components/primitives/SectionHeading'
import { profile } from '../../data/profile'

export function Contact() {
  const { links } = profile

  return (
    <section id="contacto" className="bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Contacto" title="Hablemos" />
        <p className="mt-8 max-w-2xl text-body leading-relaxed">
          [PLACEHOLDER] Texto de contacto — pendiente de definir.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {links.github ? (
            <li>
              <a
                href={links.github.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-ink px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
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
                className="inline-block border border-ink px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
              >
                LinkedIn
              </a>
            </li>
          ) : null}
          {links.email ? (
            <li>
              <a
                href={links.email.url}
                className="inline-block border border-ink px-5 py-3 font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
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
                className="inline-block bg-accent px-5 py-3 font-medium uppercase tracking-[0.18em] text-paper hover:bg-accent-alt"
              >
                Descargar CV
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  )
}
