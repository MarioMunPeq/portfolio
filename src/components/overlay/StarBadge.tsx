import { forwardRef } from 'react'

export type StarBadgeState = 'empty' | 'full'

interface StarBadgeProps {
  /** Estado de completado de la categoría. */
  state?: StarBadgeState
  /** Nombre de la categoría (accesibilidad). */
  label: string
}

/**
 * Sello de estrella de la pantalla de carga. Sin barras ni porcentajes: una
 * estrella hueca que se rellena en dorado cuando la categoría termina de
 * "cargar". Solo dos estados visuales (vacío → completo); el morfo lo hace
 * el CSS de tokens.css con una transición limpia, sin estados intermedios.
 */
export const StarBadge = forwardRef<HTMLDivElement, StarBadgeProps>(
  function StarBadge({ state = 'empty', label }, ref) {
    return (
      <div
        ref={ref}
        data-state={state}
        role="img"
        aria-label={label}
        className="star-badge shrink-0"
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <polygon
            className="star-outline"
            points="50,5 61,38 96,38 68,59 79,92 50,71 21,92 32,59 4,38 39,38"
          />
          <polygon
            className="star-fill"
            points="50,20 58,42 82,42 62,56 70,80 50,66 30,80 38,56 18,42 42,42"
          />
        </svg>
      </div>
    )
  },
)
