const CACHE = 'zzp-wraak-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/main.js',
  './js/engine/input.js',
  './js/engine/audio.js',
  './js/engine/storage.js',
  './js/engine/util.js',
  './js/scenes/menu.js',
  './js/scenes/battle.js',
  './js/scenes/quiz.js',
  './js/scenes/leaderboard.js',
  './js/scenes/lawbook.js',
  './js/scenes/gameover.js',
  './js/data/questions.js',
  './js/data/facts.js',
  './js/data/enemies.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => null);
      return res;
    }).catch(() => cached))
  );
});
