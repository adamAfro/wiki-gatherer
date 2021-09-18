export default function person({ type = '', id = '', claims = {} }) {


    return {
        type, id,
        dates: {
            birth: claims.P569 ? claims.P569[0]?.mainsnak?.datavalue?.value?.time : undefined,
            death: claims.P570 ? claims.P570[0]?.mainsnak?.datavalue?.value?.time : undefined
        }
    };
}
