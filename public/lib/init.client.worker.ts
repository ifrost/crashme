import { getDb } from './utils';
import { BaseStateReport } from './types';
import { createPingEvent, isCloseEvent, isStartEvent, isUpdateEvent } from './events';

type ClientWorkerOptions = {
  pingInterval: number; // e.g. 1000
  dbName: string;
};

/**
 * Main logic of the Web Worker running with the tab. Create a separate file for the worker with code:
 *
 * initClientWorker({
 *   dbName: 'NAME OF YOUR DB',
 *   pingInterval: 1000,
 * });
 *
 */
export function initClientWorker(options: ClientWorkerOptions) {
  let lastStateReport: BaseStateReport;
  let tabLastActive = Date.now();
  let db: IDBDatabase | undefined;

  setInterval(() => {
    if (!db) {
      // not started yet
      return;
    }

    if (lastStateReport?.id) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');

      const workerLastActive = Date.now();
      // save latest received info here - the tab may be paused because of debugging but we need to mark the tab as alive anyway because the worker is still alive
      store.put({ ...structuredClone(lastStateReport), tabLastActive, workerLastActive });
    }

    // ping to tab so it can send latest values
    // saving will happen on the next pingInterval
    const pingEvent = createPingEvent();
    postMessage(pingEvent);
  }, options.pingInterval);

  addEventListener('message', async (message) => {
    if (isUpdateEvent(message.data)) {
      tabLastActive = Date.now();
      lastStateReport = structuredClone(message.data.report);
      // saving cannot happen here because message may not be sent when tab is paused (e.g. while debugging)
    }
    if (isStartEvent(message.data)) {
      db = await getDb(options.dbName);
    }
    if (isCloseEvent(message.data) && db) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(message.data.id);
      db = undefined;
    }
  });
}
