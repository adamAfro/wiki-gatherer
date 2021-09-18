import {
    Gatherer
} from "./index.mjs"

let gatherer = new Gatherer("https://pl.wikipedia.org/w/api.php");
let members = await gatherer.gather(1949616);

console.log(members.length);
