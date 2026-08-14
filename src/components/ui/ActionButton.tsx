import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const CHIP_CLASSES =
  'group inline-flex items-center justify-center gap-3 border-2 border-paper/60 bg-bg-content-alt px-5 py-2.5 font-display text-[13px] uppercase tracking-[0.15em] text-paper [clip-path:polygon(10px_0,100%_0,calc(100%_-_10px)_100%,0_100%)] transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink md:px-6 md:py-3 md:text-base'

interface ActionButtonProps {
  to: string
  children: ReactNode
  /** Flecha ◀ de "volver" opcional. */
  arrow?: 'back' | 'none'
  dataCursor?: string
  className?: string
}

/**
 * Chip de acción angular (viñeta de cómic) — el mismo tratamiento para
 * "VOLVER AL MENÚ" y "CONTACTO": borde papel, relleno oscuro, corte
 * diagonal y relleno rojo al hover. Vive en la BottomBar y en el pie del
 * menú principal.
 */
export function ActionButton({
  to,
  children,
  arrow = 'none',
  dataCursor,
  className = '',
}: ActionButtonProps) {
  return (
    <Link to={to} data-cursor={dataCursor} className={`${CHIP_CLASSES} ${className}`}>
      {arrow === 'back' && (
        <span aria-hidden="true" className="text-accent transition-colors duration-200 group-hover:text-ink">
          ◀
        </span>
      )}
      {children}
    </Link>
  )
}
