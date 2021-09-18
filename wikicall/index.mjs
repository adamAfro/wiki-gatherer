export const Meta = {
    purpose: "making continuous requests to wikimedia websites"
};

import querify from "./querify.mjs";
import fetch from './fetch.mjs';

export default function wikicall(URL = '', params = {}) {

    let req = fetch(querify(URL, params))
        .then(res => res.ok ? res.json() : Promise.reject(res));

    let stack = req.then(result => {

        if (result.continue) {

            let subparams = {};
            for (let key in params)
                subparams[key] = params[key];
            for (let key in result.continue)
                subparams[key] = result.continue[key];

            return wikicall(URL, subparams)
                .then(subresults => [result, ...subresults]);

        } else
            return [result];
    });

    return stack;
}
