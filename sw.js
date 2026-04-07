// Nombre de la versión de la caché (Incrementar cuando hagas cambios importantes)
const CACHE_NAME = "valle-v3";

// Lista de archivos que se guardarán en el celular para uso offline
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./generar.html",
  "./verqr.html",
  "./escaner.html",
  "./manifest.json",
  "./firebase.js",
  "./login.js",
  "./qr.js",
  "./scanner.js",
  "./qrcode.min.js",        // Librería local de QR
  "./html2canvas.min.js",   // Librería local de descarga
  "https://unpkg.com/html5-qrcode" // Librería de la cámara (Caseta)
];

// Instalación: Guardar archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caché instalada correctamente.");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación: Limpiar versiones viejas de la App
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia: Intentar red, si falla usar caché (Network First)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
