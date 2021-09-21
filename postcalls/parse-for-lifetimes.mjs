export const Meta = {
    purpose: "getting information from API res. in order to visualize it on a timetable"
};

import {
    readFileSync as read,
    readdirSync as list,
    writeFileSync as write
} from "fs";

let data = [], ignored = [];

function totime(pseudodate) {

    // making WikiData dates normal
    if (pseudodate) {

        if (pseudodate.slice(6,8) == "00")
            pseudodate = pseudodate.slice(0,6) + "01" + pseudodate.slice(8);

        if (pseudodate.slice(9,11) == "00")
            pseudodate = pseudodate.slice(0,9) + "01" + pseudodate.slice(11);

        if (pseudodate.startsWith('+'))
            return pseudodate.slice(1, -1) + ".000Z";
        else if (pseudodate.startsWith('-'))
            return "-00" + pseudodate.slice(1, -1) + ".000Z";
    }
}

for (let filename of list("test-results/download")) {

    let input = read(`test-results/download/${filename}`, { encoding: "utf-8" });
    let item = JSON.parse(input);

    let entity = {
        content: item.title,
        start: item.claims.P569 ? totime(item.claims.P569[0]?.mainsnak?.datavalue?.value.time) : undefined,
        end: item.claims.P570 ? totime(item.claims.P570[0]?.mainsnak?.datavalue?.value.time) : undefined
    };

    if (entity.start) {

        // extending lifetime
        if(!entity.end || Math.abs(Date.parse(entity.end) - Date.parse(entity.start)) < 60000*60*24*365*13) // assuming adolescence
            entity.end = new Date(Date.parse(entity.start) + 60000*60*24*365*64);

        data.push(entity);

    } else
        ignored.push(entity.content);
}

console.log({ "!entity.start": ignored });

let output = JSON.stringify(data, null, '\t');

write(`test-results/lifetimes.json`, output);
