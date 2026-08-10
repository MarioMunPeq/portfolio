import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  /** true si el label vive sobre fondo oscuro. */
  onDark?: boolean
}

export function SectionLabel({ children, onDark = false }: SectionLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.22em] ${
        onDark ? 'text-paper' : 'text-ink'
      }`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-3 w-3 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)]"
      />
      {children}
    </span>
  )
}
