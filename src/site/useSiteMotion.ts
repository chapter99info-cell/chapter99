import { useEffect, type RefObject } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Sticky header: glass over hero until 60px scroll. */
export function useHeaderScroll(onScrolled: (scrolled: boolean) => void) {
  useEffect(() => {
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      onScrolled(y > 60)
    }
    update()
    window.addEventListener('scroll', update, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', update, { capture: true } as AddEventListenerOptions)
  }, [onScrolled])
}

/** Fade + rise 16px once. Stagger 60ms per card. */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current
    if (!host) return
    const nodes = Array.from(host.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (prefersReducedMotion()) {
      nodes.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 8) * 60}ms`)
      io.observe(el)
    })
    return () => io.disconnect()
  }, [root])
}
