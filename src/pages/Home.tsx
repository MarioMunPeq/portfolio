import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Screen } from '../components/transition/Screen'
import { profile } from '../data/profile'
import { useBooted } from '../lib/boot'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

const NAME_SIZE = 'clamp(2.75rem, 9.5vw, 8rem)'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

const nameReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  show: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.9, ease: EASE, delay: 0.2 },
  },
}

export function Home() {
  const reduced = useReducedMotion()
  const booted = useBooted()
  const { hero, branding, role, roleFull, alias } = profile

  const parts = profile.name.trim().split(/\s+/)
  const first = parts[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  const middle = parts.length > 2 ? parts.slice(1, -1).join(' ') : null

  return (
    <Screen className="bg-bg-hero text-paper">
      <section className="relative min-h-dvh overflow-hidden">
        <motion.div
          className="relative flex min-h-dvh flex-col"
          initial={reduced ? false : 'hidden'}
          animate={reduced || booted ? 'show' : 'hidden'}
          variants={container}
        >
          {/* Capa decorativa: fantasma, diagonales, rejilla y marcos */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <motion.span
              variants={fade}
              className="absolute -right-[3%] top-[4%] -rotate-6 select-none font-display uppercase leading-none text-outline-faint"
              style={{ fontSize: 'clamp(9rem, 28vw, 24rem)' }}
            >
              {alias}
            </motion.span>
            <motion.span
              variants={fade}
              className="absolute right-[9%] top-[15%] block h-2 w-40 -skew-x-12 bg-accent"
            />
            <motion.span
              variants={fade}
              className="absolute inset-y-0 left-1/3 w-px bg-paper/5"
            />
            <motion.span
              variants={fade}
              className="absolute inset-y-0 left-2/3 w-px bg-paper/5"
            />
            <motion.span
              variants={fade}
              className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-paper/20 md:left-5 md:top-5"
            />
            <motion.span
              variants={fade}
              className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-paper/20 md:right-5 md:top-5"
            />
            <motion.span
              variants={fade}
              className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-paper/20 md:bottom-5 md:left-5"
            />
            <motion.span
              variants={fade}
              className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-paper/20 md:bottom-5 md:right-5"
            />
          </div>

          {/* Etiqueta vertical izquierda */}
          <motion.span
            variants={fade}
            className="absolute left-5 top-1/2 hidden -translate-y-1/2 text-label uppercase tracking-[0.45em] text-paper/40 [writing-mode:vertical-rl] md:block"
          >
            {branding.cvViviente} — 2026
          </motion.span>

          {/* Franja superior de estado */}
          <motion.header
            variants={fade}
            className="relative z-10 flex items-center justify-between border-b border-paper/10 px-6 py-4 md:px-10"
          >
            <span className="text-label uppercase tracking-[0.3em] text-paper/60">
              {alias} — Portfolio
            </span>
            <span className="hidden text-label uppercase tracking-[0.3em] text-paper/60 md:inline">
              {branding.cvViviente} · {hero.region}
            </span>
            <span className="text-label uppercase tracking-[0.3em] text-paper/60">
              01 / 06
            </span>
          </motion.header>

          {/* Bloque principal: nombre dominante + rol */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-10 md:px-10">
            <motion.p
              variants={fade}
              className="flex items-center gap-2.5 text-label uppercase tracking-[0.3em] text-accent"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
              />
              {roleFull}
            </motion.p>

            <motion.h1
              variants={nameReveal}
              className="mt-5 font-display uppercase leading-[0.95]"
              style={{ fontSize: NAME_SIZE }}
            >
              <span className="block text-paper">{first}</span>
              <span className="block text-outline md:translate-x-[9%]">
                {middle ?? last}
              </span>
              {middle ? (
                <span className="relative z-10 block md:translate-x-[18%]">
                  <span className="relative inline-block -skew-x-6 bg-accent px-[0.1em] leading-[1.02] text-paper">
                    <span className="inline-block skew-x-6">{last}</span>
                  </span>
                </span>
              ) : null}
            </motion.h1>

            <motion.div
              variants={fade}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <span className="inline-block -skew-x-12 bg-accent px-5 py-2.5">
                <span className="inline-block skew-x-12 font-display text-xl uppercase tracking-[0.15em] text-paper">
                  {role}
                </span>
              </span>
              <span className="text-label uppercase tracking-[0.3em] text-paper/50">
                Proyectos · Experiencia · Formación
              </span>
            </motion.div>
          </div>

          {/* Franja inferior: CTA, scroll y metadata */}
          <motion.footer
            variants={fade}
            className="relative z-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 px-6 pb-8 md:px-10"
          >
            <div className="flex flex-wrap items-center gap-8">
              <Link
                to="/projects"
                className="inline-flex items-center gap-3 border-2 border-paper px-6 py-3 font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:border-accent hover:bg-accent"
              >
                Entrar al sistema
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)] transition-colors group-hover:bg-paper"
                />
              </Link>
              <div className="flex items-center gap-3 text-label uppercase tracking-[0.3em] text-paper/50">
                <span>Scroll</span>
                <span className="relative block h-px w-28 bg-paper/25">
                  <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)] animate-[scroll-marker_1.8s_ease-in-out_infinite]" />
                </span>
              </div>
            </div>

            <div className="hidden text-right md:block">
              <p className="font-medium uppercase tracking-[0.2em] text-paper/80">
                {hero.roleLine}
              </p>
              <p className="mt-1 text-label uppercase tracking-[0.3em] text-paper/50">
                {hero.credentialLine}
              </p>
              <p className="mt-1 text-label uppercase tracking-[0.3em] text-paper/50">
                {hero.coordinates}
              </p>
            </div>
          </motion.footer>
        </motion.div>
      </section>
    </Screen>
  )
}
