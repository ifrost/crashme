import {initDetectorWorker} from "../lib";

initDetectorWorker({
    dbName: 'crashme.crashes',
    inactivityThreshold: 5000,
});
