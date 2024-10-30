// @ts-nocheck

import {getDb} from "./utils";

type CrashDetectionOptions<CustomProperties> = {
  id: string;
  dbName: string;
  reportCrash: (crashedTab: CustomProperties) => Promise<boolean>;
  updateInfo: (currentTab: CustomProperties) => void;
  createDetectorWorker: () => SharedWorker;
  createClientWorker: () => Worker;
  log?: (log: Record<string, string | boolean | number>) => void;
};

export type BasicReport = {
  id: string;
}

export function initCrashDetection<CustomProperties extends BasicReport>(
  options: CrashDetectionOptions<CustomProperties>
) {
  let worker;
  let detector;
  let info = {};
  let db;

  const log = (log: Record<string, string | boolean>) => {
    log.id = info.id;
    options.log?.(log)
  }

  async function handleDetectorMessage(event) {
    if (event.data.event === 'crash-detected' && event.data.reporter.id === info.id) {
      log({ event: 'crash-detected'})
      const tab = event.data.tab;
      const success = await options.reportCrash(tab);
      log({ event: 'crash-reported', success })

      if (success) {
        log({ event: 'crash-report-confirmed' })
        detector.port.postMessage({ event: 'crash-reported', id: event.data.tab.id });
      }
    }
  }

  /**
   * Generate id for the tab
   */
  function initialize() {
    info.id = options.id;
    info.tabFirstActive = Date.now();
  }

  /**
   * Update latest state of the tab
   */
  function updateInfo() {
    options.updateInfo(info);
    log({ event: 'updated' })
    worker.postMessage({
      event: 'update',
      info,
    });
  }

  function registerWorkers() {
    worker = options.createClientWorker();
    worker.addEventListener('message', updateInfo);

    detector = options.createDetectorWorker();
    detector.port.addEventListener('message', handleDetectorMessage);
    detector.port.start();
  }

  function unregisterWorkers() {
    worker.removeEventListener('message', updateInfo);
    detector.port.removeEventListener('message', handleDetectorMessage);
  }

  function startWhenReady() {
    // beforeunload is triggered only after at least one interaction
    log({ event: 'loaded'});
    window.addEventListener('click', start);
  }

  async function start() {
    log({ event: 'started'})

    window.removeEventListener('click', start);
    initialize();

    registerWorkers();

    window.addEventListener('beforeunload', () => {
      log({ event: 'unloaded'})

      // to avoid any delays clean-up happens in the current tab as well
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(info.id);

      worker.postMessage({
        event: 'close',
        info,
      });
      unregisterWorkers();
      log({ event: 'unloaded-done'})
    });

    worker.postMessage({
      event: 'start',
      info,
    });
    log({ event: 'started-done'})
  }

  // main entry point
  getDb(options.dbName).then(result => db = result)
  if (document.readyState === 'complete') {
    startWhenReady();
  } else {
    window.addEventListener('load', () => {
      startWhenReady();
    });
  }
}
