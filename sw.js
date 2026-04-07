const CACHE_NAME = "valle-v2"; // Incrementamos la versión para forzar actualización

const ASSETS = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./escaner.html",
  "./generar.html",
  "./verqr.html", // <--- Ahora es parte de la App
  "./firebase.js",
  "./login.js",
  "./qr.js",
  "./scanner.js",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", // Nueva librería
  "https://unpkg.com/html5-qrcode"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
