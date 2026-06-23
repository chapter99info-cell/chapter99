import { forwardRef, useEffect, useRef } from 'react'

type LazyViewportVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

const LazyViewportVideo = forwardRef<HTMLVideoElement, LazyViewportVideoProps>(
  function LazyViewportVideo({ autoPlay, preload: _preload, ...props }, forwardedRef) {
    const localRef = useRef<HTMLVideoElement>(null)
    const shouldAutoplay = Boolean(autoPlay)

    useEffect(() => {
      const video = localRef.current
      if (!video) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (shouldAutoplay) {
              void video.play().catch(() => {})
            }
          } else {
            video.pause()
          }
        },
        { threshold: 0.2 },
      )

      observer.observe(video)
      return () => observer.disconnect()
    }, [shouldAutoplay])

    return (
      <video
        {...props}
        ref={mergeRefs(localRef, forwardedRef)}
        autoPlay={false}
        preload="none"
        {...({ loading: 'lazy' } as React.VideoHTMLAttributes<HTMLVideoElement>)}
      />
    )
  },
)

export default LazyViewportVideo
