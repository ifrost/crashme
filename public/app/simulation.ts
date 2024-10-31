/**
 * A set of functions that can be used to simulate expensive operations that may crash of freeze the browser
 */

export const crashmeSimulation = {
  memoryCrash: function () {
    let dump: Array<object | number> = [];
    let dumps: Record<number, object> = {};

    setInterval(() => {
      for (let i = 0; i < 1000000; i++) {
        if (dump.length > 1000000) {
          dumps[Object.keys(dumps).length] = dump;
          dump = [];
        }
        dump.push(Math.random());
      }
    }, 1);
  },
  loopCrash: function () {
    let i = 0;
    while (true) {
      i++;
    }
  },
  recursiveCrash: function () {
    this.recursiveCrash();
    this.recursiveCrash();
    this.recursiveCrash();
  },
  domCrash: function () {
    const div = document.createElement('div');
    document.body.appendChild(div);
    while (true) {
      const child = div.cloneNode();
      document.body.appendChild(child);
    }
  },
};
