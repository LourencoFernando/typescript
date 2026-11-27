import axios from "axios";
// OpenLayers' CSS positions the map controls and attribution.
import "ol/ol.css";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
// Renamed so it doesn't shadow JavaScript's built-in Map collection.
import OlMap from "ol/Map.js";
import { fromLonLat } from "ol/proj.js";
import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import View from "ol/View.js";

// --- Nominatim response type ---

// Nominatim's search with `format=json` returns an array of places (empty when
// nothing matches). Only the fields used here are typed; the API sends lat and
// lon as strings, not numbers.
type NominatimSearchResult = {
    lat: string;
    lon: string;
    display_name: string;
};

type NominatimSearchResponse = NominatimSearchResult[];

// --- DOM elements ---

// `!` asserts the elements exist; index.html always contains them.
const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;
const mapElement = document.getElementById("map")!;

// --- Map (OpenLayers) ---

// The marker is a point feature on its own vector layer, drawn as a circle,
// so no image files are needed.
const markerSource = new VectorSource();
const markerStyle = new Style({
    image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: "#d33" }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
    }),
});

// Created on the first search, so the "Please enter an address!" text shows until then.
let map: OlMap | undefined;

function showOnMap(lon: number, lat: number) {
    // OpenLayers takes [longitude, latitude] (x, y), and fromLonLat converts it
    // to the Web Mercator projection the OpenStreetMap tiles use.
    const position = fromLonLat([lon, lat]);

    if (!map) {
        mapElement.innerHTML = "";
        map = new OlMap({
            target: mapElement,
            layers: [
                // OSM() loads the standard OpenStreetMap tiles and their attribution.
                new TileLayer({ source: new OSM() }),
                new VectorLayer({ source: markerSource, style: markerStyle }),
            ],
            view: new View(),
        });
    }

    // After the `if`, TypeScript has narrowed map from OlMap | undefined to OlMap.
    map.getView().setCenter(position);
    map.getView().setZoom(16);

    markerSource.clear();
    markerSource.addFeature(new Feature(new Point(position)));
}

// --- Address search (Nominatim) ---

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    axios
        // The type argument types response.data; axios doesn't check it at runtime.
        .get<NominatimSearchResponse>(
            `https://nominatim.openstreetmap.org/search?q=${encodeURI(
                enteredAddress
            )}&format=json`
        )
        .then((response) => {
            // axios rejects the promise on network or HTTP errors, so this
            // check is a safeguard; the empty-result check below is the real one.
            if (!response) {
                throw new Error("Could not fetch location!");
            }

            const data = response.data[0];

            // noUncheckedIndexedAccess types data[0] as possibly undefined,
            // which is the "no results" case for an empty array.
            if (!data) {
                throw new Error("Could not find that address!");
            }

            const lat = data.lat;
            const long = data.lon;

            // Nominatim sends lat/lon as strings; OpenLayers needs numbers.
            showOnMap(Number(long), Number(lat));
        })
        // A promise's rejection reason is typed `any`, so err.message isn't checked.
        .catch((err) => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchAddressHandler);

/*
Use cases and architectural decisions

- Typing a third-party API response: NominatimSearchResponse describes only the
  fields the app reads, not the whole JSON. This keeps the type small and
  honest, but `axios.get<T>` is a compile-time promise only. If the API changes
  shape, TypeScript won't notice; a runtime validator (such as zod) is the next
  step when the data comes from a service you don't control.
- Library types come in two forms: OpenLayers ships its own `.d.ts` files, so
  `import OlMap from "ol/Map.js"` is typed with no extra package. Libraries
  written in plain JavaScript (Leaflet, for example) need a separate
  `@types/...` package from DefinitelyTyped, which can lag behind the library.
- Geocoding and map display are separate concerns: Nominatim turns text into
  coordinates and OpenLayers draws them. Keeping them in separate functions
  (`searchAddressHandler` and `showOnMap`) means either provider can be
  swapped, for example Google's Geocoding API, without touching the other.
- Data conversion at the boundary: Nominatim's string coordinates are converted
  with Number() right before calling showOnMap, so the map code only sees
  numbers. Number() returns NaN for bad input instead of throwing, which the
  types can't catch.
- `let map: OlMap | undefined` with lazy creation avoids initializing the map
  before there is something to show, and narrowing removes the `undefined`
  after the `if`. The tradeoff is module-level mutable state; a class would
  wrap it once the app grows.
- Usage limits: Nominatim and the OpenStreetMap tiles are free but
  rate-limited (about one search per second), so search on submit, not on
  every keystroke. A production app would use a paid or self-hosted provider.
*/
