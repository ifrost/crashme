/**
 * Send logs to external server because console.log in the browser may not be available
 * @param params
 */
function logger(params) {
    console.log(JSON.stringify(params));
    fetch("/log?" + Object.entries(params).map(e => e.join('=')).join("&"))
}

/**
 * Get IndexedDB containing all tabs.
 *
 * Alternatives:
 * - local storage
 * - session storage
 */
async function getDb() {
    return new Promise(function (resolve, reject) {
        let request = indexedDB.open("crashmeDb");
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("tabs")) {
                db.createObjectStore("tabs", {keyPath: "id"});
            }
        };
    })
}
