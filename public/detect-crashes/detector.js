(function() {

    let db;

    const INACTIVITY_THRESHOLD = 3000;

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
                if (inactivity > INACTIVITY_THRESHOLD) {
                    reportCrash(tab)
                    logger({ event: "crashed", id: tab.id })
                    store.delete(tab.id);
                }
            })
        }
    }

    async function start() {
        db = await getDb();
        setInterval(checkStaleTabs, INACTIVITY_THRESHOLD);
        logger({ event: "detector-initialized"})
    }

    window.addEventListener("load", start);
})();