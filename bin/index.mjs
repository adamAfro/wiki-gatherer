export const Meta = {
    purpose: "downloading and making presentation about WikiData",
    usage: "execute func." + ': ' +
        "title is needed, if there is no workdir, then the title is used as it" + '; ' +
        "if there is no langdomain: script will pass fetching from web and try local files instead"  + '; ' +
        "if workdir contains `template.html`, it will be used" + '; ' +
        "otherwise script will use the default one"
};


import {
    writeFileSync as write,
    mkdirSync as make,
    rmSync as remove,
    readFileSync as read,
    readdirSync as list
} from "fs";

import {
    fileURLToPath as purl
} from 'url';
import * as Path from 'path';

const dirpath = Path.dirname(purl(import.meta.url));


import Gatherer from "../index.mjs";
import Parser from "../parser/index.mjs";
import { JSDOM as DOM } from "jsdom";
import { Timeline } from "../display/index.mjs";


export default async function(title, workdir = title, langdomain = undefined) {

    let members = [];
    if (langdomain) {

        let gatherer = new Gatherer(langdomain);

        members = await gatherer.gather(title);

    } else for (let name of list(`./${workdir}/WikiData`)) {

        console.info(`./${workdir}/WikiData/${name}`);

        let data = read(`./${workdir}/WikiData/${name}`, { encoding: "utf-8" });
        let item = JSON.parse(data);

        members.push(item);
    }



    try {

        remove(`${workdir}/WikiData`, { recursive: true })

    } catch (e) {}

    try {

        make(`${workdir}/WikiData`, { recursive: true })

    } catch (e) {}

    for (let member of members)
        write(`${workdir}/WikiData/${member.title}.json`, JSON.stringify(member));



    let parser = new Parser({ dates: ["birth", "death"] });

    let dataset = [];
    for (let member of members)
        dataset.push({ title: member.title, link: member.link, ...parser.parse(member.claims) });

    write(`${workdir}/data.json`, JSON.stringify(dataset, null, '\t'));


    let model;
    try {

        model = await DOM.fromFile(`${workdir}/template.html`);

    } catch(e) {

        model = await DOM.fromFile(`${dirpath}/template.html`);
    }

    let document = model.window.document

    let selectors = {
        display: document.querySelector(`meta[name="wiki-gatherer-display"]`)?.content || "body",
        titles: document.querySelector(`meta[name="wiki-gatherer-titles"]`)?.content || "title,h1",
        notes: document.querySelector(`meta[name="wiki-gatherer-notes"]`)?.content || undefined
    };

    let display = document.querySelector(selectors.display);

    for (let node of [...document.querySelectorAll(selectors.titles)])
        node.textContent = title;

    let features = [], featuring = document.querySelector(`meta[name="wiki-gatherer-features"]`);
    if (featuring) for (let input of featuring.content.split(",")) {
        let feature = input.trim();
        if (feature)
            features.push(feature);
    }

    new Timeline(display).print(Timeline.parse("people", dataset, features));

    let notenode = document.querySelector(selectors.notes);
    if (notenode) {

        let notes = '';
        for (let { link, title, dates } of dataset)
            notes += `<article id="${title}"><a target="_blank" href="${link}">${title}</a> (${new Date(dates.birth).getFullYear()} - ${dates.death ? new Date(dates.death).getFullYear() : "..."})</article>`

        notenode.innerHTML = notes;
    }

    write(`${workdir}/index.html`, model.serialize());
}
