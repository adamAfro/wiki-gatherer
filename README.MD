Wiki'Gatherer[.mjs](https://github.com/adamAfro/wiki-gatherer/blob/master/index.mjs)
===================

v.: 1.0.0-alpha

![A place for a screenshot](assets/timeline-screenshot.jpeg)

Imagine a tree, an apple tree - it has branches with lesser branches with lesser branches...
and so on. Some of them have apples on them. In order to take all the apples one needs
to take the apples not only from the big branches but also from the small ones.

That's what gatherer does. It takes all the pages from various categories on wikipedia
ignoring untasteful branches called categories - 'cause no tasty content there.

Why? I was curious how many philosopheres were there throughout history on more visualisation
level and what is the better place to get such data...



Installation and running
------------------------

0. `git clone https://github.com/adamAfro/wiki-gatherer.git WGDir`
    - `cd WGDir`
    - `npm install`

Globally:
1. `npm install -g`
2. `wiki-gather -h`
3. `wiki-gather -l lang -t category -d directory`

Locally:
1. `node bin/run.mjs -h`
2. `node bin/run.mjs -l lang -t category -d directory`

Javascript
```JS
import { default as gather } from "./dir-with-lib/bin/index.mjs";

if (language)
    await gather(category, directory ? directory : category, language);
else
    await gather(category, directory ? directory : category);
```

In the directory one may find claims from WikiData (`/WikiData/...`), parsed `data.json` and
`index.html` with demo-page which may be runned inside the browser without server.

If the directory contains "template.html" - it will be used as template with meta tags:
```HTML
<meta name="wiki-gatherer-display" content="container selector">
<meta name="wiki-gatherer-titles" content="heading/title selectors">

<!-- Timeline: -->
<meta name="wiki-gatherer-features" content="surnames to feature, ...">
```



Javascript
----------

Gathering:
```JS
import Gatherer from "./dir-with-lib/index.mjs";

let language = "pl";

let gatherer = new Gatherer(language);

let category = {
    title: "Kategoria: Sofiści" // for example
};

let data = await gatherer.gather(category.title);
/// data -> [{ title, ns, claims }, ...]
```

Parsing:
```JS
import Parser from "./dir-with-lib/parser/index.mjs";

let targetmap = { dates: ["birth", "death"] };

let parser = new Parser(targetmap);

let dataset = [];
for (let item of data)
    dataset.push(parser.parse(item));
/// dataset[i] -> { title, dates: { birth, death } }
```

Displaying:
```JS
import Timeline from "./dir-with-lib/display/index.mjs";

new Timeline(document.getElementById("display"))
    .print(Timeline.parse(dataset, "people"));
```
