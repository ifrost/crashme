import { DetectorWorkerOptions } from './types';
/**
 * Main logic of the Shared Worker responsible for detecting crashes. Create a separate file for the worker with code:
 *
 * initDetectorWorker({
 *   dbName: 'NAME OF YOUR DB',
 *   staleThreshold: 60000,
 *   crashThreshold: 5000,
 *   interval: 5000,
 * });
 *
 */
export declare function initDetectorWorker(options: DetectorWorkerOptions): void;
