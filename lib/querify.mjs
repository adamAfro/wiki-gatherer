export const Meta = {

    purpose: "combining given URL with given params"

}; export default function querify(URL = '', params = {}) {

    let query = '';
    for (let key in params)
        query += `${key}=${params[key]}&`;

    return `${URL}?${query.slice(0, - '&'.length)}`;
}
