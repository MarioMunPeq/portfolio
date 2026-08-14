import type { ReactNode } from 'react'

const CLIP = '[clip-path:polygon(8px_0,100%_0,calc(100%_-_8px)_100%,0_100%)]'

interface TagProps {
  children: ReactNode
  /** Relleno del sello: rojo, oscuro o claro. El amarillo queda reservado a la estrella. */
  tone?: 'red' | 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const toneClass = {
  red: 'bg-accent text-paper',
  dark: 'bg-ink text-paper border border-paper/25',
  light: 'bg-paper text-ink',
} as const

const sizeClass = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-1.5 text-base',
  lg: 'px-4 py-2 text-sm sm:text-lg md:text-xl xl:text-2xl',
} as const

/**
 * Sello/tag angular recortado (viñeta de cómic) con respaldo oscuro
 * desplazado. Solo rojo/negro/blanco: el amarillo se reserva para la
 * estrella de Social Stats. Fuente P5 Menu (ransom-note) como piden los
 * tags del sistema.
 */
export function Tag({ children, tone = 'red', size = 'md', className = '' }: TagProps) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 ${CLIP} translate-x-[2.5px] translate-y-[3px] bg-black`}
      />
      <span
        className={`relative inline-flex items-center gap-2 ${CLIP} ${toneClass[tone]} ${sizeClass[size]} font-p5-menu uppercase leading-none tracking-[0.08em]`}
      >
        {children}
      </span>
    </span>
  )
}
