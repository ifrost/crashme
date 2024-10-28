"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initCrashDetection;
function initCrashDetection(options) {
    var worker;
    var detector;
    var info = {};
    function reportCrash(event) {
        return __awaiter(this, void 0, void 0, function () {
            var tab, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(event.data.event === 'crash-detected' && event.data.reporter.id === info.id)) return [3 /*break*/, 2];
                        tab = event.data.tab;
                        return [4 /*yield*/, options.reportCrash(tab)];
                    case 1:
                        success = _a.sent();
                        if (success) {
                            detector.port.postMessage({ event: 'crash-reported', id: event.data.tab.id });
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Generate id for the tab
     */
    function initialize() {
        info.id = options.id;
        info.tabFirstActive = Date.now();
    }
    /**
     * Update latest state of the tab
     */
    function updateInfo() {
        options.updateInfo(info);
        worker.postMessage({
            event: 'update',
            info: info,
        });
    }
    function registerWorker() {
        worker = options.createClientWorker();
        worker.addEventListener('message', updateInfo);
        detector = options.createDetectorWorker();
        detector.port.addEventListener('message', reportCrash);
        detector.port.start();
    }
    function startWhenReady() {
        // beforeunload is triggered only after at least one interaction
        window.addEventListener('click', start);
    }
    function start() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                initialize();
                registerWorker();
                window.addEventListener('beforeunload', function () {
                    worker.postMessage({
                        event: 'close',
                        info: info,
                    });
                });
                worker.postMessage({
                    event: 'start',
                    info: info,
                });
                return [2 /*return*/];
            });
        });
    }
    if (document.readyState === 'complete') {
        startWhenReady();
    }
    else {
        window.addEventListener('load', function () {
            startWhenReady();
        });
    }
}
