self.importScripts('/dist/bundle.js');

crashme.initClientWorker({
    dbName: 'crashme.crashes',
    pingInterval: 1000,
});
