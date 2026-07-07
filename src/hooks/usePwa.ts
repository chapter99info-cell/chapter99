import { useEffect } from 'react'

/** Register root-scoped service worker for static asset caching */
export function useServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* non-fatal in dev */
    })
  }, [])
}
