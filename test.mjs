import * as Lib from "./index.mjs";

let gatherer = new Lib.types.Person("https://pl.wikipedia.org/w/api.php");

let members = await gatherer.gather(1949616);

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
});
