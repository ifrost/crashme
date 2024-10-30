import { startReportingCrashes } from "./app.reporter";
import { crashmeSimulation } from "./simulation";

type CrashReport = {
    id: string;
    url: string;
    tabLastActive: number;
    memory: Record<string, number>
}

(function () {
    function createTable(crashes: CrashReport[]) {
        if (crashes.length) {
            document.getElementById("crashes-block")!.classList.remove("is-hidden")
        } else {
            document.getElementById("crashes-block")!.classList.add("is-hidden")
        }
        const body = document.getElementById("crashes-body")!;
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

    function initContent() {
        document.getElementById('title')!.innerText = "Loading...";
        document.getElementById('main')?.classList.remove("is-hidden");
        document.getElementById('btn-dom')?.addEventListener("click", () => { crashmeSimulation.domCrash() })
        document.getElementById('btn-mem')?.addEventListener("click", () => { crashmeSimulation.memoryCrash() })
        document.getElementById('btn-rec')?.addEventListener("click", () => { crashmeSimulation.recursiveCrash() })
        document.getElementById('btn-loop')?.addEventListener("click", () => { crashmeSimulation.loopCrash() })
        document.getElementById("deleteCrashes")!.onclick = clearCrashes
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

    function init() {
        initContent();
        setInterval(() => {
            reloadCrashes();
        }, 1000)
        window.removeEventListener("click", init);
    }

    function start() {
        startReportingCrashes();
        window.addEventListener('click', init)
    }

    window.addEventListener("load", start);
})()