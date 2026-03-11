const CACHE = "accesos-v1";

const archivos = [

"/",
"/index.html",
"/dashboard.html",
"/generar.html",
"/escaner.html",
"/admin.html",
"/css/estilos.css"

];

self.addEventListener("install", e => {

e.waitUntil(

caches.open(CACHE)
.then(cache => cache.addAll(archivos))

);

});

self.addEventListener("fetch", e => {

e.respondWith(

caches.match(e.request)
.then(res => res || fetch(e.request))

);

});
