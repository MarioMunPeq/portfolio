import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { markBooted } from '../../lib/boot'

const MASK_SRC = `${import.meta.env.BASE_URL}images/ui/persona-mask.png`

/**
 * Persona 5-style mask slash transition from LoadScreen → Metro menu.
 *
 * Z-layer stack (all inside z-[90], behind LoadScreen at z-[100]):
 *   z-[1] — dark halves (cover viewport, hide Metro)
 *   z-[2] — mask image (focal point)
 *   z-[3] — snap flash (brief radial glow behind mask)
 *
 * Timeline from `ready` firing:
 *   0–170ms   : dark halves + mask render (hidden behind LoadScreen)
 *   170ms     : LoadScreen clip-path begins clearing → MaskTransition visible
 *   170–320ms : mask snap (scale + rotation punch)
 *   350–550ms : diagonal split — halves translate+rotate off-screen
 *   550ms     : Metro fully visible, clean menu
 *   650ms     : onDone → component unmounts
 *
 * All visuals are CSS animations. No framer-motion.
 * reduced-motion: skips straight to done.
 */
type Phase = 'idle' | 'snap' | 'split' | 'done'

interface MaskTransitionProps {
  ready: boolean
  onDone?: () => void
}

export function MaskTransition({ ready, onDone }: MaskTransitionProps) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<ReturnType<typeof window.setTimeout>[]>([])

  useEffect(() => {
    if (!ready || phase !== 'idle') return

    const t = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms)
      timers.current.push(id)
      return id
    }

    if (reduced) {
      markBooted()
      setPhase('done')
      onDone?.()
      return
    }

    // Snap: mask activates when LoadScreen clip-path clears (~170ms)
    t(170, () => setPhase('snap'))
    // Split: halves begin diagonal exit
    t(350, () => setPhase('split'))
    // Done: Metro fully visible, clean menu
    t(650, () => {
      markBooted()
      setPhase('done')
      onDone?.()
    })

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [ready, onDone])

  // Don't render anything before ready or after done
  if (!ready || phase === 'done') return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90]"
    >
      {/* z-[1]: Dark halves — cover viewport IMMEDIATELY when ready,
          hiding Metro behind them. clip-path splits along -45° diagonal.
          During 'split' they translate+rotate off-screen. */}
      <div
        className={`absolute inset-0 z-[1] will-change-transform ${
          phase === 'split' ? 'mask-split-tl' : ''
        }`}
        style={{
          background: '#0a0a0a',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          backfaceVisibility: 'hidden',
        }}
      />
      <div
        className={`absolute inset-0 z-[1] will-change-transform ${
          phase === 'split' ? 'mask-split-br' : ''
        }`}
        style={{
          background: '#0a0a0a',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* z-[2]: Mask image — visible from the start, centered.
          During 'snap' it does a quick scale+rotation punch. */}
      <div
        className={`absolute z-[2] -translate-x-1/2 -translate-y-1/2 ${
          phase === 'snap' ? 'mask-snap' : ''
        }`}
        style={{ left: '50%', top: '46%' }}
      >
        <img
          src={MASK_SRC}
          alt=""
          draggable={false}
          className="block w-[min(82vw,560px)] max-w-none"
          style={{
            transform: 'translateX(-50%)',
            filter:
              'drop-shadow(3px 3px 0 rgba(230,0,18,0.3)) drop-shadow(0 0 14px rgba(230,0,18,0.3))',
          }}
        />
      </div>

      {/* z-[3]: Brief radial flash behind mask during snap */}
      {phase === 'snap' && (
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 46%, rgba(230,0,18,0.4), transparent 45%)',
            animation: 'mask-snap-flash 0.2s cubic-bezier(0.55, 0, 1, 0.45) both',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  )
}
