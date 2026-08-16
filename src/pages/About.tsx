import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { Annotation } from '../components/primitives/Annotation'
import { SectionTitle } from '../components/ui/SectionTitle'
import { Tag } from '../components/ui/Tag'
import { StatTag } from '../components/ui/StatTag'
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
// unicode-range de P5 Menu/Expose los cae al fallback del stack.
const STATS = [
  { label: 'PROGRAMACIÓN', value: 5, descriptor: 'DESARROLLO' },
  { label: 'CREATIVIDAD', value: 4, descriptor: 'DISEÑO' },
  { label: 'CARISMA', value: 2, descriptor: 'SOCIAL' },
  { label: 'CURIOSIDAD', value: 3, descriptor: 'INVESTIGACIÓN' },
  { label: 'RESOLUCIÓN', value: 4, descriptor: 'LÓGICA' },
] as const

// Geometría de la estrella de Social Stats de P5. La estrella exterior es una
// silueta decorativa regular de cinco puntas. La estrella interior es la forma
// de estadísticas: sus cinco puntas se extienden de forma independiente según
// el valor de cada atributo, creando una silueta irregular y asimétrica.
const STAR_CX = 160
const STAR_CY = 160

// Puntas de la estrella decorativa al 65% del radio del contenedor, dejando
// espacio libre alrededor para las etiquetas.
const OUTER_TIP = 104
const OUTER_VALLEY = 44

// Puntas del polígono de estadísticas: como máximo el 80% de la punta exterior.
const INNER_TIP_MAX = OUTER_TIP * 0.8
// Valles interiores: 42% de la media de las puntas adyacentes.
const INNER_VALLEY_RATIO = 0.42

const shapePoints = (tips: number[], valleys: number[]): string => {
  const pts: string[] = []
  for (let i = 0; i < 5; i += 1) {
    const a = ((-90 + i * 72) * Math.PI) / 180
    const b = ((-54 + i * 72) * Math.PI) / 180
    pts.push(
      `${(STAR_CX + tips[i] * Math.cos(a)).toFixed(1)},${(STAR_CY + tips[i] * Math.sin(a)).toFixed(1)}`,
      `${(STAR_CX + valleys[i] * Math.cos(b)).toFixed(1)},${(STAR_CY + valleys[i] * Math.sin(b)).toFixed(1)}`,
    )
  }
  return pts.join(' ')
}

// Silueta decorativa: estrella regular de cinco puntas.
const OUTER_STAR = shapePoints(
  [OUTER_TIP, OUTER_TIP, OUTER_TIP, OUTER_TIP, OUTER_TIP],
  [OUTER_VALLEY, OUTER_VALLEY, OUTER_VALLEY, OUTER_VALLEY, OUTER_VALLEY],
)

// Polígono de estadísticas: puntas según el valor de cada atributo.
const statTips = STATS.map(({ value }) => (value / 5) * INNER_TIP_MAX)
const statValleys = statTips.map(
  (tip, i) => INNER_VALLEY_RATIO * ((tip + statTips[(i + 1) % 5]) / 2),
)
const INNER_STAR = shapePoints(statTips, statValleys)

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

/** Estrella de Social Stats de Persona 5: silueta decorativa regular de cinco
    puntas con un único degradado radial plano (centro claro → borde oro oscuro)
    que enmarca un polígono de estadísticas irregular amarillo plano cuyas
    puntas se extienden según el valor de cada atributo. Sin extrusiones, sin
    caras en dos tonos, sin brillos ni forma de radar. */
function StatStar() {
  return (
    <div className="relative mx-auto w-full max-w-[42rem] px-4 pt-8 pb-4">
      <div className="relative aspect-square">
        <svg
          viewBox="0 0 320 320"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full [transform:rotate(2deg)]"
        >
          <defs>
            {/* Oro plano de la silueta: degradado radial con centro claro y
                borde oro/naranja más oscuro (rendering plano, sin caras). */}
            <radialGradient id="stat-star-gold" cx="50%" cy="50%" r="68%">
              <stop offset="0%" stopColor="#ffd84d" />
              <stop offset="55%" stopColor="#ffa600" />
              <stop offset="100%" stopColor="#e68c00" />
            </radialGradient>
          </defs>

          {/* Silueta exterior: oro con degradado radial plano */}
          <polygon
            points={OUTER_STAR}
            fill="url(#stat-star-gold)"
            stroke="#111111"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Polígono de estadísticas: amarillo plano */}
          <polygon
            points={INNER_STAR}
            fill="#FEC802"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

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

// Inclinaciones suaves y alternadas para las etiquetas de intereses/tecnologías.
const CHIP_ROTATIONS = ['-rotate-1', 'rotate-1']

export function About() {
  const { about, hero, branding } = profile

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative overflow-hidden px-6 pb-28 pt-16 md:px-12 md:pt-20">
        {/* Fondo: estrellas de contorno sutiles (mismo patrón que el inventario) */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars opacity-70" />

        {/* Palabra fantasma de marca */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-2 z-0 -rotate-6 select-none font-expose uppercase leading-none text-outline-faint opacity-55"
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
                  <Tag className="rotate-1">{hero.eyebrow}</Tag>
                  <Tag tone="dark" className="rotate-1">
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
                  <Tag className="absolute right-2 top-0 z-10 -rotate-3">
                    Estadísticas sociales
                  </Tag>
                  <StatStar />
                </div>
              </Reveal>
            </div>
          </div>

          {/* ===== Contenido: Bio / Intereses / Tecnologías ===== */}
          <Reveal delay={0.16}>
            <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.96fr)_minmax(0,0.96fr)]">
              <div>
                <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                  <DiamondMarker size={6} />
                  Bio
                </h2>
                <p className="mt-4 max-w-md text-body leading-relaxed text-paper/75">
                  {about.bio}
                </p>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                  <DiamondMarker size={6} />
                  Intereses
                </h2>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-4" aria-label="Intereses personales">
                  {about.interests.map((interest, index) => (
                    <li
                      key={interest}
                      className={CHIP_ROTATIONS[index % CHIP_ROTATIONS.length]}
                    >
                      <Tag tone={index % 2 === 0 ? 'red' : 'dark'}>{interest}</Tag>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                  <DiamondMarker size={6} />
                  Tecnologías
                </h2>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-4" aria-label="Tecnologías y lenguajes">
                  {about.techSkills.map((skill, index) => (
                    <li
                      key={skill}
                      className={CHIP_ROTATIONS[index % CHIP_ROTATIONS.length]}
                    >
                      <Tag tone={index % 2 === 0 ? 'dark' : 'red'}>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Screen>
  )
}
