export const TRANSITION_SPEED = 2

/** Time in ms after which the video has visually covered the screen. */
const COVER_MS = 400

/**
 * Global flag checked by TransitionRoutes to avoid double-triggering
 * when CommandNavItem has already started the transition externally.
 */
let transitionExternallyStarted = false

export const transitionBus = {
  /** Mark that a transition was started outside TransitionRoutes. */
  markExternallyStarted() {
    transitionExternallyStarted = true
  },

  /** Returns true if a transition was already started externally, then resets. */
  consumeExternallyStarted(): boolean {
    if (transitionExternallyStarted) {
      transitionExternallyStarted = false
      return true
    }
    return false
  },

  /**
   * Play the full transition video (used by TransitionRoutes for
   * non-button-triggered route changes).
   */
  play(onDone: () => void) {
    const video = document.getElementById('transition-video') as HTMLVideoElement | null
    if (!video) {
      onDone()
      return
    }

    video.currentTime = 0
    video.hidden = false
    video.playbackRate = TRANSITION_SPEED

    const cleanup = () => {
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onEnded)
    }

    const onEnded = () => {
      cleanup()
      onDone()
    }

    video.addEventListener('ended', onEnded, { once: true })
    video.addEventListener('error', onEnded, { once: true })

    video.play().catch(cleanup)
  },

  /**
   * Start the transition video and resolve when the screen is visually
   * covered. Used by CommandNavItem so navigation can happen right after
   * coverage instead of waiting for the full video to end.
   */
  playUntilCovered(): Promise<void> {
    return new Promise((resolve) => {
      const video = document.getElementById('transition-video') as HTMLVideoElement | null
      if (!video) {
        resolve()
        return
      }

      video.currentTime = 0
      video.hidden = false
      video.playbackRate = TRANSITION_SPEED

      const timer = window.setTimeout(() => {
        cleanup()
        resolve()
      }, COVER_MS)

      const cleanup = () => {
        window.clearTimeout(timer)
        video.removeEventListener('ended', onEnded)
        video.removeEventListener('error', onEnded)
      }

      const onEnded = () => {
        cleanup()
        resolve()
      }

      video.addEventListener('ended', onEnded, { once: true })
      video.addEventListener('error', onEnded, { once: true })

      video.play().catch(() => {
        cleanup()
        resolve()
      })
    })
  },
}
