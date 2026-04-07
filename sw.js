self.addEventListener("install", (e) => {
    e.waitUntil(caches.open("v1").then((cache) => cache.addAll([
        "./", "./index.html", "./generar.html", "./escaner.html", 
        "./verqr.html", "./firebase.js", "./qr.js", "./scanner.js",
        "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"
    ])));
});

self.addEventListener("fetch", (e) => {
    e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
