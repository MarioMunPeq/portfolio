import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

/* ── Petal (Type A) ─────────────────────────────────────── */

interface Petal {
  id: string;
  type: "petal";
  left: number;
  w: number;
  h: number;
  delay: number;
  duration: number;
  sway1: number;
  sway2: number;
  sway3: number;
  sway4: number;
  rot1: number;
  rot2: number;
  rot3: number;
  rot4: number;
  opacity: number;
}

/* ── Flower (Type B) ────────────────────────────────────── */

interface Flower {
  id: string;
  type: "flower";
  left: number;
  size: number;
  delay: number;
  duration: number;
  sway1: number;
  sway2: number;
  sway3: number;
  sway4: number;
  rot1: number;
  rot2: number;
  rot3: number;
  rot4: number;
  opacity: number;
}

type Particle = Petal | Flower;

const PETAL_COUNT = 24;
const FLOWER_COUNT = 5;

function seededRand(seed: number) {
  return (offset: number) => {
    const v = ((seed + offset) * 137.508) % 1;
    return v < 0 ? v + 1 : v;
  };
}

function generateParticles(): Particle[] {
  const particles: Particle[] = [];

  /* ── Individual petals ── */
  for (let i = 0; i < PETAL_COUNT; i++) {
    const r = seededRand(i);
    particles.push({
      id: `p${i}`,
      type: "petal",
      left: r(1) * 100,
      w: 8 + r(2) * 8,
      h: 12 + r(3) * 10,
      delay: -(r(4) * 16),
      duration: 7 + r(5) * 7,
      sway1: -15 + r(6) * 30,
      sway2: -25 + r(7) * 50,
      sway3: -20 + r(8) * 40,
      sway4: -10 + r(9) * 20,
      rot1: 30 + r(10) * 60,
      rot2: 90 + r(11) * 120,
      rot3: 180 + r(12) * 90,
      rot4: 270 + r(13) * 120,
      opacity: 0.3 + r(14) * 0.5,
    });
  }

  /* ── Complete sakura flowers ── */
  for (let i = 0; i < FLOWER_COUNT; i++) {
    const r = seededRand(i + 200);
    particles.push({
      id: `f${i}`,
      type: "flower",
      left: r(1) * 100,
      size: 18 + r(2) * 12,
      delay: -(r(3) * 18),
      duration: 12 + r(4) * 8,
      sway1: -20 + r(5) * 40,
      sway2: -35 + r(6) * 70,
      sway3: -25 + r(7) * 50,
      sway4: -15 + r(8) * 30,
      rot1: 15 + r(9) * 45,
      rot2: 60 + r(10) * 90,
      rot3: 120 + r(11) * 120,
      rot4: 200 + r(12) * 160,
      opacity: 0.35 + r(13) * 0.4,
    });
  }

  return particles;
}

/* ── Single petal silhouette ────────────────────────────── */

function PetalSpan({ p, reduced }: { p: Petal; reduced: boolean }) {
  return (
    <span
      className="sakura-petal absolute"
      style={
        {
          left: `${p.left}%`,
          width: `${p.w}px`,
          height: `${p.h}px`,
          opacity: reduced ? 0.2 : undefined,
          "--sway1": `${p.sway1}px`,
          "--sway2": `${p.sway2}px`,
          "--sway3": `${p.sway3}px`,
          "--sway4": `${p.sway4}px`,
          "--rot1": `${p.rot1}deg`,
          "--rot2": `${p.rot2}deg`,
          "--rot3": `${p.rot3}deg`,
          "--rot4": `${p.rot4}deg`,
          "--petal-opacity": p.opacity,
          animation: reduced
            ? "none"
            : `sakura-fall ${p.duration}s ease-in-out ${p.delay}s infinite`,
          transform: reduced
            ? `translateY(${15 + ((p.id.charCodeAt(1) * 137) % 70)}vh) rotate(${p.rot1}deg)`
            : undefined,
        } as React.CSSProperties
      }
    />
  );
}

/* ── Complete 5-petal sakura blossom ────────────────────── */

function FlowerSpan({ p, reduced }: { p: Flower; reduced: boolean }) {
  return (
    <span
      className="sakura-flower-group absolute"
      style={
        {
          left: `${p.left}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          opacity: reduced ? 0.2 : undefined,
          "--sway1": `${p.sway1}px`,
          "--sway2": `${p.sway2}px`,
          "--sway3": `${p.sway3}px`,
          "--sway4": `${p.sway4}px`,
          "--rot1": `${p.rot1}deg`,
          "--rot2": `${p.rot2}deg`,
          "--rot3": `${p.rot3}deg`,
          "--rot4": `${p.rot4}deg`,
          "--petal-opacity": p.opacity,
          animation: reduced
            ? "none"
            : `sakura-fall ${p.duration}s ease-in-out ${p.delay}s infinite`,
          transform: reduced
            ? `translateY(${15 + ((p.id.charCodeAt(1) * 137) % 70)}vh) rotate(${p.rot1}deg)`
            : undefined,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {/* 5 petals arranged radially around center */}
      <span className="sakura-flower-petal" style={{ transform: "rotate(0deg) translateY(-30%)" }} />
      <span className="sakura-flower-petal" style={{ transform: "rotate(72deg) translateY(-30%)" }} />
      <span className="sakura-flower-petal" style={{ transform: "rotate(144deg) translateY(-30%)" }} />
      <span className="sakura-flower-petal" style={{ transform: "rotate(216deg) translateY(-30%)" }} />
      <span className="sakura-flower-petal" style={{ transform: "rotate(288deg) translateY(-30%)" }} />
      <span className="sakura-flower-center" />
    </span>
  );
}

/* ── Component ──────────────────────────────────────────── */

export function PetalBackground() {
  const reduced = useReducedMotion() ?? false;
  const particles = useMemo(generateParticles, []);

  return (
    <div
      aria-hidden="true"
      className="sakura-bg pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {particles.map((p) =>
        p.type === "petal" ? (
          <PetalSpan key={p.id} p={p} reduced={reduced} />
        ) : (
          <FlowerSpan key={p.id} p={p as Flower} reduced={reduced} />
        )
      )}
    </div>
  );
}
