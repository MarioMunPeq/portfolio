const CHARCOAL = '#111111'
const YELLOW = '#FFD21A'
const ORANGE = '#F5A900'
const DARK_ORANGE = '#D98200'

/**
 * Estrella facetada estilo Persona 5 Social Stats.
 *
 * Silueta exterior: EXACTAMENTE 5 puntas (10 puntos alternando punta/valle).
 * Interior: 8 facetas grandes (triángulos + cuadriláteros) con colores sólidos.
 * Sin degradados, sin transparencia, sin blur.
 *
 * Estructura de capas:
 *   1. Silueta negra con trazo grueso (outline exterior)
 *   2. Estrella naranja base
 *   3. Facetas amarillas (planos iluminados)
 *   4. Facetas naranja oscuro (planos en sombra)
 *   5. Ridge lines selectivas (contraste luz/sombra)
 */
export function SocialStar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    >
      {/* ── 1. Silueta exterior: 5 puntas exactas ── */}
      {/* P=punta (exterior), V=valle (interior) */}
      {/* P1(top) V1 P2(upper-right) V2 P3(lower-right) V3 P4(lower-left) V4 P5(upper-left) V5 */}
      <polygon
        points="150,20 179,110 274,110 200,166 224,252 150,198 74,255 102,166 28,111 119,108"
        fill={CHARCOAL}
        stroke={CHARCOAL}
        strokeWidth="8"
        strokeLinejoin="miter"
      />

      {/* ── 2. Estrella naranja base ── */}
      <polygon
        points="150,20 179,110 274,110 200,166 224,252 150,198 74,255 102,166 28,111 119,108"
        fill={ORANGE}
      />

      {/* ── 3. Facetas amarillas (planos iluminados, luz superior-izquierda) ── */}

      {/* Gran cuadrilátera: cara izquierda del brazo superior + brazo superior-izquierdo */}
      <polygon
        points="150,20 119,108 28,111 148,146"
        fill={YELLOW}
      />

      {/* Brazo superior-derecho, cara superior iluminada */}
      <polygon
        points="274,110 179,110 148,146"
        fill={YELLOW}
      />

      {/* ── 4. Facetas naranja oscuro (planos en sombra) ── */}

      {/* Brazo superior, cara derecha en sombra */}
      <polygon
        points="150,20 148,146 179,110"
        fill={DARK_ORANGE}
      />

      {/* Brazo superior-derecho, cara inferior en sombra */}
      <polygon
        points="274,110 148,146 200,166"
        fill={DARK_ORANGE}
      />

      {/* Gran cuadrilátera inferior: sombra profunda en brazos inferiores */}
      <polygon
        points="224,252 148,146 74,255 150,198"
        fill={DARK_ORANGE}
      />

      {/* ── 5. Facetas naranja (tonos medios) ── */}

      {/* Brazo inferior-derecho, cara superior */}
      <polygon
        points="224,252 200,166 148,146"
        fill={ORANGE}
      />

      {/* Brazo inferior-izquierdo, cara superior */}
      <polygon
        points="74,255 148,146 102,166"
        fill={ORANGE}
      />

      {/* Brazo superior-izquierdo, cara inferior */}
      <polygon
        points="28,111 102,166 148,146"
        fill={ORANGE}
      />

      {/* ── 6. Ridge lines selectivas (bordes de mayor contraste) ── */}
      <line x1="150" y1="20" x2="148" y2="146" stroke={CHARCOAL} strokeWidth="3" />
      <line x1="274" y1="110" x2="148" y2="146" stroke={CHARCOAL} strokeWidth="3" />
    </svg>
  )
}
