const CACHE_NAME = "valle-esmeralda-v1";

// Lista de archivos para funcionar sin internet (Caché)
const assets = [
    "./",
    "./index.html",
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

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caché abierto con éxito");
            return cache.addAll(assets);
        })
    );
});

// Activar y limpiar cachés antiguos
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Responder desde el caché si no hay internet
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
