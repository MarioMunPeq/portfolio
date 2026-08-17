import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Screen } from '../components/transition/Screen'
import { experience } from '../data/experience'
import type { ExperienceEntry } from '../data/experience'
import { companyLogoCandidates } from '../lib/company-logo'

// Curva de interaccion rapida y cortante (menu de juego, no SaaS).
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Paleta exclusiva de la pantalla (Persona 5: rojo + negro + blanco).
const BLACK = '#000000'

// Silueta del panel de dialogo: esquinas cortadas con angulo agresivo.
// La cola (triangulo negro) se pinta con un elemento propio bajo el panel,
// porque clip-path no puede añadir pixeles fuera de la caja del elemento.
const BUBBLE_LEFT =
  'polygon(0.9rem 0, calc(100% - 2.25rem) 0, 100% 0.9rem, 100% calc(100% - 0.9rem), calc(100% - 0.9rem) 100%, 0.9rem 100%, 0 calc(100% - 0.9rem))'
const BUBBLE_RIGHT =
  'polygon(calc(100% - 0.9rem) 0, 2.25rem 0, 0 0.9rem, 0 calc(100% - 0.9rem), 0.9rem 100%, calc(100% - 0.9rem) 100%, 100% calc(100% - 0.9rem))'

// Ritmo de composicion por mensaje (escritorio): posicion horizontal, ancho,
// rotacion y desplazamiento de la sombra dura. Los bordes interiores de cada
// tarjeta definen los anclajes por los que pasa la ruta negra zig-zag.
interface CardLayout {
  wrap: string
  maxW: string
  rot: string
  sx: number
  sy: number
}
const LAYOUTS: CardLayout[] = [
  // izquierda (6%–48%) — la ruta sale por su esquina inferior derecha
  { wrap: 'lg:mr-auto lg:ml-[6%]', maxW: 'lg:max-w-[42%]', rot: '-rotate-[1.4deg]', sx: 14, sy: 14 },
  // derecha (52%–92%) — la ruta entra/sale por su borde izquierdo
  { wrap: 'lg:ml-auto lg:mr-[8%]', maxW: 'lg:max-w-[40%]', rot: 'rotate-[1.1deg]', sx: 14, sy: 16 },
  // izquierda (12%–52%) — la ruta entra/sale por su borde derecho
  { wrap: 'lg:mr-auto lg:ml-[12%]', maxW: 'lg:max-w-[40%]', rot: '-rotate-[0.8deg]', sx: 12, sy: 14 },
  // derecha (50%–94%) — la ruta entra por su borde izquierdo
  { wrap: 'lg:ml-auto lg:mr-[6%]', maxW: 'lg:max-w-[44%]', rot: 'rotate-[1.3deg]', sx: 14, sy: 14 },
]

// Ruta negra de conversacion (Persona 5): UN unico camino continuo que
// zigzaguea entre los mensajes. Tecnicamente es un trazo por hueco, pero cada
// trazo se oculta bajo la tarjeta anterior y bajo la siguiente, de modo que
// solo queda visible el tramo diagonal del hueco: el ojo lo lee como una sola
// linea que se enrosca detras de cada tarjeta.
//
//   leftPct   — punto de salida visible (borde de la tarjeta superior), en %
//               del ancho de contenido.
//   shiftPx   — correccion del origen skew (tan(angulo) × saliente superior)
//               para que `left` coincida con el borde visible en el hueco.
//   angulo    — 28° = giro agudo y marcado; el saliente superior/inferior
//               (4rem a cada lado) entierra los extremos tras las tarjetas.
interface Connector {
  ang: number
  leftPct: number
  shiftPx: number
}
const CONNECTORS: Connector[] = [
  { ang: 28, leftPct: 44.5, shiftPx: 34 }, // 1 → 2 (baja a la derecha)
  { ang: -28, leftPct: 56, shiftPx: 34 }, // 2 → 3 (baja a la izquierda)
  { ang: 28, leftPct: 48, shiftPx: 34 }, // 3 → 4 (baja a la derecha)
]

const TOTAL = experience.length

// Recibo de lectura estilo chat de Persona 5: dos tildes separadas dibujadas
// con SVG (no Unicode), la trasera fina y la delantera gruesa, en rojo.
function ReadChecks() {
  return (
    <svg viewBox="0 0 26 12" className="h-3 w-[26px] shrink-0" aria-hidden="true">
      <path
        d="M1.5 6 L5 9.5 L10 4"
        fill="none"
        stroke="#B80404"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M9 6 L12.5 9.5 L18.5 3.5"
        fill="none"
        stroke="#B80404"
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

/* ============================================================
   Cabecera integrada sobre el rojo. Jerarquia:
   PROGRESO (titulo dominante, Persona 5) → EXPERIENCIA LABORAL
   ============================================================ */

function PageTitleBar() {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-6 px-5 pt-8 md:px-10 md:pt-12">
      <div className="ml-auto flex items-center gap-4 text-label font-bold uppercase tracking-[0.25em] text-white [text-shadow:2px_2px_0_#000]">
        <span className="hidden items-center gap-2 sm:inline-flex">
          <span aria-hidden="true" className="h-2 w-2 animate-pulse bg-white" />
          En linea
        </span>
        <span className="bg-black px-3 py-1.5 text-white [clip-path:polygon(8px_0,100%_0,calc(100%_-_8px)_100%,0_100%)]">
          2026
        </span>
      </div>

      <div className="order-last w-full lg:order-none lg:w-auto lg:flex-1 lg:text-center">
        <h1
          className="mt-4 font-p5-menu uppercase leading-[0.85] tracking-tight text-white"
          style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)', textShadow: `6px 6px 0 ${BLACK}` }}
        >
          Progreso
        </h1>
        <span className="mt-4 inline-block -skew-x-6 bg-black px-5 py-2 text-white [clip-path:polygon(0_0,100%_0,calc(100%_-_9px)_100%,0_100%)]">
          <span className="text-label font-bold uppercase tracking-[0.35em]">Experiencia laboral</span>
        </span>
        <span aria-hidden="true" className="mt-5 flex items-center justify-center gap-3">
          <span className="h-[6px] w-16 -skew-x-12 bg-white [box-shadow:4px_4px_0_#000]" />
          <span className="h-2.5 w-2.5 rotate-45 bg-black [box-shadow:2px_2px_0_#fff]" />
          <span className="h-[6px] w-6 -skew-x-12 bg-white [box-shadow:4px_4px_0_#000]" />
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   Barra de "conversacion" (etiquetas pequeñas del historial)
   ============================================================ */

function ConversationLabel() {
  return (
    <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center gap-3 px-5 md:px-10">
      <span className="inline-flex items-center gap-2 bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-white [clip-path:polygon(0_0,100%_0,calc(100%_-_8px)_100%,0_100%)]">
        <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-white" />
        Historial profesional
      </span>
      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white [text-shadow:2px_2px_0_#000]">
        <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-white" />
        {TOTAL} mensajes
      </span>
      <span className="ml-auto inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-black [clip-path:polygon(0_0,calc(100%_-_8px)_0,100%_100%,0_100%)]">
        <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-black" />
        En curso
      </span>
    </div>
  )
}

/* ============================================================
   Logo de chat de la empresa: se resuelve automaticamente desde el
   nombre de la empresa (public/images/experience/<empresa>.png|webp).
   ============================================================ */

/**
 * Logo de la empresa dentro del avatar de chat. Resuelve el archivo desde
 * el campo `company` (PNG primero, WebP despues). Si no existe ninguno o la
 * carga falla (onError), se avanza al siguiente candidato y, agotados, se
 * muestra la inicial de la empresa como placeholder. object-contain mantiene
 * la proporcion del logo sin recortarlo y centrado dentro del recuadro.
 */
function CompanyLogo({ company }: { company: string }) {
  const candidates = companyLogoCandidates(company)
  const [failed, setFailed] = useState<number[]>([])

  const index = candidates.findIndex((_, i) => !failed.includes(i))

  if (index === -1) {
    return (
      <span className="flex h-full w-full items-center justify-center font-p5-menu text-2xl uppercase leading-none text-black md:text-3xl">
        {company.charAt(0)}
      </span>
    )
  }

  return (
    <img
      src={candidates[index]}
      alt={company}
      className="h-full w-full object-contain p-1.5"
      onError={() => setFailed((prev) => [...prev, index])}
    />
  )
}

/* ============================================================
   Avatar de chat de la empresa: cuadrado pequeño con borde negro,
   anillo blanco y ligera rotacion, al lado de la tarjeta.
   ============================================================ */

function SpeakerAvatar({ entry, right }: { entry: ExperienceEntry; right: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute z-30 h-16 w-16 md:h-[4.5rem] md:w-[4.5rem] ${
        right
          ? 'left-3 -top-6 md:left-auto md:-right-[4.5rem] md:top-7'
          : 'right-3 -top-6 md:right-auto md:-left-[4.5rem] md:top-7'
      }`}
      style={{ transform: right ? 'rotate(3deg)' : 'rotate(-3deg)' }}
    >
      <div
        className="h-full w-full border-[3px] border-black bg-white"
        style={{ boxShadow: '0 0 0 2px #fff, 6px 6px 0 #000' }}
      >
        <CompanyLogo company={entry.company} />
      </div>
    </div>
  )
}

/* ============================================================
   Contenido de un mensaje desbloqueado (panel blanco)
   ============================================================ */

function OpenMessage({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const nn = String(index + 1).padStart(2, '0')

  return (
    <div className="relative px-6 py-8 md:px-10 md:py-9">
      <h3 className="font-display uppercase leading-[0.9] text-black" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.6rem)' }}>
        {entry.company}
      </h3>

      <span
        aria-hidden="true"
        className="mt-3 block h-[5px] w-16 -skew-x-12 bg-[#B80404] transition-all duration-200 group-hover:w-28"
      />

      <p className="mt-5 inline-block bg-black px-3 py-1.5 text-label font-bold uppercase tracking-[0.25em] text-white [clip-path:polygon(0_0,100%_0,calc(100%_-_8px)_100%,0_100%)]">
        {entry.role}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-black">
        {entry.period && (
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[#B80404]" />
            {entry.period}
          </span>
        )}
        {entry.location && (
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[#B80404]" />
            {entry.location}
          </span>
        )}
        {entry.meta && (
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[#B80404]" />
            {entry.meta}
          </span>
        )}
      </div>

      <p className="mt-5 font-sans text-[15px] leading-relaxed text-black">
        {entry.summary}
      </p>

      {entry.highlights.length > 0 && (
        <ul className="mt-5 space-y-2.5 border-l-[3px] border-black pl-4">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5 text-[13px] leading-snug text-black">
              <span aria-hidden="true" className="mt-[6px] h-2 w-2 shrink-0 rotate-45 bg-[#B80404]" />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {entry.tech && entry.tech.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.tech.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 border-2 border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#B80404]" />
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-black pt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black">
        <span>Mensaje {nn} / {String(TOTAL).padStart(2, '0')}</span>
        <span className="flex items-center gap-2">
          <span>Leido</span>
          <ReadChecks />
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   Un mensaje de la conversacion: hueco de entrada con el tramo de
   ruta negra que llega desde el mensaje anterior + tarjeta blanca
   recortada con contorno negro, sombra dura y avatar de chat.
   ============================================================ */

function MessageBlock({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const reduced = useReducedMotion()
  const right = index % 2 === 1
  const poly = right ? BUBBLE_RIGHT : BUBBLE_LEFT
  const layout = LAYOUTS[index % LAYOUTS.length]
  const conn = CONNECTORS[index - 1] ?? null

  return (
    <div className="group">
      {/* Hueco entre tarjetas: aqui vive el tramo de la ruta que conecta este
          mensaje con el anterior. La barra se entierra 4rem por encima (tras la
          tarjeta previa) y 4rem por debajo (tras esta tarjeta): z-10 (positivo)
          la pinta por encima del fondo rojo de la pantalla pero por debajo de
          las tarjetas (z-20), por lo que no toca el texto y el conjunto lee
          como un unico camino continuo. */}
      {conn && (
        <div className="relative h-24 md:h-56">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 bg-black"
            style={
              {
                top: '-4rem',
                left: `calc(${conn.leftPct}% - ${conn.shiftPx}px)`,
                width: 'clamp(1.25rem, 4vw, 2.5rem)',
                height: 'calc(100% + 8rem)',
                transform: `skewX(${conn.ang}deg)`,
                transformOrigin: 'top left',
              } as CSSProperties
            }
          />
        </div>
      )}

      <motion.div
        className="relative z-20"
        initial={reduced ? false : { opacity: 0, x: right ? 64 : -64, rotate: right ? 3 : -3, scale: 0.98 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className={`${layout.maxW} ${layout.wrap} ${layout.rot} transition-transform duration-200 ease-out group-hover:rotate-0 group-hover:-translate-y-1.5`}
        >
          <div className="relative">
            {/* Cola negra del dialogo (baja sobre el rojo) */}
            <span
              aria-hidden="true"
              className={`absolute bottom-[-1rem] ${right ? 'right-[3.5rem]' : 'left-[3.5rem]'} h-6 w-6 bg-black`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />
            {/* Sombra dura offset (se encoge al presionar en hover) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-black transition-transform duration-200 ease-out [transform:translate(var(--sx),var(--sy))] group-hover:[--sx:6px] group-hover:[--sy:8px]"
              style={
                {
                  clipPath: poly,
                  '--sx': `${layout.sx}px`,
                  '--sy': `${layout.sy}px`,
                } as CSSProperties
              }
            />
            {/* Panel: negro (contorno grueso) con relleno blanco */}
            <div data-cursor="select" className="relative bg-black p-[6px] md:p-[7px]" style={{ clipPath: poly }}>
              <div className="relative bg-white">
                <OpenMessage entry={entry} index={index} />
              </div>
            </div>
            {/* Avatar de chat de la empresa */}
            <SpeakerAvatar entry={entry} right={right} />
            {/* Numero de mensaje (etiqueta grafica) */}
            <span
              aria-hidden="true"
              className={`absolute -top-5 ${right ? 'right-6' : 'left-6'} z-10 inline-flex items-baseline gap-2 bg-white px-3 py-1 text-black [box-shadow:5px_5px_0_#000] [clip-path:polygon(0_0,100%_0,calc(100%_-_9px)_100%,0_100%)]`}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Mensaje</span>
              <span className="font-display text-lg font-bold leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
            </span>
            {/* Marcador de seleccion (hover) */}
            <span
              aria-hidden="true"
              className={`absolute -top-2 ${right ? '-right-2' : '-left-2'} z-10 h-5 w-5 rotate-45 border-[3px] border-black bg-white opacity-0 transition-opacity duration-150 group-hover:opacity-100`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ============================================================
   Pagina
   ============================================================ */

export function Experience() {
  return (
    <Screen className="min-h-dvh bg-[#B80404] text-white">
      <section className="relative min-h-dvh overflow-x-clip pt-11 md:pt-12">
        <PageTitleBar />
        <ConversationLabel />

        {/* Conversacion de experiencias. Los huecos entre mensajes son parte
            de cada bloque (contienen el tramo de la ruta negra). */}
        <div className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
          <div className="mt-16 md:mt-20">
            {experience.map((entry, index) => (
              <MessageBlock key={entry.id} entry={entry} index={index} />
            ))}
          </div>

          <div className="mt-24 flex items-center justify-center gap-4">
            <span className="h-[6px] w-14 -skew-x-12 bg-white [box-shadow:4px_4px_0_#000]" />
            <span className="inline-flex items-center gap-2 bg-black px-4 py-2 text-label font-bold uppercase tracking-[0.3em] text-white [clip-path:polygon(0_0,100%_0,calc(100%_-_9px)_100%,0_100%)]">
              <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-white" />
              Fin de la conversacion
            </span>
            <span className="h-[6px] w-14 -skew-x-12 bg-white [box-shadow:4px_4px_0_#000]" />
          </div>
        </div>
      </section>
    </Screen>
  )
}
