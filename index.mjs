export const Meta = {

	title: "Wiki'Gatherer", author: "adamAfro",
    purpose: "Gathering all endpoint-pages inside wikipedia with their data-claims",
    explanation: "Wiki'page is either category or content-alike" + '; ' +
        "gathering recurses through all offspring categories" + ' ' +
        "and replaces them with their content-pages" + ', ' +
        "then it fetches for their claims from WikiData.org",
    references: [
        "https://www.mediawiki.org/wiki/API:Tutorial",
        "https://stackoverflow.com/a/69233719/13851998"
    ]
}

import wikicall from "./wikicall/index.mjs";

export default class Gatherer {

    constructor(lang = "en") { this.lang = lang }

    async gather(title) {

        let members = await this.list(title);
        for (let i = 0, member = members[i]; i < members.length; member = members[i]) {

            let treenesness = (members[i].ns == 14);
            if (treenesness) {

                members.splice(i, 1);

                let submembers = await this.list(member.title);
                for (let submember of submembers)
                    if(!members.some(sample => sample.title == submember.title))
                        members.push(submember);

            } else i++;
        }

        let heading = `Data (${members.length})`;
        let underscore = '';
        for (let char of heading)
            underscore += "=";

        console.log(heading);
        console.log(underscore + '\n');

        let dataset = [];
        for (let i = 0; i < members.length; i++) {

            let { title } = members[i];

            console.log(`${i + 1}. ${title}`);

            let data = await this.claim(title);
            if (data && (data.id && data.claims))
                dataset.push({ link: `https://${this.lang}.wikipedia.org/wiki/${title}`, title, id: data.id, claims: data.claims });
        }

        return dataset;
    }

    async list(title) {

        return wikicall(`https://${this.lang}.wikipedia.org/w/api.php`, {

            "action": "query",
            "list": "categorymembers",
            "cmtitle": title,
            "cmlimit": "max",
            "format": "json"

        }).then(results => {

            let members = [];
            for (let { query } of results)
                for (let member of query.categorymembers)
                    members.push(member);

            return members;
        });
    }

    async claim(title) {

        return wikicall("https://wikidata.org/w/api.php", {

            "action": "wbgetentities",
            "sites": `${this.lang}wiki`,
            "titles": title,
            "props": "claims",
            "format": "json"

        }).then(([result]) => {

            for (let key in result.entities) if (key.startsWith('Q'))
                return result.entities[key];
        });
    }
}
