import type { CSSProperties, ReactNode } from 'react'

interface AnnotationProps {
  children: ReactNode
  /** Color del texto y del marcador. */
  tone?: 'red' | 'paper'
  /** Marcador decorativo dibujado a mano. */
  marker?: 'arrow' | 'star' | 'none'
  /** Añade una carita sonriente al final. */
  smile?: boolean
  className?: string
  style?: CSSProperties
}

const toneClass = {
  red: 'text-accent',
  paper: 'text-paper/80',
} as const

function Marker({ type, tone }: { type: 'arrow' | 'star'; tone: 'red' | 'paper' }) {
  const stroke = tone === 'red' ? '#e60012' : 'rgba(245,245,240,0.85)'
  if (type === 'arrow') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[1.1em] w-[1.1em] shrink-0"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 17c4-3 8-5 14-6" />
        <path d="M14 6l4 5-6 1" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[0.9em] w-[0.9em] shrink-0"
      fill={stroke}
    >
      <path d="M12 2l2.4 6.2L21 9l-5 4 1.7 6.5L12 16l-5.7 3.5L8 13l-5-4 6.6-.8z" />
    </svg>
  )
}

function Smile() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1em] w-[1em] shrink-0 -scale-x-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 10.5h.01M15.5 10.5h.01" strokeWidth="2.4" />
      <path d="M7.5 14c1.2 1.8 2.8 2.8 4.5 2.8s3.3-1 4.5-2.8" />
    </svg>
  )
}

/**
 * Etiqueta manuscrita (Caveat) con marcador dibujado a mano — el equivalente
 * a las notas/garabatos de la interfaz de Persona 5. Decorativa y ligera.
 */
export function Annotation({
  children,
  tone = 'red',
  marker = 'arrow',
  smile = false,
  className = '',
  style,
}: AnnotationProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-hand text-2xl leading-none ${toneClass[tone]} ${className}`}
      style={style}
    >
      {marker !== 'none' ? <Marker type={marker} tone={tone} /> : null}
      <span>{children}</span>
      {smile ? <Smile /> : null}
    </span>
  )
}
