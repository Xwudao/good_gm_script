import {
    INVALIDATE_LINK_REG, LINKIFY_REG,
    BAIDU_ELEMENT, DISK_INFO_START_WITH, LZ_ELEMENT, VIP_VIDEO_API_URL,
    ACTIVE_LINK_REG, URL_REG, LZ_PWD_EXITS_ELEMENT, IS_DISK_URL, TY_ELEMENT,
    TYY_PRIVATE_TEXT, SYS_ERROR_NOTICE, QUERY_SUCCESS_NOTICE, PLEASE_INPUT_NOTICE, JUMP_LINK_REG,
} from './config'
// import { encode } from 'js-base64';
// const base64url = require('base64-url')
import {
    selector, getPass, getDiskIdAndType, sendPass, appendVipVideoDom,
    setValue, getValue, setPwdValue, getPwdValue, getSentValue, setSentValue,
    mactchReplaceHtml, parsePwd, sendInvalidate, activeAnyLink, parseTitle,
    appendCouponQrCode, parseLink,
    appendBaiduParseDom, appendSettingDom, appendCouponDom, appendHistoryDom, linkify, appendLinksDom, AddLinks,
} from './func'

import { jumpUrl, parseItemId } from './util';

// 天猫详情页操作
export function tmallDetail(config) {
    let { href } = config;
    let title = document.title.split('-')[0] || '';
    if (!title) return;

    let itemId = parseItemId(href);
    appendCouponQrCode(itemId);//弹出二维码
    appendCouponDom(parseTitle(title));
    appendHistoryDom(href);

}

// 淘宝详情页操作
export function taobaoDetail(config) {
    let { href } = config;
    let title = document.title.split('-')[0] || '';
    if (!title) return;

    let itemId = parseItemId(href);
    appendCouponQrCode(itemId);//弹出二维码


    appendCouponDom(parseTitle(title));
    appendHistoryDom(href);
}

// 跳转Vip视频
export function videoPage(config) {
    let { href } = config;
    appendVipVideoDom(VIP_VIDEO_API_URL.replace('[url]', Base64.encode(href)));
}


// 处理百度密码页面
export function baiduPwdPage(config) {
    let { href } = config;
    console.log('helper...')
    let [disk_type, disk_id] = getDiskIdAndType(href);


    let selector_input = selector(BAIDU_ELEMENT.input);
    let selector_click = selector(BAIDU_ELEMENT.click);
    let selector_notice = selector(BAIDU_ELEMENT.notice);

    selector_notice.style.display = 'block'
    // 这是从服务器获取密码
    getPass(disk_type, disk_id, (res, status) => {
        // todo 从这里开始要写从本地获取的密码
        if (status === 'success') {
            console.log(res)
            if (res && res.diskPass) {
                setPwdValue(disk_type, disk_id, res.diskPass);
                selector_notice.innerText = DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                selector_input.value = res.diskPass;
                selector_click.click();
            } else {

                selector_notice.innerText = DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
            }
        } else {
            console.log('系统错误');
            selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
        }
    });
    // 这里等用户输入

    selector_input.addEventListener('input', (ev) => {
        let value = ev.target.value;
        setPwdValue(disk_type, disk_id, value);
    })


}

//百度正文页面
export function baiduIndexPage(config) {

    let { href } = config;
    console.log('helper...baiduIndexPage')




    let [disk_type, disk_id] = getDiskIdAndType(href);
    // 检测是否已失效
    for (let i = 0; i < INVALIDATE_LINK_REG.length; i++) {
        let reg = INVALIDATE_LINK_REG[i];
        if (reg.test(document.body.innerText)) {
            console.log('detected invalid page');
            sendInvalidate(disk_type, disk_id);
            return;//已失效，不往下进行了；
        }
    }
    // 左侧按钮，跳转解析
    // appendBaiduParseDom(disk_id, getPwdValue(disk_type, disk_id));
    // 设置dom
    appendSettingDom();

    if (!getSentValue(disk_type, disk_id)) {
        // not sent
        let val = getPwdValue(disk_type, disk_id);
        sendPass(disk_type, disk_id, val, () => setSentValue(disk_type, disk_id));
    } else {
        console.log('has sent');
    }
}

// 蓝奏云页面
export function lzyPage(config) {


    let { href } = config;
    console.log('helper...')


    // 设置dom
    appendSettingDom();

    let [disk_type, disk_id] = getDiskIdAndType(href);

    // 检测是否已失效
    for (let i = 0; i < INVALIDATE_LINK_REG.length; i++) {
        let reg = INVALIDATE_LINK_REG[i];
        if (reg.test(document.body.innerText)) {
            console.log('detected invalid page');
            sendInvalidate(disk_type, disk_id);
            return;//已失效，不往下进行了；
        }
    }

    //1.先判断是否有密码的页面
    let select0 = selector(LZ_PWD_EXITS_ELEMENT[0]);
    let select1 = selector(LZ_PWD_EXITS_ELEMENT[1]);

    let style = null;

    if (select0 && (style = getComputedStyle(select0)).getPropertyValue('display') === 'block') {
        console.log('Pwd page Type 1');
        // e.g. https://xihan.lanzous.com/b03yu4atg
        operate(selector(LZ_ELEMENT[0].input), selector(LZ_ELEMENT[0].click), selector(LZ_ELEMENT[0].notice))


    } else if (select1 && (style = getComputedStyle(select1)).getPropertyValue('display') === 'block') {
        console.log('Pwd page Type 2');
        // e.g. https://skyamg.lanzous.com/i64lVerm67g
        operate(selector(LZ_ELEMENT[1].input), selector(LZ_ELEMENT[1].click), selector(LZ_ELEMENT[1].notice))

    }

    //操作是否有密码
    function operate(selector_input, selector_click, selector_notice) {
        // 这是从服务器获取密码
        getPass(disk_type, disk_id, (res, status) => {
            // todo 从这里开始要写从本地获取的密码
            if (status === 'success') {
                console.log(res)
                if (res && res.diskPass) {
                    setPwdValue(disk_type, disk_id, res.diskPass);
                    selector_notice.innerText = DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                    selector_input.value = res.diskPass;
                    selector_click.click();
                }
            } else {
                selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
            }
        });
        // 这里等用户输入
        selector_input.addEventListener('input', (ev) => {
            let value = ev.target.value;
            setPwdValue(disk_type, disk_id, value);
        })
    }
    //send
    let timer = setInterval(() => {
        if (getSentValue(disk_type, disk_id)) {
            clearInterval(timer);
            return;
        }
        if ((!select0 && !select1) || (!style || style.getPropertyValue('display') === 'none')) {
            console.log('sent');
            let pass = getPwdValue(disk_type, disk_id) || '';
            sendPass(disk_type, disk_id, pass, () => { setSentValue(disk_type, disk_id) });
            clearInterval(timer);
        }
    }, 2000);

}

export function tyyPage(config) {
    let { href } = config;
    console.log('helper...')


    // 设置dom
    appendSettingDom();

    let [disk_type, disk_id] = getDiskIdAndType(href);

    // 检测是否已失效
    for (let i = 0; i < INVALIDATE_LINK_REG.length; i++) {
        let reg = INVALIDATE_LINK_REG[i];
        if (reg.test(document.body.innerText)) {
            console.log('detected invalid page');
            sendInvalidate(disk_type, disk_id);
            return;//已失效，不往下进行了；
        }
    }

    let selector_input = selector(TY_ELEMENT.input);
    let selector_click = selector(TY_ELEMENT.click);
    let selector_notice = selector(TY_ELEMENT.notice);


    let textBody = document.body.innerText;
    let wait_timer = null;
    if (textBody.indexOf(TYY_PRIVATE_TEXT) !== -1) {

        // 这是从服务器获取密码
        getPass(disk_type, disk_id, (res, status) => {
            // todo 从这里开始要写从本地获取的密码
            if (status === 'success') {
                console.log(res)
                if (res && res.diskPass) {
                    if (selector_notice)
                        selector_notice.style.display = 'block';
                    setTimeout(() => {//延迟一点
                        setPwdValue(disk_type, disk_id, res.diskPass);
                        if (selector_notice)
                            selector_notice.innerText = DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                        selector_input.value = res.diskPass;
                        selector_click.click();

                    }, 500);
                } else {
                    if (selector_notice) {
                        selector_notice.style.display = 'block';
                        selector_notice.innerText = DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
                    }
                }
            } else {
                console.log('系统错误');
                selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
            }
        });
        // 这里等用户输入
        selector_input.addEventListener('input', (ev) => {
            let value = ev.target.value;
            setPwdValue(disk_type, disk_id, value);
        })
    }
    wait_timer = setInterval(waitSuccess, 1000);

    function waitSuccess() {
        if (getSentValue(disk_type, disk_id))
            clearInterval(wait_timer);//clear
        if (textBody.indexOf(TYY_PRIVATE_TEXT) === -1) {
            clearInterval(wait_timer);//clear
            let val = getPwdValue(disk_type, disk_id) || '';
            if (!getSentValue(disk_type, disk_id)) {
                sendPass(disk_type, disk_id, val, () => {
                    console.log('sent');
                    setSentValue(disk_type, disk_id);
                });
            }
        }
    }


}
// 其他页面
export function OtherPage(config) {

    let { href } = config;

    // Array.prototype.slice.call(document.querySelectorAll(
    //     "a[href*='pan.baidu.com'], a[href*='lanzou'], a[href*='lanzoui.com'], a[href*='lanzous.com'], a[href*='lanzoux.com']"
    // )).forEach(function (link) {
    //     let txt = link.nextSibling && link.nextSibling.nodeValue;
    //     console.log('link', link);
    //     console.log('txt', txt);
    //     parseLink(link)
    //     let linkcode = /码.*?([a-z\d]{4})/i.exec(txt) && RegExp.$1;

    //     if (!linkcode) {
    //         txt = link.parentNode.innerText;
    //         linkcode = /码.*?([a-z\d]{4})/i.exec(txt) && RegExp.$1;
    //     }

    // });

    let linkArr = parsePwd(document.body.innerText);//先分析下密码
    appendLinksDom(linkArr)

    // document.addEventListener('click', (ev) => {
    //     if (ev.target === document.body) return
    //     linkArr = AddLinks(linkArr, parsePwd(ev.target.innerText))
    //     appendLinksDom(linkArr)
    // })



    /* 
    以下代码，参考自：https://greasyfork.org/zh-CN/scripts/18733-%E7%BD%91%E7%9B%98%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7/code
    */
    let CODE_RULE_COMMON = /^([a-z\d]{3,})$/i;
    let MAX_SEARCH_CODE_RANGE = 5;
    //functions...
    let textNodesUnder = function (el) {
        let n, a = [],
            walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        while ((n = walk.nextNode())) {
            if (n.nodeName === '#text')
                a.push(n);
        }
        return a;
    };
    let generalLinkifyText = function (source, eles, index, testReg, validateRule) {
        let count = 0,
            text = source,
            match;
        while ((match = testReg.exec(source))) {
            count++;

            let url = (match[1] || "http://") + match[2];
            let originalText = (match[1] || "") + match[2];
            let code = match[3] || findCodeFromElements(eles, index, validateRule) || "";
            url = url.split('#')[0];
            text = text.replace(originalText, "<a href='" + url + "#" + code + "' target='_blank'>" + url + '</a>');
        }
        return {
            count,
            text
        };
    };
    let findCodeFromElements = function (eles, index, rule) {
        for (let i = 0; i < MAX_SEARCH_CODE_RANGE && i < eles.length; i++) {
            let txt = null
            try {
                txt = eles[i + index].textContent || '';
            }
            catch (e) {
                continue
            }
            let codeReg = /码.*?([a-z\d]+)/gi;
            let codeMatch = codeReg.exec(txt) && RegExp.$1;
            if (!codeMatch) continue;
            let linkTestReg = /(https?:|\.(net|cn|com|gov|cc|me))/gi;
            if (linkTestReg.exec(txt) && linkTestReg.lastIndex <= codeReg.lastIndex) {
                break;
            }
            if (rule.test(codeMatch)) return codeMatch;
        }
        return null;
    };
    let linkify = function () {
        let eles = textNodesUnder(document.body);
        let processor = [];
        for (let m = 0; m < LINKIFY_REG.length; m++) {
            processor.push(
                function (...args) {
                    return generalLinkifyText(...[
                        ...args,
                        LINKIFY_REG[m],
                        CODE_RULE_COMMON
                    ]);
                }
            )
        }
        for (let i = 0; i < eles.length; i++) {
            let ele = eles[i];
            if (ele.parentNode.tagName == 'a' || !ele.textContent) continue;

            let txt = ele.textContent;
            let loopCount = 0;

            for (var action of processor) {
                let {
                    count,
                    text
                } = action(txt, eles, i + 1);
                loopCount += count;
                txt = text;
            }
            if (loopCount > 0) {
                var span = document.createElement("span");
                span.innerHTML = txt;
                ele.parentNode.replaceChild(span, ele);
            }
        }
    };

    linkify()
}
