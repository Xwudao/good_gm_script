import {
    API_DISK_URL,
    PARSE_PWD_REG, BUTTON_TEXT_VIP_VIDEO, BUTTON_TEXT_PARSE_BAIDU,
    URL_REG, API_PARSE_BAIDU_URL, VIP_VIDEO_API_URL
} from './config'


import style from './styles/styles.scss'

export function selector(dom) {
    return document.querySelector(dom);
}

// 导出样式
export function exportStyle() {
    let styleDom = document.createElement('style');
    styleDom.textContent = style;
    document.head.appendChild(styleDom);
}

// 添加左侧根节点
export function appendLeftBarDom() {
    let leftBar = selector('.kuan-left-bar')
    if (leftBar) return leftBar;

    let divDom = document.createElement('div');
    divDom.classList.add('kuan-left-bar');
    document.body.appendChild(divDom);
    return divDom;
}

export function appendBaiduParseDom(disk_id, pwd = '') {
    let aDom = document.createElement('a');
    aDom.setAttribute('target', '_blank');
    aDom.innerText = BUTTON_TEXT_PARSE_BAIDU;
    let url = API_PARSE_BAIDU_URL.replace('[disk_id]', disk_id).replace('[pwd]', pwd);
    aDom.setAttribute('href', url);
    aDom.classList.add('kuan-link');
    aDom.classList.add('bd');

    let leftDivDom = appendLeftBarDom()

    leftDivDom.appendChild(aDom);
}

// 插入播放视频的dom
export function appendVipVideoDom(url) {
    let aDom = document.createElement('a');
    aDom.setAttribute('target', '_blank');
    aDom.innerText = BUTTON_TEXT_VIP_VIDEO;
    aDom.setAttribute('href', url);
    aDom.classList.add('kuan-link');
    aDom.classList.add('kuan-vip');

    let leftDivDom = appendLeftBarDom()

    leftDivDom.appendChild(aDom);
}
export function getCompressPass() {
    let re_pass = /[【\[激活解压壓提取密码碼：:\]】]{3,}\s*([\w+\.\-\~]+)/ig;
    let matchArray = document.body.innerText.match(re_pass);
    let result = [];
    if (!matchArray)
        return '';
    for (let i = 0; i < matchArray.length; i++) {
        result.push(matchArray[i]);
    }
    result = unique(result);
    // console.log(result);
    return result.join('~~');
}

export function getPass(disk_type, disk_id, callBack) {
    let data = 'disk_id=' + disk_id + '&disk_type=' + disk_type;
    let pwd = getPwdValue(disk_type, disk_id)
    if (pwd) {//本地密码
        callBack({ diskPass: pwd, from: 'local' }, 'success');
        return;
    }
    return $.post(API_DISK_URL + '/pass/get', data, callBack, 'json');
}
export function sendPass(disk_type, disk_id, local_pass, callBack) {
    if (disk_type === undefined || disk_id === undefined) return;
    let local_compress_pass = getCompressValue(disk_type, disk_id);
    let data = 'disk_id=' + disk_id + '&disk_type=' + disk_type + '&disk_state=1' + '&disk_pass=' + local_pass + '&file_pass=' + local_compress_pass;

    return $.post(API_DISK_URL + '/pass/send', data, callBack);
}

export function sendInvalidate(disk_type, disk_id) {
    if (disk_type === undefined || disk_id === undefined) return;
    let data = 'disk_state=0&disk_id=' + disk_id + '&disk_type=' + disk_type;
    return $.post(API_DISK_URL + '/pass/send', data, callBack);
}

export function activeAnyLink(html) {
    html = html.replace(new RegExp(html, 'ig'), `<a target="_blank" href="http://${html}" class="active-link">${html}</a>`)
    return html;
}

// ===========

// ===========set/get value func===========

export function getValues() {
    return GM_listValues();
}

export function setValue(key, value) {
    GM_setValue(key, value);
}

export function getValue(key, defaultValue) {
    return GM_getValue(key, defaultValue);
}

export function setPwdValue(disk_type, disk_id, value) {
    GM_setValue(disk_type + '_' + disk_id, value);
}

export function getPwdValue(disk_type, disk_id) {
    return GM_getValue(disk_type + '_' + disk_id, '');
}

export function getSentValue(disk_type, disk_id) {
    return GM_getValue(disk_type + '_sent_' + disk_id, '');
}

export function setSentValue(disk_type, disk_id) {
    GM_setValue(disk_type + '_sent_' + disk_id, 'ok');
}
export function getCompressValue(disk_type, disk_id) {
    return GM_getValue(disk_type + '_compress_' + disk_id, '');
}

export function setCompressValue(disk_type, disk_id, val) {
    GM_setValue(disk_type + '_compress_' + disk_id, val);
}


// ===========inner func===========

export function unique(arr) {// 去重
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {         //第一个等同于第二个，splice方法删除第二个
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

// 顺带抓取链接后面的密码
export function parsePwd(html) {
    /* 
    0: "https://pan.baidu.com/s/1KpvGklksecWEEAQop1PumQ 提取码: 9g4q"
    1: "https://pan.baidu.com/s/1KpvGklksecWEEAQop1PumQ"
    2: "9g4q"
    groups: undefined */
    for (let i = 0; i < PARSE_PWD_REG.length; i++) {
        let res = matchAll(html, PARSE_PWD_REG[i]);
        for (let j = 0; j < res.length; j++) {
            if (res[j].length >= 3 && res[j][2] !== undefined) {
                let [disk_type, disk_id] = getDiskIdAndType(res[j][1]);
                setCompressValue(disk_type, disk_id, getCompressPass());//密码
                console.log('find pwd: ', disk_id, '===>>', res[j][2]);
                setPwdValue(disk_type, disk_id, res[j][2]);
            }
        }
    }
}

export function matchAll(str, reg) {// helper,简单封装匹配函数
    let res = [];
    let match;
    while ((match = reg.exec(str))) {
        res.push(match)
    }
    return res
}

// ===========about disk===========


// return [type,id]
export function getDiskIdAndType(url) {
    if (typeof url !== 'string') return [];

    let matches;
    matches = /https?:\/\/(?:pan|eyun)\.baidu\.com\/share\/init\?surl=([a-zA-Z0-9_\-]{5,25})/ig.exec(url);
    if (matches && matches.length === 2) {
        return ['BDY', matches[1]];
    }
    matches = /https?:\/\/(?:pan|eyun)\.baidu\.com\/s\/[\d]([a-zA-Z0-9_\-]{5,25})/ig.exec(url);
    if (matches && matches.length === 2) {
        return ['BDY', matches[1]];
    }

    matches = /https?:\/\/(?:\w+)?\.?lanzou.?\.com\/([\w-_]{6,13})/ig.exec(url);
    if (matches && matches.length === 2) {
        return ['LZY', matches[1]];
    }

    matches = /https?:\/\/cloud.?189?\.cn\/t\/([\w_]{4,20})/ig.exec(url);
    if (matches && matches.length === 2) {
        return ['TYY', matches[1]];
    }
    return [];
}

export function mactchReplaceHtml(html, reg, tag = false) {
    // let reg = /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/s[hare]*\/[int?surl=]*[\w-_]{5,25})/ig;
    let exec_res
    let isMatch = false;
    let i = 0;
    let newHtml = html;


    while ((exec_res = reg.exec(html))) {
        if (i++ > 100) break;
        let start = html.substring(0, exec_res.index).slice(-8);
        if (!/href=['"]?/ig.test(start) && !/['"]?>$/ig.test(start)) {

            if (exec_res && exec_res[1]) {
                isMatch = true;
                if (exec_res[1].indexOf('http') === -1) {
                    newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" href="http://${exec_res[1]}" class="active-link">${exec_res[1]}</a>`);
                } else {
                    newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" href="${exec_res[1]}" class="active-link">${exec_res[1]}</a>`);
                }

                newHtml = newHtml.replace(/www(\.lanzous\.com)/ig, 'pan$1');//将www替换为pan
            }
        }

    }

    return [isMatch, newHtml];
}