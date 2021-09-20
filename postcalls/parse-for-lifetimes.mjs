import {
    readFileSync as read,
    readdirSync as list,
    writeFileSync as write
} from "fs";

let data = [], ignored = [];

for (let filename of list("test-results/download")) {

    let input = read(`test-results/download/${filename}`, { encoding: "utf-8" });
    let item = JSON.parse(input);

    let entity = {
        title: item.title,
        birth: item.data.claims.P569 ? item.data.claims.P569[0]?.mainsnak?.datavalue?.value?.time : undefined,
        death: item.data.claims.P570 ? item.data.claims.P570[0]?.mainsnak?.datavalue?.value?.time : undefined
    };

    if (entity.birth) {

        // TODO append +100Y death date if (!entity.date)

        data.push(entity);

    } else
        ignored.push(entity.title);
}

console.log({ "!entity.birth": ignored });

let output = JSON.stringify(data, null, '\t');

write(`test-results/lifetimes.json`, output);
