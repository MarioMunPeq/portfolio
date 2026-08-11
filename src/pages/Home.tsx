import { Screen } from '../components/transition/Screen'
import { SystemLabel } from '../components/shared/SystemLabel'
import { HazardStripe } from '../components/hero/HazardStripe'
import { GhostBgWord } from '../components/hero/GhostBgWord'
import { InkBlot } from '../components/hero/InkBlot'
import { HalftoneOverlay } from '../components/hero/HalftoneOverlay'
import { SpeedLines } from '../components/hero/SpeedLines'
import { Floaters } from '../components/hero/Floaters'
import { ScanlineOverlay } from '../components/hero/ScanlineOverlay'
import { CommandNavItem } from '../components/hero/CommandNavItem'
import { ContactButton } from '../components/hero/ContactButton'
import { HERO_COMMANDS } from '../components/hero/hero-commands'
import { profile } from '../data/profile'

const nameParts = profile.name.trim().split(/\s+/)
const nameLine1 = nameParts[0] ?? ''
const nameLine2 = nameParts[1] ?? ''
const nameLine3 = nameParts.slice(2).join(' ')

const OUTLINE_BLACK = `-2px -2px 0 var(--color-bg-hero), 2px -2px 0 var(--color-bg-hero), -2px 2px 0 var(--color-bg-hero), 2px 2px 0 var(--color-bg-hero)`
const OUTLINE_RED = `-2px -2px 0 var(--color-accent), 2px -2px 0 var(--color-accent), -2px 2px 0 var(--color-accent), 2px 2px 0 var(--color-accent)`

/** Hora de inicio de sesión (fija durante la carga de la pantalla). */
const SESSION_TIME = new Date().toTimeString().slice(0, 8)

/**
 * Pantalla principal = MENÚ PRINCIPAL del sistema. Reconstrucción fiel de la
 * referencia persona-hero.html como componentes React: overlays de textura
 * (halftone, ink blot, speed-lines, floaters, scanlines), palabra fantasma,
 * hazard stripe, topbar de sistema, bloque de título en 3 líneas, navegación
 * de comandos △ □ ○ ✕ con glitch-slice al hover y footer con el disparador
 * "ENTRAR AL SISTEMA". Esta pantalla no monta el HUD global: trae su propia
 * topbar. La pantalla entera es fija y no hace scroll.
 */
export function Home() {
  return (
    <Screen className="bg-bg-hero text-paper">
      <section className="relative h-dvh w-full overflow-hidden">
        {/* Overlays de fondo del sistema (solo menú principal) */}
        <HalftoneOverlay />
        <InkBlot />
        <SpeedLines />
        <Floaters />
        <ScanlineOverlay />
        <GhostBgWord>{profile.hero.ghost}</GhostBgWord>

        {/* Marco superior */}
        <HazardStripe />
        <div className="hero-topbar absolute inset-x-0 top-[14px] z-40 flex items-center justify-between gap-4 px-6 py-3.5 md:px-10">
          <SystemLabel className="text-paper/60 tracking-[0.15em]">
            {profile.branding.system}
          </SystemLabel>
          <span className="hidden truncate text-center text-label font-medium uppercase tracking-[0.15em] text-paper/70 sm:block">
            SESIÓN {SESSION_TIME}
          </span>
          <SystemLabel className="text-paper/60 tracking-[0.15em]">
            {profile.branding.system.split(' ')[0]} {profile.branding.version}
          </SystemLabel>
        </div>

        {/* Bloque de título */}
        <div className="hero-title-block absolute left-5 top-[22%] z-10 max-w-[calc(100%-2.5rem)] lg:left-[60px] lg:top-[38%] lg:max-w-none">
          <p className="hero-eyebrow mb-3.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true">◄</span>
            {profile.hero.eyebrow}
          </p>

          <h1
            className="hero-h1 font-display uppercase leading-[1.08] tracking-[0.005em]"
            style={{ fontSize: 'clamp(2.75rem, 5vw, 6rem)' }}
          >
            <span className="block">
              <span
                className="inline-block"
                style={{
                  transform: 'rotate(-1.5deg)',
                  textShadow: `${OUTLINE_BLACK}, 5px 5px 0 var(--color-accent-deep)`,
                }}
              >
                {nameLine1}
              </span>
            </span>
            <span
              className="block"
              style={{
                marginTop: 6,
                transform: 'rotate(1deg) translateX(14px)',
                textShadow: `${OUTLINE_RED}, 5px 5px 0 var(--color-bg-hero)`,
              }}
            >
              {nameLine2}
            </span>
            <span className="block" style={{ marginTop: 10 }}>
              <span
                className="inline-block bg-accent px-[18px] pb-[6px] pt-[2px] text-ink [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] [box-shadow:6px_6px_0_var(--color-paper)]"
                style={{ transform: 'skew(-6deg) rotate(-1deg)' }}
              >
                {nameLine3}
              </span>
            </span>
          </h1>

          <p className="hero-tagline mt-7 max-w-[380px] text-[13px] leading-relaxed tracking-[0.05em] text-paper/75">
            {profile.tagline}
          </p>
        </div>

        {/* Navegación de comandos */}
        <nav
          aria-label="Menú principal del portfolio"
          className="hero-command-nav absolute bottom-[14%] left-1/2 z-20 w-[min(78vw,26rem)] -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-[6%] lg:top-1/2 lg:w-[min(40vw,600px)] lg:-translate-y-1/2 lg:translate-x-0"
        >
          <ol className="flex flex-col gap-2">
            {HERO_COMMANDS.map((command) => (
              <CommandNavItem key={command.id} {...command} />
            ))}
          </ol>
        </nav>

        {/* Pie del sistema */}
        <footer className="hero-footer absolute inset-x-0 bottom-0 z-40 flex items-center justify-center gap-3 border-t border-paper/10 px-6 py-4 md:px-10 sm:justify-between">
          <SystemLabel className="max-sm:hidden text-paper/50 tracking-[0.1em] sm:inline-flex">
            {profile.hero.roleLine} · {profile.hero.credentialLine}
          </SystemLabel>
          <ContactButton />
          <SystemLabel className="max-lg:hidden text-paper/50 tracking-[0.1em] lg:inline-flex lg:pr-32">
            ESC · Salir del menú
          </SystemLabel>
        </footer>
      </section>
    </Screen>
  )
}
