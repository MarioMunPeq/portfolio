import type { ElementType, ReactNode } from 'react'

interface SystemLabelProps {
  children: ReactNode
  /** Etiqueta semántica (span, p, div…). */
  as?: ElementType
  className?: string
}

/**
 * Etiqueta tipo "interfaz de sistema": mayúsculas, tono label del sistema
 * y tracking amplio configurable. Reutilizable como patrón de microcopy en
 * todo el sitio (topbars, footers, metadata).
 */
export function SystemLabel({ children, as: Tag = 'span', className = '' }: SystemLabelProps) {
  return (
    <Tag className={`inline-flex items-center gap-2 text-label font-medium uppercase ${className}`}>
      {children}
    </Tag>
  )
}
