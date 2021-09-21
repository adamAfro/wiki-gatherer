Wiki'Gatherer[.mjs](https://github.com/adamAfro/wiki-gatherer/blob/master/index.mjs)
=================

Imagine a tree, an apple tree - it has branches with lesser branches with lesser branches...
and so on. Some of them have apples on them. In order to take all the apples one needs
to take the apples not only from the big branches but also from the small ones.

That's what gatherer does. It takes all the pages from various categories on wikipedia
igoring untasteful branches called categories - 'cause no tasty content there.

Why? I was curious how many philosopheres were there throughout history on more visualisation
level and what is the better place to get such data... Still not done the vis.-part but atleast
I have the data :P

Installation and running „tests”:
0. `git clone https://github.com/adamAfro/wiki-gatherer.git WGDir`
    - `cd WGDir`
    - `npm install`
1. `node test.mjs;cd test-results/download;ls;cd ../../` (CTRL + c -> ✖)
2. `node parser/test.mjs;cd test-results;ls;cd ../`

Gathering:
```JS
import Gatherer from "./dir-with-lib/index.mjs";

let url = "https://pl.wikipedia.org"; // any site that uses MediaWiki API
let path = "w/api.php" // path to the api

let gatherer = new Gatherer(`${url}/${path}`);

let category = {
    title: "Kategoria: Sofiści" // for example
};

let data = await gatherer.gather(category.title);
/// data -> [{ title, ns, claims }, ...]
```

Parsing:
```JS
import Parser from "./dir-with-lib/index.mjs";

let targetmap = { dates: ["birth", "death"] };

let parser = new Parser(targetmap);

for (let item of data) {

    let info = parse.parse(item);
    /// info -> { title, dates: { birth, death } }
}
```
