import { useEffect, useRef, useState } from 'react'
import { DiamondMarker } from '../shared/DiamondMarker'
import { Tag } from '../ui/Tag'
import { NodeIcon } from './NodeIcon'
import { SKILL_TREE } from '../../data/skill-tree'
import type { SkillNode } from '../../data/skill-tree'

/** Hexágono apuntando hacia arriba, circunradio 50 en un viewBox 0-100. */
const HEX_POINTS = '93.3,75 50,100 6.7,75 6.7,25 50,0 93.3,25'

/** Offset perpendicular de cada línea del conector doble. */
const LINE_OFFSET = 4

function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, size }
}

interface HexNodeProps {
  node: SkillNode
  selected: boolean
  onSelect: (id: string) => void
}

/**
 * Nodo hexagonal: botón accesible con hexágono rojo relleno y en glow
 * (desbloqueado) o silueta gris (etapa futura), icono de campo dentro y
 * etiqueta corta debajo.
 */
function HexNode({ node, selected, onSelect }: HexNodeProps) {
  const locked = node.kind === 'locked'
  const glow = selected
    ? 'drop-shadow(3px 3px 0 rgba(0,0,0,0.85)) drop-shadow(0 0 18px rgba(230,0,18,0.9))'
    : 'drop-shadow(3px 3px 0 rgba(0,0,0,0.85)) drop-shadow(0 0 10px rgba(230,0,18,0.45))'

  return (
    <div
      className="absolute z-10"
      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        aria-pressed={selected}
        aria-label={node.title}
        className="group flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          className="relative block h-14 w-14 transition-transform duration-200 sm:h-[76px] sm:w-[76px]"
          style={{
            filter: locked ? 'drop-shadow(3px 3px 0 rgba(0,0,0,0.85))' : glow,
            transform: selected && !locked ? 'scale(1.08)' : undefined,
          }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id={`skill-hex-${node.id}`} cx="42%" cy="38%" r="75%">
                <stop offset="0%" stopColor="#ff3b30" />
                <stop offset="70%" stopColor="#e60012" />
                <stop offset="100%" stopColor="#a3000c" />
              </radialGradient>
              <linearGradient id={`skill-shine-${node.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <polygon
              points={HEX_POINTS}
              fill={locked ? 'rgba(26,26,26,0.92)' : `url(#skill-hex-${node.id})`}
              stroke={locked ? 'rgba(245,245,240,0.3)' : 'var(--color-accent-alt)'}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {!locked && <polygon points={HEX_POINTS} fill={`url(#skill-shine-${node.id})`} />}
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-paper">
            <NodeIcon
              kind={node.icon}
              className={locked ? 'h-7 w-7 opacity-40 sm:h-8 sm:w-8' : 'h-7 w-7 sm:h-8 sm:w-8'}
            />
          </span>
        </span>
        <span
          className={`font-hatty text-caption uppercase leading-none tracking-[0.12em] transition-colors ${
            selected
              ? 'text-accent'
              : locked
                ? 'text-paper/40'
                : 'text-paper/75 group-hover:text-paper'
          }`}
        >
          {node.label}
        </span>
      </button>
    </div>
  )
}

/**
 * Líneas conectoras entre nodos, dibujadas en el espacio de píxeles real del
 * contenedor (medido con ResizeObserver) para que el par de líneas paralelas
 * rojas quede perpendicular de verdad. La conexión a la etapa futura es un
 * trazo punteado gris (locked).
 */
function ConnectorLayer({ size }: { size: { w: number; h: number } }) {
  const { w, h } = size
  if (w <= 0 || h <= 0) return null

  const center = (node: SkillNode) => ({
    x: (node.x / 100) * w,
    y: (node.y / 100) * h,
  })

  return (
    <svg className="pointer-events-none absolute inset-0" width={w} height={h} aria-hidden="true">
      {SKILL_TREE.edges.map((edge, index) => {
        const from = SKILL_TREE.nodes.find((node) => node.id === edge.from)
        const to = SKILL_TREE.nodes.find((node) => node.id === edge.to)
        if (!from || !to) return null

        const a = center(from)
        const b = center(to)
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy)

        if (edge.kind === 'future') {
          return (
            <line
              key={index}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(245,245,240,0.3)"
              strokeWidth={2}
              strokeDasharray="5 6"
            />
          )
        }

        const nx = (-dy / len) * LINE_OFFSET
        const ny = (dx / len) * LINE_OFFSET
        const stroke = 'var(--color-accent)'

        return (
          <g
            key={index}
            style={{ filter: 'drop-shadow(0 0 5px rgba(230,0,18,0.45))' }}
          >
            <line
              x1={a.x + nx}
              y1={a.y + ny}
              x2={b.x + nx}
              y2={b.y + ny}
              stroke={stroke}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <line
              x1={a.x - nx}
              y1={a.y - ny}
              x2={b.x - nx}
              y2={b.y - ny}
              stroke={stroke}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Panel de detalle de la titulación seleccionada, en el mismo estilo de
 * ficha de proyecto (marco angular con esquinas cortadas y fondo oscuro).
 */
function DetailPanel({ node }: { node: SkillNode }) {
  const locked = node.kind === 'locked'

  return (
    <div className="clip-cut-br border border-paper/30 bg-bg-content-alt p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DiamondMarker size={8} />
          <h3 className="font-hatty text-label font-medium uppercase tracking-[0.22em] text-accent">
            Detalle
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {node.level && (
            <Tag font="hatty" tone="dark" size="sm">
              {node.level}
            </Tag>
          )}
          <Tag font="hatty" tone={locked ? 'dark' : 'red'} size="sm">
            {node.status}
          </Tag>
        </div>
      </div>

      <h4 className="mt-6 font-display text-2xl uppercase leading-tight">{node.title}</h4>

      {(node.period || node.institution) && (
        <dl className="mt-6 space-y-4">
          {node.period && (
            <div>
              <dt className="font-hatty text-caption uppercase tracking-[0.18em] text-paper/50">Periodo</dt>
              <dd className="mt-1 font-medium">{node.period}</dd>
            </div>
          )}
          {node.institution && (
            <div>
              <dt className="font-hatty text-caption uppercase tracking-[0.18em] text-paper/50">Centro</dt>
              <dd className="mt-1 font-medium">{node.institution}</dd>
            </div>
          )}
        </dl>
      )}

      {node.detail && (
        <p className="mt-4 inline-flex items-center gap-2 border-l-2 border-accent pl-3 font-hatty text-caption uppercase tracking-[0.18em] text-accent">
          {node.detail}
        </p>
      )}

      {node.description && (
        <p className="mt-6 max-w-2xl text-body leading-relaxed text-paper/80">
          {node.description}
        </p>
      )}
    </div>
  )
}

/**
 * Sección Árbol de Habilidades: hexágonos conectados por dobles líneas rojas
 * (radiando del tronco de Telecomunicaciones), con panel de detalle bajo el
 * árbol. La selección es por clic; por defecto se muestra el nodo más
 * reciente (Bootcamp de IA).
 */
export function SkillTreeSection() {
  const { ref, size } = useContainerSize()
  const [selected, setSelected] = useState('bootcamp')
  const active =
    SKILL_TREE.nodes.find((node) => node.id === selected) ?? SKILL_TREE.nodes[0]

  return (
    <div className="mt-8">
      <div
        ref={ref}
        className="relative mx-auto h-[26rem] max-w-4xl sm:h-[28rem] lg:h-[30rem]"
      >
        <ConnectorLayer size={size} />
        {SKILL_TREE.nodes.map((node) => (
          <HexNode
            key={node.id}
            node={node}
            selected={node.id === selected}
            onSelect={setSelected}
          />
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <DetailPanel node={active} />
      </div>
    </div>
  )
}
