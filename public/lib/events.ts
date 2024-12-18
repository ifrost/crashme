import { BaseStateReport } from './types';

/**
 * Sent from main thread to WebWorker with initial report. It initializes web worker which starts pining main thread
 */
export type StartEvent = {
  event: 'start';
  report: BaseStateReport;
};

export function isStartEvent(event: any): event is StartEvent {
  return event?.event === 'start';
}

export function createStartEvent(report: BaseStateReport): StartEvent {
  return {
    event: 'start',
    report,
  };
}

/**
 * Sent from WebWorker to the main thread to force an update
 */
export type PingEvent = {
  event: 'ping';
};

export function createPingEvent(): PingEvent {
  return { event: 'ping' };
}

export function isPingEvent(event: any): event is PingEvent {
  return event?.event === 'ping';
}

/**
 * Sent from main thread to WebWorker as response to ping event
 */
export type UpdateEvent = {
  event: 'update';
  report: BaseStateReport;
};

export function isUpdateEvent(event: any): event is UpdateEvent {
  return event?.event === 'update';
}

export function createUpdateEvent(report: BaseStateReport): UpdateEvent {
  return { event: 'update', report };
}

/**
 * Send from main thread to WebWorker when browser tab is closed correctly
 */
export type CloseEvent = {
  event: 'close';
  id: IDBValidKey;
};

export function isCloseEvent(event: any): event is CloseEvent {
  return event?.event === 'close';
}

export function createCloseEvent(id: IDBValidKey): CloseEvent {
  return {
    event: 'close',
    id,
  };
}

/**
 * Sent from detector SharedWorker to main thread to indicate a crash was detected
 */
export type CrashDetectedEvent = {
  event: 'crash-detected';
  report: BaseStateReport;
  senderId: IDBValidKey;
};

export function isCrashDetectedEvent(event: any): event is CrashDetectedEvent {
  return event?.event === 'crash-detected';
}

export function createCrashDetectedEvent(report: BaseStateReport, senderId: IDBValidKey): CrashDetectedEvent {
  return {
    event: 'crash-detected',
    report,
    senderId,
  };
}

/**
 * Sent from detector SharedWorker to main thread to indicate a stale tab was detected
 */
export type StaleTabDetectedEvent = {
  event: 'stale-tab-detected';
  report: BaseStateReport;
  senderId: IDBValidKey;
};

export function isStaleTabDetectedEvent(event: any): event is StaleTabDetectedEvent {
  return event?.event === 'stale-tab-detected';
}

export function createStaleTabDetectedEvent(report: BaseStateReport, senderId: IDBValidKey): StaleTabDetectedEvent {
  return {
    event: 'stale-tab-detected',
    report,
    senderId,
  };
}

/**
 * Sent from the main thread to detector SharedWorker to indicate the crash was successfully reported
 */
export type CrashReportedEvent = {
  event: 'crash-reported';
  // id of the report that was saved
  id: IDBValidKey;
};

export function isCrashReportedEvent(event: any): event is CrashReportedEvent {
  return event?.event === 'crash-reported';
}

export function createCrashReportedEvent(id: IDBValidKey): CrashReportedEvent {
  return {
    event: 'crash-reported',
    id,
  };
}

export type StaleTabReportedEvent = {
  event: 'stale-tab-reported';
  report: BaseStateReport;
};

export function isStaleTabReportedEvent(event: any): event is StaleTabReportedEvent {
  return event?.event === 'stale-tab-reported';
}

export function createStaleTabReportedEvent(report: BaseStateReport): StaleTabReportedEvent {
  return {
    event: 'stale-tab-reported',
    report,
  };
}
