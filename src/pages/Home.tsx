import { Screen } from '../components/transition/Screen'
import { SystemLabel } from '../components/shared/SystemLabel'
import { Wordmark } from '../components/ui/Wordmark'
import { CommandNavItem } from '../components/hero/CommandNavItem'
import { HERO_COMMANDS } from '../components/hero/hero-commands'

const SESSION_TIME = new Date().toTimeString().slice(0, 8)

const MENU_CHAOS = [
  { rotation: -2, offsetX: 10 },
  { rotation: 1.5, offsetX: -5 },
  { rotation: -1, offsetX: 16 },
  { rotation: 2, offsetX: 2 },
]

/**
 * Menu principal estilo Persona 5 — fondo de metro con video,
 * sin presentacion personal, navegacion angular a la izquierda
 * con entrada escalonada.
 */
export function Home() {
  return (
    <Screen className="bg-ink text-paper">
      <section className="relative h-dvh w-full overflow-hidden">
        {/* Video de metro como fondo */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source
            src={`${import.meta.env.BASE_URL}videos/metro-background.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Capa de oscuridad sutil para legibilidad de la UI */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.45) 40%, rgba(10,10,10,0.15) 70%, transparent 100%)',
          }}
        />

        {/* Viñeta para profundidad */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(10,10,10,0.5) 100%)',
          }}
        />

        {/* Scanlines sutiles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] bg-scanlines [mix-blend-mode:overlay]"
        />

        {/* Marco superior */}
        <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-6 py-3.5 md:px-10">
          <Wordmark static />
          <span className="hidden truncate text-center text-label font-medium uppercase tracking-[0.15em] text-paper/70 sm:block">
            SESIoN {SESSION_TIME}
          </span>
          <SystemLabel className="text-paper/60 tracking-[0.15em]">
            SISTEMA V.2026
          </SystemLabel>
        </div>

        {/* Navegacion de comandos — columna izquierda compacta */}
        <nav
          aria-label="Menu principal del portfolio"
          className="absolute left-[4%] top-1/2 z-20 -translate-y-1/2 sm:left-[5%] lg:left-[6%]"
        >
          <ol className="flex w-[min(82vw,380px)] flex-col gap-3">
            {HERO_COMMANDS.map((command, i) => (
              <CommandNavItem
                key={command.id}
                {...command}
                animDelay={i * 0.1}
                rotation={MENU_CHAOS[i].rotation}
                offsetX={MENU_CHAOS[i].offsetX}
              />
            ))}
          </ol>
        </nav>
      </section>
    </Screen>
  )
}
