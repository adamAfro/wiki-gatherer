export const Meta = {
    purpose: "getting structurized data about a person"
};

import Base from "./raw.mjs";

export default class Gatherer extends Base {

    scan({ type = '', id = '', claims = {} }) {

        return {
            type, id,
            dates: {
                birth: claims.P569 ? claims.P569[0]?.mainsnak?.datavalue?.value?.time : undefined,
                death: claims.P570 ? claims.P570[0]?.mainsnak?.datavalue?.value?.time : undefined
            }
        };
    }
}
