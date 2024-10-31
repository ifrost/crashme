export async function getDb(dbName: string) {
  return new Promise<IDBDatabase>(function (resolve, reject) {
    let request = indexedDB.open(dbName);
    request.onerror = () => {
      reject(request.error);
    };
    request.onsuccess = () => {
      resolve(request.result as IDBDatabase);
    };
    request.onupgradeneeded = (event) => {
      if (!event.target) {
        return;
      }

      const db = request.result;

      if (!db.objectStoreNames.contains('tabs')) {
        db.createObjectStore('tabs', { keyPath: 'id' });
      }
    };
  });
}
