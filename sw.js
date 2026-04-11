// Nombre de la versión (Incrementar cada vez que actualices el código de la App)
const CACHE_NAME = "valle-v4";

// Lista de archivos maestros para funcionamiento Offline y PWA
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./generar.html",
  "./admin.html",
  "./pendientes.html",
  "./manifest.json",
  "./firebase.js",
  "./logo.png",
  // Librerías Externas (CDN) para que funcionen si hay intermitencia
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
];

// 1. INSTALACIÓN: Guarda los archivos en el almacenamiento del celular
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("PWA: Archivos cacheados con éxito.");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Fuerza al Service Worker a activarse inmediatamente
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Borra versiones viejas de la App automáticamente
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("PWA: Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Toma el control de las pestañas abiertas inmediatamente
  self.clients.claim();
});

// 3. ESTRATEGIA (Network First): Prioriza internet para ver datos de Firebase en tiempo real.
// Si no hay señal, busca en la memoria del celular.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
