export function parseItemId(url) {
    let res = /id=(\d+)&?/ig.exec(url)
    if (res && res.length >= 2)
        return res[1];
    else
        return null;
}