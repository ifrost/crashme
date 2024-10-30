export async function getDb(dbName: string) {
    return new Promise(function (resolve, reject) {
        let request = indexedDB.open(dbName);
        request.onerror = (event) => {
            // reject(event.target.error);
            reject(request.error);
        };
        request.onsuccess = (event) => {
            // resolve(event.target.result);
            resolve(request.result);
        };
        request.onupgradeneeded = (event) => {
            if (!event.target) {
                return;
            }

            // const db = event.target.result;
            const db = request.result;

            if (!db.objectStoreNames.contains('tabs')) {
                db.createObjectStore('tabs', { keyPath: 'id' });
            }
        };
    });
}
