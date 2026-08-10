import { Reveal } from '../components/primitives/Reveal'
import { MenuOption } from '../components/primitives/MenuOption'
import { Screen } from '../components/transition/Screen'
import { profile } from '../data/profile'
import { NAV_ITEMS } from '../components/navigation/nav-items'

const NAME_SIZE = 'clamp(2.75rem, 11vw, 9rem)'

const nameParts = profile.name.trim().split(/\s+/)
const nameFirst = nameParts[0]
const nameMiddle = nameParts.slice(1, -1).join(' ')
const nameLast = nameParts[nameParts.length - 1]

const MENU = [
  NAV_ITEMS.find((item) => item.id === 'proyectos'),
  NAV_ITEMS.find((item) => item.id === 'experiencia'),
  NAV_ITEMS.find((item) => item.id === 'sobre-mi'),
  NAV_ITEMS.find((item) => item.id === 'formacion'),
  NAV_ITEMS.find((item) => item.id === 'contacto'),
].filter((item): item is NonNullable<typeof item> => item !== undefined)

/**
 * Pantalla principal = MENÚ PRINCIPAL del sistema. La portada del portfolio
 * no es un hero: es la interfaz de selección de una partida. Título del
 * juego (el nombre), opciones de destino (rutas reales), silueta de
 * personaje recortada y HUD superior/inferior persistente.
 */
export function Home() {
  return (
    <Screen className="min-h-dvh bg-bg-hero text-paper">
      <section className="relative flex min-h-dvh flex-col overflow-hidden">
        {/* Capa decorativa del sistema */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <span
            className="absolute -right-[5%] -top-6 -rotate-6 select-none font-display uppercase leading-none text-outline-faint"
            style={{ fontSize: 'clamp(7rem, 22vw, 18rem)' }}
          >
            {profile.hero.ghost}
          </span>
          <span className="absolute -right-[12%] top-[20%] hidden h-[85%] w-[26vw] rotate-[14deg] bg-accent lg:block" />
          <span className="absolute bottom-28 left-[5%] hidden h-6 w-12 bg-halftone-red md:block" />
          <span className="absolute left-1/2 top-1/2 hidden h-[42%] w-px -translate-y-1/2 bg-paper/10 lg:block" />
        </div>

        {/* Zona de personaje: silueta recortada, parcialmente fuera del viewport */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 z-0 hidden h-[26rem] w-[20rem] -translate-y-1/2 -skew-x-6 lg:block"
        >
          <span className="block h-full w-full border-2 border-accent/70 bg-bg-hero/60 p-8">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle cx="100" cy="66" r="40" fill="rgba(245,245,240,0.9)" />
              <path
                d="M100 118c-46 0-82 32-82 64 0 6 4 10 10 10h144c6 0 10-4 10-10 0-32-36-64-82-64z"
                fill="rgba(245,245,240,0.9)"
              />
            </svg>
          </span>
          <span className="absolute -left-3 -top-3 block h-6 w-6 border-l-2 border-t-2 border-paper/40" />
          <span className="absolute -bottom-3 -right-3 block h-6 w-6 border-b-2 border-r-2 border-paper/40" />
        </span>

        {/* Composición principal */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 content-center gap-12 px-6 pb-16 pt-28 md:px-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-10">
          {/* Título del juego */}
          <div>
            <Reveal>
              <p className="inline-flex flex-wrap items-center gap-2.5 text-label font-medium uppercase tracking-[0.28em] text-paper/70">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
                />
                {profile.role}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-5 font-display uppercase leading-[0.92] text-paper"
                style={{ fontSize: NAME_SIZE }}
              >
                <span className="block">{nameFirst}</span>
                <span className="block text-outline-faint md:translate-x-[6%]">
                  {nameMiddle}
                </span>
                <span className="relative z-10 block md:translate-x-[12%]">
                  <span className="-skew-x-6 inline-block bg-accent px-[0.12em] leading-[1.02]">
                    <span className="inline-block skew-x-6">{nameLast}</span>
                  </span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-body leading-relaxed text-paper/75">
                {profile.hero.roleLine} — {profile.hero.credentialLine}
              </p>
            </Reveal>
          </div>

          {/* Menú de selección */}
          <div>
            <Reveal delay={0.12}>
              <p className="mb-2 flex items-center gap-2 border-t border-paper/15 pt-3 text-label font-medium uppercase tracking-[0.25em] text-paper/50">
                <span
                  aria-hidden="true"
                  className="block h-2 w-2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
                />
                Selecciona destino
              </p>
            </Reveal>

            <nav aria-label="Menú principal del portfolio">
              <Reveal delay={0.14}>
                <ol>
                  {MENU.map((item) => (
                    <MenuOption
                      key={item.id}
                      index={item.index}
                      label={item.label}
                      path={item.path}
                      tag="SELECT"
                    />
                  ))}
                </ol>
              </Reveal>
            </nav>
          </div>
        </div>

        {/* Barra inferior del sistema */}
        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 px-6 py-4 text-label uppercase tracking-[0.25em] text-paper/50 md:px-10">
          <span>{profile.hero.coordinates}</span>
          <span className="hidden items-center gap-2 font-medium text-paper/70 md:flex">
            <span className="animate-blink-soft">PRESS ENTER</span>
            <span
              aria-hidden="true"
              className="block h-2 w-2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
            />
            SELECT
          </span>
          <span>
            © {new Date().getFullYear()} {profile.hero.region}
          </span>
        </footer>
      </section>
    </Screen>
  )
}
