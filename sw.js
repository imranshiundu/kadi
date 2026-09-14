const CACHE = 'kadi-v3';
const ASSETS = ['./', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isShell = e.request.mode === 'navigate' ||
    (url.origin === location.origin && (url.pathname === '/' || url.pathname.endsWith('index.html')));
  if (isShell) {
    // App shell: network-first so fixes reach users; cache fallback when offline.
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, cp));
          return res;
        })
        .catch(() =>
          caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('/index.html'))
        )
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (r) =>
        r ||
        fetch(e.request).then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, cp));
          return res;
        }).catch(() => caches.match('/index.html'))
    )
  );
});
