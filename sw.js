importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'style/base.css',
    'js/base.js',
    'js/app.js',
    'js/sw-utils.js',
    'img/icons/favicon.ico',
    'style/bg.png',
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js',
];
const APP_SHELL_DINAMIC = [];

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
        keys.forEach(key => {
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if ((requestUrl.pathname === '/')) {
            event.respondWith(caches.match('/'));
            // event.respondWith(caches.match('/base_layout'));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // return response || fetch(event.request);
            if (response) {
                return response;
            } else {
                return fetch(event.request).then(newRes => {
                    return actualizar_cache_dinamico(DYNAMIC_CACHE, event.request, newRes);
                });
            }

        })
    );
});