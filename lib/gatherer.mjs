export const Meta = {

	title: "Wiki'Gatherer", author: "adamAfro",
    purpose: "Gathering all endpoint-pages inside wikipedia (or other wikimedias)",
    explanation: "Wiki'page is either category or content-alike" + ' ' +
        "gathering recurses through all offspring categories" + ' ' +
        "and replaces them with their content-pages",
	analogy: "Apple tree has a lot of branches with lesser branches and fruits" + ' ' +
		"gathering is taking only the fruits",
    reference: "https://www.mediawiki.org/wiki/API:Tutorial"
}

import Pedia from "./pedia.mjs";

export default class Gatherer extends Pedia {

    gather(id, params) { return this.constructor.gather(id, this.url, params) }

    static async gather(id, URL = '', params = {}) {

        console.log(`↓{ id: ${id} }↓`);

        return Gatherer.get(URL, {

            "action": "query", ...params,
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

                        return Gatherer.gather(members[i].pageid, URL, params)
                            .then(submembers => members.splice(i, 1, ...submembers))
                            .then(function() { return subfetch(i) });

                    } else
                        return subfetch(i + 1);
                }
            }
        });
    }
}
