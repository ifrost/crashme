function memoryCrash() {
    let dump = [];
    let dumps = {};

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
    while (true) {
        console.log("freeze")
    }
}

function computationCrash() {
    let i = 0;
    while (i < Infinity) {
        i++;
    }
}

function recursiveCrash() {
    recursiveCrash();
    recursiveCrash();
    recursiveCrash();
}

function domCrash() {
    const div = document.createElement("div");
    document.body.appendChild(div);
    while (true) {
        const child = div.cloneNode();
        document.body.appendChild(child);
    }
}
