import { useEffect, useRef } from "react"
import Hls from "hls.js"

type StreamPlayerProps = {
  /** HLS playlist URL, e.g. /streams/<id>/index.m3u8 */
  src: string
  /** Live streams autoplay muted; VODs wait for the user. */
  live: boolean
}

// hls.js (MSE) on Chrome/Firefox/Edge; Safari/iOS falls back to its native
// HLS support. The playlist is event-style, so video.seekable spans the whole
// stream — the native controls' scrub bar reaches back to 0:00 even while
// live, and the same URL plays as a VOD once the playlist is finalized.
function StreamPlayer({ src, live }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      return () => {
        video.removeAttribute("src")
        video.load()
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      data-slot="stream-player"
      controls
      playsInline
      muted={live}
      autoPlay={live}
      className="aspect-video w-full rounded-lg border-[2.5px] border-cl-ink bg-cl-ink"
    />
  )
}

export { StreamPlayer }
