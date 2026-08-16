import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
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
        {/* Fondo: estrellas de contorno sutiles (mismo patrón que el inventario) */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars opacity-70" />

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
            <SectionTitle label="Árbol de habilidades" labelFont="hatty" title="HABILIDADES" persona />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex items-center gap-3">
              <DiamondMarker size={8} />
              <h2 className="font-hatty text-label font-medium uppercase tracking-[0.22em] text-accent">
                Recorrido académico
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.14} amount={0.1}>
            <SkillTreeSection />
          </Reveal>
        </div>
      </section>
    </Screen>
  )
}
