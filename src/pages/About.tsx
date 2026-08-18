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

// Nombre en tres bloques (mismo tratamiento tipografico que el hero).
const nameParts = profile.name.trim().split(/\s+/)
const nameLine1 = nameParts[0] ?? ''
const nameLine2 = nameParts[1] ?? ''
const nameLine3 = nameParts.slice(2).join(' ')

const OUTLINE_BLACK = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero), -3px -3px 0 var(--color-bg-hero), 3px 3px 0 var(--color-bg-hero)`
const OUTLINE_RED = `-2px -2px 0 var(--color-accent), 2px -2px 0 var(--color-accent), -2px 2px 0 var(--color-accent), 2px 2px 0 var(--color-accent), -3px -3px 0 var(--color-accent), 3px 3px 0 var(--color-accent)`

// Atributos sociales del personaje (Social Stats de P5). Cada atributo tiene
// su propio valor (1-5) que decide cuanto se extiende su punta en la estrella
// interior: a mayor valor, mas lejos del centro. El orden fija la posicion
// alrededor de la estrella: arriba, arriba-derecha, abajo-derecha,
// abajo-izquierda, arriba-izquierda. Los acentos si son seguros: el
// unicode-range de P5 Menu/Expose los cae al fallback del stack. Valores
// aproximados y honestos, sin presentarse como datos objetivos.
const STATS = [
  { label: 'PROGRAMACIoN', value: 4, descriptor: 'DESARROLLO' },
  { label: 'CREATIVIDAD', value: 3, descriptor: 'DISEÑO' },
  { label: 'CARISMA', value: 3, descriptor: 'SOCIAL' },
  { label: 'CURIOSIDAD', value: 5, descriptor: 'INVESTIGACIoN' },
  { label: 'RESOLUCIoN', value: 4, descriptor: 'LoGICA' },
] as const

// Detalle animado junto al dato "Permiso de conducir": motion graphic corto al
// estilo de una tarjeta de menu de Persona 5. El coche entra con un "snap" y
// ejecuta una coreografia en bucle de 4.0 s: IDLE (reposo largo 36%) →
// anticipacion (compresion + retroceso) → ACELERACIoN explosiva (estela roja
// diagonal, marcas de velocidad, particulas) → SALTO (arco airborne) →
// CONGELACIoN AeREA (pausa visual breve) → IMPACTO duro (squash + fragmentos
// + lineas + sombra aplastada) → RECOUPERACIoN con rebote → retorno al idle.
// Al hover reacciona con un destello de estela ("rev"). Las ruedas llevan
// muescas y giran solo durante las fases de movimiento. Con reduced-motion
// las capas de efectos no se dibujan y el coche queda estatico y perfectamente
// visible.
function DrivingCar({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const fx = reduceMotion ? 'hidden' : 'block'

  return (
    <span
      aria-hidden="true"
      className={`relative block h-16 w-full overflow-hidden ${className}`}
    >
      {/* Carretera: linea roja fija */}
      <span className="absolute bottom-3 left-0 h-[2px] w-full bg-accent/40" />

      {/* Marcas de carretera: guiones que se mueven en direccion opuesta */}
      <span
        className={`absolute bottom-1 left-0 h-[6px] w-full ${fx}`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 12px, transparent 12px, transparent 28px)',
          backgroundSize: '28px 6px',
          opacity: 0.15,
          animation: reduceMotion ? 'none' : 'var(--animate-car-road-markings)',
        }}
      />

      {/* Grupo del coche — cruza la pantalla de izquierda a derecha */}
      <span
        className={`absolute bottom-3 left-0 ${
          reduceMotion ? '' : 'animate-car-cross'
        }`}
      >
        {/* Suspension: micro-rebote vertical */}
        <span
          className={`block ${
            reduceMotion ? '' : 'animate-car-bounce'
          }`}
        >
          {/* Tilt + estela + SVG */}
          <span
            className={`flex items-end ${
              reduceMotion ? '' : 'animate-car-tilt'
            }`}
          >
            {/* Estela de velocidad: 3 lineas rojas/negras */}
            <span
              className={`relative mr-[-2px] flex flex-col justify-center gap-[3px] ${fx}`}
            >
              <span
                className="block h-[2px] w-8 bg-accent/70"
                style={{ transform: 'skewX(-20deg)' }}
              />
              <span
                className="block h-[1.5px] w-5 bg-accent/50"
                style={{ transform: 'skewX(-24deg)' }}
              />
              <span
                className="block h-[1px] w-3 bg-paper/40"
                style={{ transform: 'skewX(-28deg)' }}
              />
            </span>

            {/* Coche SVG: silueta angular estilo P5 */}
            <svg viewBox="0 0 100 40" className="block h-12 w-auto">
              {/* Carroceria: silueta angular de compacto deportivo */}
              <path
                d="M6 27 L9 27 L11 25 L14 26 L16 25 L18 21 L25 16 L27 14 L38 14 L41 13
                   L60 13 L64 14 L70 14 L75 17 L78 14 L82 14 L86 16 L88 20 L90 24 L93 26
                   L95 27 L95 29 L78 29 L78 25 Q74 20 70 25 L32 25 Q28 20 24 25 L6 25 Z"
                className="fill-paper"
              />
              {/* Ventana trasera: angular, recortada */}
              <path
                d="M28 16 L33 13 L44 13 L44 16 Z"
                style={{ fill: 'var(--color-bg-hero)', opacity: 0.85 }}
              />
              {/* Ventana delantera: mayor, mas inclinada */}
              <path
                d="M46 16 L56 13 L70 13 L72 16 Z"
                style={{ fill: 'var(--color-bg-hero)', opacity: 0.85 }}
              />
              {/* Parabrisas: division A-pillar */}
              <path
                d="M44 16 L46 16 L46 13 L44 13 Z"
                style={{ fill: 'var(--color-paper)' }}
              />
              {/* Detalle angular bajo la ventana — corte P5 */}
              <path
                d="M30 20 L72 20 L72 21 L30 21 Z"
                className="fill-bg-hero opacity-15"
              />
              {/* Linea de caracter afilada en el costado */}
              <path
                d="M18 24 L88 24 L88 24.5 L18 24.5 Z"
                className="fill-accent"
              />
              {/* Rueda trasera */}
              <g
                className={
                  reduceMotion ? '' : 'animate-car-wheel'
                }
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              >
                <circle cx="24" cy="31" r="6" className="fill-accent" />
                <circle cx="24" cy="31" r="2.5" className="fill-paper" />
                <circle cx="24" cy="28" r="1" className="fill-paper" />
                <circle cx="24" cy="34" r="1" className="fill-paper" />
              </g>
              {/* Rueda delantera */}
              <g
                className={
                  reduceMotion ? '' : 'animate-car-wheel'
                }
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              >
                <circle cx="76" cy="31" r="6" className="fill-accent" />
                <circle cx="76" cy="31" r="2.5" className="fill-paper" />
                <circle cx="76" cy="28" r="1" className="fill-paper" />
                <circle cx="76" cy="34" r="1" className="fill-paper" />
              </g>
            </svg>
          </span>
        </span>
      </span>
    </span>
  )
}

// Posiciones fijas de las etiquetas en las esquinas, fuera del area de la
// estrella, y sus inclinaciones suaves (casi horizontales).
const LABEL_POSITIONS = [
  { left: 50, top: 2 },
  { left: 90, top: 30 },
  { left: 90, top: 88 },
  { left: 10, top: 88 },
  { left: 10, top: 30 },
]
const LABEL_ROTATIONS = [0, -2, 2, -2, 1]

/** Hueco del retrato recortado en angulo. Sin avatar → placeholder. */
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
        {/* Fondo: estrellas de contorno sutiles (mismo patron que el inventario) */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars opacity-70" />

        {/* Starbackground: textura atmosferica sutil detras de la composicion.
            Sesgada a la derecha (zona de estadisticas), con mascara que
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
          {/* Titulo de perfil (mismo tratamiento que INVENTARIO) */}
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

                {/* Pegatina de rol + credencial (DAM vive aqui, no en el footer) */}
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
              {/* Panel de fondo de la composicion: textura de estrellas en
                  gris oscuro (sin rojo) que tapa las estrellas rojas del
                  fondo de pagina dentro de esta zona. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 bg-bg-hero bg-stars-charcoal opacity-80"
              />
              <Reveal delay={0.1}>
                <div className="relative">
                  <Tag font="sans" className="absolute right-2 top-0 z-10 -rotate-3">
                    Estadisticas sociales
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

          {/* ===== Habilidades (menu de juego) ===== */}
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
