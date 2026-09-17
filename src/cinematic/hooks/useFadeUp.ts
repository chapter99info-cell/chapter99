import { useEffect, useRef } from 'react'

export function useFadeUp(index = 0) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const delay = Math.min(index, 8) * 80
    node.style.opacity = '0'
    node.style.transform = 'translateY(16px)'
    const timer = window.setTimeout(() => {
      node.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
      node.style.opacity = '1'
      node.style.transform = 'translateY(0)'
    }, delay)
    return () => window.clearTimeout(timer)
  }, [index])

  return ref
}
