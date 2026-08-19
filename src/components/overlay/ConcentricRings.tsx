/** Composicion grafica de anillos que ENMARCA el antifaz (no un radar):
 *  aro exterior punteado casi invisible, dos arcos laterales (rojo +
 *  papel) y marcas tecnicas en los cardinales. Se pinta DETRaS del
 *  antifaz, de modo que solo asoma alrededor de la silueta. */
const ACCENT = "var(--color-accent)";
const PAPER = "rgba(245, 245, 240, 1)";

/** Arco izquierdo (165° → 250° de un circulo de radio 290, centro 300,300). */
const LEFT_ARC = "M 19.9 375.1 A 290 290 0 0 1 200.8 27.5";
/** Arco derecho (345° → 70°). */
const RIGHT_ARC = "M 580.1 224.9 A 290 290 0 0 1 399.2 572.5";

interface ConcentricRingsProps {
  /** Destello corto de los arcos cuando el antifaz termina de revelarse. */
  revealed: boolean;
  /** Sin movimiento: estructura estatica. */
  reduced: boolean;
}

export function ConcentricRings({ revealed, reduced }: ConcentricRingsProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "50%", top: "46%" }}
      >
        <svg
          viewBox="0 0 600 600"
          className="h-[min(70vh,340px)] w-[min(70vh,340px)] lg:h-[min(78vh,820px)] lg:w-[min(78vh,820px)]"
        >
          {/* Aro exterior punteado, giro lentisimo (atmosferico) */}
          <circle
            cx="300"
            cy="300"
            r="290"
            fill="none"
            stroke={PAPER}
            strokeWidth="1"
            opacity="0.12"
            strokeDasharray="1.5 12"
            className={reduced ? "" : "rings-dotted"}
          />
          {/* Arcos laterales: enmarcan el antifaz */}
          <path
            d={LEFT_ARC}
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.5"
            opacity="0.28"
            className={revealed && !reduced ? "rings-arcs--flash" : ""}
          />
          <path
            d={RIGHT_ARC}
            fill="none"
            stroke={PAPER}
            strokeWidth="1"
            opacity="0.14"
          />
          {/* Aro de fijacion interior (asoma solo por encima/debajo del antifaz) */}
          <circle
            cx="300"
            cy="300"
            r="160"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            opacity="0.14"
            strokeDasharray="5 12"
          />
          {/* Marcas tecnicas en los cardinales */}
          <line
            x1="298"
            y1="2"
            x2="302"
            y2="2"
            stroke={PAPER}
            strokeWidth="2"
            opacity="0.22"
          />
          <line
            x1="298"
            y1="598"
            x2="302"
            y2="598"
            stroke={PAPER}
            strokeWidth="2"
            opacity="0.22"
          />
          <line
            x1="2"
            y1="298"
            x2="2"
            y2="302"
            stroke={PAPER}
            strokeWidth="2"
            opacity="0.22"
          />
          <line
            x1="598"
            y1="298"
            x2="598"
            y2="302"
            stroke={PAPER}
            strokeWidth="2"
            opacity="0.22"
          />
          {/* Diamante superior de la marca */}
          <rect
            x="297.5"
            y="8"
            width="5"
            height="5"
            fill={ACCENT}
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}
