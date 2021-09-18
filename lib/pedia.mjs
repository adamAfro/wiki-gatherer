export const Meta = {
    purpose: "making continuous requests to wikimedia websites"
};

import querify from "./querify.mjs";
import fetch from './fetch.mjs';

export default class Pedia {

    constructor(url) { this.url = url }

    get(params) { return this.constructor.get(this.url, params) }

    static async get(URL = '', params = {}) {

        let req = fetch(querify(URL, params))
            .then(res => res.ok ? res.json() : Promise.reject(res));

        let stack = req.then(result => {

            if (result.continue) {

                let subparams = {};
                for (let key in params)
                    subparams[key] = params[key];
                for (let key in result.continue)
                    subparams[key] = result.continue[key];

                return this.get(URL, subparams)
                    .then(subresults => [result, ...subresults]);

            } else
                return [result];
        });

        return stack;
    }
}
