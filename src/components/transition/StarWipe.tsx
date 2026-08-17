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

interface StarWipeProps {
  /** 0 = star hidden · 1 = star covers full viewport. */
  progress: MotionValue<number>
  /** Pre-calculated max factor for this viewport. */
  maxFactor: number
}

/**
 * Thin red SVG outline that follows the expanding star mask.
 *
 * The interior of the star is transparent — it reveals the destination page
 * through the clip-path applied by AnimatedRoutes.  This component only
 * draws the subtle perimeter edge and an optional secondary echo slightly
 * behind it.
 */
export function StarWipe({ progress, maxFactor }: StarWipeProps) {
  const factor = useTransform(progress, [0, 1], [0, maxFactor])

  const points = useTransform(factor, (f: number) =>
    STAR_POINTS.map(
      ([x, y]) =>
        `${(50 + (x - 50) * f).toFixed(2)},${(50 + (y - 50) * f).toFixed(2)}`,
    ).join(' '),
  )

  // Secondary echo trails slightly behind the main mask
  const echoFactor = useTransform(progress, [0, 0.92, 1], [0, maxFactor * 0.94, maxFactor * 0.98])
  const echoPoints = useTransform(echoFactor, (f: number) =>
    STAR_POINTS.map(
      ([x, y]) =>
        `${(50 + (x - 50) * f).toFixed(2)},${(50 + (y - 50) * f).toFixed(2)}`,
    ).join(' '),
  )

  // Edge visible during expansion, fades out in the final frames
  const opacity = useTransform(progress, [0, 0.02, 0.88, 1], [0, 0.9, 0.9, 0])

  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      {/* Secondary echo — very subtle red offset behind the main edge */}
      <motion.polygon
        points={echoPoints}
        fill="none"
        stroke="#E60012"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
        strokeOpacity={0.2}
      />
      {/* Primary edge — thin, sharp, elegant */}
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
