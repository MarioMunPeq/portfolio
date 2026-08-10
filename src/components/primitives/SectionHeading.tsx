import type { ReactNode } from 'react'
import { SectionLabel } from './SectionLabel'

interface SectionHeadingProps {
  label: string
  title: ReactNode
  /** true si la cabecera vive sobre fondo oscuro. */
  onDark?: boolean
}

export function SectionHeading({ label, title, onDark = false }: SectionHeadingProps) {
  return (
    <header>
      <SectionLabel onDark={onDark}>{label}</SectionLabel>
      <h2
        className={`mt-4 font-display text-section-title uppercase leading-none ${
          onDark ? 'text-paper' : 'text-ink'
        }`}
      >
        {title}
      </h2>
    </header>
  )
}
