function actualizar_cache_dinamico(dynamicCache, req, res) {
    if (res.ok) {
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone());
            return res.clone()
        });
    } else {
        return res;
    }
}