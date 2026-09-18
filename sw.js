const CACHE='nightfall-v5.0-'+new URL(self.registration.scope).pathname;
const FILES=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nightfall-')&&k.endsWith('-'+new URL(self.registration.scope).pathname)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;const url=new URL(e.request.url);if(!url.href.startsWith(self.registration.scope))return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(new URL('./index.html',self.registration.scope),copy)));}return response;}).catch(()=>caches.match(new URL('./index.html',self.registration.scope))));return;}
e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));});
