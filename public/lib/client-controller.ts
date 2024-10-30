// @ts-nocheck

type CrashDetectionOptions<CustomProperties> = {
  id: string;
  reportCrash: (crashedTab: CustomProperties) => Promise<boolean>;
  updateInfo: (currentTab: CustomProperties) => void;
  createDetectorWorker: () => SharedWorker;
  createClientWorker: () => Worker;
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

  async function handleDetectorMessage(event) {
    if (event.data.event === 'crash-detected' && event.data.reporter.id === info.id) {
      const tab = event.data.tab;
      const success = await options.reportCrash(tab);
      if (success) {
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
    worker.postMessage({
      event: 'update',
      info,
    });
  }

  function registerWorker() {
    worker = options.createClientWorker();
    worker.addEventListener('message', updateInfo);

    detector = options.createDetectorWorker();
    detector.port.addEventListener('message', handleDetectorMessage);
    detector.port.start();
  }

  function startWhenReady() {
    // beforeunload is triggered only after at least one interaction
    window.addEventListener('click', start);
  }

  async function start() {
    window.removeEventListener('click', start);
    initialize();

    registerWorker();

    window.addEventListener('beforeunload', () => {
      worker.postMessage({
        event: 'close',
        info,
      });
    });

    worker.postMessage({
      event: 'start',
      info,
    });
  }

  // main entry point
  if (document.readyState === 'complete') {
    startWhenReady();
  } else {
    window.addEventListener('load', () => {
      startWhenReady();
    });
  }
}
