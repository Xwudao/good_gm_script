export function parseItemId(url) {
    let res = /id=(\d+)&?/ig.exec(url)
    if (res && res.length >= 2)
        return res[1];
    else
        return null;
}

export function jumpUrl(url) {
    let w = window.open(url, '_blank')
    if (!w) {
        window.location.href = url
    }
}
export function uniqueArr(arr) {
    let hash = [];
    for (let i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i]);
        }
    }
    return [...hash];
}