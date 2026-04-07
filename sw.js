const CACHE_NAME = "valle-esmeralda-v1";

// Lista de todos los archivos que deben funcionar sin internet
const ASSETS = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./generar.html",
  "./escaner.html",
  "./verqr.html",
  "./historial.html",
  "./firebase.js",
  "./login.js",
  "./qr.js",
  "./scanner.js",
  "./historial.js",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js",
  "https://unpkg.com/html5-qrcode"
];

// Instalación: Guarda los archivos en la memoria del celular
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caché abierta: Guardando recursos...");
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpia versiones antiguas de la caché
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Borrando caché antigua...");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Primero busca en caché, si no, usa internet
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
