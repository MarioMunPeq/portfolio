import { Reveal } from "../components/primitives/Reveal";
import { Screen } from "../components/transition/Screen";
import { SectionTitle } from "../components/ui/SectionTitle";
import { SkillTreeSection } from "../components/skill-tree/SkillTreeSection";

/**
 * Formacion = arbol de Habilidades: ruta academica real (Telecomunicaciones →
 * robotica y DAM → Bootcamp de IA) como arbol de nodos hexagonales conectados,
 * con panel de detalle.
 */
export function Education() {
  return (
    <Screen className="h-dvh bg-bg-hero text-paper">
      <section className="relative flex h-full flex-col overflow-hidden px-6 pt-14 md:px-10 md:pt-16">
        {/* Fondo: estrellas de contorno + halftone tenue (mismo lenguaje que Perfil/Inventario) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-stars opacity-70"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-halftone-dots opacity-25"
        />

        {/* Palabra fantasma de marca, centrada para rellenar ambos flancos */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[26%] z-0 -rotate-6 select-none text-center font-expose uppercase leading-none text-outline-faint opacity-55"
          style={{ fontSize: "clamp(7rem, 15vw, 14rem)" }}
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
  );
}
