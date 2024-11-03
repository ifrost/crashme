import { BaseStateReport } from './types';
/**
 * Sent from main thread to WebWorker with initial report. It initializes web worker which starts pining main thread
 */
export type StartEvent = {
    event: 'start';
    report: BaseStateReport;
};
export declare function isStartEvent(event: any): event is StartEvent;
export declare function createStartEvent(report: BaseStateReport): StartEvent;
/**
 * Sent from WebWorker to the main thread to force an update
 */
export type PingEvent = {
    event: 'ping';
};
export declare function createPingEvent(): PingEvent;
export declare function isPingEvent(event: any): event is PingEvent;
/**
 * Sent from main thread to WebWorker as response to ping event
 */
export type UpdateEvent = {
    event: 'update';
    report: BaseStateReport;
};
export declare function isUpdateEvent(event: any): event is UpdateEvent;
export declare function createUpdateEvent(report: BaseStateReport): UpdateEvent;
/**
 * Send from main thread to WebWorker when browser tab is closed correctly
 */
export type CloseEvent = {
    event: 'close';
    id: IDBValidKey;
};
export declare function isCloseEvent(event: any): event is CloseEvent;
export declare function createCloseEvent(id: IDBValidKey): CloseEvent;
/**
 * Sent from detector SharedWorker to main thread to indicate a crash was detected
 */
export type CrashDetectedEvent = {
    event: 'crash-detected';
    report: BaseStateReport;
    senderId: IDBValidKey;
};
export declare function isCrashDetectedEvent(event: any): event is CrashDetectedEvent;
export declare function createCrashDetectedEvent(report: BaseStateReport, senderId: IDBValidKey): CrashDetectedEvent;
/**
 * Sent from detector SharedWorker to main thread to indicate a stale tab was detected
 */
export type StaleTabDetectedEvent = {
    event: 'stale-tab-detected';
    report: BaseStateReport;
    senderId: IDBValidKey;
};
export declare function isStaleTabDetectedEvent(event: any): event is StaleTabDetectedEvent;
export declare function createStaleTabDetectedEvent(report: BaseStateReport, senderId: IDBValidKey): StaleTabDetectedEvent;
/**
 * Sent from the main thread to detector SharedWorker to indicate the crash was successfully reported
 */
export type CrashReportedEvent = {
    event: 'crash-reported';
    id: IDBValidKey;
};
export declare function isCrashReportedEvent(event: any): event is CrashReportedEvent;
export declare function createCrashReportedEvent(id: IDBValidKey): CrashReportedEvent;
export type StaleTabReportedEvent = {
    event: 'stale-tab-reported';
    report: BaseStateReport;
};
export declare function isStaleTabReportedEvent(event: any): event is StaleTabReportedEvent;
export declare function createStaleTabReportedEvent(report: BaseStateReport): StaleTabReportedEvent;
