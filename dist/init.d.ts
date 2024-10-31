import { BasicReport, CrashDetectionOptions } from './types';
/**
 * Main function to initialize crash detection. This should be run from the main thread of the tab.
 */
export declare function initCrashDetection<CustomProperties extends BasicReport>(options: CrashDetectionOptions<CustomProperties>): void;
