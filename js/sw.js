const CACHE = "accesos-v1";

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE).then(cache => {

return cache.addAll(["/"]);

})

);

});
