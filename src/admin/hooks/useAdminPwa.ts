import { useEffect } from 'react'

/** Register admin-scoped service worker for static asset caching */
export function useAdminServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' }).catch(() => {
      /* non-fatal in dev */
    })
  }, [])
}

/** Link admin PWA manifest when on admin routes */
export function useAdminManifest() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = '/admin/manifest.json'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])
}
