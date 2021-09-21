export const Meta = {
    purpose: "normalizing claims from WikiData.org to edible data"
};

export default class Parser {

    constructor({ dates = ["birth", "death"] }) {

        this.targets = {
            dates
        }
    }

    parse(claims = {}) {

        let output = {};

        if (this.targets.dates.length > 0) {

            output.dates = {};
            for (let name of this.targets.dates) {

                let claim;
                switch (name) {
                    case "birth": claim = claims.P569; break;
                    case "death": claim = claims.P570; break;
                }

                if (claim && claim[0])
                    output.dates[name] = this.constructor.normalize(claim[0], "time");
            }
        }

        return output
    }

    static normalize(claim, type) {

        switch (type) {

            case "time": {

                let date = claim.mainsnak?.datavalue?.value.time
                if(!date)
                    throw "date did not have value";

                if (date.slice(6,8) == "00")
                    date = date.slice(0,6) + "01" + date.slice(8);

                if (date.slice(9,11) == "00")
                    date = date.slice(0,9) + "01" + date.slice(11);

                if (date.startsWith('+'))
                    return date.slice(1, -1) + ".000Z";
                else if (date.startsWith('-'))
                    return "-00" + date.slice(1, -1) + ".000Z";

            } break;

            default:
                return claim.mainsnak?.datavalue?.value;
        }
    }
}
