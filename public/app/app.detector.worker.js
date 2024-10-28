self.importScripts('/dist/bundle.js');

crashme.initDetectorWorker({
    dbName: 'crashme.crashes',
    inactivityThreshold: 5000,
});
