import Gatherer from "./index.mjs";

let gatherer = new Gatherer("https://pl.wikipedia.org/w/api.php");

let members = await gatherer.gather(1810130);

import {
    writeFile as write,
    mkdir as make,
    rm as remove
} from "fs/promises";

let cataloging = remove("test-results", { recursive: true }).catch(error => {})
    .then(() => make("test-results").catch(error => {}))
    .then(() => make("test-results/download").catch(error => {}))

let writing = cataloging.then(function() {

    return loop(); function loop(i = 0) {

        if (i < members.length)
            return write(`test-results/download/${members[i].title}.json`, JSON.stringify(members[i]))
                .then(() => loop(i + 1));
        else
            return;
    };
});
