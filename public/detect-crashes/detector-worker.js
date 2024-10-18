importScripts("/detect-crashes/utils.js")

let db;
let started = false;
let clients = [];

function crashReported(event) {
    if (event.data.event === "crash-reported" && event.data.id) {
        const transaction = db.transaction(["tabs"], "readwrite");
        const store = transaction.objectStore("tabs");
        logger({event: "crash-reported", id: event.data.id, level: "error" })
        store.delete(event.data.id);
    }
}

const INACTIVITY_THRESHOLD = 5000;

/**
 * Check which tabs have stopped sending updates but did not clear themselves properly
 */
function checkStaleTabs() {
    const transaction = db.transaction(["tabs"], "readwrite");
    const store = transaction.objectStore("tabs");
    const request = store.getAll();

    request.onsuccess = function () {
        const tabs = request.result;

        let activeTabs = [];
        let inactiveTabs = [];

        tabs.forEach(function (tab) {
            const workerInactivity = Date.now() - tab.workerLastActive;
            if (workerInactivity > INACTIVITY_THRESHOLD) {
                inactiveTabs.push(tab);
            } else {
                activeTabs.push(tab);
            }
        })

        if (activeTabs.length === 0) {
            // no active tabs, skip until a tab gets active
            return;
        }

        let candidate = activeTabs.pop();
        tabs.forEach(function (tab) {
            const workerInactivity = Date.now() - tab.workerLastActive;
            if (workerInactivity > INACTIVITY_THRESHOLD) {
                reportCrash(tab, candidate)
            }
        })
    }
}

function reportCrash(tab, reporter) {
    logger({event: "crash-detected", id: tab.id, level: "error", reporter: reporter.id })
    clients.forEach(function (port) {
        port.postMessage({ event: "crash-detected", tab, reporter })
    })
}

self.onconnect = async function(event) {
    if (!started) {
        db = await getDb();

        const port = event.ports[0];
        clients.push(port);
        port.start();
        port.onmessage = crashReported;
        port.onclose = function() {
            clients = clients.filter(p => p !== port);
        }

        setInterval(checkStaleTabs, INACTIVITY_THRESHOLD);
        started = true;
    }
};

