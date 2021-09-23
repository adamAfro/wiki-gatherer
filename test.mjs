import {
    writeFile as write,
    mkdir as make,
    rm as remove
} from "fs/promises";

import Gatherer from "./index.mjs";


import {
    fileURLToPath as purl
} from 'url';
import * as Path from 'path';

const dirpath = Path.dirname(purl(import.meta.url));


let title = process.argv[2];
if (title) {

    let gatherer = new Gatherer("https://pl.wikipedia.org/w/api.php");

    let members = await gatherer.gather(title), paths = {
        workspace: `${dirpath}/test-results/download`
    };

    let cataloging = remove(paths.workspace, { recursive: true }).catch(error => {})
        .then(() => make(paths.workspace).catch(error => {}))

    let writing = cataloging.then(function() {

        return loop(); function loop(i = 0) {

            if (i < members.length)
                return write(`${paths.workspace}/${members[i].title}.json`, JSON.stringify(members[i]))
                    .then(() => loop(i + 1));
            else
                return;
        };
    }).then(function() { import("./parser/test.mjs") });

} else
    console.info("provide title if you want to gather anything");




import { default as Express } from "express";

let app = new Express();

app.use(Express.static(`${dirpath}/test-results`));
app.use("/assets/display", Express.static(`${dirpath}/display`));
app.use("/assets", Express.static(`${dirpath}/assets`));

app.listen(3000, function() {

    console.log("http://localhost:3000");
});
