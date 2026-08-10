import type { ReactNode } from 'react'

interface ScreenHeaderProps {
  index: string
  label: string
  title: ReactNode
  /** true si vive sobre fondo oscuro. */
  onDark?: boolean
}

/**
 * Cabecera de pantalla de contenido: índice fantasma gigante, etiqueta
 * con marcador angular, título display y acento diagonal rojo. Refuerza
 * el lenguaje de "interfaz de juego" con numeración visible.
 */
export function ScreenHeader({ index, label, title, onDark = false }: ScreenHeaderProps) {
  return (
    <header className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 overflow-hidden">
        <span
          className={`block select-none font-display uppercase leading-none ${
            onDark ? 'text-paper/[0.06]' : 'text-ink/[0.06]'
          }`}
          style={{ fontSize: 'clamp(6rem, 17vw, 13rem)' }}
        >
          {index}
        </span>
      </div>

      <span
        className={`inline-flex items-center gap-2.5 text-label font-medium uppercase tracking-[0.22em] ${
          onDark ? 'text-paper' : 'text-ink'
        }`}
      >
        <span
          aria-hidden="true"
          className="inline-block h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
        />
        {label}
      </span>

      <h1
        className={`relative mt-4 max-w-[14ch] font-display uppercase leading-none ${
          onDark ? 'text-paper' : 'text-ink'
        }`}
        style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
      >
        {title}
      </h1>

      <span
        aria-hidden="true"
        className={`mt-5 block h-2 w-40 -skew-x-12 ${
          onDark ? 'bg-accent/80' : 'bg-accent'
        }`}
      />
    </header>
  )
}
