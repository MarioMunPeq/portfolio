import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { SectionTitle } from '../components/ui/SectionTitle'
import { SkillTreeSection } from '../components/skill-tree/SkillTreeSection'

/**
 * Formación = Árbol de Habilidades: ruta académica real (Telecomunicaciones →
 * Robótica y DAM → Bootcamp de IA) como árbol de nodos hexagonales conectados,
 * con panel de detalle.
 */
export function Education() {
  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative overflow-hidden px-6 pb-28 pt-16 md:px-10 md:pt-20">
        {/* Palabra fantasma de marca */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-2 z-0 -rotate-6 select-none font-expose uppercase leading-none text-outline-faint opacity-55"
          style={{ fontSize: 'clamp(7rem, 15vw, 14rem)' }}
        >
          HABILIDADES
        </span>

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionTitle title="HABILIDADES" persona />
          </Reveal>

          <Reveal delay={0.14} amount={0.1}>
            <SkillTreeSection />
          </Reveal>
        </div>
      </section>
    </Screen>
  )
}
