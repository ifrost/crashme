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
};
export declare function initCrashDetection<CustomProperties extends BasicReport>(
  options: CrashDetectionOptions<CustomProperties>
): void;
export {};
