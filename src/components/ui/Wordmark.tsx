import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'

/** Monograma derivado del nombre (Mario Muñoz Pequeño → MMP). */
const INITIALS = profile.name
  .trim()
  .split(/\s+/)
  .slice(0, 3)
  .map((part) => part.charAt(0) ?? '')
  .join('')
  .toUpperCase()

interface WordmarkProps {
  className?: string
}

/**
 * Marca de sistema: monograma corto (MMP) sobre la etiqueta completa
 * "SISTEMA PERSONAL". Es el primer slot de la TopBar y de la barra del
 * menú principal; enlaza a la pantalla de inicio.
 */
export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <Link
      to="/"
      data-cursor="back"
      className={`group inline-flex items-center gap-2.5 text-label font-medium uppercase tracking-[0.25em] ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 bg-accent [clip-path:polygon(100%_0,100%_100%,0_50%)] transition-transform duration-200 group-hover:translate-x-0.5"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-base tracking-[0.2em] text-paper transition-colors duration-200 group-hover:text-accent">
          {INITIALS}
        </span>
        <span className="mt-0.5 text-[10px] tracking-[0.25em] text-paper/60">
          {profile.branding.system}
        </span>
      </span>
    </Link>
  )
}
