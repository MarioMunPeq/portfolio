import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react'
import { Sweep } from '../../components/primitives/Sweep'
import { profile } from '../../data/profile'
import { useBooted } from '../../lib/boot'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const rise: Variants = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.75, ease: EASE } },
}

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

const slash: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } },
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const booted = useBooted()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 90])

  const firstName = profile.name.split(' ').slice(0, 2).join(' ')
  const surname = profile.name.split(' ').slice(2).join(' ')

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-dvh overflow-hidden bg-bg-hero text-paper"
    >
      {reduced ? null : <Sweep progress={scrollYProgress} fadeOutAt={0.72} />}

      <motion.div
        className="relative flex min-h-dvh flex-col"
        initial={reduced ? false : 'hidden'}
        animate={reduced || booted ? 'show' : 'hidden'}
        variants={container}
      >
        {/* Capa decorativa: diagonales, rejilla y marcos de esquina */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            variants={fade}
            className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-paper/20 md:left-5 md:top-5"
          />
          <motion.div
            variants={fade}
            className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-paper/20 md:right-5 md:top-5"
          />
          <motion.div
            variants={fade}
            className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-paper/20 md:bottom-5 md:left-5"
          />
          <motion.div
            variants={fade}
            className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-paper/20 md:bottom-5 md:right-5"
          />
          <motion.div
            variants={fade}
            className="absolute inset-y-0 left-1/3 w-px bg-paper/5"
          />
          <motion.div
            variants={fade}
            className="absolute inset-y-0 left-2/3 w-px bg-paper/5"
          />
          <motion.div
            variants={slash}
            className="absolute right-0 top-[24%] h-1.5 w-[58%] origin-left bg-accent"
            style={{ rotate: -10 }}
          />
        </div>

        {/* Franja superior de estado */}
        <motion.header
          variants={fade}
          className="flex items-center justify-between border-b border-paper/10 px-6 py-4 md:px-10"
        >
          <span className="text-label uppercase tracking-[0.3em] text-paper/60">
            XNAQUE
          </span>
          <span className="hidden text-label uppercase tracking-[0.3em] text-paper/60 md:inline">
            Portfolio — CV viviente
          </span>
          <span className="text-label uppercase tracking-[0.3em] text-paper/60">
            Valladolid · Es
          </span>
        </motion.header>

        {/* Nombre: bloque tipográfico dominante */}
        <div className="flex flex-1 flex-col justify-center px-6 md:px-10">
          <motion.p
            variants={fade}
            className="flex items-center gap-2.5 text-label uppercase tracking-[0.3em] text-accent"
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
            />
            {profile.alias} — {profile.roleFull}
          </motion.p>

          <motion.h1
            className="mt-6 font-display uppercase leading-none"
            style={reduced ? undefined : { y: parallaxY }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={rise} className="block text-hero text-paper">
                {firstName}
              </motion.span>
            </span>
            <span className="block overflow-hidden md:translate-x-[14%]">
              <motion.span
                variants={rise}
                className="block text-hero text-outline"
              >
                {surname}
              </motion.span>
            </span>
          </motion.h1>
        </div>

        {/* Franja inferior: rol, scroll y metadata */}
        <div className="px-6 pb-8 md:px-10">
          <motion.div
            variants={fade}
            className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8"
          >
            <div>
              <span className="inline-block -skew-x-12 bg-accent px-5 py-2.5">
                <span className="inline-block skew-x-12 font-display text-xl uppercase tracking-[0.15em] text-paper">
                  {profile.role}
                </span>
              </span>
              <div className="mt-6 flex items-center gap-3 text-label uppercase tracking-[0.3em] text-paper/60">
                <span>Scroll</span>
                <span className="relative block h-px w-28 bg-paper/25">
                  <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)] animate-[scroll-marker_1.8s_ease-in-out_infinite]" />
                </span>
              </div>
            </div>

            <div className="hidden text-right md:block">
              <p className="font-medium uppercase tracking-[0.2em] text-paper/80">
                Aplicaciones multiplataforma
              </p>
              <p className="mt-1 text-label uppercase tracking-[0.3em] text-paper/50">
                F.P. Grado Superior — DAM
              </p>
              <p className="mt-1 text-label uppercase tracking-[0.3em] text-paper/50">
                41.6523° N, 4.7245° O
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
