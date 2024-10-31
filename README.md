# Detecting Browser/Tab crashes POC

This POC shows how browser crashes could potentially be detected.

## How to run demo?

1. Run `npm run dev`
2. Run `npm run server`
3. Open http://localhost:1234
You can open multiple tabs (each tab will get a unique name)
4. Logs are sent to the terminal via server.js
5. Try various actions that can simulate a crash
6. Once a crash is detected it will be sent to the server and stored in local memory
7. http://localhost:1234 will show crashes that were reported

## Resources

1. https://github.com/getsentry/sentry-javascript/issues/5280
2. http://jasonjl.me/blog/2015/06/21/taking-action-on-browser-crashes/
3. https://medium.com/@JackPu/how-to-check-browser-crash-via-javascript-fa7d5af5e80b

## How does it work?

There are two basic concept:

1. Tab tracking

Each browser tab reports its current state on regular intervals. The current state is saved in IndexedDB as a state report. 
The state contains properties like: last time when it was active, url, memory usage, etc.
The state is removed from the db when then tab is closed by the user

2. Crash detection

A separate process reads all state reports. If it happens that there's a state report that was saved and not removed for long period of time it means the tab was not closed correctly and it probably crashed. 

## How to use it in my project?

You need to create 2 files for workers and run init function in your app:

`detector.worker.js`

```javascript
import { initDetectorWorker } from 'crashme';

initDetectorWorker({
  dbName: 'crashme.crashes',
  staleThreshold: 60000,
  crashThreshold: 5000,
  interval: 5000,
});
```

`client.worker.js`

```javascript
import { initDetectorWorker } from 'crashme';

initClientWorker({
  dbName: 'crashme.crashes',
  pingInterval: 1000,
});
```

and run function to initialize detection:

```javascript
import { initCrashDetection } from 'crashme';

export function startReportingCrashes() {
  initCrashDetection({
    id: Math.random().toString(36).substr(2,5), // create unique id

    dbName: 'crashme.crashes',

    createClientWorker: () => {
      return new Worker(new URL('./client.worker', import.meta.url));
    },

    createDetectorWorker: () => {
      return new SharedWorker(new URL('./detector.worker', import.meta.url));
    },

    reportCrash: async (tab) => {
      // add your logic to report the crash
        
      // return true if reporting was successul
      return true;
    },

    updateInfo: (report) => {
      // enrich report with any properties you would like to track
    },
  });
}

```


