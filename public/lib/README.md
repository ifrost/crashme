# Overview

Client: code that is run in the main thread of the tab (collects info about the tab)
Client worker: a web worker running for the same tab but in a separate thread to track main thread status
Detector worker: a shared worker, single instance for all tabs used to check which tabs crashed

# Client

Client code (runs in the  main thread of the tab). Responsibilities:
- Workers initialization
- Sending updates about the tab to the web worker (see below)
- Sending close event to the web worker when the tab is closed by the user
- Handling crash reports sent by the shared detector worker

## Workers initialization

```mermaid
sequenceDiagram
    autonumber
    User->>Client: click
    Client->>ClientWorker: new Worker(...)
    Client->>ClientWorker: addEventListener("message")
    Client->>DetectorWorker: new SharedWorker(...)
    Client->>DetectorWorker: addEventListener("message")
```

(1) Crash detection is activated on click because proper clean-up relies on `beforeunload` event which is not dispatched when user does not interact with tha page (ie. [sticky activation](https://developer.mozilla.org/en-US/docs/Glossary/Sticky_activation)).

## Sending updates about the tab

```mermaid
sequenceDiagram
    autonumber
    Client-->ClientWorker: postMessage({ event: "start" });
    ClientWorker->>ClientWorker: setInterval(options.pingInterval)
    ClientWorker->>Client: postMessage({ event: "ping" });
    Client->>ClientWorker: postMessage({ event: "update", report: ... });
```

(2) (3) The worker sends pings on regular ping interval. The worker is responsible for sending pings because client code may not be able to run code on regular basis:
- setInterval may be deprioritized when tab is inactive
- setInterval may not be triggered when code is paused due to debugging

(4) Client code sends report about current tab (like URL, memory usage) to the worker for saving

## Sending close event

```mermaid
sequenceDiagram
    autonumber
    Browser->>Client: beforeunload
    Client->>ClientWorker: postMessage({ event: "close" });
```

The tab is marked as successfully closed when:
- user closes the tab/browser
- user navigates to a different page

# Client Web Worker

Client Web Worker is responsible for:
- Sending "pings" to the main thread (client), and saving received state report of the tab (e.g. URL, memory usage)

## Saving ping updates

```mermaid
sequenceDiagram
    autonumber
    ClientWorker->>+ClientWorker: setInterval(options.pingInterval)
    loop UpdateLoop
      ClientWorker->ClientWorker: workerLastActive = Date.now();
      ClientWorker->>IndexedDB: put(workerLastActive, tabLastActive, report)
      ClientWorker->>Client: postMessage({ event: "ping" });
      activate Client
    end
    Client-->>ClientWorker: postMessage({ event: "update", report });
    deactivate Client
    ClientWorker->>ClientWorker: tabLastActive = Date.now()
```

(2) `workerLastActive` is updated on regular interval calls and stored along with current data to the db (3)

(4) Ping is sent at the end of the loop, but since it's asynchronous the update may happen outside of the loop:

(5) The client sends the update as a response to ping event 

(6) `tabLastActive` is updated, and will be stored on the next main update loop

## Removing state of the tab

```mermaid
sequenceDiagram
    autonumber
    Browser->>Client: beforeunload
    Client->>ClientWorker: postMessage({ event: "close" });
    ClientWorker-->IndexedDB: delete(...)
```

# Detector  Worker

Detector Worker (Shared Worker) is responsible for:
- Reading current state of all tabs to determine which one crashed and sending a crash report to client so it can be stored externally

Detector's logic:

The tab is active when `workerLastActive` (last time worker code was run) is very close to Date.now(). `tabLastActive` is not reliable to determine if the tab is active as the tab may be debugged and `tabLastActive` freezes for time being.

If the tab is closed successfully the report won't be in the database. The database should only contain currently active tabs or tabs that were not closed correctly (due to a crash) and have been inactive for some time.

The tab is detected as crashed when `workerLastActive` is above certain threshold (set but the user) when compared to Date.now(). When threshold is reached it means the web worker stopped working but since the report is in the database in means the page was not closed correctly and the worker stopped responding so it probably crashed.

```mermaid
sequenceDiagram
    autonumber
    DetectorWorker ->> DetectorWorker: setInterval(options.interval)
    loop DetectionLoop
        DetectorWorker -->> IndexedDB: read all reports
        DetectorWorker ->> DetectorWorker: determine crashed tabs (see above)
        DetectorWorker ->> DetectorWorker: determine active tabs (see above)
        DetectorWorker ->> Client: postMessage("crash-detected")
        Client ->> HTTP: /report
        Client ->> DetectorWorker: postMessage("crash-reported")
        DetectorWorker ->> IndexedDB: delete(...)
    end
```

(4) (5) crash reports are sent only to one active tab to avoid duplicates

(8) state is removed from the db only after successful report to ensure it was sent out