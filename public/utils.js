// readable names used as ids for testing
const funnyNames = [
    "Ziggy", "Bozo", "Fizz", "Waldo", "Bobo", "Zippy", "Wacky", "Jiffy", "Dinky", "Taco",
    "Noodles", "Spud", "Goober", "Snickers", "Chomp", "Pogo", "Gizmo", "Jelly", "Bubbles", "Flip",
    "Sparky", "Buzz", "Toot", "Flick", "Sprout", "Peppy", "Bingo", "Muffin", "Skippy", "Twix",
    "Squee", "Tater", "Pop", "Zip", "Chunk", "Wiggles", "Snuffy", "Pip", "Nugget", "Doodle",
    "Whiz", "Fluff", "Bam", "Jinx", "Zonk", "Scooter", "Plop", "Fizz", "Gloop",
    "Bucky", "Chomp", "Squishy", "Whiskers", "Ruff", "Dizzy", "Bonk", "Sprinkle", "Zipper", "Boom",
    "Zoodle", "Waffle", "Tickle", "Munch", "Floppy", "Popcorn", "Swoosh", "Zigzag", "Wobble", "Pip",
    "Frodo", "Gibber", "Spritz", "Hopper", "Zippy", "Wobbles", "Puff", "Frolic", "Taco", "Dabble",
    "Snort", "Boing", "Tizzy", "Twinkle", "Snip", "Puff", "Bop", "Cricket", "Doodle", "Blip",
    "Giggles", "Flicker", "Squiggle", "Chuckle", "Hoot", "Guffaw", "Tinker", "Bonzo", "Fluke", "Whisk"
];

function getRandomName() {
    const randomIndex = Math.floor(Math.random() * funnyNames.length);
    const randomNumber = Math.floor(Math.random() * 10);
    return funnyNames[randomIndex] + randomNumber;
}

function reportCrash(tab) {
    fetch("/crash", {
        method: "POST",
        body: JSON.stringify(tab),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

/**
 * Send logs to external server because console.log in the browser may not be available
 * @param params
 */
function logger(params) {
    console.log(JSON.stringify(params));
    fetch("/log?" + Object.entries(params).map(e => e.join('=')).join("&"))
}

/**
 * Get IndexedDB containing all tabs.
 *
 * Alternatives:
 * - local storage
 * - session storage
 */
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
