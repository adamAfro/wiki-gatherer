export const Meta = {

	title: "Wiki'Gatherer", author: "adamAfro",
    purpose: "Gathering all endpoint-pages inside wikipedia with their data-claims",
    explanation: "Wiki'page is either category or content-alike" + '; ' +
        "gathering recurses through all offspring categories" + ' ' +
        "and replaces them with their content-pages" + ', ' +
        "then it fetches for their claims from WikiData.org",
	analogy: "Apple tree has a lot of branches with lesser branches and fruits" + ' ' +
		"gathering is taking only the fruits from all the branches",
    references: [
        "https://www.mediawiki.org/wiki/API:Tutorial",
        "https://stackoverflow.com/a/69233719/13851998"
    ]
}

import wikicall from "./wikicall/index.mjs";

export default class Gatherer {

    constructor(url) { this.url = url }

    get lang() { return this.url.slice("https://".length, "https://**".length) }

    async gather(id) {

        return wikicall(this.url, {

            "action": "query",
            "list": "categorymembers",
            "cmpageid": id,
            "format": "json"

        }).then(results => {

            let members = [];
            for (let { query } of results) for (let member of query.categorymembers)
                if(!members.some(({ pageid }) => pageid == member.pageid))
                    members.push(member);

            return this.subfetch(members).then(() => members);
        });
    }

    async subfetch(members = [], i = 0) {

        if (i < members.length) {

            let treenesness = (members[i].ns == 14);
            if (treenesness) {

                return this.gather(members[i].pageid).then(submembers => {

                    members.splice(i, 1, ...submembers)

                    return this.subfetch(members, i);
                });

            } else return wikicall("https://wikidata.org/w/api.php", {

                "action": "wbgetentities",
                "sites": `${this.lang}wiki`,
                "titles": members[i].title,
                "props": "claims",
                "format": "json"

            }).then(([result]) => {


                for (let key in result.entities) {

                    if (key.startsWith("Q")) {

                        members[i].data = result.entities[key];

                        break;
                    }
                }

            }).then(() => this.subfetch(members, i + 1));
        }
    }
}
