import { BaseStateReport, CrashDetectionOptions } from './types';
/**
 * Main function to initialize crash detection. This should be run from the main thread of the tab.
 */
export declare function initCrashDetection<CustomStateReport extends BaseStateReport>(options: CrashDetectionOptions<CustomStateReport>): void;
