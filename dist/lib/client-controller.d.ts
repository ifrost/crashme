type CrashDetectionOptions<CustomProperties> = {
    id: string;
    reportCrash: (crashedTab: CustomProperties) => Promise<boolean>;
    updateInfo: (currentTab: CustomProperties) => void;
    createDetectorWorker: () => SharedWorker;
    createClientWorker: () => Worker;
};
export type BasicReport = {
    id: string;
};
export declare function initCrashDetection<CustomProperties extends BasicReport>(options: CrashDetectionOptions<CustomProperties>): void;
export {};
