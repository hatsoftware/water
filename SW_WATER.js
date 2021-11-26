const cacheName = 'WATER-1127';
const staticAssets = [
  './',
  './index.html',
  
  './app_styles.css',  
  
  './js/axios.min.js','./js/coke.js','./js/je_msg.js','./js/enadlib.js',

  './app_admin.js','./app_chat.js','./app_db.js','./app_main.js','./app_meter.js',
  './app_meter2.js','./app_pages.js','./app_profile.js','./app_setting.js','./app_video.js',

  './gfx/apple-touch-iphone.png', 
  './gfx/jimage.png', './gfx/ref.png', 
  './gfx/proc.gif',  

  './gfx/author.png',  './gfx/logo.png',  
  
  './gfx/img_empty.png',  
  './gfx/jadmin.png',  
  './gfx/jback.png',  
  './gfx/jcam.png',
    
  './gfx/jedit.png',
  './gfx/jham.png',  
  './gfx/jhome.png',
  
  './gfx/jmsg.png', 
  './gfx/jsave.png',
  './gfx/jsend.png',

  './gfx/jsite.png',  

  './gfx/eMeter.png',  
  
  './manifest.webmanifest'
];

/*
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});
*/

/*
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if(url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req){
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req,fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
*/

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(async function() {
     try{
       var res = await fetch(event.request);
       var cache = await caches.open('cache');
       cache.put(event.request.url, res.clone());
       return res;
     }
     catch(error){
       return caches.match(event.request);
      }
    }());
});
*/

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(async function() {
    try{
      var res = await fetch(event.request);
      var cache = await caches.open('cache');
      cache.put(event.request.url, res.clone());
      return res;
    }
    catch(error){
      return caches.match(event.request);
    }
  }());
});


