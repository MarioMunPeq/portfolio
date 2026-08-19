import { useReducedMotion } from "motion/react";
import { Reveal } from "../components/primitives/Reveal";
import { Screen } from "../components/transition/Screen";
import { DiamondMarker } from "../components/shared/DiamondMarker";
import { Annotation } from "../components/primitives/Annotation";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Tag } from "../components/ui/Tag";
import { StatTag } from "../components/ui/StatTag";
import { SocialStar } from "../components/social-star/SocialStar";
import { SkillMenuSection } from "../components/skill-menu/SkillMenuSection";
import { profile } from "../data/profile";

// Nombre en tres bloques (mismo tratamiento tipografico que el hero).
const nameParts = profile.name.trim().split(/\s+/);
const nameLine1 = nameParts[0] ?? "";
const nameLine2 = nameParts[1] ?? "";
const nameLine3 = nameParts.slice(2).join(" ");

const OUTLINE_BLACK = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero), -3px -3px 0 var(--color-bg-hero), 3px 3px 0 var(--color-bg-hero)`;
const OUTLINE_RED = `-2px -2px 0 var(--color-accent), 2px -2px 0 var(--color-accent), -2px 2px 0 var(--color-accent), 2px 2px 0 var(--color-accent), -3px -3px 0 var(--color-accent), 3px 3px 0 var(--color-accent)`;

// Atributos sociales del personaje (Social Stats de P5). Cada atributo tiene
// su propio valor (1-5) que decide cuanto se extiende su punta en la estrella
// interior: a mayor valor, mas lejos del centro. El orden fija la posicion
// alrededor de la estrella: arriba, arriba-derecha, abajo-derecha,
// abajo-izquierda, arriba-izquierda. Los acentos si son seguros: el
// unicode-range de P5 Menu/Expose los cae al fallback del stack. Valores
// aproximados y honestos, sin presentarse como datos objetivos.
const STATS = [
  { label: "PROGRAMACIoN", value: 4, descriptor: "DESARROLLO" },
  { label: "CREATIVIDAD", value: 3, descriptor: "DISEÑO" },
  { label: "CARISMA", value: 3, descriptor: "SOCIAL" },
  { label: "CURIOSIDAD", value: 5, descriptor: "INVESTIGACIoN" },
  { label: "RESOLUCIoN", value: 4, descriptor: "LoGICA" },
] as const;

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
function DrivingCar({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const fx = reduceMotion ? "hidden" : "block";

  return (
    <span
      aria-hidden="true"
      className={`relative block h-32 w-full overflow-hidden ${className}`}
    >
      {/* Carretera: linea roja fija */}
      <span className="absolute bottom-3 left-0 h-[2px] w-full bg-accent/40" />

      {/* Marcas de carretera: guiones que se mueven en direccion opuesta */}
      <span
        className={`absolute bottom-1 left-0 h-[6px] w-full ${fx}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 12px, transparent 12px, transparent 28px)",
          backgroundSize: "28px 6px",
          opacity: 0.15,
          animation: reduceMotion ? "none" : "var(--animate-car-road-markings)",
        }}
      />

      {/* Grupo del coche — cruza la pantalla de izquierda a derecha */}
      <span
        className={`absolute bottom-3 left-0 ${
          reduceMotion ? "" : "animate-car-cross"
        }`}
      >
        {/* Suspension: micro-rebote vertical */}
        <span className={`block ${reduceMotion ? "" : "animate-car-bounce"}`}>
          {/* Tilt + estela + SVG */}
          <span
            className={`flex items-end ${
              reduceMotion ? "" : "animate-car-tilt"
            }`}
          >
            {/* Estela de velocidad: 4 lineas graficas escalonadas */}
            <span
              className={`relative mr-4 flex flex-col items-end justify-center gap-[5px] ${fx}`}
            >
              {/* Linea 1: larga, opaca */}
              <span
                className="block h-[2px] w-28 bg-accent/60"
                style={{
                  transform: "skewX(-18deg)",
                  animation: reduceMotion
                    ? "none"
                    : "car-trail-drift 2.8s ease-in-out infinite alternate",
                }}
              />
              {/* Linea 2: media, semi-opaca */}
              <span
                className="block h-[1.5px] w-20 bg-paper/30"
                style={{
                  transform: "skewX(-22deg)",
                  animation: reduceMotion
                    ? "none"
                    : "car-trail-drift 3.2s ease-in-out 0.4s infinite alternate-reverse",
                }}
              />
              {/* Linea 3: corta, tenue */}
              <span
                className="block h-[1.5px] w-14 bg-accent/35"
                style={{
                  transform: "skewX(-16deg)",
                  animation: reduceMotion
                    ? "none"
                    : "car-trail-drift 2.5s ease-in-out 0.8s infinite alternate",
                }}
              />
              {/* Linea 4: muy corta, fantasma */}
              <span
                className="block h-[1px] w-8 bg-paper/20"
                style={{
                  transform: "skewX(-24deg)",
                  animation: reduceMotion
                    ? "none"
                    : "car-trail-drift 3.6s ease-in-out 0.2s infinite alternate-reverse",
                }}
              />
            </span>

            {/* Coche SVG: ilustracion vectorial simple */}
            <svg
              viewBox="0 0 200 70"
              preserveAspectRatio="xMidYMid meet"
              className="block h-28 w-auto"
            >
              {/* Carroceria */}
              <path
                d="M18,50 L12,40 C12,36 16,32 22,30 L55,15 C58,13 62,12 66,12 L134,12 C138,12 142,13 145,15 L178,30 C184,32 188,36 188,40 L192,50 Z"
                fill="#F2F2F0"
              />
              {/* Ventana trasera */}
              <path d="M60,15 L94,15 L94,30 L54,30 Z" fill="#111111" />
              {/* Ventana delantera */}
              <path d="M100,15 L140,15 L148,30 L100,30 Z" fill="#111111" />
              {/* Rueda trasera */}
              <circle cx="58" cy="52" r="12" fill="#111111" />
              {/* Rueda delantera */}
              <circle cx="152" cy="52" r="12" fill="#111111" />
            </svg>
          </span>
        </span>
      </span>
    </span>
  );
}

// Posiciones fijas de las etiquetas en las esquinas, fuera del area de la
// estrella, y sus inclinaciones suaves (casi horizontales).
const LABEL_POSITIONS = [
  { left: 48, top: 0 },
  { left: 94, top: 28 },
  { left: 92, top: 90 },
  { left: 6, top: 90 },
  { left: 8, top: 28 },
];
const LABEL_ROTATIONS = [-1, -3, 3, -2, 1];

/** Hueco del retrato recortado en angulo. Sin avatar → placeholder. */
function PortraitSlot() {
  const { avatar } = profile.about;
  const CUTOUT =
    "[clip-path:polygon(10%_0,100%_0,100%_82%,86%_100%,0_100%,0_14%)]";
  return (
    <div className={`${CUTOUT} bg-paper p-[3px]`}>
      <div
        className={`${CUTOUT} aspect-[3/4] overflow-hidden bg-bg-content-alt`}
      >
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
  );
}

function StatStar() {
  return (
    <div className="relative w-full pt-4 pb-4">
      <div className="relative aspect-square w-full max-w-[34rem] ml-auto">
        <SocialStar className="absolute inset-0 h-full w-full [transform:rotate(2deg)]" />

        {STATS.map(({ label, value, descriptor }, i) => {
          const pos = LABEL_POSITIONS[i];
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
          );
        })}
      </div>
    </div>
  );
}

export function About() {
  const { about, hero, branding } = profile;

  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative overflow-hidden px-6 pb-28 pt-16 md:px-12 lg:px-16 md:pt-20">
        {/* Fondo: estrellas de contorno sutiles (mismo patron que el inventario) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-stars opacity-70"
        />

        {/* Starbackground: textura atmosferica sutil detras de la composicion.
            Sesgada a la derecha (zona de estadisticas), con mascara que
            desvanece hacia la izquierda para no competir con la tarjeta
            de perfil. Opacidad baja para mantener la legibilidad. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-full w-[75%] opacity-[0.14]"
          style={{
            backgroundImage:
              "url(/portfolio/images/background/starbackground.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
          }}
        />

        {/* Palabra fantasma de marca */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-2 z-0 -rotate-6 select-none font-p5-menu uppercase leading-none text-outline-faint opacity-55"
          style={{ fontSize: "clamp(7rem, 15vw, 14rem)" }}
        >
          PERFIL
        </span>

        <div className="relative mx-auto max-w-[110rem] px-4 lg:px-8">
          {/* Titulo de perfil (mismo tratamiento que INVENTARIO) */}
          <Reveal>
            <SectionTitle title="PERFIL" persona />
          </Reveal>

          <div className="mt-10 grid items-start gap-16 lg:grid-cols-[0.38fr_0.62fr] lg:gap-8 xl:gap-12">
            {/* ===== Columna izquierda: identidad ===== */}
            <Reveal>
              <div className="relative -ml-2 lg:-ml-6">
                <Annotation
                  tone="paper"
                  className="absolute -left-2 top-4 z-30 -rotate-3"
                >
                  {branding.system}
                </Annotation>

                <div className="relative z-10 mx-auto w-[min(22rem,95%)] -rotate-2">
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
                    style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)" }}
                  >
                    <span
                      className="block"
                      style={{
                        textShadow: OUTLINE_BLACK,
                        transform: "rotate(-1.5deg)",
                      }}
                    >
                      {nameLine1}
                    </span>
                    <span
                      className="block"
                      style={{
                        textShadow: OUTLINE_RED,
                        transform: "rotate(1.2deg) translateX(22px)",
                        marginTop: 4,
                      }}
                    >
                      {nameLine2}
                    </span>
                    <span className="block" style={{ marginTop: 8 }}>
                      <span
                        className="inline-block bg-accent px-5 pb-[5px] pt-[3px] text-ink [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"
                        style={{ transform: "skew(-6deg) rotate(-1deg)" }}
                      >
                        {nameLine3}
                      </span>
                    </span>
                  </h1>
                </div>

                {/* Pegatina de rol + credencial (DAM vive aqui, no en el footer) */}
                <div className="relative z-30 mt-4 flex flex-wrap items-center justify-end gap-2 pr-2">
                  <Tag font="sans" className="rotate-1">
                    {hero.eyebrow}
                  </Tag>
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
                  <Tag
                    font="sans"
                    className="absolute right-2 top-0 z-10 -rotate-3"
                  >
                    Estadisticas sociales
                  </Tag>
                  <StatStar />
                </div>
              </Reveal>
            </div>
          </div>

          {/* ===== Contenido: Bio ===== */}
          <Reveal delay={0.16}>
            <div className="mt-14 lg:mt-16 lg:max-w-[55%]">
              <div className="relative border border-paper/8 bg-bg-content-alt/70 p-6 pr-8 sm:p-8 sm:pr-10 [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%_-_12px))]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-5 w-5"
                >
                  <span className="absolute right-0 top-0 h-[1px] w-5 bg-accent/50" />
                  <span className="absolute right-0 top-0 h-5 w-[1px] bg-accent/50" />
                </span>
                <h2 className="flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] text-accent">
                  <DiamondMarker size={6} />
                  Bio
                </h2>
                <p className="mt-4 text-body leading-relaxed text-paper/75">
                  {about.bio}
                </p>
              </div>
            </div>
          </Reveal>

          {/* ===== Habilidades (menu de juego) ===== */}
          <SkillMenuSection
            skills={about.skills}
            languages={about.languages}
            interests={about.interests}
          />
        </div>

        {/* ===== Permiso de conducir — full width, cruza el layout ===== */}
        <Reveal delay={0.2}>
          <div className="relative mt-16">
            <p className="flex items-center gap-2 pl-6 text-caption uppercase tracking-[0.2em] text-paper/50 md:pl-12">
              <DiamondMarker size={5} />
              {about.license}
            </p>
            <DrivingCar className="mt-3" />
          </div>
        </Reveal>
      </section>
    </Screen>
  );
}
