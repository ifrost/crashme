/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
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

/***/ "./public/v2/client-controller.ts":
/*!****************************************!*\
  !*** ./public/v2/client-controller.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\n// @ts-nocheck\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initCrashDetection = initCrashDetection;\nfunction initCrashDetection(options) {\n    let worker;\n    let detector;\n    let info = {};\n    function reportCrash(event) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (event.data.event === 'crash-detected' && event.data.reporter.id === info.id) {\n                const tab = event.data.tab;\n                const success = yield options.reportCrash(tab);\n                if (success) {\n                    detector.port.postMessage({ event: 'crash-reported', id: event.data.tab.id });\n                }\n            }\n        });\n    }\n    /**\n     * Generate id for the tab\n     */\n    function initialize() {\n        info.id = options.id;\n        info.tabFirstActive = Date.now();\n    }\n    /**\n     * Update latest state of the tab\n     */\n    function updateInfo() {\n        options.updateInfo(info);\n        worker.postMessage({\n            event: 'update',\n            info,\n        });\n    }\n    function registerWorker() {\n        worker = options.createClientWorker();\n        worker.addEventListener('message', updateInfo);\n        detector = options.createDetectorWorker();\n        detector.port.addEventListener('message', reportCrash);\n        detector.port.start();\n    }\n    function startWhenReady() {\n        // beforeunload is triggered only after at least one interaction\n        window.addEventListener('click', start);\n    }\n    function start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            initialize();\n            registerWorker();\n            window.addEventListener('beforeunload', () => {\n                worker.postMessage({\n                    event: 'close',\n                    info,\n                });\n            });\n            worker.postMessage({\n                event: 'start',\n                info,\n            });\n        });\n    }\n    if (document.readyState === 'complete') {\n        startWhenReady();\n    }\n    else {\n        window.addEventListener('load', () => {\n            startWhenReady();\n        });\n    }\n}\n\n\n//# sourceURL=webpack://crashme/./public/v2/client-controller.ts?");

/***/ }),

/***/ "./public/v2/client-worker.ts":
/*!************************************!*\
  !*** ./public/v2/client-worker.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n// @ts-nocheck\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initClientWorker = initClientWorker;\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./public/v2/utils.ts\");\nfunction initClientWorker(options) {\n    let lastInfo;\n    let tabLastActive = Date.now();\n    let db;\n    setInterval(() => {\n        // ping to tab so it can send latest values\n        postMessage({ event: 'ping' });\n        if (!(lastInfo === null || lastInfo === void 0 ? void 0 : lastInfo.id)) {\n            return;\n        }\n        const transaction = db.transaction(['tabs'], 'readwrite');\n        const store = transaction.objectStore('tabs');\n        const workerLastActive = Date.now();\n        // save latest received info here - the tab may be paused because of debugging but we need to mark the tab as alive anyway because the worker is still alive\n        lastInfo = Object.assign(Object.assign({}, lastInfo), { tabLastActive, workerLastActive });\n        store.put(lastInfo);\n    }, options.pingInterval);\n    addEventListener('message', (event) => __awaiter(this, void 0, void 0, function* () {\n        if (event.data.event === 'update') {\n            tabLastActive = Date.now();\n            lastInfo = Object.assign({}, event.data.info);\n        }\n        if (event.data.event === 'start') {\n            db = yield (0, utils_1.getDb)(options.dbName);\n        }\n        if (event.data.event === 'close') {\n            const transaction = db.transaction(['tabs'], 'readwrite');\n            const store = transaction.objectStore('tabs');\n            store.delete(event.data.info.id);\n        }\n    }));\n}\n\n\n//# sourceURL=webpack://crashme/./public/v2/client-worker.ts?");

/***/ }),

/***/ "./public/v2/detector-worker.ts":
/*!**************************************!*\
  !*** ./public/v2/detector-worker.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n// @ts-nocheck\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initDetectorWorker = initDetectorWorker;\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./public/v2/utils.ts\");\nfunction initDetectorWorker(options) {\n    let db;\n    let started = false;\n    let clients = [];\n    function crashReported(event) {\n        if (event.data.event === 'crash-reported' && event.data.id) {\n            const transaction = db.transaction(['tabs'], 'readwrite');\n            const store = transaction.objectStore('tabs');\n            store.delete(event.data.id);\n        }\n    }\n    const INACTIVITY_THRESHOLD = options.inactivityThreshold;\n    /**\n     * Check which tabs have stopped sending updates but did not clear themselves properly\n     */\n    function checkStaleTabs() {\n        const transaction = db.transaction(['tabs'], 'readwrite');\n        const store = transaction.objectStore('tabs');\n        const request = store.getAll();\n        request.onsuccess = function () {\n            const tabs = request.result;\n            let activeTabs = [];\n            let inactiveTabs = [];\n            tabs.forEach(function (tab) {\n                const workerInactivity = Date.now() - tab.workerLastActive;\n                if (workerInactivity > INACTIVITY_THRESHOLD) {\n                    inactiveTabs.push(tab);\n                }\n                else {\n                    activeTabs.push(tab);\n                }\n            });\n            if (activeTabs.length === 0) {\n                // no active tabs, skip until a tab gets active\n                return;\n            }\n            let candidate = activeTabs.pop();\n            tabs.forEach(function (tab) {\n                const workerInactivity = Date.now() - tab.workerLastActive;\n                if (workerInactivity > INACTIVITY_THRESHOLD) {\n                    reportCrash(tab, candidate);\n                }\n            });\n        };\n    }\n    function reportCrash(tab, reporter) {\n        clients.forEach(function (port) {\n            port.postMessage({ event: 'crash-detected', tab, reporter });\n        });\n    }\n    self.onconnect = function (event) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (!started) {\n                db = yield (0, utils_1.getDb)(options.dbName);\n                const port = event.ports[0];\n                clients.push(port);\n                port.start();\n                port.onmessage = crashReported;\n                port.onclose = function () {\n                    clients = clients.filter((p) => p !== port);\n                };\n                setInterval(checkStaleTabs, INACTIVITY_THRESHOLD);\n                started = true;\n            }\n        });\n    };\n}\n\n\n//# sourceURL=webpack://crashme/./public/v2/detector-worker.ts?");

/***/ }),

/***/ "./public/v2/index.ts":
/*!****************************!*\
  !*** ./public/v2/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initDetectorWorker = exports.initClientWorker = exports.initCrashDetection = void 0;\nvar client_controller_1 = __webpack_require__(/*! ./client-controller */ \"./public/v2/client-controller.ts\");\nObject.defineProperty(exports, \"initCrashDetection\", ({ enumerable: true, get: function () { return client_controller_1.initCrashDetection; } }));\nvar client_worker_1 = __webpack_require__(/*! ./client-worker */ \"./public/v2/client-worker.ts\");\nObject.defineProperty(exports, \"initClientWorker\", ({ enumerable: true, get: function () { return client_worker_1.initClientWorker; } }));\nvar detector_worker_1 = __webpack_require__(/*! ./detector-worker */ \"./public/v2/detector-worker.ts\");\nObject.defineProperty(exports, \"initDetectorWorker\", ({ enumerable: true, get: function () { return detector_worker_1.initDetectorWorker; } }));\n\n\n//# sourceURL=webpack://crashme/./public/v2/index.ts?");

/***/ }),

/***/ "./public/v2/utils.ts":
/*!****************************!*\
  !*** ./public/v2/utils.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getDb = getDb;\nfunction getDb(dbName) {\n    return __awaiter(this, void 0, void 0, function* () {\n        return new Promise(function (resolve, reject) {\n            let request = indexedDB.open(dbName);\n            request.onerror = (event) => {\n                // reject(event.target.error);\n                reject(request.error);\n            };\n            request.onsuccess = (event) => {\n                // resolve(event.target.result);\n                resolve(request.result);\n            };\n            request.onupgradeneeded = (event) => {\n                if (!event.target) {\n                    return;\n                }\n                // const db = event.target.result;\n                const db = request.result;\n                if (!db.objectStoreNames.contains('tabs')) {\n                    db.createObjectStore('tabs', { keyPath: 'id' });\n                }\n            };\n        });\n    });\n}\n\n\n//# sourceURL=webpack://crashme/./public/v2/utils.ts?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/v2/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});