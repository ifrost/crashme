import { initDetectorWorker } from '../lib';

initDetectorWorker({
  dbName: 'crashme.crashes',
  staleThreshold: 60000,
  crashThreshold: 5000,
  interval: 5000,
});
