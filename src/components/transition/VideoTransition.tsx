import { useEffect, useRef } from "react";
import { useMediaQuery } from "../../lib/use-media-query";

/**
 * Singleton fullscreen video overlay for page transitions.
 * Renders a single <video> element that stays in the DOM permanently.
 * TransitionRoutes triggers playback via the transition bus;
 * the video element hides itself when playback ends.
 *
 * On mount the decoder is pre-warmed: the muted hidden video is played
 * just long enough for the browser to initialise its decode pipeline and
 * decode the first frame, then paused and reset to time 0.  This
 * eliminates the ~1 s cold-start latency on the first user click.
 *
 * On `ended` the video pre-seeks back to 0 so the next transition avoids
 * an expensive backward seek through the WebM container.
 *
 * On mobile/tablet (< 1024 px) the video is completely skipped — no
 * element is rendered, no file is loaded.
 */
export function VideoTransition() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isDesktop) return;
    const video = videoRef.current;
    if (!video) return;

    let disposed = false;

    /* -------------------------------------------------------------- */
    /*  Decoder warm-up                                                */
    /* -------------------------------------------------------------- */

    const warmUp = async () => {
      // Wait until the browser has buffered enough data to play.
      if (video.readyState < 3) {
        await new Promise<void>((r) => {
          const onCanPlay = () => {
            video.removeEventListener("canplay", onCanPlay);
            r();
          };
          video.addEventListener("canplay", onCanPlay);
          // readyState may have risen between our check and listener registration.
          if (video.readyState >= 3) {
            video.removeEventListener("canplay", onCanPlay);
            r();
          }
        });
      }
      if (disposed) return;

      // Play the hidden muted video to force the browser to:
      //  1. Initialise the media decoder (VP8/VP9)
      //  2. Parse the WebM container / build seek index
      //  3. Decode the first keyframe
      // The `playing` event fires once the first frame has been decoded.
      video.currentTime = 0;
      try {
        await video.play();
      } catch {
        return; // autoplay blocked or other error — skip warm-up gracefully
      }
      if (disposed) return;

      // Decoder is now warm.  Pause and reset to start.
      video.pause();
      video.currentTime = 0;
    };

    warmUp();

    /* -------------------------------------------------------------- */
    /*  Post-transition pre-seek                                       */
    /* -------------------------------------------------------------- */

    const onEnded = () => {
      video.hidden = true;
      // Pre-seek to start so the next playUntilCovered() avoids an
      // expensive backward seek through the WebM container.
      video.currentTime = 0;
    };

    video.addEventListener("ended", onEnded);
    return () => {
      disposed = true;
      video.removeEventListener("ended", onEnded);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

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
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <source
        src={`${import.meta.env.BASE_URL}videos/train-transition.webm`}
        type="video/webm"
      />
    </video>
  );
}
