export type CrashDetectionOptions<CustomStateReport> = {
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
  reportCrash: (crashedTab: CustomStateReport) => Promise<boolean>;
  /**
   * Report a stale tab (e.g. over HTTP). Needs to return true if reporting was successful.
   * If reporting was not successful the detector will try to report the stale tab again.
   */
  reportStaleTab?: (crashedTab: CustomStateReport) => Promise<boolean>;
  /**
   * Modify currentTab param with any parameters about the current tab needed to be reported back
   */
  updateInfo: (currentTab: CustomStateReport) => void;
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
export type DetectorWorkerOptions = {
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
/**
 * Each report will container BasicReport. You can enrich the data in updateInfo handler
 */
export type BaseStateReport = {
  id: string;
  tabLastActive: number;
  tabFirstActive: number;
  workerLastActive: number;
};
