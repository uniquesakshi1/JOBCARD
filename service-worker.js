const CACHE_NAME = 'job-card-local-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // बाहरी (External) लाइब्रेरीज जिन्हें App को ऑफलाइन इस्तेमाल करने के लिए कैश करना है
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
];

// App इंस्टॉल करें और जरूरी फ़ाइलों को कैश करें
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// App को कैश से लोड करें (जिससे यह ऑफलाइन काम करे)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache हिट होने पर, cache से रिटर्न करें
        if (response) {
          return response;
        }
        // Cache हिट न होने पर, नेटवर्क से रिक्वेस्ट करें
        return fetch(event.request);
      })
  );
});

// पुराने Cache को साफ़ करें
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});