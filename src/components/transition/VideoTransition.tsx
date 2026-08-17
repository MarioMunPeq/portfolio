import { useEffect, useRef } from 'react'

/**
 * Singleton fullscreen video overlay for page transitions.
 * Renders a single <video> element that stays in the DOM permanently.
 * TransitionRoutes triggers playback via the transition bus;
 * the video element hides itself when playback ends.
 */
export function VideoTransition() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener('ended', () => {
      video.hidden = true
    })
  }, [])

  return (
    <video
      id="transition-video"
      ref={videoRef}
      hidden
      muted
      loop={false}
      playsInline
      preload="auto"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <source
        src={`${import.meta.env.BASE_URL}videos/train-transition.webm`}
        type="video/webm"
      />
    </video>
  )
}
