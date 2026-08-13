import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/primitives/Reveal'
import { Screen } from '../components/transition/Screen'
import { DiamondMarker } from '../components/shared/DiamondMarker'
import { Annotation } from '../components/primitives/Annotation'
import { profile } from '../data/profile'

// Nombre en tres bloques (mismo tratamiento tipográfico que el hero).
const nameParts = profile.name.trim().split(/\s+/)
const nameLine1 = nameParts[0] ?? ''
const nameLine2 = nameParts[1] ?? ''
const nameLine3 = nameParts.slice(2).join(' ')

const OUTLINE_BLACK = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero), -3px -3px 0 var(--color-bg-hero), 3px 3px 0 var(--color-bg-hero)`
const OUTLINE_RED = `-2px -2px 0 var(--color-accent), 2px -2px 0 var(--color-accent), -2px 2px 0 var(--color-accent), 2px 2px 0 var(--color-accent), -3px -3px 0 var(--color-accent), 3px 3px 0 var(--color-accent)`

// Atributos sociales del personaje. Niveles de diseño de la pantalla
// (no son datos personales presentados como reales).
const STATS = [
  { label: 'PROGRAMACIÓN', level: 5 },
  { label: 'CREATIVIDAD', level: 4 },
  { label: 'CARISMA', level: 2 },
  { label: 'CURIOSIDAD', level: 4 },
  { label: 'RESOLUCIÓN', level: 3 },
] as const

// Geometría de la estrella de atributos (Social Stats de P5): recorte
// irregular "a mano" (jitter de ángulo + radios base variables por punta).
const STAR_CX = 160
const STAR_CY = 160
const STAR_BASE_OUTER = [104, 100, 106, 102, 98]
const STAR_BASE_INNER = [46, 42, 48, 44, 46]
const STAR_JITTER_OUT = [-1.8, 2.4, -2.2, 1.8, -1.4]
const STAR_JITTER_IN = [1.2, -1.6, 2.0, -1.2, 1.8]

const starPoint = (i: number, radius: number): [number, number] => {
  const a = ((-90 + i * 72 + STAR_JITTER_OUT[i]) * Math.PI) / 180
  return [STAR_CX + radius * Math.cos(a), STAR_CY + radius * Math.sin(a)]
}
const valleyPoint = (i: number, radius: number): [number, number] => {
  const a = ((-54 + i * 72 + STAR_JITTER_IN[i]) * Math.PI) / 180
  return [STAR_CX + radius * Math.cos(a), STAR_CY + radius * Math.sin(a)]
}
const fmt = (p: [number, number]) => p.map((n) => n.toFixed(1)).join(',')

// Dirección y giro de las etiquetas radiales (sin invertirse al fondo).
const statAngle = (i: number) => -90 + i * 72
const statRad = (i: number) => (statAngle(i) * Math.PI) / 180
const LABEL_ROTATIONS = [0, -18, 54, -54, 18]

/** Etiqueta pegatina angular recortada (estilo pegatinas del menú). */
function Sticker({
  children,
  className = '',
  tone = 'red',
}: {
  children: ReactNode
  className?: string
  tone?: 'red' | 'gold' | 'paper'
}) {
  const toneClass = {
    red: 'bg-accent text-paper',
    gold: 'bg-gold text-ink',
    paper: 'bg-paper text-ink',
  }[tone]
  return (
    <span
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 font-display text-sm uppercase tracking-[0.15em] [clip-path:polygon(8px_0,100%_0,calc(100%_-_8px)_100%,0_100%)] ${toneClass} ${className}`}
    >
      {children}
    </span>
  )
}

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

/** Estrella de atributos sociales (estilo Social Stats de Persona 5):
    irregular, recortada a mano, facetada y con siluetas negras detrás.
    La longitud de cada punta codifica el nivel del atributo. */
function StatStar() {
  const { hero } = profile
  const levels = STATS.map((s) => s.level)

  const outerR = STAR_BASE_OUTER.map((r, i) => r * (levels[i] / 5))
  const innerR = STAR_BASE_INNER.map((r, i) => {
    const avg = (levels[i] + levels[(i + 1) % 5]) / 2 / 5
    return r * Math.max(0.7, avg)
  })
  const tips = outerR.map((r, i) => starPoint(i, r))
  const valleys = innerR.map((r, i) => valleyPoint(i, r))
  const knees = outerR.map((r, i) => starPoint(i, r * 0.44))

  const outline = STATS.map((_, i) => `${fmt(tips[i])} ${fmt(valleys[i])}`).join(' ')
  const leftFace = (i: number) =>
    `${fmt(tips[i])} ${fmt(valleys[(i + 4) % 5])} ${fmt(knees[i])}`
  const rightFace = (i: number) =>
    `${fmt(tips[i])} ${fmt(knees[i])} ${fmt(valleys[i])}`
  const core = STATS.map((_, i) => `${fmt(knees[i])} ${fmt(valleys[i])}`).join(' ')

  return (
    <div className="relative mx-auto w-full max-w-[24rem] px-8 pt-9 pb-12">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-3 text-caption uppercase tracking-[0.22em] text-paper/35"
      >
        {hero.coordinates}
      </span>

      <div className="relative aspect-square">
        <svg
          viewBox="0 0 320 320"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full [transform:rotate(2deg)]"
        >
          {/* Silueta negra desplazada (sombra dura recortada) */}
          <g transform="translate(13 15)">
            <polygon points={outline} fill="#000000" strokeLinejoin="round" />
          </g>
          {/* Silueta naranja oscura (profundidad intermedia) */}
          <g transform="translate(6 7)">
            <polygon points={outline} fill="#CC7A00" />
          </g>
          {/* Facetas de la estrella */}
          <g>
            {STATS.map((_, i) => (
              <polygon key={`f${i}`} points={leftFace(i)} fill="#FFB800" />
            ))}
            {STATS.map((_, i) => (
              <polygon key={`s${i}`} points={rightFace(i)} fill="#E89A00" />
            ))}
            <polygon points={core} fill="#CC7A00" />
            <polygon
              points={outline}
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {STATS.map((s, i) => {
          const left = 50 + 42 * Math.cos(statRad(i))
          const top = 50 + 42 * Math.sin(statRad(i))
          return (
            <div
              key={s.label}
              className="absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%,-50%) rotate(${LABEL_ROTATIONS[i]}deg)`,
              }}
            >
              <P5Label>{s.label}</P5Label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Etiqueta amarilla recortada con respaldo negro (estilo Social Stats de P5).
const LABEL_CLIP = '[clip-path:polygon(5px_0,100%_0,calc(100%_-_5px)_100%,0_100%)]'

/** Etiqueta de atributo/etiqueta amarilla P5: fondo negro desplazado,
    amarillo #FFD400 y texto en P5 Menu. Solo el nombre, sin números. */
function P5Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-x-[2.5px] translate-y-[3px] bg-black ${LABEL_CLIP}`}
      />
      <span
        className={`relative inline-flex items-center bg-[#FFD400] px-3 py-1 text-black ${LABEL_CLIP}`}
      >
        <span className="font-p5-menu text-sm uppercase leading-none">{children}</span>
      </span>
    </span>
  )
}

// Inclinaciones alternadas para las etiquetas de intereses/tecnologías.
const CHIP_ROTATIONS = ['rotate-2', '-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0', '-rotate-2']

export function About() {
  const { about, hero, branding } = profile

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative overflow-hidden px-6 pb-28 pt-16 md:px-12 md:pt-20">
        {/* Fondo: estrellas de contorno sutiles (mismo patrón que el inventario) */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars" />

        {/* Palabra fantasma de marca */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-2 z-0 -rotate-6 select-none font-expose uppercase leading-none text-outline-faint opacity-70"
          style={{ fontSize: 'clamp(7rem, 15vw, 14rem)' }}
        >
          PERFIL
        </span>

        {/* Corchetes de retícula HUD en las esquinas del contenido */}
        <span aria-hidden="true" className="pointer-events-none absolute left-6 top-14 z-0 h-6 w-6">
          <span className="absolute left-0 top-0 h-[2px] w-6 bg-accent/60" />
          <span className="absolute left-0 top-0 h-6 w-[2px] bg-accent/60" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute right-6 top-14 z-0 h-6 w-6">
          <span className="absolute right-0 top-0 h-[2px] w-6 bg-accent/60" />
          <span className="absolute right-0 top-0 h-6 w-[2px] bg-accent/60" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-6 left-6 z-0 h-6 w-6">
          <span className="absolute bottom-0 left-0 h-[2px] w-6 bg-accent/60" />
          <span className="absolute bottom-0 left-0 h-6 w-[2px] bg-accent/60" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 z-0 h-6 w-6">
          <span className="absolute bottom-0 right-0 h-[2px] w-6 bg-accent/60" />
          <span className="absolute bottom-0 right-0 h-6 w-[2px] bg-accent/60" />
        </span>

        <div className="relative mx-auto max-w-6xl">
          {/* Barra superior de perfil */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Sticker className="-rotate-2">Profile</Sticker>
              <span className="text-label uppercase tracking-[0.25em] text-paper/45">
                {branding.system} · {hero.region}
              </span>
            </div>
          </Reveal>

          <div className="mt-10 grid items-start gap-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 xl:gap-16">
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

                {/* Pegatina de rol */}
                <div className="relative z-30 mt-4 flex justify-end pr-2">
                  <Sticker className="rotate-1">{hero.eyebrow}</Sticker>
                </div>
              </div>
            </Reveal>

            {/* ===== Columna derecha: radar + datos ===== */}
            <div className="relative">
              <Reveal delay={0.1}>
                <div className="relative">
                  <Sticker tone="gold" className="absolute right-2 top-0 z-10 -rotate-3">
                    Social stats
                  </Sticker>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-8 z-0 h-40 w-10 bg-stripes-red opacity-40 [transform:rotate(18deg)]"
                  />
                  <StatStar />
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-2 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
                  <div>
                    <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                      <DiamondMarker size={6} />
                      Bio
                    </h2>
                    <p className="mt-3 max-w-md text-body leading-relaxed text-paper/75">
                      {about.bio}
                    </p>
                  </div>

                  <div className="flex flex-col gap-7">
                    <div>
                      <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                        <DiamondMarker size={6} />
                        Intereses
                      </h2>
                      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-5" aria-label="Intereses personales">
                        {about.interests.map((interest, index) => (
                          <li
                            key={interest}
                            className={CHIP_ROTATIONS[index % CHIP_ROTATIONS.length]}
                          >
                            <P5Label>{interest}</P5Label>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                        <DiamondMarker size={6} />
                        Tecnologías
                      </h2>
                      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-5" aria-label="Tecnologías y lenguajes">
                        {about.techSkills.map((skill, index) => (
                          <li
                            key={skill}
                            className={CHIP_ROTATIONS[index % CHIP_ROTATIONS.length]}
                          >
                            <P5Label>{skill}</P5Label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-paper/15 pt-6">
                  <Link
                    to="/"
                    className="group inline-flex items-center gap-3 border-2 border-paper/60 bg-bg-content-alt px-6 py-3 font-display text-base uppercase tracking-[0.15em] text-paper [clip-path:polygon(10px_0,100%_0,calc(100%_-_10px)_100%,0_100%)] transition-colors duration-200 hover:border-accent hover:bg-accent"
                  >
                    <span
                      aria-hidden="true"
                      className="text-accent transition-colors duration-200 group-hover:text-paper"
                    >
                      ◀
                    </span>
                    Volver al menú
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </Screen>
  )
}
