import { motion, useTransform, type MotionValue } from 'motion/react'

// 5-point star from StarBadge.tsx (viewBox 0 0 100 100).
const STAR_POINTS: [number, number][] = [
  [50, 5],
  [61, 38],
  [96, 38],
  [68, 59],
  [79, 92],
  [50, 71],
  [21, 92],
  [32, 59],
  [4, 38],
  [39, 38],
]

/** Max factor so every valley exits the viewport (bottleneck ~4.55). */
const MAX_FACTOR = 5

interface StarWipeProps {
  /** 0 = star hidden · 1 = star covers full viewport. */
  progress: MotionValue<number>
}

/**
 * Persona 5 star mask — the star is a WINDOW, not a filled shape.
 *
 * AnimatedRoutes clips the NEW PAGE layer with a star-shaped clip-path
 * that expands from center. This component renders the thin red SVG
 * outline that follows the same expanding geometry.
 */
export function StarWipe({ progress }: StarWipeProps) {
  const factor = useTransform(progress, [0, 1], [0, MAX_FACTOR])

  const points = useTransform(factor, (f: number) =>
    STAR_POINTS.map(
      ([x, y]) => `${(50 + (x - 50) * f).toFixed(1)},${(50 + (y - 50) * f).toFixed(1)}`,
    ).join(' '),
  )

  const opacity = useTransform(progress, [0, 0.03, 0.92, 1], [0, 1, 1, 0])

  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      <motion.polygon
        points={points}
        fill="none"
        stroke="#E60012"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
    </motion.svg>
  )
}
