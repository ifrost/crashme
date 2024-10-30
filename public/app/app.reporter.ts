import {initCrashDetection} from "../lib";

type TabInfo = {
    id: string;
    url: string;
    memory: Record<string, number>
}

export function startReportingCrashes() {
    initCrashDetection<TabInfo>({
        id: Math.random().toString(36).substr(2, 5),

        createClientWorker: () => {
            return new Worker(new URL('./app.worker', import.meta.url));
        },

        createDetectorWorker: () => {
            return new SharedWorker(new URL('./app.detector.worker', import.meta.url));
        },

        reportCrash: async (tab) => {
            await fetch("/crash", {
                method: "POST", body: JSON.stringify(tab), headers: {
                    "Content-Type": "application/json"
                }
            });
            return true;
        },

        updateInfo: (info) => {
            document.getElementById('title')!.innerText = "ID: " + info.id
            info.url = window.location.href;
            info.memory = {
                // @ts-ignore
                usedJSHeapSize: performance?.memory?.usedJSHeapSize,
                // @ts-ignore
                totalJSHeapSize: performance?.memory?.totalJSHeapSize,
                // @ts-ignore
                jsHeapSizeLimit: performance?.memory?.jsHeapSizeLimit,
            }
        },
    })
}
