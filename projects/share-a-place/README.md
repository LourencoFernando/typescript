# Share a Place

A practice project for selecting an address and showing it on a map. The
goal is to learn how to use a third-party library in TypeScript: installing
it, finding or adding its types (`@types` packages or `declare` for libraries
without types), and working with its API in a type-safe way.

A common setup for this kind of app is webpack with ts-loader. This version
uses Vite instead, because ts-loader needs the TypeScript compiler's
JavaScript API, which TypeScript 7 (the native compiler) doesn't provide. With Vite, the
TypeScript version is independent of the bundler: Vite strips types, and `tsc`
only type-checks.

Instead of Google Maps, which needs an API key, this version uses two
OpenStreetMap services that need no key:

- **Nominatim** turns the address into coordinates. It only geocodes; it
  doesn't draw maps. `NominatimSearchResponse` in `src/app.ts` types the part
  of its JSON response the app uses.
- **OpenLayers** (`ol`) draws the map from OpenStreetMap tiles and the marker.
  It ships its own `.d.ts` files, so no `@types` package is needed (unlike
  Leaflet, which needs `@types/leaflet`).

## Type-check and run

```sh
cd projects/share-a-place
npm ci
npx tsc --noEmit -p .   # type-check only; Vite does not check types
npm run dev             # dev server with hot reload
npm run build           # runs tsc, then writes ignored dist/
```

`index.html` loads `src/app.ts` directly as an ES module, and Vite compiles it
on request. Because Vite strips types without generating code,
`erasableSyntaxOnly` rejects `enum` and constructor parameter properties.
