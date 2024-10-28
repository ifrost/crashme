type CrashDetectionOptions<CustomProperties> = {
    id: string;
    reportCrash: (crashedTab: CustomProperties) => Promise<boolean>;
    updateInfo: (currentTab: CustomProperties) => void;
    createDetectorWorker: () => SharedWorker;
    createClientWorker: () => Worker;
};
export declare function initCrashDetection<CustomProperties extends object = {}>(options: CrashDetectionOptions<CustomProperties>): void;
export {};
