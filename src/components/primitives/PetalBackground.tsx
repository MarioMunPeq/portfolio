import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

/* ── Mulberry32 — fast, deterministic PRNG ──────────────── */

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randRange(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

/* ── Particle interfaces ────────────────────────────────── */

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

function generateParticles(): Particle[] {
  const rng = mulberry32(42);
  const particles: Particle[] = [];

  /* ── Individual petals ── */
  for (let i = 0; i < PETAL_COUNT; i++) {
    const baseW = randRange(rng, 6, 18);
    const baseH = baseW * randRange(rng, 1.2, 2.0);
    particles.push({
      id: `p${i}`,
      type: "petal",
      left: randRange(rng, -5, 105),
      w: baseW,
      h: baseH,
      delay: -randRange(rng, 0, 20),
      duration: randRange(rng, 5, 18),
      sway1: randRange(rng, -30, 30),
      sway2: randRange(rng, -50, 50),
      sway3: randRange(rng, -40, 40),
      sway4: randRange(rng, -25, 25),
      rot1: randRange(rng, 0, 360),
      rot2: randRange(rng, 0, 360),
      rot3: randRange(rng, 0, 360),
      rot4: randRange(rng, 0, 360),
      opacity: randRange(rng, 0.2, 0.75),
    });
  }

  /* ── Complete sakura flowers — significantly larger, fully independent positions ── */
  for (let i = 0; i < FLOWER_COUNT; i++) {
    particles.push({
      id: `f${i}`,
      type: "flower",
      left: randRange(rng, 2, 98),
      size: randRange(rng, 32, 56),
      delay: -randRange(rng, 0, 24),
      duration: randRange(rng, 10, 26),
      sway1: randRange(rng, -40, 40),
      sway2: randRange(rng, -60, 60),
      sway3: randRange(rng, -50, 50),
      sway4: randRange(rng, -35, 35),
      rot1: randRange(rng, 0, 360),
      rot2: randRange(rng, 0, 360),
      rot3: randRange(rng, 0, 360),
      rot4: randRange(rng, 0, 360),
      opacity: randRange(rng, 0.25, 0.65),
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
      <span
        className="sakura-flower-petal"
        style={{ transform: "rotate(0deg) translateY(-30%)" }}
      />
      <span
        className="sakura-flower-petal"
        style={{ transform: "rotate(72deg) translateY(-30%)" }}
      />
      <span
        className="sakura-flower-petal"
        style={{ transform: "rotate(144deg) translateY(-30%)" }}
      />
      <span
        className="sakura-flower-petal"
        style={{ transform: "rotate(216deg) translateY(-30%)" }}
      />
      <span
        className="sakura-flower-petal"
        style={{ transform: "rotate(288deg) translateY(-30%)" }}
      />
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
        ),
      )}
    </div>
  );
}
