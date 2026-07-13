// 1. Import OneSignal Web Push Engine Core via CDN
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js"); //

// 2. Configure PWA Asset Caching
const CACHE_NAME = 'baking-studio-cache-v1';
const ASSETS_TO_CACHE = [
  '/awenity_bakery_concept/',
  '/awenity_bakery_concept/index.html',
  '/awenity_bakery_concept/manifest.json'
];

// Install Service Worker and Cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate and Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Network First Fallback Caching Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid network responses dynamically
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});