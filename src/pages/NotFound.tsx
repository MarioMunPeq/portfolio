import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="relative flex min-h-dvh flex-col items-start justify-center overflow-hidden bg-bg-hero px-6 py-12 text-paper">
      <p className="text-label uppercase tracking-[0.3em] text-paper/60">
        ERROR 404
      </p>
      <h1 className="mt-4 font-display text-hero uppercase leading-none text-accent">
        Sin ruta
      </h1>
      <p className="mt-6 max-w-xl text-body leading-relaxed text-paper/80">
        Esta página no existe. O quizá nunca existió.
      </p>
      <Link
        to="/"
        className="mt-10 inline-block bg-accent px-6 py-3 font-medium uppercase tracking-[0.18em] text-paper hover:bg-accent-alt"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
