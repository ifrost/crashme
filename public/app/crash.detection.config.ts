import {initCrashDetection} from "../lib";
import {generateRandomName} from "./names";
import {createServerLogger} from "./utils";

const logger = createServerLogger('tab.main.thread')

type TabInfo = {
    id: string;
    url: string;
    memory: Record<string, number>
}

export function startReportingCrashes() {
    initCrashDetection<TabInfo>({
        id: generateRandomName(),

        createClientWorker: () => {
            logger.log({ event: 'client worker created'})
            return new Worker(new URL('./client.worker', import.meta.url));
        },

        createDetectorWorker: () => {
            logger.log({ event: 'detector worker created'})
            return new SharedWorker(new URL('./detector.worker', import.meta.url));
        },

        reportCrash: async (tab) => {
            logger.log({ event: 'reporting crash', tab: tab.id })

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
            logger.log({ event: 'update', tab: info.id})
        },
    })
}
