#!/usr/bin/env node

export const Meta = {
    purpose: "using project as CLI application",
    usage: "node run.mjs -help"
};


import { default as Yarg } from "yargs";

let args = Yarg(process.argv.slice(2))
switch (args.locale()) {
    case "pl_PL":

        args.option("d", { alias: "domena", describe: "Domena strony (przy braku skrypt będzie szukał plików w folderze WikiData)", type: "string", demandOption: false })
            .option("c", { alias: "kategoria", describe: "Kategoria z której zbierane są artykuły", type: "string", demandOption: true })
            .option("o", { alias: "output", describe: "Nazwa folderu z pobranymi plikami", type: "string", demandOption: false })
            .check((argv, options) => (!argv.c) ? new Error("Zabrakło wartości kategorii") : true);

        break;

    default:

        args.option("d", { alias: "domain", describe: "Website's domain (if nothing was given: script will search for files in WikiData folder)", type: "string", demandOption: false })
            .option("c", { alias: "category", describe: "Category to gather from", type: "string", demandOption: true })
            .option("o", { alias: "output", describe: "Output-catalog's name (defaultly 'c')", type: "string", demandOption: false })
            .check((argv, options) => (!argv.c) ? new Error("Expected value for category") : true);
}

args = args.argv;

let domain = args.d,
    title = args.c,
    output = args.o;
if(!output)
    output = title;



import {
    writeFileSync as write,
    mkdirSync as make,
    rmSync as remove,
    readFileSync as read,
    readdirSync as list
} from "fs";

let members = [];
if (domain) {

    const Gatherer = await import("./index.mjs");

    let gatherer = new Gatherer.default(`https://${domain}/w/api.php`);

    members = await gatherer.gather(title);

} else for (let name of list(`./${output}/WikiData`)) {

    console.info(`./${output}/WikiData/${name}`);

    let data = read(`./${output}/WikiData/${name}`, { encoding: "utf-8" });
    let item = JSON.parse(data);

    members.push(item);
}



try {

    remove(`${output}/WikiData`, { recursive: true })

} catch (e) {}

try {

    make(`${output}/WikiData`, { recursive: true })

} catch (e) {}

for (let member of members)
    write(`${output}/WikiData/${member.title}.json`, JSON.stringify(member));



import Parser from "./parser/index.mjs";

let parser = new Parser({ dates: ["birth", "death"] });

let dataset = [];
for (let member of members)
    dataset.push({ title: member.title, ...parser.parse(member.claims) });

write(`${output}/data.json`, JSON.stringify(dataset, null, '\t'));



import { JSDOM as DOM } from "jsdom";

import {
    fileURLToPath as purl
} from 'url';
import * as Path from 'path';

const dirpath = Path.dirname(purl(import.meta.url));

let { window } = await DOM.fromFile(`${dirpath}/template.html`);
let document = window.document

for (let node of [document.head.querySelector(`title`), ...document.head.querySelectorAll(`h1`)])
    node.innerText = title;

let display = document.body.querySelector(`#display`);

import { Timeline } from "./display/index.mjs";

new Timeline(display).print(Timeline.parse(dataset, "people"));

write(`${output}/index.html`, `<!DOCTYPE><html>${document.head.outerHTML + document.body.outerHTML}</html>`);
