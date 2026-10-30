/*
 * Resolves once the Google Maps JS API is ready to use.
 *
 * The API script is included once in index.html with `async defer`, so a
 * component that mounts quickly can call `new google.maps.Map(...)` before the
 * global `google` object exists and throw a ReferenceError. This helper polls
 * for the API and hands back a single shared promise so the script is only
 * waited on once.
 */

let mapsPromise = null;

function mapsReady() {
  return Boolean(window.google && window.google.maps && window.google.maps.Map);
}

export default function loadGoogleMaps() {
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    if (mapsReady()) {
      resolve(window.google.maps);
      return;
    }

    const startedAt = Date.now();
    const poll = setInterval(() => {
      if (mapsReady()) {
        clearInterval(poll);
        resolve(window.google.maps);
      } else if (Date.now() - startedAt > 15000) {
        clearInterval(poll);
        reject(new Error('The Google Maps JS API did not finish loading.'));
      }
    }, 100);
  });

  return mapsPromise;
}
