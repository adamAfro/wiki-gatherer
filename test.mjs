import {
    Gatherer, Scanners
} from "./index.mjs"

let gatherer = new Gatherer("https://pl.wikipedia.org/w/api.php");
let members = await gatherer.gather(3183659, Scanners.person);

import {
    writeFile as write,
    mkdir as make,
    rm as remove
} from "fs/promises";


let cataloging = remove("test-results", { recursive: true }).catch(error => {})
    .then(function () { make("test-results") }).catch(error => {});

let writing = cataloging.then(function() {

    return loop(); function loop(i = 0) {

        if (i < members.length)
            return write(`test-results/${members[i].title}.json`, JSON.stringify(members[i]))
                .then(() => loop(i + 1));
        else
            return;
    };

}).then(() => console.log(members, `(${members.length}) -> ./test-results`));
