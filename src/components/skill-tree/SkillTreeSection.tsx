import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { DiamondMarker } from "../shared/DiamondMarker";
import { Tag } from "../ui/Tag";
import { NodeIcon } from "./NodeIcon";
import { SKILL_TREE } from "../../data/skill-tree";
import type { SkillNode } from "../../data/skill-tree";

/* ── Angular badge polygon — square with two diagonal cuts (Persona 5 motif) ── */
const NODE_POINTS = "0,0 88,0 100,12 100,100 12,100 0,88";

/** Inset polygon points toward center (50,50) by a given scale factor. */
function insetPoints(points: string, scale: number): string {
  return points
    .split(" ")
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return `${50 + (x - 50) * scale},${50 + (y - 50) * scale}`;
    })
    .join(" ");
}

/** Node tier based on education level — drives outline count. */
function getNodeTier(node: SkillNode): number {
  if (node.kind === "locked") return 0;
  if (node.level === "Grado medio") return 1;
  if (node.level === "Grado superior") return 2;
  return 3; // Bootcamp
}

/* ── Hooks ── */

function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

function useMousePosition(ref: React.RefObject<HTMLDivElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", handler, { passive: true });
    return () => el.removeEventListener("mousemove", handler);
  }, [ref]);

  return pos;
}

/* ── Node badge ── */

interface NodeBadgeProps {
  node: SkillNode;
  index: number;
  selected: boolean;
  flashKey: number;
  onSelect: (id: string) => void;
}

function NodeBadge({
  node,
  index,
  selected,
  flashKey,
  onSelect,
}: NodeBadgeProps) {
  const locked = node.kind === "locked";
  const tier = getNodeTier(node);
  const glow = selected
    ? "drop-shadow(3px 3px 0 rgba(0,0,0,0.85)) drop-shadow(0 0 18px rgba(230,0,18,0.9))"
    : "drop-shadow(3px 3px 0 rgba(0,0,0,0.85)) drop-shadow(0 0 10px rgba(230,0,18,0.45))";

  /* Tiered outlines — single / double / triple concentric polygons */
  const outlineScales =
    tier === 3 ? [1.0, 0.91, 0.82] : tier === 2 ? [1.0, 0.89] : [1.0];
  const outlineColors =
    tier === 3
      ? ["var(--color-accent)", "var(--color-paper)", "var(--color-accent)"]
      : tier === 2
        ? ["var(--color-accent)", "var(--color-paper)"]
        : ["var(--color-accent-alt)"];
  const outlineWidths =
    tier === 3 ? [2.5, 1.2, 0.8] : tier === 2 ? [2.5, 1.2] : [2.5];

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        aria-pressed={selected}
        aria-label={node.title}
        className="group flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          className={`relative block h-14 w-14 sm:h-[68px] sm:w-[68px] ${
            locked
              ? "group-hover:[animation:locked-shake_0.35s_ease-in-out]"
              : "group-hover:scale-110"
          } ${selected && !locked ? "node-glitch-flash" : ""}`}
          style={{
            filter: locked ? "drop-shadow(3px 3px 0 rgba(0,0,0,0.85))" : glow,
            transform: selected && !locked ? "scale(1.08)" : undefined,
            transition: locked ? "none" : "transform 0.1s steps(2)",
            animationDelay: selected ? "0s" : undefined,
          }}
          key={flashKey}
        >
          {/* Halo (unlocked only) */}
          {!locked && <span aria-hidden="true" className="node-halo" />}

          {/* Angular badge SVG */}
          <svg
            viewBox="0 0 100 100"
            className="relative h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <radialGradient
                id={`skill-ng-${node.id}`}
                cx="42%"
                cy="38%"
                r="75%"
              >
                <stop offset="0%" stopColor="#ff3b30" />
                <stop offset="70%" stopColor="#e60012" />
                <stop offset="100%" stopColor="#a3000c" />
              </radialGradient>
              <linearGradient
                id={`skill-ns-${node.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              {/* Noise filter for locked nodes */}
              <filter id={`skill-noise-${node.id}`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="4"
                  seed={index * 7}
                />
                <feColorMatrix type="saturate" values="0" />
                <feBlend in="SourceGraphic" mode="multiply" />
              </filter>
            </defs>

            {/* Tiered outlines (outermost → innermost) */}
            {!locked &&
              outlineScales.map((scale, i) => (
                <polygon
                  key={i}
                  points={insetPoints(NODE_POINTS, scale)}
                  fill="none"
                  stroke={outlineColors[i]}
                  strokeWidth={outlineWidths[i]}
                  strokeLinejoin="round"
                />
              ))}

            {/* Main fill */}
            <polygon
              points={NODE_POINTS}
              fill={
                locked ? "rgba(20,20,20,0.95)" : `url(#skill-ng-${node.id})`
              }
              stroke={locked ? "rgba(245,245,240,0.2)" : "none"}
              strokeWidth={locked ? 1.5 : 0}
              strokeLinejoin="round"
              strokeDasharray={locked ? "4 4" : "none"}
            />

            {/* Shine overlay (unlocked) */}
            {!locked && (
              <polygon
                points={NODE_POINTS}
                fill={`url(#skill-ns-${node.id})`}
              />
            )}

            {/* Static noise overlay (locked) */}
            {locked && (
              <polygon
                points={NODE_POINTS}
                fill="rgba(245,245,240,0.06)"
                filter={`url(#skill-noise-${node.id})`}
                style={{ animation: "locked-static 0.12s steps(2) infinite" }}
              />
            )}
          </svg>

          {/* Icon */}
          <span className="absolute inset-0 flex items-center justify-center text-paper">
            <NodeIcon
              kind={node.icon}
              className={locked ? "h-7 w-7 opacity-30" : "h-7 w-7"}
            />
          </span>

          {/* Diamond indicator on selected */}
          {selected && !locked && (
            <span
              aria-hidden="true"
              className="node-diamond-enter absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center"
            >
              <span className="h-2.5 w-2.5 rotate-45 bg-gold" />
            </span>
          )}
        </span>

        {/* Label — condensed/stencil typography */}
        <span
          className={`font-display text-[0.65rem] font-normal uppercase leading-none tracking-[0.14em] transition-colors ${
            selected
              ? "text-accent"
              : locked
                ? "text-paper/30"
                : "text-paper/70 group-hover:text-paper"
          }`}
        >
          {node.label}
        </span>
      </button>
    </div>
  );
}

/* ── Angular connector layer ── */

function ConnectorLayer({ size }: { size: { w: number; h: number } }) {
  const { w, h } = size;
  const reduced = useReducedMotion();
  if (w <= 0 || h <= 0) return null;

  const center = (node: SkillNode) => ({
    x: (node.x / 100) * w,
    y: (node.y / 100) * h,
  });

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={w}
      height={h}
      aria-hidden="true"
    >
      {SKILL_TREE.edges.map((edge, index) => {
        const from = SKILL_TREE.nodes.find((node) => node.id === edge.from);
        const to = SKILL_TREE.nodes.find((node) => node.id === edge.to);
        if (!from || !to) return null;

        const a = center(from);
        const b = center(to);
        const isFuture = edge.kind === "future";

        /* Angular path: L-shape (vertical first, then horizontal) */
        const cornerY = b.y;

        /* Double parallel lines with perpendicular offset */
        const offset = 3.5;
        const dx = 0;
        const dy = offset;
        const path1 = `M ${a.x + dx},${a.y - dy} L ${a.x + dx},${cornerY - dy} L ${b.x},${cornerY - dy}`;
        const path2 = `M ${a.x - dx},${a.y + dy} L ${a.x - dx},${cornerY + dy} L ${b.x},${cornerY + dy}`;

        const stroke = isFuture
          ? "rgba(245,245,240,0.2)"
          : "var(--color-accent)";
        const dashArray = isFuture ? "5 7" : "8 5";
        const lineW = isFuture ? 1.5 : 2;

        return (
          <g
            key={index}
            style={{
              filter: isFuture
                ? "none"
                : "drop-shadow(0 0 4px rgba(230,0,18,0.35))",
              ["--connector-delay" as string]: `${index * 0.12 + 0.1}s`,
            }}
          >
            <path
              d={path1}
              fill="none"
              stroke={stroke}
              strokeWidth={lineW}
              strokeLinecap="square"
              strokeDasharray={dashArray}
              className="connector-draw"
            />
            <path
              d={path2}
              fill="none"
              stroke={stroke}
              strokeWidth={lineW}
              strokeLinecap="square"
              strokeDasharray={dashArray}
              className="connector-draw"
            />

            {/* Energy pulse along angular path */}
            {!reduced && !isFuture && (
              <g>
                <circle
                  r={6}
                  fill="var(--color-accent)"
                  opacity={0}
                  style={{ filter: "blur(2px)" }}
                >
                  <animate
                    attributeName="cx"
                    values={`${a.x};${a.x};${b.x}`}
                    dur="2.8s"
                    begin={`${index * 0.7}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                  />
                  <animate
                    attributeName="cy"
                    values={`${a.y};${cornerY};${cornerY}`}
                    dur="2.8s"
                    begin={`${index * 0.7}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    keyTimes="0;0.5;1"
                    dur="2.8s"
                    begin={`${index * 0.7}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                  />
                </circle>
                <circle
                  r={2}
                  fill="var(--color-paper)"
                  opacity={0}
                  style={{ filter: "drop-shadow(0 0 4px rgba(230,0,18,0.9))" }}
                >
                  <animate
                    attributeName="cx"
                    values={`${a.x};${a.x};${b.x}`}
                    dur="2.8s"
                    begin={`${index * 0.7}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                  />
                  <animate
                    attributeName="cy"
                    values={`${a.y};${cornerY};${cornerY}`}
                    dur="2.8s"
                    begin={`${index * 0.7}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    keyTimes="0;0.5;1"
                    dur="2.8s"
                    begin={`${index * 0.7}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                  />
                </circle>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Detail panel — angular card with clipped corner ── */

function DetailPanel({ node }: { node: SkillNode }) {
  const locked = node.kind === "locked";

  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DiamondMarker size={8} />
          <h3 className="font-display text-sm font-normal uppercase tracking-[0.2em] text-accent">
            Detalle
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {node.level && (
            <Tag font="sans" tone="dark" size="sm">
              {node.level}
            </Tag>
          )}
          <Tag font="sans" tone={locked ? "dark" : "red"} size="sm">
            {node.status}
          </Tag>
        </div>
      </div>

      <h4 className="mt-4 font-display text-2xl uppercase leading-tight">
        {node.title}
      </h4>

      {(node.period || node.institution) && (
        <dl className="mt-4 space-y-3">
          {node.period && (
            <div>
              <dt className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-paper/50">
                Periodo
              </dt>
              <dd className="mt-1 font-medium">{node.period}</dd>
            </div>
          )}
          {node.institution && (
            <div>
              <dt className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-paper/50">
                Centro
              </dt>
              <dd className="mt-1 font-medium">{node.institution}</dd>
            </div>
          )}
        </dl>
      )}

      {node.detail && (
        <p className="mt-4 inline-flex items-center gap-2 border-l-2 border-accent pl-3 font-sans text-[0.65rem] uppercase tracking-[0.18em] text-accent">
          {node.detail}
        </p>
      )}

      {node.description && (
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-paper/80">
          {node.description}
        </p>
      )}
    </>
  );

  return (
    <div
      className="relative border border-paper/30 bg-bg-content-alt p-5 md:p-6"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 1.2rem) 0, 100% 1.2rem, 100% 100%, 0 100%)",
      }}
    >
      {/* Red left edge accent */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
      />
      <div key={node.id} className="skill-panel-in">
        {content}
      </div>
    </div>
  );
}

/* ── Cursor diamond follower ── */

function CursorDiamond({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pos = useMousePosition(containerRef);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [containerRef]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-50 h-3 w-3 rotate-45 border border-accent/60 bg-accent/20"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%) rotate(45deg)",
        transition: "left 0.08s steps(3), top 0.08s steps(3)",
        animation: "cursor-diamond-pulse 1.8s ease-in-out infinite",
      }}
    />
  );
}

/* ── Progress counter ── */

function ProgressCounter() {
  const unlocked = SKILL_TREE.nodes.filter((n) => n.kind === "unlocked").length;
  const total = SKILL_TREE.nodes.length;

  return (
    <div className="flex items-center gap-2.5 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-paper/35">
      <span className="h-1.5 w-1.5 rotate-45 bg-accent/50" />
      <span>
        {unlocked} / {total} nodos desbloqueados
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN SECTION
   ════════════════════════════════════════════════════════════════ */
export function SkillTreeSection() {
  const { ref, size } = useContainerSize();
  const treeRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState("bootcamp");
  const [flashKey, setFlashKey] = useState(0);

  const active =
    SKILL_TREE.nodes.find((node) => node.id === selected) ??
    SKILL_TREE.nodes[0];

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    setFlashKey((k) => k + 1);
  }, []);

  return (
    <div className="mt-6">
      <div className="mx-auto mb-4 max-w-4xl">
        <ProgressCounter />
      </div>

      <div
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (treeRef as React.MutableRefObject<HTMLDivElement | null>).current =
            el;
        }}
        className="relative mx-auto h-[19rem] max-w-4xl sm:h-[20rem] lg:h-[21rem]"
      >
        {/* Side label — UI chrome density */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-1/2 z-20 select-none font-sans text-[0.5rem] uppercase tracking-[0.25em] text-paper/15"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          SKILL_TREE.SYS
        </span>

        <ConnectorLayer size={size} />
        <CursorDiamond containerRef={treeRef} />

        {SKILL_TREE.nodes.map((node, index) => (
          <NodeBadge
            key={node.id}
            node={node}
            index={index}
            selected={node.id === selected}
            flashKey={flashKey}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-4xl">
        <DetailPanel node={active} />
      </div>
    </div>
  );
}
