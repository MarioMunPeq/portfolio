import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { Annotation } from '../components/primitives/Annotation'
import { SectionTitle } from '../components/ui/SectionTitle'
import { Tag } from '../components/ui/Tag'
import { StatTag } from '../components/ui/StatTag'
import { SocialStar } from '../components/social-star/SocialStar'
import { SkillMenuSection } from '../components/skill-menu/SkillMenuSection'
import { profile } from '../data/profile'

// Nombre en tres bloques (mismo tratamiento tipográfico que el hero).
const nameParts = profile.name.trim().split(/\s+/)
const nameLine1 = nameParts[0] ?? ''
const nameLine2 = nameParts[1] ?? ''
const nameLine3 = nameParts.slice(2).join(' ')

const OUTLINE_BLACK = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero), -3px -3px 0 var(--color-bg-hero), 3px 3px 0 var(--color-bg-hero)`
const OUTLINE_RED = `-2px -2px 0 var(--color-accent), 2px -2px 0 var(--color-accent), -2px 2px 0 var(--color-accent), 2px 2px 0 var(--color-accent), -3px -3px 0 var(--color-accent), 3px 3px 0 var(--color-accent)`

// Atributos sociales del personaje (Social Stats de P5). Cada atributo tiene
// su propio valor (1-5) que decide cuánto se extiende su punta en la estrella
// interior: a mayor valor, más lejos del centro. El orden fija la posición
// alrededor de la estrella: arriba, arriba-derecha, abajo-derecha,
// abajo-izquierda, arriba-izquierda. Los acentos sí son seguros: el
// unicode-range de P5 Menu/Expose los cae al fallback del stack. Valores
// aproximados y honestos, sin presentarse como datos objetivos.
const STATS = [
  { label: 'PROGRAMACIÓN', value: 4, descriptor: 'DESARROLLO' },
  { label: 'CREATIVIDAD', value: 3, descriptor: 'DISEÑO' },
  { label: 'CARISMA', value: 2, descriptor: 'SOCIAL' },
  { label: 'CURIOSIDAD', value: 5, descriptor: 'INVESTIGACIÓN' },
  { label: 'RESOLUCIÓN', value: 4, descriptor: 'LÓGICA' },
] as const

// Detalle animado junto al dato "Permiso de conducir": motion graphic corto al
// estilo de una tarjeta de menú de Persona 5. El coche entra con un "snap" y
// ejecuta una coreografía en bucle de 4.0 s: IDLE (reposo largo 36%) →
// anticipación (compresión + retroceso) → ACELERACIÓN explosiva (estela roja
// diagonal, marcas de velocidad, partículas) → SALTO (arco airborne) →
// CONGELACIÓN AÉREA (pausa visual breve) → IMPACTO duro (squash + fragmentos
// + líneas + sombra aplastada) → RECOUPERACIÓN con rebote → retorno al idle.
// Al hover reacciona con un destello de estela ("rev"). Las ruedas llevan
// muescas y giran solo durante las fases de movimiento. Con reduced-motion
// las capas de efectos no se dibujan y el coche queda estático y perfectamente
// visible.
function DrivingCar({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion()

  // Las capas de efectos solo tienen sentido si hay movimiento: con
  // reduced-motion se ocultan y el coche queda estático y visible.
  const fx = reduceMotion ? 'hidden' : 'block'

  return (
    <span
      aria-hidden="true"
      className={`group relative block h-8 w-28 md:w-32 ${className}`}
    >
      {/* Carretera: se estira con la aceleración y recibe el golpe del
          aterrizaje */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent/50 ${
          reduceMotion ? '' : 'animate-car-road'
        }`}
      />

      {/* Estelas de velocidad: cortes gráficos afilados que quedan atrás
          (el coche acelera hacia la derecha) */}
      <span
        className={`absolute bottom-[2px] left-[calc(50%_-_40px)] h-[14px] w-[34px] origin-right bg-accent/80 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-trail-a group-hover:animate-car-hover-flash'
        }`}
        style={{ transform: 'skewX(-20deg)' }}
      />
      <span
        className={`absolute bottom-[6px] left-[calc(50%_-_30px)] h-[10px] w-[22px] origin-right bg-accent/60 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-trail-b group-hover:animate-car-hover-flash'
        }`}
        style={{ transform: 'skewX(-24deg)' }}
      />
      <span
        className={`absolute bottom-[12px] left-[calc(50%_-_32px)] h-[2px] w-[18px] origin-right bg-paper/60 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-trail-line'
        }`}
        style={{ transform: 'skewX(-28deg)' }}
      />

      {/* Marcas de velocidad: rasguños finos que pasan hacia atrás */}
      <span
        className={`absolute bottom-[9px] left-[calc(50%_-_26px)] h-[1px] w-[7px] bg-paper/70 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-speed'
        }`}
        style={{ transform: 'skewX(-28deg)' }}
      />
      <span
        className={`absolute bottom-[16px] left-[calc(50%_-_42px)] h-[1px] w-[5px] bg-accent/70 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-speed'
        }`}
        style={{ transform: 'skewX(-28deg)' }}
      />

      {/* Rigger: centra el coche sobre la pista */}
      <span className="absolute bottom-0 left-1/2 -ml-7">
        {/* Entrada: "snap" y asiento de la suspensión (one-shot) */}
        <span className={`block ${reduceMotion ? '' : 'animate-car-enter'}`}>
          {/* Coreografía: idle → aceleración → salto → aterrizaje → idle */}
          <span className={`block ${reduceMotion ? '' : 'animate-car-run'}`}>
            <svg viewBox="0 0 24 12" className="block h-7 w-14">
              <path
                d="M1.5 7.6 Q1.5 6 3.2 5.9 L4.1 5.5 Q5 3.9 6.7 3.5 Q7.5 3.3 8.4 3.2 L13.5 3.2 Q16.4 3.2 18.3 4.6 L20 5.5 Q21 5.7 21.7 6.2 Q22.5 6.6 22.5 7.7 L22.5 8.2 Q22.5 8.6 22.1 8.6 L1.9 8.6 Q1.5 8.6 1.5 8.2 Z"
                className="fill-paper"
              />
              {/* Rueda trasera: las muescas hacen perceptible el giro */}
              <g
                className={reduceMotion ? '' : 'animate-car-wheel'}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <circle cx="5.4" cy="9" r="1.9" className="fill-accent" />
                <circle cx="5.4" cy="8.2" r="0.45" className="fill-paper" />
                <circle cx="5.4" cy="9.8" r="0.45" className="fill-paper" />
              </g>
              {/* Rueda delantera */}
              <g
                className={reduceMotion ? '' : 'animate-car-wheel'}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <circle cx="18.6" cy="9" r="1.9" className="fill-accent" />
                <circle cx="18.6" cy="8.2" r="0.45" className="fill-paper" />
                <circle cx="18.6" cy="9.8" r="0.45" className="fill-paper" />
              </g>
            </svg>
          </span>
        </span>
      </span>

      {/* Sombra del coche sobre la pista: encoge en el aire y se aplasta
          al aterrizar */}
      <span
        className={`absolute bottom-[2px] left-1/2 -ml-6 h-[5px] w-12 rounded-full bg-accent/25 opacity-0 blur-[1px] ${
          reduceMotion ? '' : 'animate-car-shadow'
        }`}
      />

      {/* Partículas angulares de la aceleración */}
      <span
        className={`absolute bottom-[4px] left-[calc(50%_-_16px)] h-[3px] w-[3px] bg-accent opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-particle'
        }`}
        style={{ '--px': '-14px', '--py': '9px' } as CSSProperties}
      />
      <span
        className={`absolute bottom-[10px] left-[calc(50%_-_8px)] h-[3px] w-[3px] bg-accent/80 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-particle'
        }`}
        style={{ '--px': '-10px', '--py': '13px' } as CSSProperties}
      />
      <span
        className={`absolute bottom-[2px] left-[calc(50%_-_20px)] h-[3px] w-[3px] bg-accent/90 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-particle'
        }`}
        style={{ '--px': '-16px', '--py': '6px' } as CSSProperties}
      />

      {/* Fragmentos del impacto del aterrizaje */}
      <span
        className={`absolute bottom-[3px] left-[calc(50%_+_2px)] h-[4px] w-[4px] bg-accent opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-impact'
        }`}
        style={{ '--ix': '-8px', '--iy': '-10px' } as CSSProperties}
      />
      <span
        className={`absolute bottom-[3px] left-[calc(50%_+_2px)] h-[4px] w-[4px] bg-paper opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-impact'
        }`}
        style={{ '--ix': '9px', '--iy': '-7px' } as CSSProperties}
      />
      <span
        className={`absolute bottom-[3px] left-[calc(50%_+_2px)] h-[4px] w-[4px] bg-accent/90 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-impact'
        }`}
        style={{ '--ix': '-4px', '--iy': '-14px' } as CSSProperties}
      />
      <span
        className={`absolute bottom-[3px] left-[calc(50%_+_18px)] h-[4px] w-[4px] bg-accent opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-impact'
        }`}
        style={{ '--ix': '6px', '--iy': '-9px' } as CSSProperties}
      />

      {/* Líneas de impacto junto a las ruedas al aterrizar */}
      <span
        className={`absolute bottom-[2px] left-[calc(50%_-_4px)] h-[10px] w-[2px] bg-paper/80 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-impact-line'
        }`}
        style={{ transform: 'skewX(-22deg)' }}
      />
      <span
        className={`absolute bottom-[2px] left-[calc(50%_+_30px)] h-[8px] w-[2px] bg-accent/80 opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-impact-line'
        }`}
        style={{ transform: 'skewX(-22deg)' }}
      />

      {/* Marcador rojo de P5 que destella tras el aterrizaje */}
      <span
        className={`absolute bottom-[26px] left-[calc(50%_+_8px)] h-[6px] w-[6px] bg-accent opacity-0 ${fx} ${
          reduceMotion ? '' : 'animate-car-marker'
        }`}
      />
    </span>
  )
}

// Posiciones fijas de las etiquetas en las esquinas, fuera del área de la
// estrella, y sus inclinaciones suaves (casi horizontales).
const LABEL_POSITIONS = [
  { left: 50, top: 2 },
  { left: 90, top: 30 },
  { left: 90, top: 88 },
  { left: 10, top: 88 },
  { left: 10, top: 30 },
]
const LABEL_ROTATIONS = [0, -2, 2, -2, 1]

/** Hueco del retrato recortado en ángulo. Sin avatar → placeholder. */
function PortraitSlot() {
  const { avatar } = profile.about
  const CUTOUT = '[clip-path:polygon(10%_0,100%_0,100%_82%,86%_100%,0_100%,0_14%)]'
  return (
    <div className={`${CUTOUT} bg-paper p-[3px]`}>
      <div className={`${CUTOUT} aspect-[3/4] overflow-hidden bg-bg-content-alt`}>
        {avatar ? (
          <img
            src={avatar.src}
            alt={avatar.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative h-full w-full">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-stripes-faint opacity-60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 top-1/4 block h-3/5 w-14 bg-halftone-red opacity-25 [transform:rotate(14deg)]"
            />
            <span className="absolute right-3 top-3 flex items-center gap-1.5 bg-accent px-2 py-1 text-label font-medium uppercase tracking-[0.2em] text-paper">
              <DiamondMarker size={5} />
              No data
            </span>
            <div className="relative flex h-full flex-col items-center justify-center gap-4">
              <svg
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="h-24 w-24 opacity-30"
                fill="none"
                stroke="var(--color-paper)"
                strokeWidth="2"
              >
                <polygon points="50,5 61,38 96,38 68,59 79,92 50,71 21,92 32,59 4,38 39,38" />
              </svg>
              <span className="font-hand text-2xl leading-none text-paper/50">
                Retrato pendiente
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatStar() {
  return (
    <div className="relative mx-auto w-full max-w-[42rem] px-4 pt-8 pb-4">
      <div className="relative aspect-square">
        <SocialStar className="absolute inset-0 h-full w-full [transform:rotate(2deg)]" />

        {STATS.map(({ label, value, descriptor }, i) => {
          const pos = LABEL_POSITIONS[i]
          return (
            <div
              key={label}
              className="absolute"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: `translate(-50%,-50%) rotate(${LABEL_ROTATIONS[i]}deg)`,
              }}
            >
              <StatTag label={label} rank={value} descriptor={descriptor} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function About() {
  const { about, hero, branding } = profile

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative overflow-hidden px-6 pb-28 pt-16 md:px-12 md:pt-20">
        {/* Fondo: estrellas de contorno sutiles (mismo patrón que el inventario) */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars opacity-70" />

        {/* Starbackground: textura atmosférica sutil detrás de la composición.
            Sesgada a la derecha (zona de estadísticas), con máscara que
            desvanece hacia la izquierda para no competir con la tarjeta
            de perfil. Opacidad baja para mantener la legibilidad. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-full w-[70%] opacity-[0.14]"
          style={{
            backgroundImage: 'url(/portfolio/images/background/starbackground.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to right, transparent 0%, black 35%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%, black 100%)',
          }}
        />

        {/* Palabra fantasma de marca */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-2 z-0 -rotate-6 select-none font-p5-menu uppercase leading-none text-outline-faint opacity-55"
          style={{ fontSize: 'clamp(7rem, 15vw, 14rem)' }}
        >
          PERFIL
        </span>

        <div className="relative mx-auto max-w-6xl">
          {/* Título de perfil (mismo tratamiento que INVENTARIO) */}
          <Reveal>
            <SectionTitle title="PERFIL" persona />
          </Reveal>

          <div className="mt-10 grid items-start gap-16 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-10 xl:gap-16">
            {/* ===== Columna izquierda: identidad ===== */}
            <Reveal>
              <div className="relative">
                <Annotation
                  tone="paper"
                  className="absolute -left-2 top-4 z-30 -rotate-3"
                >
                  {branding.system}
                </Annotation>

                <div className="relative z-10 mx-auto w-[min(21rem,92%)] -rotate-2">
                  <PortraitSlot />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -top-3 z-10 h-7 w-7"
                  >
                    <span className="absolute right-0 top-0 h-[2px] w-7 bg-accent" />
                    <span className="absolute right-0 top-0 h-7 w-[2px] bg-accent" />
                  </span>
                </div>

                {/* Nombre de identidad solapado sobre el retrato */}
                <div className="relative z-20 -mt-14 pl-2 lg:-mt-20 lg:pl-4">
                  <h1
                    className="font-display uppercase leading-[0.95]"
                    style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)' }}
                  >
                    <span
                      className="block"
                      style={{ textShadow: OUTLINE_BLACK, transform: 'rotate(-1.5deg)' }}
                    >
                      {nameLine1}
                    </span>
                    <span
                      className="block"
                      style={{
                        textShadow: OUTLINE_RED,
                        transform: 'rotate(1.2deg) translateX(22px)',
                        marginTop: 4,
                      }}
                    >
                      {nameLine2}
                    </span>
                    <span className="block" style={{ marginTop: 8 }}>
                      <span
                        className="inline-block bg-accent px-5 pb-[5px] pt-[3px] text-ink [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"
                        style={{ transform: 'skew(-6deg) rotate(-1deg)' }}
                      >
                        {nameLine3}
                      </span>
                    </span>
                  </h1>
                </div>

                {/* Pegatina de rol + credencial (DAM vive aquí, no en el footer) */}
                <div className="relative z-30 mt-4 flex flex-wrap items-center justify-end gap-2 pr-2">
                  <Tag font="sans" className="rotate-1">{hero.eyebrow}</Tag>
                  <Tag font="sans" tone="dark" className="rotate-1">
                    {hero.credentialLine}
                  </Tag>
                </div>
              </div>
            </Reveal>

            {/* ===== Columna derecha: Social Stats (pieza central) ===== */}
            <div className="relative">
              {/* Panel de fondo de la composición: textura de estrellas en
                  gris oscuro (sin rojo) que tapa las estrellas rojas del
                  fondo de página dentro de esta zona. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 bg-bg-hero bg-stars-charcoal opacity-80"
              />
              <Reveal delay={0.1}>
                <div className="relative">
                  <Tag font="sans" className="absolute right-2 top-0 z-10 -rotate-3">
                    Estadísticas sociales
                  </Tag>
                  <StatStar />
                </div>
              </Reveal>
            </div>
          </div>

          {/* ===== Contenido: Bio ===== */}
          <Reveal delay={0.16}>
            <div className="mt-14 lg:mt-16">
              <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                <DiamondMarker size={6} />
                Bio
              </h2>
              <p className="mt-4 max-w-2xl text-body leading-relaxed text-paper/75">
                {about.bio}
              </p>
            </div>
          </Reveal>

          {/* ===== Habilidades (menú de juego) ===== */}
          <SkillMenuSection
            skills={about.skills}
            languages={about.languages}
            interests={about.interests}
          />

          {/* ===== Permiso de conducir ===== */}
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-col">
              <p className="flex items-center gap-2 text-caption uppercase tracking-[0.2em] text-paper/50">
                <DiamondMarker size={5} />
                {about.license}
              </p>
              <DrivingCar className="mt-2 ml-[13px]" />
            </div>
          </Reveal>
        </div>
      </section>
    </Screen>
  )
}
