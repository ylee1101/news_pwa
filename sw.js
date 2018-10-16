const staticAssets = [
    './',
    './styles.css',
    './app.js',
    "./images/fetch-dog.jpg"
]

self.addEventListener('install', async event => {
    console.log("install")
    // to take all static assets/caches and save them for later
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets)
})

self.addEventListener('fetch', event => {
    console.log("fetch")
    const req = event.request;
    const url = new URL(req.url)
    console.log("55", req)
    console.log("66", url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req))
    }
    
})

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    console.log("44", cachedResponse)
    return cachedResponse || fetch(req)
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');
    console.log("33", cache)
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}