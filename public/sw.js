// ArchLab Service Worker
// Cache-first para assets estáticos, network-first para navegação
const CACHE_NAME = 'archlab-v1'
const FONT_CACHE = 'archlab-fonts-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
]

const FONT_URLS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
]

// ── Install: pré-cache assets críticos ──────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS)
    )
  )
  self.skipWaiting()
})

// ── Activate: limpar caches antigos ─────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== FONT_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ── Fetch: estratégia por tipo de recurso ───────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Google Fonts — Cache First
  if (FONT_URLS.some((f) => request.url.startsWith(f))) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const response = await fetch(request)
        cache.put(request, response.clone())
        return response
      })
    )
    return
  }

  // Arquivos estáticos (JS, CSS, imagens) — Cache First com fallback
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetch(request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
          return res
        })
      )
    )
    return
  }

  // Navegação (HTML) — Network First com fallback para /
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((r) => r ?? Response.error())
      )
    )
    return
  }
})
