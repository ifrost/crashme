/**
 * A set of functions that can be used to simulate expensive operations that may crash of freeze the browser
 */
export declare const crashmeSimulation: {
    memoryCrash: () => void;
    loopCrash: () => never;
    recursiveCrash: () => void;
    domCrash: () => never;
};
