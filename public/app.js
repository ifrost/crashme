(function () {
    function createTable(crashes) {
        if (crashes.length) {
            document.getElementById("crashes-block").classList.remove("is-hidden")
        } else {
            document.getElementById("crashes-block").classList.add("is-hidden")
        }
        const body = document.getElementById("crashes-body");
        body.innerHTML = crashes.map(({id, url, tabLastActive, memory}) => {
            return `
                <tr>
                    <td>${id}</td>
                    <td>${url}</td>
                    <td>${new Date(tabLastActive).toLocaleString()}</td>
                    <td>${JSON.stringify(memory)}</td>
                </tr>
            `;
        }).join("")
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
     * Remove saved crashes
     */
    function clearCrashes() {
        fetch("/crashes", {
            method: "DELETE",
        })
    }

    function start() {
        document.getElementById("deleteCrashes").onclick = clearCrashes
        setInterval(reloadCrashes, 1000)
    }

    window.addEventListener("load", start);
})()