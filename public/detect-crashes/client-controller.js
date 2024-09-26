(function () {

    // let db;
    let worker;
    let info = {}

    // readable names used as ids for testing
    const funnyNames = ["Ziggy", "Bozo", "Fizz", "Waldo", "Bobo", "Zippy", "Wacky", "Jiffy", "Dinky", "Taco", "Noodles", "Spud", "Goober", "Snickers", "Chomp", "Pogo", "Gizmo", "Jelly", "Bubbles", "Flip", "Sparky", "Buzz", "Toot", "Flick", "Sprout", "Peppy", "Bingo", "Muffin", "Skippy", "Twix", "Squee", "Tater", "Pop", "Zip", "Chunk", "Wiggles", "Snuffy", "Pip", "Nugget", "Doodle", "Whiz", "Fluff", "Bam", "Jinx", "Zonk", "Scooter", "Plop", "Fizz", "Gloop", "Bucky", "Chomp", "Squishy", "Whiskers", "Ruff", "Dizzy", "Bonk", "Sprinkle", "Zipper", "Boom", "Zoodle", "Waffle", "Tickle", "Munch", "Floppy", "Popcorn", "Swoosh", "Zigzag", "Wobble", "Pip", "Frodo", "Gibber", "Spritz", "Hopper", "Zippy", "Wobbles", "Puff", "Frolic", "Taco", "Dabble", "Snort", "Boing", "Tizzy", "Twinkle", "Snip", "Puff", "Bop", "Cricket", "Doodle", "Blip", "Giggles", "Flicker", "Squiggle", "Chuckle", "Hoot", "Guffaw", "Tinker", "Bonzo", "Fluke", "Whisk"];

    function getRandomName() {
        const randomIndex = Math.floor(Math.random() * funnyNames.length);
        const randomNumber = Math.floor(Math.random() * 10);
        return funnyNames[randomIndex] + randomNumber;
    }

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
        info.url = window.location.href;
        info.memory = {
            usedJSHeapSize: performance?.memory?.usedJSHeapSize,
            totalJSHeapSize: performance?.memory?.totalJSHeapSize,
            jsHeapSizeLimit: performance?.memory?.jsHeapSizeLimit,
        }

        worker.postMessage({
            event: "update",
            info
        })
    }

    /**
     * Register a web worker to ensure setInterval is not deprioritized/slowed down
     *
     * Alternatives
     * - service worker
     */
    function registerWorker() {
        worker = new Worker("/detect-crashes/client-worker.js");
        worker.addEventListener("error", (e) => console.log(e))
        worker.addEventListener("message", updateInfo)

        const detector = new SharedWorker("/detect-crashes/detector-worker.js");
        detector.port.start();
    }

    async function start() {
        initialize();

        // register worker that would invoke regular updates
        registerWorker();

        window.onbeforeunload = function () {
            worker.postMessage({
                event: "close",
                info
            })
        }

        worker.postMessage({
            event: "start",
            info
        })
    }

    window.addEventListener("load", start);
})();