let lastPing;
let source;
let i1, i2;

let clients = {};

self.addEventListener('message', message => {
    const { event, id, url } = message.data
    if (event === "connect") {
        const id = Object.keys(clients).length;
        clients[id] = {
            id,
            connected: true,
            source: message.source,
            url,
            ping: Date.now(),
        };
        message.source.postMessage({
            event: "connected",
            id,
        })
        fetch('/report?open=' + url)
    }
    if (event === "close") {
        delete clients[id];
        fetch('/report?close=' + clients[id].url)
    }
    if (event === "ping") {
        clients[id].ping = Date.now();
        fetch('/report?clients=' + JSON.stringify(clients))
    }
})

let db

self.addEventListener("activate", (event) => {
    event.waitUntil(new Promise((resolve, reject) => {
        let req = indexedDB.open('crashmedb', 1);
        req.onerror = (err) => {
            fetch('/report?log=dberror')
            reject();
        }
        req.onupgradeneeded = (event) => {
            const objectStore = db.createObjectStore("tabs", { keyPath: "id" });
            fetch('/report?log=upgraded')
        }
        req.onsuccess = (event) => {
            db = event.target.result;
            fetch('/report?log=initialized')
            resolve();
        }
    }))
    clients = {};
})
