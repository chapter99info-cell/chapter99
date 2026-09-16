import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'

export function HeroScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useRef(false)
  const [spot, setSpot] = useState({ x: 62, y: 40 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce.current) return
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const x = ((e.clientX - box.left) / box.width) * 100
    const y = ((e.clientY - box.top) / box.height) * 100
    setSpot({ x, y })
    setTilt({ x: (x - 50) / 7, y: (y - 45) / 9 })
  }

  return (
    <div
      ref={ref}
      className="new-hero-scene"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={
        {
          '--spot-x': `${spot.x}%`,
          '--spot-y': `${spot.y}%`,
          '--tilt-x': `${tilt.x}px`,
          '--tilt-y': `${tilt.y}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
