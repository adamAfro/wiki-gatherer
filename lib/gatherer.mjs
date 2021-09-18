export const Meta = {

	title: "Wiki'Gatherer", author: "adamAfro",
    purpose: "Gathering all endpoint-pages inside wikipedia with their properties",
    explanation: "Wiki'page is either category or content-alike" + '; ' +
        "gathering recurses through all offspring categories" + ' ' +
        "and replaces them with their content-pages" + ', ' +
        "then it fetches for their props",
	analogy: "Apple tree has a lot of branches with lesser branches and fruits" + ' ' +
		"gathering is taking only the fruits from all the branches",
    references: [
        "https://www.mediawiki.org/wiki/API:Tutorial",
        "https://stackoverflow.com/a/69233719/13851998"
    ],

    bugs: ["each WikiData API request is made 2 times"],
    todo: [
        "make it non-static - it makes some trouble"
    ]
}

import Pedia from "./pedia.mjs";
import querify from "./querify.mjs";
import fetch from './fetch.mjs';

export default class Gatherer extends Pedia {

    gather(id, scan) { return this.constructor.gather(id, this.url, scan) }

    static async gather(id, URL = '', scan = function(d) { return d }) {

        console.log(`↓{ id: ${id} }↓`);

        return Gatherer.get(URL, {

            "action": "query",
            "list": "categorymembers",
            "cmpageid": id,
            "format": "json"

        }).then(results => {

            let members = [];
            for (let { query } of results) for (let member of query.categorymembers)
                if(!members.some(({ pageid }) => pageid == member.pageid))
                    members.push(member);

            return subfetch().then(function() {

                return members;

            }); async function subfetch(i = 0) {

                if (i < members.length) {

                    let treenesness = (members[i].ns == 14);
                    if (treenesness) {

                        return Gatherer.gather(members[i].pageid, URL, scan)
                            .then(submembers => members.splice(i, 1, ...submembers))
                            .then(function() { return subfetch(i) });

                    } else return fetch(querify("https://wikidata.org/w/api.php", {

                        "action": "wbgetentities",
                        "sites": `${URL.slice("https://".length, "https://**".length)}wiki`,
                        "titles": members[i].title,
                        "props": "claims",
                        "format": "json"

                    })).then(res => res.ok ? res.json() : Promise.reject(res)).then(({ success, entities }) => {

                        for (let key in entities) {

                            if (key.startsWith("Q")) {

                                members[i].data = scan(entities[key]);

                                break;
                            }
                        }

                    }).then(function() { return subfetch(i + 1) });
                }
            }
        });
    }
}
