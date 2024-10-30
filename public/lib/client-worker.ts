// @ts-nocheck

import {getDb} from "./utils";

type ClientWorkerOptions = {
  pingInterval: number; // e.g. 1000
  dbName: string;
};

export function initClientWorker(options: ClientWorkerOptions) {
  let lastInfo;
  let tabLastActive = Date.now();
  let db;

  setInterval(() => {
    if (lastInfo?.id) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');

      const workerLastActive = Date.now();
      // save latest received info here - the tab may be paused because of debugging but we need to mark the tab as alive anyway because the worker is still alive
      store.put({ ...structuredClone(lastInfo), tabLastActive, workerLastActive });
    }

    // ping to tab so it can send latest values
    // saving will happen on the next pingInterval
    postMessage({ event: 'ping' });
  }, options.pingInterval);

  addEventListener('message', async (event) => {
    if (event.data.event === 'update') {
      tabLastActive = Date.now();
      lastInfo = structuredClone(event.data.info);
      // saving cannot happen here because message may not be sent when tab is paused (e.g. while debugging)
    }
    if (event.data.event === 'start') {
      db = await getDb(options.dbName);
    }
    if (event.data.event === 'close') {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(event.data.info.id);
    }
  });

}
