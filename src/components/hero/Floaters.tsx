import { useState } from "react";
import { useReducedMotion } from "motion/react";

interface Floater {
  id: number;
  size: number;
  left: number;
  top: number;
  opacity: number;
  duration: number;
  delay: number;
}

/**
 * Cuadrados flotantes de fondo, generados aleatoriamente una sola vez
 * (tamaños/posiciones/velocidades) y subiendo desde abajo del viewport.
 * Con `prefers-reduced-motion` no se monta.
 */
export function Floaters() {
  const reduced = useReducedMotion();
  const [floaters] = useState<Floater[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 14,
      left: Math.random() * 100,
      top: 100 + Math.random() * 20,
      opacity: 0.25 + Math.random() * 0.35,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * -20,
    })),
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="hero-floaters pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {floaters.map((f) => (
        <span
          key={f.id}
          className="absolute border border-paper/15 bg-bg-content-alt"
          style={{
            width: f.size,
            height: f.size,
            left: `${f.left}vw`,
            top: `${f.top}vh`,
            opacity: f.opacity,
            animation: `hero-drift ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
