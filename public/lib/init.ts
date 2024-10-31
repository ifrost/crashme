import { getDb } from './utils';
import { BaseStateReport, CrashDetectionOptions } from './types';
import {
  createCloseEvent,
  createCrashReportedEvent,
  createStaleTabReportedEvent,
  createStartEvent,
  createUpdateEvent,
  isCrashDetectedEvent,
  isPingEvent,
  isStaleTabDetectedEvent,
} from './events';

/**
 * Main function to initialize crash detection. This should be run from the main thread of the tab.
 */
export function initCrashDetection<CustomStateReport extends BaseStateReport>(
  options: CrashDetectionOptions<CustomStateReport>
) {
  let worker: Worker;
  let detector: SharedWorker;
  let stateReport: Partial<CustomStateReport> = {};
  let db: IDBDatabase;

  const log = (log: Record<string, string | boolean>) => {
    log.id = String(stateReport.id);
    options.log?.(log);
  };

  async function handleDetectorMessage(message: MessageEvent) {
    if (isCrashDetectedEvent(message.data) && message.data.reporter.id === stateReport.id) {
      const tab = message.data.tab;
      const success = await options.reportCrash(tab as CustomStateReport);

      if (success) {
        const crashReportedEvent = createCrashReportedEvent(message.data.tab.id);
        detector.port.postMessage(crashReportedEvent);
      }
    }

    if (
      options.reportStaleTab &&
      isStaleTabDetectedEvent(message.data) &&
      message.data.reporter.id === stateReport.id
    ) {
      const tab = message.data.tab;
      const success = await options.reportStaleTab(tab as CustomStateReport);

      if (success) {
        const staleTabReportedEvent = createStaleTabReportedEvent(message.data.tab);
        detector.port.postMessage(staleTabReportedEvent);
      }
    }
  }

  /**
   * Generate id for the tab
   */
  function initialize() {
    stateReport.id = options.id;
    stateReport.tabFirstActive = Date.now();
  }

  /**
   * Update latest state of the tab
   */
  function handleWebWorkerMessage(message: MessageEvent) {
    if (isPingEvent(message.data)) {
      // info should have all required info when passed here
      options.updateInfo(stateReport as CustomStateReport);

      const updateEvent = createUpdateEvent(stateReport as BaseStateReport);
      worker.postMessage(updateEvent);
    }
  }

  function registerWorkers() {
    worker = options.createClientWorker();
    worker.addEventListener('message', handleWebWorkerMessage);

    detector = options.createDetectorWorker();
    detector.port.addEventListener('message', handleDetectorMessage);
    detector.port.start();
  }

  function unregisterWorkers() {
    worker.removeEventListener('message', handleWebWorkerMessage);
    detector.port.removeEventListener('message', handleDetectorMessage);
  }

  function startWhenReady() {
    // beforeunload is triggered only after at least one interaction
    window.addEventListener('click', start);
  }

  async function start() {
    window.removeEventListener('click', start);
    initialize();

    registerWorkers();

    window.addEventListener('beforeunload', () => {
      // to avoid any delays clean-up happens in the current tab as well
      const transaction = db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');
      store.delete(stateReport.id!);

      const closeEvent = createCloseEvent(stateReport as BaseStateReport);
      worker.postMessage(closeEvent);
      unregisterWorkers();
    });

    const startEvent = createStartEvent(stateReport as BaseStateReport);
    worker.postMessage(startEvent);
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
