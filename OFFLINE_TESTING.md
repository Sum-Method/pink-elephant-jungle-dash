# Offline testing checklist

Use this quick flow after running `npm run build:pages` and publishing to GitHub Pages.

1. Open the live game once while online.
2. Open DevTools → **Application** and confirm a service worker is active.
3. In DevTools → **Network**, enable **Offline**.
4. Refresh the page.
5. Confirm the game still opens and is playable.
6. Disable Offline mode and deploy a small change.
7. Refresh again and confirm the app updates (the new service worker should replace old caches automatically).

If the browser still shows an old version, in DevTools → Application:
- unregister the service worker,
- clear site storage,
- reload the page once online.
