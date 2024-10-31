// @ts-nocheck

import { getDb } from './utils';

type DetectorWorkerOptions = {
  /**
   * Name of the database used to store the data (needs to be the same for all components)
   */
  dbName: string;

  /**
   * If the web worker thread of the tab is inactive longer than the threshold and the tab was not successfully closed
   * it's marked as crashed and can be reported. This number needs be bigger than pingInterval of the web worker.
   */
  crashThreshold: number;

  /**
   * If the main thread of the tab is inactive longer than the threshold it's marked as stale and can be reported.
   * It doesn't mean the tab crashed but indicates the main thread was blocked for given time. This may be due to
   * extensive processing or because the thread was paused with a debugger.
   */
  staleThreshold: number;

  /**
   * How often detection logic will be triggered
   */
  interval: number;
};

export function initDetectorWorker(options: DetectorWorkerOptions) {
  let db;
  let started = false;
  let openPorts = [];

  function handleMessageFromReporter(event) {
    if (event.data.event === 'crash-reported' && event.data.id) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(event.data.id);
    }

    if (event.data.event === 'stale-tab-reported' && event.data.tab) {
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.store({ ...event.data.tab, staleReported: true });
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
      const tabs = request.result;

      let activeTabs = [];
      let inactiveTabs = [];
      let staleTabs = [];

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
      let reporter = activeTabs.pop();

      inactiveTabs.forEach(function (tab) {
        openPorts.forEach(function (port) {
          port.postMessage({ event: 'crash-detected', tab, reporter });
        });
      });

      staleTabs.forEach(function (tab) {
        openPorts.forEach(function (port) {
          port.postMessage({ event: 'stale-tab-detected', tab, reporter });
        });
      });
    };
  }

  self.onconnect = async function (event) {
    if (!started) {
      db = await getDb(options.dbName);

      // keep track of all clients to report only to one tab
      const port = event.ports[0];
      openPorts.push(port);
      port.addEventListener('message', handleMessageFromReporter);
      port.addEventListener('close', () => {
        openPorts = openPorts.filter((p) => p !== port);
      });
      port.start();

      setInterval(checkStaleTabs, options.interval);
      started = true;
    }
  };
}
