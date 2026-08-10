import { SectionHeading } from '../../components/primitives/SectionHeading'
import { profile } from '../../data/profile'

export function About() {
  return (
    <section id="sobre-mi" className="bg-bg-content px-6 py-20 text-ink">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Sobre mí" title="Quién está detrás" />
        <div className="mt-8 max-w-2xl space-y-4 text-body leading-relaxed">
          {profile.about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Intereses personales">
          {profile.about.interests.map((interest) => (
            <li
              key={interest}
              className="border border-ink px-3 py-1 text-label uppercase tracking-[0.18em]"
            >
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
