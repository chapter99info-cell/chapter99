/* Chapter99 Admin — static asset cache only; HTML/API/data always network-first */
const CACHE_NAME = 'chapter99-admin-v3'
const STATIC_ASSETS = [
  '/admin/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (!url.pathname.startsWith('/admin')) return
  if (event.request.method !== 'GET') return

  // Never cache HTML/navigation requests (SPA shell) — stale shells cause
  // "Failed to fetch dynamically imported module" after redeploys.
  if (event.request.mode === 'navigate' || url.pathname === '/admin' || url.pathname === '/admin/') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
    return
  }

  // Hashed static assets only — safe to cache-first.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (response.ok && url.pathname.match(/\.(js|css|svg|png|woff2?)$/)) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
