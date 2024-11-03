import { getDb } from './utils';
import { BaseStateReport, DetectorWorkerOptions } from './types';
import {
  createCrashDetectedEvent,
  createStaleTabDetectedEvent,
  isCrashReportedEvent,
  isStaleTabReportedEvent,
} from './events';

declare const self: SharedWorker;

/**
 * Main logic of the Shared Worker responsible for detecting crashes. Create a separate file for the worker with code:
 *
 * initDetectorWorker({
 *   dbName: 'NAME OF YOUR DB',
 *   staleThreshold: 60000,
 *   crashThreshold: 5000,
 *   interval: 5000,
 * });
 *
 */
export function initDetectorWorker(options: DetectorWorkerOptions) {
  let db: IDBDatabase;
  let started = false;
  let openPorts: MessagePort[] = [];

  function handleMessageFromReporter(event: MessageEvent) {
    if (isCrashReportedEvent(event.data)) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(event.data.id);
    }

    if (isStaleTabReportedEvent(event.data)) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.put({ ...event.data.report, staleReported: true });
    }
  }

  /**
   * Check which tabs have stopped sending updates but did not clear themselves properly
   */
  function checkStaleTabs() {
    const transaction = db.transaction(['tabs'], 'readwrite');
    const store = transaction.objectStore('tabs');
    const request = store.getAll();

    request.onsuccess = function () {
      const tabs = request.result as BaseStateReport[];

      let activeTabs: BaseStateReport[] = [];
      let inactiveTabs: BaseStateReport[] = [];
      let staleTabs: BaseStateReport[] = [];

      tabs.forEach(function (tab) {
        const workerInactivity = Date.now() - tab.workerLastActive;
        const tabInactivity = Date.now() - tab.tabLastActive;
        if (workerInactivity > options.crashThreshold) {
          inactiveTabs.push(tab);
        } else if (tabInactivity > options.staleThreshold && !tab.staleReported) {
          staleTabs.push(tab);
        } else {
          activeTabs.push(tab);
        }
      });

      if (activeTabs.length === 0) {
        // no active tabs, skip until a tab gets active
        return;
      }
      // use only one tab for reporting
      let reporter = activeTabs.pop()!; // must be defined based on the check above

      inactiveTabs.forEach(function (report) {
        openPorts.forEach(function (port) {
          const event = createCrashDetectedEvent(report, reporter.id);
          port.postMessage(event);
        });
      });

      staleTabs.forEach(function (report) {
        openPorts.forEach(function (port) {
          const event = createStaleTabDetectedEvent(report, reporter.id);
          port.postMessage(event);
        });
      });
    };
  }

  self.addEventListener('connect', async function (event) {
    if (!started) {
      db = await getDb(options.dbName);

      // keep track of all clients to report only to one tab
      const port = (event as MessageEvent).ports[0];
      openPorts.push(port);
      port.addEventListener('message', handleMessageFromReporter);
      port.addEventListener('close', () => {
        openPorts = openPorts.filter((p) => p !== port);
      });
      port.start();

      setInterval(checkStaleTabs, options.interval);
      started = true;
    }
  });
}
