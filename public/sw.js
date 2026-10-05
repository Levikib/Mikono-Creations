/* Minimal service worker: an offline fallback page and a cache for static assets only.
   - Navigations always go to the network. HTML is never cached; if the network is down, /offline.html is shown.
   - /media-opt images, /_next/static files, textures and cutouts are cache-first, in versioned caches.
   Bump VERSION to drop old caches. Nothing else is touched: no API calls, no forms, no third party requests. */
const VERSION = "mk-v1";
const STATIC = VERSION + "-static";
const MEDIA = VERSION + "-media";
const FALLBACK = "/offline.html";
const MEDIA_LIMIT = 220;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll([FALLBACK, "/logo-mark.png"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MEDIA_LIMIT; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match(FALLBACK)));
    return;
  }

  const p = url.pathname;
  const isMedia = p.startsWith("/media-opt/");
  if (isMedia || p.startsWith("/_next/static/") || p.startsWith("/textures/") || p.startsWith("/cutouts/")) {
    event.respondWith(
      caches.open(isMedia ? MEDIA : STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) {
          cache.put(req, res.clone()).then(() => (isMedia ? trim(cache) : undefined)).catch(() => {});
        }
        return res;
      }),
    );
  }
});
