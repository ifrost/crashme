type ClientWorkerOptions = {
    pingInterval: number;
    dbName: string;
};
/**
 * Main logic of the Web Worker running with the tab. Create a separate file for the worker with code:
 *
 * initClientWorker({
 *   dbName: 'NAME OF YOUR DB',
 *   pingInterval: 1000,
 * });
 *
 */
export declare function initClientWorker(options: ClientWorkerOptions): void;
export {};
