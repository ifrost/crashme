// readable names used as ids for testing
const funnyNames = [
    "Ziggy", "Bozo", "Fizz", "Waldo", "Bobo", "Zippy", "Wacky", "Jiffy", "Dinky", "Taco",
    "Noodles", "Spud", "Goober", "Snickers", "Chomp", "Pogo", "Gizmo", "Jelly", "Bubbles", "Flip",
    "Sparky", "Buzz", "Toot", "Flick", "Sprout", "Peppy", "Bingo", "Muffin", "Skippy", "Twix",
    "Squee", "Tater", "Pop", "Zip", "Chunk", "Wiggles", "Snuffy", "Pip", "Nugget", "Doodle",
    "Whiz", "Fluff", "Bam", "Squirt", "Jinx", "Zonk", "Scooter", "Plop", "Fizz", "Gloop",
    "Bucky", "Chomp", "Squishy", "Whiskers", "Ruff", "Dizzy", "Bonk", "Sprinkle", "Zipper", "Boom",
    "Zoodle", "Waffle", "Tickle", "Munch", "Floppy", "Popcorn", "Swoosh", "Zigzag", "Wobble", "Pip",
    "Frodo", "Gibber", "Spritz", "Hopper", "Zippy", "Wobbles", "Puff", "Frolic", "Taco", "Dabble",
    "Snort", "Boing", "Tizzy", "Twinkle", "Snip", "Puff", "Bop", "Cricket", "Doodle", "Blip",
    "Giggles", "Flicker", "Squiggle", "Chuckle", "Hoot", "Guffaw", "Tinker", "Bonzo", "Fluke", "Whisk"
];

function getRandomName() {
    const randomIndex = Math.floor(Math.random() * funnyNames.length);
    const randomNumber = Math.floor(Math.random() * 10); // Generate a number between 0 and 9
    return funnyNames[randomIndex] + randomNumber;
}

// const channel = new BroadcastChannel("crashme");

// channel.onmessage = (event) => {
//     if (event.data.type === "refresh") {
//         console.log(new Date().toLocaleString(), "refresh")
//         updateInfo();
//     }
// }

function memoryCrash() {
    let dump = [];
    let dumps = {};

    info.actions.push("memoryCrash");
    updateInfo();

    setInterval(() => {
        for (let i = 0; i < 1000000; i++) {
            if (dump.length > 1000000) {
                dumps[Object.keys(dumps).length] = dump;
                dump = [];
            }
            dump.push(Math.random())
        }
    }, 1);
}

function freezeCrash() {
    info.actions.push("freezeCrash");
    updateInfo();

    while (true) {
        console.log("freeze")
    }
}

function computationCrash() {
    info.actions.push("computationCrash");
    updateInfo();

    let i = 0;
    while (i < Infinity) {
        i++;
    }
}

function recursiveCrash() {
    info.actions.push("recursiveCrash");
    updateInfo();

    recursiveCrash();
    recursiveCrash();
    recursiveCrash();
}

function domCrash() {
    info.actions.push("domCrash");
    updateInfo();

    const div = document.createElement("div");
    document.body.appendChild(div);
    while (true) {
        const child = div.cloneNode();
        document.body.appendChild(child);
    }
}

let db;
let info = {
    actions: [],
}

function initialize() {
    info.id = getRandomName()
    window.document.title = info.id;
    window.location.href = window.location.href.split("#")[0] + "#" + info.id;
    updateInfo();
}

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
    fetch("/log?update=" + info.id)
}

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
                // window.alert(msg);
                console.log(msg);
                store.delete(tab.id);
                fetch("/log?crashed=" + tab.id + "&main=" + info.id)
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

async function reloadCrashes() {
    const response = await fetch("/crashes");
    const json = await response.json();
    document.getElementById("crashes").innerHTML = JSON.stringify(json, undefined, 2);
}

function clearCrashes() {
    fetch("/crashes", {
        method: "DELETE",
    })
}

function registerWorker() {
    // navigator.serviceWorker.register('./ping.js').then(
    //     registration => {
    //         registration.update();
    //         console.log('Worker registered')
    //     },
    //     () => {
    //         console.log('Cannot register the worker')
    //     }
    // );
    let worker = new Worker("web.js");
    worker.onmessage = () => {
        console.log(new Date().toLocaleString(), "web update")
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
        fetch("/log?delete=" + info.id)
    }
}

(function () {

    // don't use window.onload -> it may be called when prefetching
    // same with body

    window.onpageshow = start;

})()

