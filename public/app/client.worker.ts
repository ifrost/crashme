import { initClientWorker } from '../lib';

initClientWorker({
  dbName: 'crashme.crashes',
  pingInterval: 1000,
});
