importScripts("/detect-crashes/utils.js")

let lastInfo;
let tabLastActive = Date.now();
let db;

setInterval(() => {
    // ping to tab so it can send latest values
    postMessage({ event: "ping" })

    if (!lastInfo?.id) {
        return;
    }

    const transaction = db.transaction(["tabs"], "readwrite");
    const store = transaction.objectStore("tabs");

    const workerLastActive = Date.now();
    // save latest received info here - the tab may be paused because of debugging but we need to mark the tab as alive anyway because the worker is still alive
    lastInfo = { ... lastInfo, tabLastActive, workerLastActive }
    store.put(lastInfo)
    logger({event: "update", id: lastInfo.id, tabLastActive: new Date(tabLastActive).toLocaleString(), workerLastActive: new Date(workerLastActive).toLocaleString() })
}, 1000)

addEventListener("message", async (event) => {
    if (event.data.event === "update") {
        tabLastActive = Date.now();
        lastInfo = { ... event.data.info }
    }
    if (event.data.event === "start") {
        db = await getDb();
        logger({event: "client-initialized", id: event.data.info.id})
    }
    if (event.data.event === "close") {
        const transaction = db.transaction(["tabs"], "readwrite");
        const store = transaction.objectStore("tabs");
        store.delete(event.data.info.id)
        logger({event: "closed", id: event.data.info.id})
    }
});
