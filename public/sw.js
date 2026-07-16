/* Chapter99 main site — static asset cache only; HTML/API/data always network-first */
const CACHE_NAME = 'chapter99-site-v3'
const PRECACHE = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/icons/icon-180.png',
  '/icons/favicon-32.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)))
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
  if (event.request.method !== 'GET') return
  if (url.pathname.startsWith('/admin')) return

  // Never cache HTML/navigation requests (index.html shell) — it must always
  // reflect the latest deploy so it references the current hashed JS/CSS chunks.
  // A stale cached shell pointing at deleted chunk filenames is what causes
  // "Failed to fetch dynamically imported module" errors after a redeploy.
  if (event.request.mode === 'navigate' || url.pathname === '/') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
    return
  }

  // Hashed static assets (js/css/img/font) are safe to cache-first — Vite
  // content-hashes the filename, so a changed file always gets a new URL.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (response.ok && url.pathname.match(/\.(js|css|svg|png|webp|woff2?)$/)) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
