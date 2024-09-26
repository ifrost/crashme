importScripts("/detect-crashes/utils.js")

let db;
let started = false;

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

        tabs.forEach(function (tab) {
            const workerInactivity = Date.now() - tab.workerLastActive;
            if (workerInactivity > INACTIVITY_THRESHOLD) {
                reportCrash(tab)
                logger({event: "crashed", id: tab.id, level: "error" })
                store.delete(tab.id);
            }
        })
    }
}

function reportCrash(tab) {
    fetch("/crash", {
        method: "POST", body: JSON.stringify(tab), headers: {
            "Content-Type": "application/json"
        }
    })
}


self.onconnect = async function() {
    if (!started) {
        db = await getDb();
        setInterval(checkStaleTabs, INACTIVITY_THRESHOLD);
        logger({event: "detector-initialized"})
        started = true;
    }
};


