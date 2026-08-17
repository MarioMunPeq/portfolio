const ORANGE = '#F5A900'
const YELLOW = '#FFD21A'
const DARK_ORANGE = '#D98200'
const CHARCOAL = '#171717'

/**
 * Estrella facetada de cristal/papel doblado estilo Persona 5 Social Stats.
 * Cuatro capas de polígonos con aristas duras sin degradados:
 *   1. Silueta oscura (#171717) con trazo grueso — se extiende más abajo
 *   2. Estrella principal (#F5A900 naranja) — base saturada
 *   3. Facetas claras (#FFD21A amarillo) — planos iluminados
 *   4. Facetas oscuras (#D98200 naranja oscuro) — planos en sombra
 * Cada faceta es un triángulo individual que converge hacia el centro,
 * creando la ilusión de un material plegado/cristalino.
 * Requiere un contenedor con aspect-square.
 */
export function SocialStar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    >
      {/* 1 · Silueta exterior oscura — se extiende más en los bordes inferiores */}
      <polygon
        points="150,12 176,88 198,16 222,92 288,98 230,140 274,210 208,184 202,272 158,198 114,290 126,198 50,242 110,174 12,190 104,148 16,92 112,126"
        fill={CHARCOAL}
        stroke={CHARCOAL}
        strokeWidth="6"
        strokeLinejoin="miter"
      />

      {/* 2 · Estrella principal naranja — base saturada */}
      <polygon
        points="150,24 178,92 200,28 224,96 282,102 226,140 266,206 204,182 196,264 156,196 118,280 128,196 56,234 114,172 24,186 108,148 26,100 116,128"
        fill={ORANGE}
        stroke={CHARCOAL}
        strokeWidth="5"
        strokeLinejoin="miter"
      />

      {/* 3 · Facetas amarillas — planos iluminados (superiores e izquierdos) */}

      {/* Brazo superior — cara izquierda iluminada */}
      <polygon
        points="150,24 150,150 120,96"
        fill={YELLOW}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo superior derecho — cara izquierda iluminada */}
      <polygon
        points="200,28 150,150 162,84"
        fill={YELLOW}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo derecho — cara superior iluminada */}
      <polygon
        points="282,102 150,150 216,118"
        fill={YELLOW}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo inferior derecho — cara superior iluminada */}
      <polygon
        points="196,264 150,150 192,198"
        fill={YELLOW}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo inferior izquierdo — cara derecha iluminada */}
      <polygon
        points="118,280 150,150 144,210"
        fill={YELLOW}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* 4 · Facetas naranja oscuro — planos en sombra (inferiores y derechos) */}

      {/* Brazo superior — cara derecha en sombra */}
      <polygon
        points="150,24 150,150 178,92"
        fill={DARK_ORANGE}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo superior derecho — cara derecha en sombra */}
      <polygon
        points="200,28 150,150 224,96"
        fill={DARK_ORANGE}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo derecho — cara inferior en sombra */}
      <polygon
        points="282,102 150,150 226,140"
        fill={DARK_ORANGE}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo inferior derecho — cara inferior en sombra */}
      <polygon
        points="196,264 150,150 156,196"
        fill={DARK_ORANGE}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />

      {/* Brazo inferior izquierdo — cara izquierda en sombra */}
      <polygon
        points="118,280 150,150 114,198"
        fill={DARK_ORANGE}
        stroke={CHARCOAL}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
