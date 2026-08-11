interface SkylineProps {
  /** Imagen real (skyline/foto) opcional: sustituye la silueta generada por
   *  código con un solo cambio de prop (<Skyline image="/skyline.png" />). */
  image?: string
}

type Tone = 'a' | 'b' | 'c'

interface Building {
  left: number
  w: number
  h: number
  tone: Tone
  antenna?: boolean
  sign?: boolean
}

const TONE: Record<Tone, string> = {
  a: 'var(--color-bg-content-alt)',
  b: 'color-mix(in srgb, var(--color-bg-content-alt) 68%, var(--color-ink))',
  c: 'color-mix(in srgb, var(--color-bg-content-alt) 78%, var(--color-paper))',
}

/** Fila de edificios geométricos (recurso, no ilustración): anchuras y
 *  alturas variables, algún mástil y tiras de luz. */
const BUILDINGS: Building[] = [
  { left: 0, w: 5.0, h: 52, tone: 'a' },
  { left: 5.6, w: 4.2, h: 30, tone: 'b' },
  { left: 10.4, w: 5.6, h: 78, tone: 'a', antenna: true },
  { left: 16.6, w: 4.0, h: 42, tone: 'c' },
  { left: 21.2, w: 6.4, h: 62, tone: 'b' },
  { left: 28.2, w: 4.6, h: 88, tone: 'a' },
  { left: 33.4, w: 3.6, h: 36, tone: 'c' },
  { left: 37.6, w: 5.4, h: 55, tone: 'b' },
  { left: 43.6, w: 6.8, h: 70, tone: 'a', antenna: true, sign: true },
  { left: 51.0, w: 4.4, h: 40, tone: 'c' },
  { left: 56.0, w: 5.2, h: 92, tone: 'a' },
  { left: 61.8, w: 3.8, h: 48, tone: 'b' },
  { left: 66.2, w: 6.0, h: 66, tone: 'c', sign: true },
  { left: 72.8, w: 4.6, h: 38, tone: 'b' },
  { left: 78.0, w: 5.8, h: 82, tone: 'a', antenna: true },
  { left: 84.4, w: 4.2, h: 54, tone: 'c' },
  { left: 89.2, w: 5.0, h: 34, tone: 'b' },
  { left: 94.8, w: 5.2, h: 68, tone: 'a' },
]

/**
 * Skyline de la pantalla de carga: silueta de ciudad en la parte inferior,
 * detrás del contenido. Por defecto se genera por código (rectángulos
 * geométricos en tonos oscuros con contorno sutil); si se pasa `image`, se
 * muestra esa imagen en su lugar sin reestructurar nada.
 */
export function Skyline({ image }: SkylineProps) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh] w-full object-cover object-bottom"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh]"
    >
      {BUILDINGS.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: `${b.left}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            background: TONE[b.tone],
          }}
        >
          <span className="absolute inset-x-0 top-0 h-px bg-paper/10" />
          {b.antenna ? (
            <span className="absolute -top-[6%] left-1/2 h-[6%] w-[2px] -translate-x-1/2 bg-paper/20" />
          ) : null}
          {b.sign ? (
            <span className="absolute left-1/2 top-[16%] h-[3px] w-1/3 -translate-x-1/2 bg-accent/40" />
          ) : null}
        </div>
      ))}
      <span className="absolute inset-x-0 bottom-0 h-px bg-accent/25" />
    </div>
  )
}
