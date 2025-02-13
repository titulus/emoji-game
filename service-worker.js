const cacheName = 'emoji-game-cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'styles.css',
  'src/script.ts',
  'src/audio.ts',
  'src/sdk.ts',
  'src/ui.ts',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(precacheResources))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});