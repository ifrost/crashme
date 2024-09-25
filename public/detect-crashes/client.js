(function() {

    let db;
    let info = {}

    /**
     * Generate id for the tab
     */
    function initialize() {
        info.id = getRandomName()
        document.getElementById("title").innerText = info.id;
        document.title = info.id;
        window.location.href = window.location.href.split("#")[0] + "#" + info.id;
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
        logger({ event: "update", id: info.id })
    }

    /**
     * Register a web worker to ensure setInterval is not deprioritized/slowed down
     *
     * Alternatives
     * - service worker
     */
    function registerWorker() {
        let worker = new Worker("/detect-crashes/worker.js");
        worker.addEventListener("error", (e) => logger(e))
        worker.addEventListener("message", updateInfo)
    }

    async function start() {
        // initialize the tab
        db = await getDb();
        initialize();

        // register worker that would invoke regular updates
        registerWorker();

        window.onbeforeunload = function () {
            // clean up the tab
            const transaction = db.transaction(["tabs"], "readwrite");
            const store = transaction.objectStore("tabs");
            store.delete(info.id)
            logger({event: "closed", id: info.id})
        }

        logger({ event: "client-initialized", id: info.id })
    }

    window.addEventListener("load", start);
})();