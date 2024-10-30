"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClientWorker = exports.initDetectorWorker = exports.initCrashDetection = void 0;
var client_controller_1 = require("./client-controller");
exports.initCrashDetection = client_controller_1.default;
var client_worker_1 = require("./client-worker");
exports.initClientWorker = client_worker_1.default;
var detector_worker_1 = require("./detector-worker");
exports.initDetectorWorker = detector_worker_1.default;
