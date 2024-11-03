(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["crashme"] = factory();
	else
		root["crashme"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/lib/events.ts":
/*!******************************!*\
  !*** ./public/lib/events.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCloseEvent: () => (/* binding */ createCloseEvent),
/* harmony export */   createCrashDetectedEvent: () => (/* binding */ createCrashDetectedEvent),
/* harmony export */   createCrashReportedEvent: () => (/* binding */ createCrashReportedEvent),
/* harmony export */   createPingEvent: () => (/* binding */ createPingEvent),
/* harmony export */   createStaleTabDetectedEvent: () => (/* binding */ createStaleTabDetectedEvent),
/* harmony export */   createStaleTabReportedEvent: () => (/* binding */ createStaleTabReportedEvent),
/* harmony export */   createStartEvent: () => (/* binding */ createStartEvent),
/* harmony export */   createUpdateEvent: () => (/* binding */ createUpdateEvent),
/* harmony export */   isCloseEvent: () => (/* binding */ isCloseEvent),
/* harmony export */   isCrashDetectedEvent: () => (/* binding */ isCrashDetectedEvent),
/* harmony export */   isCrashReportedEvent: () => (/* binding */ isCrashReportedEvent),
/* harmony export */   isPingEvent: () => (/* binding */ isPingEvent),
/* harmony export */   isStaleTabDetectedEvent: () => (/* binding */ isStaleTabDetectedEvent),
/* harmony export */   isStaleTabReportedEvent: () => (/* binding */ isStaleTabReportedEvent),
/* harmony export */   isStartEvent: () => (/* binding */ isStartEvent),
/* harmony export */   isUpdateEvent: () => (/* binding */ isUpdateEvent)
/* harmony export */ });
function isStartEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'start';
}
function createStartEvent(report) {
    return {
        event: 'start',
        report: report,
    };
}
function createPingEvent() {
    return { event: 'ping' };
}
function isPingEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'ping';
}
function isUpdateEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'update';
}
function createUpdateEvent(report) {
    return { event: 'update', report: report };
}
function isCloseEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'close';
}
function createCloseEvent(id) {
    return {
        event: 'close',
        id: id,
    };
}
function isCrashDetectedEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'crash-detected';
}
function createCrashDetectedEvent(report, senderId) {
    return {
        event: 'crash-detected',
        report: report,
        senderId: senderId,
    };
}
function isStaleTabDetectedEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'stale-tab-detected';
}
function createStaleTabDetectedEvent(report, senderId) {
    return {
        event: 'stale-tab-detected',
        report: report,
        senderId: senderId,
    };
}
function isCrashReportedEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'crash-reported';
}
function createCrashReportedEvent(id) {
    return {
        event: 'crash-reported',
        id: id,
    };
}
function isStaleTabReportedEvent(event) {
    return (event === null || event === void 0 ? void 0 : event.event) === 'stale-tab-reported';
}
function createStaleTabReportedEvent(report) {
    return {
        event: 'stale-tab-reported',
        report: report,
    };
}


/***/ }),

/***/ "./public/lib/init.client.worker.ts":
/*!******************************************!*\
  !*** ./public/lib/init.client.worker.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initClientWorker: () => (/* binding */ initClientWorker)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./public/lib/utils.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./public/lib/events.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


/**
 * Main logic of the Web Worker running with the tab. Create a separate file for the worker with code:
 *
 * initClientWorker({
 *   dbName: 'NAME OF YOUR DB',
 *   pingInterval: 1000,
 * });
 *
 */
function initClientWorker(options) {
    var _this = this;
    var lastStateReport;
    var tabLastActive = Date.now();
    var db;
    setInterval(function () {
        if (!db) {
            // not started yet
            return;
        }
        if (lastStateReport === null || lastStateReport === void 0 ? void 0 : lastStateReport.id) {
            var transaction = db.transaction(['tabs'], 'readwrite');
            var store = transaction.objectStore('tabs');
            var workerLastActive = Date.now();
            // save latest received info here - the tab may be paused because of debugging but we need to mark the tab as alive anyway because the worker is still alive
            store.put(__assign(__assign({}, structuredClone(lastStateReport)), { tabLastActive: tabLastActive, workerLastActive: workerLastActive }));
        }
        // ping to tab so it can send latest values
        // saving will happen on the next pingInterval
        var pingEvent = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createPingEvent)();
        postMessage(pingEvent);
    }, options.pingInterval);
    addEventListener('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
        var transaction, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((0,_events__WEBPACK_IMPORTED_MODULE_1__.isUpdateEvent)(message.data)) {
                        tabLastActive = Date.now();
                        lastStateReport = structuredClone(message.data.report);
                        // saving cannot happen here because message may not be sent when tab is paused (e.g. while debugging)
                    }
                    if (!(0,_events__WEBPACK_IMPORTED_MODULE_1__.isStartEvent)(message.data)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getDb)(options.dbName)];
                case 1:
                    db = _a.sent();
                    _a.label = 2;
                case 2:
                    if ((0,_events__WEBPACK_IMPORTED_MODULE_1__.isCloseEvent)(message.data) && db) {
                        transaction = db.transaction(['tabs'], 'readwrite');
                        store = transaction.objectStore('tabs');
                        store.delete(message.data.id);
                        db = undefined;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}


/***/ }),

/***/ "./public/lib/init.detector.worker.ts":
/*!********************************************!*\
  !*** ./public/lib/init.detector.worker.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initDetectorWorker: () => (/* binding */ initDetectorWorker)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./public/lib/utils.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./public/lib/events.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


/**
 * Main logic of the Shared Worker responsible for detecting crashes. Create a separate file for the worker with code:
 *
 * initDetectorWorker({
 *   dbName: 'NAME OF YOUR DB',
 *   staleThreshold: 60000,
 *   crashThreshold: 5000,
 *   interval: 5000,
 * });
 *
 */
function initDetectorWorker(options) {
    var db;
    var started = false;
    var openPorts = [];
    function handleMessageFromReporter(event) {
        if ((0,_events__WEBPACK_IMPORTED_MODULE_1__.isCrashReportedEvent)(event.data)) {
            var transaction = db.transaction(['tabs'], 'readwrite');
            var store = transaction.objectStore('tabs');
            store.delete(event.data.id);
        }
        if ((0,_events__WEBPACK_IMPORTED_MODULE_1__.isStaleTabReportedEvent)(event.data)) {
            var transaction = db.transaction(['tabs'], 'readwrite');
            var store = transaction.objectStore('tabs');
            store.put(__assign(__assign({}, event.data.report), { staleReported: true }));
        }
    }
    /**
     * Check which tabs have stopped sending updates but did not clear themselves properly
     */
    function checkStaleTabs() {
        var transaction = db.transaction(['tabs'], 'readwrite');
        var store = transaction.objectStore('tabs');
        var request = store.getAll();
        request.onsuccess = function () {
            var tabs = request.result;
            var activeTabs = [];
            var inactiveTabs = [];
            var staleTabs = [];
            tabs.forEach(function (tab) {
                var workerInactivity = Date.now() - tab.workerLastActive;
                var tabInactivity = Date.now() - tab.tabLastActive;
                if (workerInactivity > options.crashThreshold) {
                    inactiveTabs.push(tab);
                }
                else if (tabInactivity > options.staleThreshold && !tab.staleReported) {
                    staleTabs.push(tab);
                }
                else {
                    activeTabs.push(tab);
                }
            });
            if (activeTabs.length === 0) {
                // no active tabs, skip until a tab gets active
                return;
            }
            // use only one tab for reporting
            var reporter = activeTabs.pop(); // must be defined based on the check above
            inactiveTabs.forEach(function (report) {
                openPorts.forEach(function (port) {
                    var event = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createCrashDetectedEvent)(report, reporter.id);
                    port.postMessage(event);
                });
            });
            staleTabs.forEach(function (report) {
                openPorts.forEach(function (port) {
                    var event = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createStaleTabDetectedEvent)(report, reporter.id);
                    port.postMessage(event);
                });
            });
        };
    }
    self.addEventListener('connect', function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var port_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!started) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getDb)(options.dbName)];
                    case 1:
                        db = _a.sent();
                        port_1 = event.ports[0];
                        openPorts.push(port_1);
                        port_1.addEventListener('message', handleMessageFromReporter);
                        port_1.addEventListener('close', function () {
                            openPorts = openPorts.filter(function (p) { return p !== port_1; });
                        });
                        port_1.start();
                        setInterval(checkStaleTabs, options.interval);
                        started = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    });
}


/***/ }),

/***/ "./public/lib/init.ts":
/*!****************************!*\
  !*** ./public/lib/init.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initCrashDetection: () => (/* binding */ initCrashDetection)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./public/lib/utils.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./public/lib/events.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


/**
 * Main function to initialize crash detection. This should be run from the main thread of the tab.
 */
function initCrashDetection(options) {
    var worker;
    var detector;
    var stateReport = {};
    var db;
    var log = function (log) {
        var _a;
        log.id = String(stateReport.id);
        (_a = options.log) === null || _a === void 0 ? void 0 : _a.call(options, log);
    };
    function handleDetectorMessage(message) {
        return __awaiter(this, void 0, void 0, function () {
            var tab, success, crashReportedEvent, report, success, staleTabReportedEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((0,_events__WEBPACK_IMPORTED_MODULE_1__.isCrashDetectedEvent)(message.data) && message.data.senderId === stateReport.id)) return [3 /*break*/, 2];
                        tab = message.data.report;
                        return [4 /*yield*/, options.reportCrash(tab)];
                    case 1:
                        success = _a.sent();
                        if (success) {
                            crashReportedEvent = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createCrashReportedEvent)(message.data.report.id);
                            detector.port.postMessage(crashReportedEvent);
                        }
                        _a.label = 2;
                    case 2:
                        if (!(options.reportStaleTab && (0,_events__WEBPACK_IMPORTED_MODULE_1__.isStaleTabDetectedEvent)(message.data) && message.data.senderId === stateReport.id)) return [3 /*break*/, 4];
                        report = message.data.report;
                        return [4 /*yield*/, options.reportStaleTab(report)];
                    case 3:
                        success = _a.sent();
                        if (success) {
                            staleTabReportedEvent = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createStaleTabReportedEvent)(message.data.report);
                            detector.port.postMessage(staleTabReportedEvent);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Generate id for the tab
     */
    function initialize() {
        stateReport.id = options.id;
        stateReport.tabFirstActive = Date.now();
    }
    /**
     * Update latest state of the tab
     */
    function handleWebWorkerMessage(message) {
        if ((0,_events__WEBPACK_IMPORTED_MODULE_1__.isPingEvent)(message.data)) {
            // info should have all required info when passed here
            options.updateInfo(stateReport);
            var updateEvent = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createUpdateEvent)(stateReport);
            worker.postMessage(updateEvent);
        }
    }
    function registerWorkers() {
        worker = options.createClientWorker();
        worker.addEventListener('message', handleWebWorkerMessage);
        detector = options.createDetectorWorker();
        detector.port.addEventListener('message', handleDetectorMessage);
        detector.port.start();
    }
    function unregisterWorkers() {
        worker.removeEventListener('message', handleWebWorkerMessage);
        detector.port.removeEventListener('message', handleDetectorMessage);
    }
    function startWhenReady() {
        // beforeunload is triggered only after at least one interaction
        window.addEventListener('click', start);
    }
    function start() {
        return __awaiter(this, void 0, void 0, function () {
            var startEvent;
            return __generator(this, function (_a) {
                window.removeEventListener('click', start);
                initialize();
                registerWorkers();
                window.addEventListener('beforeunload', function () {
                    // to avoid any delays clean-up happens in the current tab as well
                    var transaction = db.transaction(['tabs'], 'readwrite');
                    var store = transaction.objectStore('tabs');
                    store.delete(stateReport.id);
                    var closeEvent = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createCloseEvent)(stateReport.id);
                    worker.postMessage(closeEvent);
                    unregisterWorkers();
                });
                startEvent = (0,_events__WEBPACK_IMPORTED_MODULE_1__.createStartEvent)(stateReport);
                worker.postMessage(startEvent);
                return [2 /*return*/];
            });
        });
    }
    // main entry point
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getDb)(options.dbName).then(function (result) { return (db = result); });
    if (document.readyState === 'complete') {
        startWhenReady();
    }
    else {
        window.addEventListener('load', function () {
            startWhenReady();
        });
    }
}


/***/ }),

/***/ "./public/lib/utils.ts":
/*!*****************************!*\
  !*** ./public/lib/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDb: () => (/* binding */ getDb)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function getDb(dbName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var request = indexedDB.open(dbName);
                    request.onerror = function () {
                        reject(request.error);
                    };
                    request.onsuccess = function () {
                        resolve(request.result);
                    };
                    request.onupgradeneeded = function (event) {
                        if (!event.target) {
                            return;
                        }
                        var db = request.result;
                        if (!db.objectStoreNames.contains('tabs')) {
                            db.createObjectStore('tabs', { keyPath: 'id' });
                        }
                    };
                })];
        });
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./public/lib/index.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initClientWorker: () => (/* reexport safe */ _init_client_worker__WEBPACK_IMPORTED_MODULE_1__.initClientWorker),
/* harmony export */   initCrashDetection: () => (/* reexport safe */ _init__WEBPACK_IMPORTED_MODULE_0__.initCrashDetection),
/* harmony export */   initDetectorWorker: () => (/* reexport safe */ _init_detector_worker__WEBPACK_IMPORTED_MODULE_2__.initDetectorWorker)
/* harmony export */ });
/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./init */ "./public/lib/init.ts");
/* harmony import */ var _init_client_worker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./init.client.worker */ "./public/lib/init.client.worker.ts");
/* harmony import */ var _init_detector_worker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./init.detector.worker */ "./public/lib/init.detector.worker.ts");




})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=lib.js.map