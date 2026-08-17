export const TRANSITION_SPEED = 2

export const transitionBus = {
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
}
