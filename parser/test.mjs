import {
    readFileSync as read,
    readdirSync as list,
    writeFileSync as write
} from "fs";

import Parser from "./index.mjs";

let parser = new Parser({ dates: ["birth", "death"] });


import {
    fileURLToPath as purl
} from 'url';
import * as Path from 'path';

const dirpath = Path.dirname(purl(import.meta.url));


let dataset = [], paths = {
    workspace: `${dirpath}/../test-results`,
    input: `${dirpath}/../test-results/download`
};

for (let filename of list(paths.input)) {

    let input = read(`${paths.input}/${filename}`, { encoding: "utf-8" });
    let item = JSON.parse(input);

    dataset.push({
        title: item.title,
        ...parser.parse(item.claims)
    });
}

write(`${paths.workspace}/parser.json`, JSON.stringify(dataset, null, '\t'));
