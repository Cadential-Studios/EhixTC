// Ehix: The Triune Convergence - Service Worker
// Enables offline gameplay and app-like experience

const CACHE_NAME = 'ehix-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/js/mobile.js',
  './assets/js/systems/character.js',
  './assets/js/systems/combat.js',
  './assets/js/systems/crafting.js',
  './assets/js/systems/experience.js',
  './assets/js/systems/progression.js',
  './assets/js/ui/inventory.js',
  './assets/js/ui/ui.js',
  './assets/js/utils/save.js',
  './assets/js/utils/core.js',
  './assets/js/scenes.js',
  './data/scenes.json',
  './data/items.json',
  './data/characters.json',
  './data/species.json',
  './data/classes.json',
  './data/spells.json',
  './data/monsters.json',
  './data/locations.json',
  './data/quests.json',
  './data/recipes.json',
  // External resources (cached when accessed)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Cinzel:wght@400;700&display=swap',
  'https://unpkg.com/@phosphor-icons/web@2.0.3/src/duotone/style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Ehix: Caching app resources');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Ehix: Cache install failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response for caching
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Ehix: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for save data (if supported)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync-save') {
    event.waitUntil(
      // Sync save data when connection is restored
      console.log('Ehix: Background sync triggered')
    );
  }
});

// Push notifications (future feature)
self.addEventListener('push', function(event) {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: './assets/images/icon-192.png',
      badge: './assets/images/icon-72.png',
      tag: 'ehix-notification',
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Play Game',
          icon: './assets/images/icon-72.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('Ehix: The Triune Convergence', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});
