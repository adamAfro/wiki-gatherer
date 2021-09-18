import {
    Gatherer, Scanners
} from "./index.mjs"

let gatherer = new Gatherer("https://pl.wikipedia.org/w/api.php");
let members = await gatherer.gather(3183659, Scanners.person);

