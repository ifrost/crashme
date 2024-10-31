// @ts-nocheck

import { getDb } from './utils';

type CrashDetectionOptions<CustomProperties> = {
  /**
   * Unique id of a tab
   */
  id: string;

  /**
   * Name of the database used to store the data (needs to be the same for all components)
   */
  dbName: string;

  /**
   * Report a crash (e.g. over HTTP). Needs to return true if reporting was successful.
   * If reporting was not successful the detector will try to report the crash again.
   */
  reportCrash: (crashedTab: CustomProperties) => Promise<boolean>;

  /**
   * Report a stale tab (e.g. over HTTP). Needs to return true if reporting was successful.
   * If reporting was not successful the detector will try to report the stale tab again.
   */
  reportStaleTab?: (crashedTab: CustomProperties) => Promise<boolean>;

  /**
   * Modify currentTab param with any parameters about the current tab needed to be reported back
   */
  updateInfo: (currentTab: CustomProperties) => void;

  /**
   * Create the shared detector worker (see detector-worker.js)
   * Should be just:
   *   return new SharedWorker(new URL('./detector.worker', import.meta.url));
   */
  createDetectorWorker: () => SharedWorker;

  /**
   * Create the client worker (see client-worker.js)
   * Should be just:
   *   return new Worker(new URL('./client.worker', import.meta.url));
   */
  createClientWorker: () => Worker;

  /**
   * Additional log for debugging
   */
  log?: (log: Record<string, string | boolean | number>) => void;
};

/**
 * Each report will container BasicReport. You can enrich the data in updateInfo handler
 */
export type BasicReport = {
  id: string;
  tabLastActive: number;
  tabFirstActive: number;
  workerLastActive: number;
};

export function initCrashDetection<CustomProperties extends BasicReport>(
  options: CrashDetectionOptions<CustomProperties>
) {
  let worker;
  let detector;
  let info: Partial<CustomProperties> = {};
  let db;

  const log = (log: Record<string, string | boolean>) => {
    log.id = info.id;
    options.log?.(log);
  };

  async function handleDetectorMessage(event) {
    if (event.data.event === 'crash-detected' && event.data.reporter.id === info.id) {
      log({ event: 'crash-detected' });
      const tab = event.data.tab;
      const success = await options.reportCrash(tab);
      log({ event: 'crash-reported', success });

      if (success) {
        log({ event: 'crash-report-confirmed' });
        detector.port.postMessage({ event: 'crash-reported', id: event.data.tab.id });
      }
    }

    if (options.reportStaleTab && event.data.event === 'stale-tab-detected' && event.data.reporter.id === info.id) {
      log({ event: 'stale-tab-detected' });
      const tab = event.data.tab;
      const success = await options.reportStaleTab(tab);
      log({ event: 'stale-tab-reported', success });

      if (success) {
        log({ event: 'stale-tab-confirmed' });
        detector.port.postMessage({ event: 'stale-tab-reported', id: event.data.tab.id });
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
    log({ event: 'updated' });
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
    log({ event: 'loaded' });
    window.addEventListener('click', start);
  }

  async function start() {
    log({ event: 'started' });

    window.removeEventListener('click', start);
    initialize();

    registerWorkers();

    window.addEventListener('beforeunload', () => {
      log({ event: 'unloaded' });

      // to avoid any delays clean-up happens in the current tab as well
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(info.id);

      worker.postMessage({
        event: 'close',
        info,
      });
      unregisterWorkers();
      log({ event: 'unloaded-done' });
    });

    worker.postMessage({
      event: 'start',
      info,
    });
    log({ event: 'started-done' });
  }

  // main entry point
  getDb(options.dbName).then((result) => (db = result));
  if (document.readyState === 'complete') {
    startWhenReady();
  } else {
    window.addEventListener('load', () => {
      startWhenReady();
    });
  }
}
