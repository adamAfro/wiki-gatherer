#!/usr/bin/env node

export const Meta = {
    purpose: "using project as CLI application",
    usage: "node run.mjs -help"
};


import { default as Yarg } from "yargs";

let args = Yarg(process.argv.slice(2))
switch (args.locale()) {
    case "pl_PL":

        args.usage("Pobieranie wszystkich artykułów z danej kategorii wikipedii.org")
            .example(`wiki-gather -l pl -c "Kategoria: Egzystencjaliści" -d "Egzystencjaliści"`)
            .option("c", { alias: "kategoria", describe: "Kategoria z artykułami", type: "string", demandOption: true })
            .option("l", { alias: "język", describe: "Subdomena językowa wikipedii.org, np. „pl”, jeśli jej nie ma skrypt będzie szukał plików w folderze „[folder]/WikiData”", type: "string", demandOption: false })
            .option("d", { alias: "folder", describe: "Nazwa folderu z pobranymi plikami", type: "string", demandOption: false })
            .help('h').alias('h', 'pomoc')
            .check((argv, options) => (!argv.c) ? new Error("Zabrakło wartości kategorii") : true);

        break;

    default:

        args.usage("Downloading all articles from given category")
            .example(`wiki-gather -l en -c "Category:'Ndranghetisti" -d "Ndrangheta"`)
            .option("c", { alias: "category", describe: "Category to fetch articles from", type: "string", demandOption: true })
            .option("l", { alias: "language", describe: "Language subdoman of wikipedia.org, for ex. „en”, if nothing given - will check for files in „[dir]/WikiData”", type: "string", demandOption: false })
            .option("d", { alias: "directory", describe: "Name of the working directory", type: "string", demandOption: false })
            .help('h').alias('h', 'help')
            .check((argv, options) => (!argv.c) ? new Error("Expected value for category") : true);
}

args = args.argv;

import { default as run } from "./index.mjs";

let category = args.c,
    directory = args.d,
    language = args.l;

if (language)
    await run(category, directory ? directory : category, language);
else
    await run(category, directory ? directory : category);
