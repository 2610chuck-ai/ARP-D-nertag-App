# Kebab-Bestellung – Netlify Final Fix

Diese Version behebt den Netlify-Function-Absturz mit `@netlify/blobs`.

## Ursache
Die Function lief als CommonJS und hat `@netlify/blobs` per `require(...)` geladen.
Neuere Netlify-Runtimes erwarten hier `import(...)`.

## Fix
`netlify/functions/orders.js` nutzt jetzt dynamischen Import:
- kein `require('@netlify/blobs')` mehr
- stattdessen `await import('@netlify/blobs')`

## Nach dem Upload
1. Projekt neu zu GitHub pushen
2. In Netlify neu deployen
3. Testen:
   - `/.netlify/functions/orders?health=1`
   - `/azubi`
   - `/index.html`
