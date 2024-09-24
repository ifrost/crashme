const channel = new BroadcastChannel("crashme");

self.addEventListener("install", (event) => {
    setInterval(() => {
        channel.postMessage({ type: "refresh"})
    }, 1000)
})