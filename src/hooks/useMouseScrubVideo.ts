import { useEffect, useRef } from 'react'

const SENSITIVITY = 0.8

export function useMouseScrubVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTimeRef = useRef(0)
  const prevXRef = useRef<number | null>(null)
  const seekingRef = useRef(false)
  const pendingSeekRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const performSeek = () => {
      if (!video.duration || Number.isNaN(video.duration)) return
      seekingRef.current = true
      video.currentTime = Math.max(0, Math.min(targetTimeRef.current, video.duration))
    }

    const onSeeked = () => {
      seekingRef.current = false
      if (pendingSeekRef.current) {
        pendingSeekRef.current = false
        performSeek()
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = event.clientX
        return
      }

      const delta = event.clientX - prevXRef.current
      prevXRef.current = event.clientX

      if (!video.duration || Number.isNaN(video.duration)) return

      targetTimeRef.current += (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTimeRef.current = Math.max(0, Math.min(targetTimeRef.current, video.duration))

      if (seekingRef.current) {
        pendingSeekRef.current = true
      } else {
        performSeek()
      }
    }

    const onLoadedMetadata = () => {
      targetTimeRef.current = video.duration * 0.35
      performSeek()
    }

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    window.addEventListener('mousemove', onMouseMove)

    if (video.readyState >= 1) onLoadedMetadata()

    return () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return videoRef
}
