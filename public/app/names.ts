// Arrays of adjectives and nouns
const adjectives = [
    "Brave", "Calm", "Delightful", "Eager", "Faithful", "Gentle", "Happy", "Jolly", "Kind", "Lively",
    "Mighty", "Nice", "Proud", "Quick", "Rough", "Smooth", "Tough", "Victorious", "Witty", "Young",
    "Ancient", "Bright", "Clever", "Daring", "Elegant", "Fancy", "Glamorous", "Honest", "Intelligent", "Joyful",
    "Keen", "Lucky", "Majestic", "Noble", "Obedient", "Polite", "Quiet", "Radiant", "Silly", "Trustworthy",
    "Unique", "Vibrant", "Warm", "Zealous", "Adventurous", "Bold", "Creative", "Diligent", "Energetic", "Fierce",
    "Gracious", "Humble", "Incredible", "Jovial", "Kindhearted", "Loyal", "Motivated", "Noteworthy", "Outstanding", "Peaceful",
    "Quirky", "Respectful", "Strong", "Talented", "Understanding", "Valiant", "Wise", "Youthful", "Zesty", "Affectionate",
    "Brilliant", "Courageous", "Dynamic", "Excited", "Fearless", "Generous", "Heroic", "Imaginative", "Joyous", "Keen-eyed",
    "Luminous", "Mindful", "Nurturing", "Optimistic", "Perceptive", "Quick-witted", "Resourceful", "Sincere", "Thoughtful", "Upbeat"
];

const nouns = [
    "Lion", "Tiger", "Bear", "Eagle", "Shark", "Wolf", "Panther", "Falcon", "Dragon", "Phoenix",
    "Unicorn", "Pegasus", "Dolphin", "Panda", "Elephant", "Rhino", "Cheetah", "Giraffe", "Koala", "Jaguar",
    "Leopard", "Octopus", "Owl", "Penguin", "Rabbit", "Snake", "Fox", "Horse", "Turtle", "Lynx",
    "Whale", "Sparrow", "Buffalo", "Cobra", "Falcon", "Hawk", "Iguana", "Kangaroo", "Lizard", "Monkey",
    "Narwhal", "Otter", "Parrot", "Quail", "Raccoon", "Seal", "Toucan", "Vulture", "Walrus", "Yak",
    "Zebra", "Antelope", "Beetle", "Cricket", "Dragonfly", "Firefly", "Grasshopper", "Heron", "Ibex", "Jackal",
    "Kingfisher", "Llama", "Marmot", "Nightingale", "Orca", "Plover", "Quokka", "Raven", "Seagull", "Toad",
    "Urchin", "Viper", "Wolverine", "Xerus", "Yeti", "Aardvark", "Bison", "Caribou", "Dingo", "Echidna",
    "Flamingo", "Gazelle", "Hedgehog", "Impala", "Jay", "Kiwi", "Lobster", "Mongoose", "Newt", "Ocelot"
];

export function generateRandomName() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
}