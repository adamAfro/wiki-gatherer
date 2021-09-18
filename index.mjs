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

    usage: "use one of the types depenging on kind of information You seek" + ', ' +
        "or make a new one extending raw"
}

export * as types from "./types/index.mjs";
