// @ts-nocheck

import { getDb } from "./utils";

type DetectorWorkerOptions = {
  dbName: string;
  inactivityThreshold: number; // e.g. 5000
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
  }

  const INACTIVITY_THRESHOLD = options.inactivityThreshold;

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

      tabs.forEach(function (tab) {
        const workerInactivity = Date.now() - tab.workerLastActive;
        if (workerInactivity > INACTIVITY_THRESHOLD) {
          inactiveTabs.push(tab);
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
      tabs.forEach(function (tab) {
        const workerInactivity = Date.now() - tab.workerLastActive;
        if (workerInactivity > INACTIVITY_THRESHOLD) {
          openPorts.forEach(function (port) {
            port.postMessage({ event: 'crash-detected', tab, reporter });
          });
        }
      });
    };
  }

  self.onconnect = async function (event) {
    if (!started) {
      db = await getDb(options.dbName);

      const port = event.ports[0];
      openPorts.push(port);
      port.addEventListener('message', handleMessageFromReporter);
      port.addEventListener('close', () => {
        openPorts = openPorts.filter((p) => p !== port);
      })
      port.start();

      setInterval(checkStaleTabs, INACTIVITY_THRESHOLD);
      started = true;
    }
  };

}
