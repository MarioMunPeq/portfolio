import type { ReactNode } from 'react'

const CLIP = '[clip-path:polygon(8px_0,100%_0,calc(100%_-_8px)_100%,0_100%)]'

interface TagProps {
  children: ReactNode
  /** Relleno del sello: rojo, oscuro o claro. El amarillo queda reservado a la estrella. */
  tone?: 'red' | 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  /** Fuente del texto del sello: P5 Menu (por defecto) o P5 Hatty (etiquetas de la página de Habilidades). */
  font?: 'p5-menu' | 'hatty'
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

const fontClass = {
  'p5-menu': 'font-p5-menu',
  hatty: 'font-hatty',
} as const

/**
 * Sello/tag angular recortado (viñeta de cómic) con sombra de offset dura.
 * Solo rojo/negro/blanco: el amarillo se reserva para la estrella de Social
 * Stats. La sombra se aplica con drop-shadow en el contenedor (sigue el clip
 * recortado) en offsets enteros de 3px para que no se vea borrosa ni doblada.
 */
export function Tag({ children, tone = 'red', size = 'md', font = 'p5-menu', className = '' }: TagProps) {
  return (
    <span
      className={`relative inline-flex ${className}`}
      style={{ filter: 'drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.9))' }}
    >
      <span
        className={`relative inline-flex items-center gap-2 ${CLIP} ${toneClass[tone]} ${sizeClass[size]} ${fontClass[font]} uppercase leading-none tracking-[0.08em]`}
      >
        {children}
      </span>
    </span>
  )
}
