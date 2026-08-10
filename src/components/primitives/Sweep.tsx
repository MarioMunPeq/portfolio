import { motion, useTransform, type MotionValue } from 'motion/react'

interface SweepProps {
  /** 0 = fuera de pantalla · 1 = cubre el viewport. */
  progress: MotionValue<number>
  /** Si se define, el barrido hace fade a 0 entre fadeOutAt y 1. */
  fadeOutAt?: number
  className?: string
}

/**
 * Barrido diagonal rojo/negro — elemento firma del proyecto.
 * Dos paneles sesgados que atraviesan la pantalla según `progress`.
 */
export function Sweep({ progress, fadeOutAt, className = '' }: SweepProps) {
  const xRed = useTransform(progress, [0, 1], ['-160vw', '0vw'])
  const xBlack = useTransform(progress, [0, 1], ['-160vw', '8vw'])
  const opacity = useTransform(
    progress,
    fadeOutAt !== undefined ? [fadeOutAt, 1] : [0, 1],
    [1, 0],
  )

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-[135vw] bg-accent"
        style={{ x: xRed, skewX: -10 }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 w-[135vw] bg-bg-hero"
        style={{ x: xBlack, skewX: -10 }}
      />
    </motion.div>
  )
}
