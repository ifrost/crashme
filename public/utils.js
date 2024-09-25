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
    return funnyNames[randomIndex];
}

function createTable(crashes) {
    if (crashes.length) {
        document.getElementById("crashes-block").classList.remove("is-hidden")
    } else {
        document.getElementById("crashes-block").classList.add("is-hidden")
    }
    const body = document.getElementById("crashes-body");
    body.innerHTML = crashes.map(({id, url, lastActive, memory}) => {
        return `
                <tr>
                    <td>${id}</td>
                    <td>${url}</td>
                    <td>${new Date(lastActive).toLocaleString()}</td>
                    <td>${JSON.stringify(memory)}</td>
                </tr>
            `;
    }).join("")
}