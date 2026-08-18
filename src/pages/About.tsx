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
      className={`relative block h-24 w-full overflow-hidden ${className}`}
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
                className="block h-[2px] w-10 bg-accent/70"
                style={{ transform: 'skewX(-20deg)' }}
              />
              <span
                className="block h-[1.5px] w-6 bg-accent/50"
                style={{ transform: 'skewX(-24deg)' }}
              />
              <span
                className="block h-[1px] w-4 bg-paper/40"
                style={{ transform: 'skewX(-28deg)' }}
              />
            </span>

            {/* Coche SVG: silueta potrace integrada, scaleX(-1) para que encare a la derecha */}
            <svg
              viewBox="0 80 400 410"
              preserveAspectRatio="xMidYMid meet"
              className="block h-20 w-auto"
              style={{ transform: 'scaleX(-1)' }}
            >
              <g transform="translate(0,640) scale(0.1,-0.1)" fill="none" stroke="none">
                {/* Carroceria: silueta potrace (outline de ambos coches, recortada por viewBox a solo Car 1) */}
                <path
                  d="M3565 5336 c-106 -30 -101 -26 -108 -111 -4 -42 -9 -80 -12 -85 -6 -10 -246 -105 -590 -234 -448 -167 -1052 -415 -1173 -483 -78 -43 -193 -91 -250 -104 -23 -5 -98 -14 -165 -19 -67 -6 -167 -19 -222 -30 -154 -31 -340 -49 -563 -57 l-203 -6 -43 -66 c-59 -91 -60 -95 -26 -130 37 -37 38 -65 3 -150 -25 -62 -27 -78 -31 -256 l-4 -190 -38 -32 c-91 -78 -133 -209 -134 -418 0 -194 11 -396 26 -482 13 -71 14 -74 72 -122 69 -58 130 -129 158 -184 64 -126 534 -211 1384 -250 l92 -4 -6 119 c-6 142 8 256 49 383 112 352 394 622 756 722 90 26 112 28 278 28 165 0 188 -2 278 -27 201 -56 361 -152 504 -302 140 -145 222 -293 274 -492 21 -79 24 -109 23 -279 -1 -127 -6 -214 -16 -263 l-15 -73 3006 7 c1653 4 3007 8 3009 9 1 1 -8 37 -20 81 -19 67 -22 105 -22 259 -1 166 1 187 27 279 117 421 467 736 885 797 119 17 325 7 432 -21 239 -63 453 -205 601 -399 70 -92 154 -267 185 -386 24 -88 27 -119 27 -260 1 -116 -4 -181 -16 -234 -10 -41 -16 -75 -15 -76 2 -1 62 2 133 6 266 16 458 45 525 79 48 24 97 81 127 146 l24 52 -16 157 c-15 152 -15 163 4 284 63 388 50 680 -35 802 -134 193 -526 336 -1429 519 -737 149 -1322 209 -2033 210 -228 0 -226 0 -347 85 -187 131 -1045 607 -1471 815 -383 187 -788 281 -1439 332 -208 17 -1106 16 -1400 0 -121 -7 -314 -19 -430 -27 -302 -22 -286 -22 -341 10 -140 81 -187 94 -269 71z m1885 -333 c6 -37 38 -238 71 -446 32 -209 66 -422 75 -474 9 -52 15 -96 13 -97 -11 -9 -1699 29 -1951 44 -206 13 -417 36 -485 54 -98 26 -198 119 -249 231 -35 75 -36 172 -5 255 17 45 30 61 68 86 83 54 135 80 253 127 341 136 858 230 1460 267 269 16 270 16 511 18 l227 2 12 -67z m630 47 c264 -18 777 -110 1029 -186 186 -56 445 -188 756 -387 211 -134 274 -181 250 -185 -75 -12 -133 -50 -162 -106 -19 -35 -21 -136 -4 -179 l11 -27 -907 2 -906 3 -59 160 c-110 302 -298 878 -298 916 0 6 95 2 290 -11z"
                  fill="#F2F2F0"
                />
                {/* Detalles interiores: ventanas, paneles, lineas de caracter */}
                <g fill="#111111">
                  <path d="M2633 3125 c-223 -40 -410 -141 -568 -306 -132 -138 -213 -283 -262 -467 -22 -83 -26 -119 -26 -247 -1 -169 10 -236 65 -382 87 -230 271 -436 493 -551 85 -44 178 -78 271 -98 107 -23 312 -23 419 1 392 84 699 375 802 761 23 86 26 120 27 254 1 158 -5 199 -46 330 -98 310 -355 567 -668 669 -150 50 -354 64 -507 36z m350 -301 c249 -56 457 -247 543 -499 25 -72 28 -95 28 -220 1 -153 -15 -228 -74 -345 -94 -186 -283 -337 -485 -386 -96 -24 -268 -24 -360 0 -320 84 -544 355 -562 681 -20 359 209 673 558 765 94 24 253 26 352 4z" />
                  <path d="M2600 2697 c-36 -13 -85 -36 -109 -51 l-44 -28 116 -115 c81 -82 120 -114 131 -110 14 6 16 29 16 167 0 186 6 178 -110 137z" />
                  <path d="M2920 2561 c0 -139 2 -162 16 -168 11 -4 50 28 130 108 l115 114 -28 22 c-34 28 -138 70 -193 79 l-40 7 0 -162z" />
                  <path d="M2282 2448 c-28 -36 -92 -191 -92 -225 0 -10 34 -13 165 -13 151 0 165 1 165 18 0 15 -206 232 -221 232 -4 0 -11 -6 -17 -12z" />
                  <path d="M3222 2351 c-62 -59 -112 -115 -112 -124 0 -15 17 -17 165 -17 131 0 165 3 165 13 0 40 -69 205 -95 227 -7 6 -48 -27 -123 -99z" />
                  <path d="M2781 2332 c-12 -22 11 -62 34 -62 8 0 21 10 29 22 20 28 4 58 -29 58 -13 0 -29 -8 -34 -18z" />
                  <path d="M2749 2161 c-32 -33 -37 -67 -14 -110 29 -57 104 -64 151 -14 53 57 9 153 -71 153 -27 0 -44 -8 -66 -29z" />
                  <path d="M2570 2125 c-26 -32 13 -81 48 -59 24 16 27 45 6 61 -23 17 -39 16 -54 -2z" />
                  <path d="M3006 2124 c-20 -19 -20 -38 -2 -54 23 -19 61 -8 64 18 7 44 -32 67 -62 36z" />
                  <path d="M2190 1975 c0 -29 41 -140 72 -194 l31 -53 117 117 c71 71 116 123 113 131 -4 11 -40 14 -169 14 -141 0 -164 -2 -164 -15z" />
                  <path d="M3110 1972 c0 -9 51 -68 114 -131 l114 -114 31 54 c30 51 71 165 71 195 0 11 -31 14 -165 14 -151 0 -165 -1 -165 -18z" />
                  <path d="M2780 1901 c-7 -15 -5 -24 8 -41 32 -40 85 -4 62 41 -14 25 -56 25 -70 0z" />
                </g>
                {/* Ruedas */}
                <g
                  className={reduceMotion ? '' : 'animate-car-wheel'}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  fill="#111111"
                >
                  <path d="M2562 1697 c-61 -62 -112 -115 -112 -119 0 -18 208 -108 249 -108 7 0 11 54 11 164 0 140 -2 165 -16 170 -9 3 -16 6 -17 6 -1 0 -53 -51 -115 -113z" />
                  <path d="M2933 1803 c-15 -6 -19 -333 -4 -333 46 0 251 88 251 108 0 9 -223 232 -230 231 -3 0 -11 -3 -17 -6z" />
                </g>
                {/* Acentos rojos: centros de ruedas */}
                <circle cx="2580" cy="1640" r="60" fill="#FF1A1A" />
                <circle cx="3055" cy="1640" r="60" fill="#FF1A1A" />
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
