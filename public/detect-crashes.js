const DEBUG = true

let db;
let info = {
    actions: [],
}

/**
 * Generate id for the tab
 */
function initialize() {
    info.id = getRandomName()
    document.getElementById("title").innerText = info.id;
    document.title = info.id;
    window.location.href = window.location.href.split("#")[0] + "#" + info.id;
    // Update only when pinged to avoid browser prefetch
    // updateInfo();
}

/**
 * Update latest state of the tab
 */
function updateInfo() {
    const transaction = db.transaction(["tabs"], "readwrite");
    const store = transaction.objectStore("tabs");

    info.url = window.location.href;
    info.lastActive = Date.now();
    info.memory = {
        usedJSHeapSize: performance?.memory?.usedJSHeapSize,
        totalJSHeapSize: performance?.memory?.totalJSHeapSize,
        jsHeapSizeLimit: performance?.memory?.jsHeapSizeLimit,
    }

    store.put(info)
    if (DEBUG) {
        fetch("/log?event=update&id=" + info.id)
    }
}

/**
 * Get IndexedDB containing all tabs.
 *
 * Alternatives:
 * - local storage
 * - session storage
 */
async function getDb() {
    return new Promise(function (resolve, reject) {
        let request = indexedDB.open("crashmeDb");
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("tabs")) {
                db.createObjectStore("tabs", {keyPath: "id"});
            }
        };
    })
}

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
            const inactivity = Date.now() - tab.lastActive;
            // ignore if the tab.id matches current tab -> may happen if breakpoints were set
            if (inactivity > 5000 && tab.id !== info.id) {
                const msg = tab.url + " possibly crashed or froze. It's been inactive for " + (inactivity / 1000) + " seconds";

                if (DEBUG) {
                    // window.alert(msg);
                    console.log(msg);
                    fetch("/log?event=crashed&id=" + tab.id + "&source=" + info.id)
                }
                store.delete(tab.id);
                fetch("/crash", {
                    method: "POST",
                    body: JSON.stringify(tab),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }
        })
    }
}

/**
 * Get info about crashed tabs
 */
async function reloadCrashes() {
    const response = await fetch("/crashes");
    const json = await response.json();
    createTable(json);
}

/**
 * Remove saved crasges
 */
function clearCrashes() {
    fetch("/crashes", {
        method: "DELETE",
    })
}

/**
 * Register a web worker to ensure setInterval is not deprioritized/slowed down
 *
 * Alternatives
 * - service worker
 */
function registerWorker() {
    let worker = new Worker("web.js");
    worker.onmessage = () => {
        if (DEBUG) {
            console.log(new Date().toLocaleString(), "update")
        }
        updateInfo();
    };
}


async function start() {
    // initialize the tab
    db = await getDb();
    initialize();

    // register worker that would invoke regular updates
    registerWorker();

    // on initial load check if there are any stale tabs and report
    setInterval(checkStaleTabs, 3000);

    // display crashes
    setInterval(reloadCrashes, 1000);

    window.onbeforeunload = function () {
        // clean up the tab
        const transaction = db.transaction(["tabs"], "readwrite");
        const store = transaction.objectStore("tabs");
        store.delete(info.id)

        if (DEBUG) {
            fetch("/log?event=closed&id=" + info.id)
        }
    }
}

(function () {

    // don't use window.onload -> it may be called when prefetching

    window.onpageshow = start;

})()

