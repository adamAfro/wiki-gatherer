export const Meta = {
    purpose: "displaying given properties over timeline",
    usage: "use func. accordingly and set CSS rules for items",
    alternatives: {
        "visjs": "would use it but it is too slow for large amounts"
    }
};

export default class Timeline {

    constructor(node) { this.node = node }

    print(rows = [], scale = 0.1**12*11) {

        let min = rows[rows.length - 1][0].start;
        for (let row of rows)
            if (row[0].start < min)
                min = row[0].start;

        let content = '';
        for (let row of rows) {

            let subcontent = '';
            for (let { title, start, end, duration = Math.abs(start - end) } of row)
                subcontent += `<a href="#${title}" class="item" style="left:${(start-min)*scale}pt;width:${duration*scale}pt">${title}</a>`;

            content += `<div class="timerow">${subcontent}</div>`;
        }

        let max = rows[rows.length - 1][rows[rows.length - 1].length - 1].start - min;
        for (let row of rows)
            if (row[row.length - 1].end - min > max)
                max = row[row.length - 1].end - min;

        this.node.innerHTML = content,
        this.node.style.width = `${max*scale}pt`,
        this.node.dataset.scale = scale;

        let dates = '';
        for (let year of ["-4000", "-2000", "-1000", "-0001", "0735", "1453", "2021"])
            dates += `<i class="date" style="left:${(Date.UTC(year)-min)*scale}pt">${year}</i>`;

        this.node.insertAdjacentHTML(`beforeend`, `<div style="width:${this.node.style.width}" class="timerow dates">${dates}</div>`);
    }

    static parse(type = "people", dataset = [{ title: '', dates: { birth: '', death: '' } }], features = []) {

        let rows = new Array([]), errors = [];
        switch (type) {

            case "people": {

                let featured = [];
                if (features && features.length > 0) {

                    for (let i = 0; i < dataset.length; i++) for (let j = 0; j < features.length; j++) {

                        if (dataset[i].title.endsWith(features[j])) {

                            featured.push(...dataset.splice(i, 1)), features.splice(j, 1);

                            i--; break;
                        } else continue;
                    }
                }

                for (let { title, dates } of dataset) try {

                    let start = Date.parse(dates.birth),
                        end = Date.parse(dates.death);

                    if (start > Date.UTC(1901) && !end)
                        end = Date.now();

                    if(!start || !end)
                        throw { title, message: "invalid date(s)" };

                    let r = 0;
                    while (rows[r]) {

                        let overflow = rows[r].some(sample => {

                            let starts = (sample.start > start && sample.start < end) || (start > sample.start && start < sample.end),
                                ends = (sample.end > start && sample.end < end) || (end > sample.start && end < sample.end);

                            if (starts || ends)
                                return true;
                            else
                                return false;
                        });

                        if (overflow)
                            r++
                        else
                            break;
                    }

                    if(!rows[r])
                        rows[r] = [];

                    rows[r].push({ title, start, end });

                } catch(e) { errors.push(e) };

                if (featured.length)
                    rows.unshift(...this.parse("people", featured).reverse());

            } break;

            default: throw "parsing must have defined type";
        }

        for (let row of rows)
            row.sort(({ start }, next) => (start - next.start));

        if (errors.length > 0)
            console.warn("Timeline errors:", errors);

        return rows;
    }
}
