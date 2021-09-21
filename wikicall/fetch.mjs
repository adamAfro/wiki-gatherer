export const Meta = {
    purpose: "wrapping custom behaviour over NPM module" + ' ' +
        "which provides fetching function like in browser's enviroment"
}

import * as Fetcher from "node-fetch";

export default function fetch(url, ...rest) {

    // console.log(url);

    return Fetcher.default(url, ...rest).catch(error => { return error });
}
