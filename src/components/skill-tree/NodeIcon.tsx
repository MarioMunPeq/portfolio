import type { SkillIconKind } from '../../data/skill-tree'

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/**
 * Icono de campo de cada nodo del árbol (trazos finos que heredan el color
 * con currentColor): gorro de graduación, antena, robot, corchetes de código,
 * chip y ? para la etapa futura. Originales, sin arte del juego de referencia.
 */
export function NodeIcon({ kind, className = '' }: { kind: SkillIconKind; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} {...STROKE}>
      {kind === 'cap' && (
        <>
          <path d="M18 56 L50 42 L82 56 L50 70 Z" />
          <path d="M18 56 V70 L50 82 L82 70 V56" />
          <path d="M30 62 V73 L50 84" />
        </>
      )}
      {kind === 'antenna' && (
        <>
          {/* Plato parabólico */}
          <path d="M22 40 A34 34 0 0 0 58 78" />
          {/* Brazo hacia el receptor */}
          <path d="M22 40 L48 58" />
          {/* Receptor en el foco */}
          <circle cx="52" cy="62" r="5" />
          {/* Ondas de señal */}
          <path d="M66 22 C80 26 80 40 66 44" />
          <path d="M56 14 C86 20 86 46 56 52" />
        </>
      )}
      {kind === 'robot' && (
        <>
          <path d="M50 36 V24" />
          <circle cx="50" cy="18" r="4.5" />
          <rect x="30" y="36" width="40" height="34" rx="7" />
          <circle cx="42" cy="52" r="4.5" />
          <circle cx="58" cy="52" r="4.5" />
          <path d="M42 62 H58" />
        </>
      )}
      {kind === 'code' && (
        <>
          <path d="M37 40 L21 50 L37 60" />
          <path d="M63 40 L79 50 L63 60" />
          <path d="M58 34 L42 66" />
        </>
      )}
      {kind === 'chip' && (
        <>
          <rect x="34" y="34" width="32" height="32" />
          <rect x="44" y="44" width="12" height="12" />
          <path d="M50 20 V34 M50 66 V80 M20 50 H34 M66 50 H80" />
        </>
      )}
      {kind === 'question' && (
        <>
          <path d="M36 32 A14 14 0 0 1 64 32 C64 42 50 42 50 54" />
          <circle cx="50" cy="70" r="4.5" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  )
}
