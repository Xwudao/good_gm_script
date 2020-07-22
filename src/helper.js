import {
    INVALIDATE_LINK_REG,
    BAIDU_ELEMENT, DISK_INFO_START_WITH, LZ_ELEMENT, VIP_VIDEO_API_URL,
    ACTIVE_LINK_REG, URL_REG, LZ_PWD_EXITS_ELEMENT, IS_DISK_URL, TY_ELEMENT,
    TYY_PRIVATE_TEXT, SYS_ERROR_NOTICE, QUERY_SUCCESS_NOTICE, PLEASE_INPUT_NOTICE,
} from './config'
// import { encode } from 'js-base64';
// const base64url = require('base64-url')
import {
    selector, getPass, getDiskIdAndType, sendPass, appendVipVideoDom,
    setValue, getValue, setPwdValue, getPwdValue, getSentValue, setSentValue,
    mactchReplaceHtml, parsePwd, sendInvalidate, activeAnyLink, parseTitle,
    appendBaiduParseDom, appendSettingDom, appendCouponDom, appendHistoryDom,
} from './func'


// 天猫详情页操作
export function tmallDetail(config) {
    let { href } = config;
    let title = document.title.split('-')[0] || '';
    if (!title) return;
    console.log(title);
    appendCouponDom(parseTitle(title));
    appendHistoryDom(href);

}

// 淘宝详情页操作
export function taobaoDetail(config) {
    let { href } = config;
    let title = document.title.split('-')[0] || '';
    if (!title) return;
    console.log(title);

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


    // 检测是否已失效
    for (let i = 0; i < INVALIDATE_LINK_REG.length; i++) {
        let reg = INVALIDATE_LINK_REG[i];
        if (reg.test(document.body.innerText)) {
            console.log('detected invalid page');
            sendInvalidate(disk_type, disk_id);
            return;//已失效，不往下进行了；
        }
    }

    let [disk_type, disk_id] = getDiskIdAndType(href);

    // 左侧按钮，跳转解析
    appendBaiduParseDom(disk_id, getPwdValue(disk_type, disk_id));
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

    // 检测是否已失效
    for (let i = 0; i < INVALIDATE_LINK_REG.length; i++) {
        let reg = INVALIDATE_LINK_REG[i];
        if (reg.test(document.body.innerText)) {
            console.log('detected invalid page');
            sendInvalidate(disk_type, disk_id);
            return;//已失效，不往下进行了；
        }
    }

    let [disk_type, disk_id] = getDiskIdAndType(href);

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


    parsePwd(document.body.innerText);//先分析下密码

    //点击激活链接
    document.body.addEventListener('click', (ev) => {
        if (ev.target !== document.body) {//不是点击的body
            let html = ev.target.innerHTML;
            console.log('click html', html);
            // console.log('inner html', html);
            // console.log('html', typeof ev.target);
            parsePwd(ev.target.innerText);//顺带要获取下密码

            if (URL_REG.test(html)) {//匹配到了纯网址点击

                // if (!IS_DISK_URL.test(html)) {
                //     ev.target.innerHTML = activeAnyLink(html);
                //     return;//就不再往下执行了，因为不是网盘地址
                // }
                // let body = document.body.innerHTML
                // if (body.split(html).length - 1 < 2) {
                //     console.log('loop active');
                //     loopToActive(html, ev, true);
                // } else {
                //     return;
                // }

                let l = html.length * 3;
                let body = document.body.innerHTML
                let r = new RegExp(html, 'ig').exec(body)
                if (r) {
                    let cut_body = body.substring(r.index - l, r.index + l);
                    if (cut_body.split(html).length - 1 < 2) {
                        console.log('loop active');
                        loopToActive(html, ev, true);
                    } else {
                        return;
                    }
                }

            }
            loopToActive(html, ev);

        }
    });

    // 通过正则循环激活链接
    function loopToActive(html, ev, tag = false) {
        for (let i = 0; i < ACTIVE_LINK_REG.length; i++) {
            let [isMatch, newHtml] = mactchReplaceHtml(html, ACTIVE_LINK_REG[i], tag);
            if (isMatch) {
                ev.target.innerHTML = newHtml;
            }
        }
    }


}