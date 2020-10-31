import {
    API_DISK_URL, SEARCH_API_URL, API_TAOKE_COUPON_URL,
    PARSE_PWD_REG, BUTTON_TEXT_VIP_VIDEO, BUTTON_TEXT_PARSE_BAIDU,
    KEY_LINKS_DIALOG, NOTICE_TEXT_CLOSE_LINK_DIALOG, BUTTON_TEXT_FIND_COUPON,
    URL_REG, API_PARSE_BAIDU_URL, VIP_VIDEO_API_URL, BUTTON_TEXT_SETTING, BUTTON_TEXT_HISTORY, BUTTON_TEXT_COUPON, HISTORY_PRICE_URL
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

// 添加设置按钮
export function appendSettingDom() {
    let aDom = document.createElement('a');
    aDom.innerText = BUTTON_TEXT_SETTING;
    aDom.setAttribute('href', '#');
    aDom.classList.add('kuan-link');
    aDom.classList.add('setting');

    let leftDivDom = appendLeftBarDom()

    leftDivDom.appendChild(aDom);
    // dialog

    let t_dialogDom = `
    <div class="kuan-wrapper">
        <div class="card">
            <div class="heading">懒盘脚本设置<iframe src="https://ghbtns.com/github-btn.html?user=Xwudao&repo=good_gm_script&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 108px;padding-left:5px;box-sizing: border-box;margin-bottom: -5px;display:unset !important;"></iframe> <span class="close">&times;</span></div>
                <div class="body">
                    <p>1、清空缓存 （清空之前缓存的提取码等信息）[缓存：<span class="cache-count"></span> ] <button class="clear-cache">清空</button></p>
                    <p>2、查找缓存[缓存的提取码] <input type="text" class="key" placeholder="输入网盘链接"> <button
                        class="find">查找</button></p>
                    <p>3、开启页面网盘链接展示框：<button class="btn_link">开启/关闭</button>，当前状态：<span class="link_status"></span></p>
                </div>
        </div>
    </div>`;
    let dialogDom = parseDom(t_dialogDom);
    document.body.appendChild(dialogDom);

    let lists = getVlues();
    // console.log(lists);

    let oWrapper = dialogDom;
    // let oWrapper = document.querySelector('.kuan-wrapper');
    let oCacheCount = oWrapper.querySelector('.kuan-wrapper .cache-count');
    let oClose = oWrapper.querySelector('.kuan-wrapper .close');
    let oClearCache = oWrapper.querySelector('.kuan-wrapper .clear-cache');
    let oInputKey = oWrapper.querySelector('.kuan-wrapper .key');
    let oFind = oWrapper.querySelector('.kuan-wrapper .find');
    let oSpanLinkStatus = oWrapper.querySelector('.kuan-wrapper .link_status');
    let oBtnLink = oWrapper.querySelector('.kuan-wrapper .btn_link');//页面链接展示控制
    // console.log(oClose);
    oCacheCount.innerText = lists.length;

    // 展示页面链接按钮
    oSpanLinkStatus.innerText = getValue(KEY_LINKS_DIALOG, 'true') === 'true' ? '开启' : '关闭';
    oBtnLink.addEventListener('click', () => {
        let st = getValue(KEY_LINKS_DIALOG, 'true')
        let newSt = st === 'true' ? 'false' : 'true';
        oSpanLinkStatus.innerText = newSt === 'true' ? '开启' : '关闭';
        setValue(KEY_LINKS_DIALOG, newSt);
    })

    oFind.addEventListener('click', () => {
        if (oInputKey.value === '' || !oInputKey.value) {
            alert('请输入网盘链接')
            return;
        }
        let [disk_type, disk_id] = getDiskIdAndType(oInputKey.value);
        if (!disk_type || !disk_id) {
            alert('请输入准确的网盘链接');
            return;
        }
        let val = getPwdValue(disk_type, disk_id);
        if (!val) {
            alert('抱歉，未在缓存中找到提取码');
            return;
        }
        oInputKey.value = '找到的提取码：' + val;
    })

    aDom.addEventListener('click', () => {
        oWrapper.style.display = 'flex';
    });

    oClose.addEventListener('click', () => {
        oWrapper.style.display = 'none';
    })

    oClearCache.addEventListener('click', () => {
        lists.forEach(item => {
            if (item.indexOf('setting') === -1)
                delValue(item);
        });
        oCacheCount.innerText = getValues().length;
    })






}



function parseDom(arg) {
    let objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.firstElementChild;
};

// 添加页面链接汇总dom
export function appendLinksDom(linksArr) {
    if (linksArr.length <= 0) return;// 没有东西，就不要创建了
    if (document.querySelector('.kuan-links-wrapper')) return;// 已经有了
    let open = getValue(KEY_LINKS_DIALOG, 'true')
    if (open !== 'true') return;
    let dom = `
    <div class="kuan-links-wrapper">
        <div class="kuan-title">
            <span>页面链接</span>
            <span class="kuan-notice">（拖拽移动，点击展开折叠）</span>
            <span class="kuan-close">&times;</span>
        </div>
        <div class="kuan-links">
            
        </div>
    </div>`;
    let linksDom = parseDom(dom);

    let oTitle = linksDom.querySelector('.kuan-title');
    let oLinks = linksDom.querySelector('.kuan-links');
    let oClose = linksDom.querySelector('.kuan-close');
    let oWrapper = linksDom;
    // console.log(oTitle, oLinks, oWrapper);


    linksArr.forEach((item, i) => {
        console.log(i);
        let { link, pwd } = item;
        let linkDom = `<div class="item"><em>[${i + 1}]</em><a class="kuan-link" href="${link}" target="_blank">${link}</a><span class="pwd">${pwd}</span></div>`;
        oLinks.appendChild(parseDom(linkDom));
    });

    document.body.appendChild(oWrapper);
    // 折叠展开
    oTitle.addEventListener('click', clickFun);

    let x = 0, y = 0, l = 0, t = 0;
    let key = false;//设置了一个标志 false为点击事件 ture为鼠标移动事件
    let firstTime = 0;
    let lastTime = 0;
    oTitle.addEventListener('mousedown', (e) => {
        firstTime = new Date().getTime();
        x = e.clientX;
        y = e.clientY;
        //获取左部和顶部的偏移量
        l = oWrapper.offsetLeft;
        t = oWrapper.offsetTop;
        //开关打开
        console.log('x', x, 'y', y);
        console.log(l, t);
        console.log('mouseDown');
        oTitle.style.cursor = 'move';
        window.addEventListener('mousemove', moveFunc)

    });
    oTitle.addEventListener('mouseup', () => {
        lastTime = new Date().getTime();
        if ((lastTime - firstTime) < 200) {
            key = true;
        }
        console.log('mouseup');
        oTitle.style.cursor = 'pointer';
        window.removeEventListener('mousemove', moveFunc);
    })
    function clickFun(ev) {
        if (ev.target === oClose) {
            setValue(KEY_LINKS_DIALOG, 'false');
            alert(NOTICE_TEXT_CLOSE_LINK_DIALOG);
            location.reload();
            return;
        }
        if (key) {
            oTitle.classList.toggle('fold');
            oLinks.classList.toggle('fold');
            key = false;
        }
    }
    function moveFunc(e) {
        let nx = e.clientX;
        let ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        let nl = nx - (x - l);
        let nt = ny - (y - t);
        oWrapper.style.left = nl + 'px';
        oWrapper.style.top = nt + 'px';
    }

}

export function parseTitle(title) {
    return title.replace(/^【.*】/ig, '');
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

// 插入历史价格
export function appendHistoryDom(url) {
    let aDom = document.createElement('a');
    aDom.setAttribute('target', '_blank');
    aDom.innerText = BUTTON_TEXT_HISTORY;


    aDom.setAttribute('href', getHistoryUrl(url));
    aDom.classList.add('kuan-link');
    aDom.classList.add('history');

    let leftDivDom = appendLeftBarDom()

    leftDivDom.appendChild(aDom);
}

//插入优惠券二维码dom

export function appendCouponQrCode(id) {
    getCouponInfo(id, (data) => {
        if (!data) return;
        let amount = data.coupon_amount;
        let coupon_url = data.coupon_share_url;
        // console.log('data: ', data);

        if (data && coupon_url) {
            let aDom = document.createElement('a');
            aDom.setAttribute('target', '_blank');
            aDom.innerText = BUTTON_TEXT_FIND_COUPON;
            aDom.setAttribute('href', coupon_url);
            aDom.classList.add('kuan-link');
            aDom.classList.add('kuan-coupon');

            let leftDivDom = appendLeftBarDom()

            leftDivDom.appendChild(aDom);
        }

    });
}

// 构造历史价格优惠券
export function getHistoryUrl(url) {
    if (typeof url !== 'string') return url;
    let hUrl = HISTORY_PRICE_URL.replace('[url]', encodeURIComponent(url))
    return hUrl
    // if (url.indexOf('detail.tmall') !== -1) {
    //     return url.replace('tmall', 'tmallasd')
    // }
    // if (url.indexOf('item.taobao') !== -1) {
    //     return url.replace('taobao', 'taobaoasd')
    // }
    // return url;
}

// 插入优惠券节点
export function appendCouponDom(title) {

    let aDom = document.createElement('a');
    aDom.setAttribute('target', '_blank');
    aDom.innerText = BUTTON_TEXT_COUPON;
    aDom.setAttribute('href', SEARCH_API_URL.replace('[kw]', encodeURIComponent(title)));
    aDom.classList.add('kuan-link');

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


// gm xml http request
export function req(url, met, data, onload, onerr) {

    GM_xmlhttpRequest({
        method: met.toUpperCase(),
        url: url,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: onload,
        onerror: onerr
    })
}

export function getPass(disk_type, disk_id, callBack) {
    let data = 'disk_id=' + disk_id + '&disk_type=' + disk_type;
    let pwd = getPwdValue(disk_type, disk_id)
    // if (pwd) {//本地密码
    //     callBack({ diskPass: pwd, from: 'local' }, 'success');
    //     return;
    // }

    req(API_DISK_URL + '?' + data, 'get', null, (r) => {
        let res = JSON.parse(r.responseText)
        if (res && res.code === 200 && res.data.disk_pass !== '') {
            callBack({ diskPass: res.data.disk_pass, from: 'remote' }, 'success');//用远程的
        } else {
            callBack({ diskPass: pwd, from: 'local' }, 'success');//用本地的
        }
    }, null)

    // return $.post(API_DISK_URL + '/pass/get', data, (res, status) => {
    //     if (res && res.code === 200 && res.data.disk_pass !== '') {
    //         callBack(res, status);//用远程的
    //     } else {
    //         callBack({ diskPass: pwd, from: 'local' }, 'success');//用本地的
    //     }
    // }, 'json');
}
export function getCouponInfo(id, callBack) {
    $.get(API_TAOKE_COUPON_URL.replace('[id]', id), (res, status) => {
        if (callBack)
            callBack(res.data);
    }, 'json');
}

export function sendPass(disk_type, disk_id, local_pass, callBack) {
    if (disk_type === undefined || disk_id === undefined) return;
    let local_compress_pass = getCompressValue(disk_type, disk_id);
    // let data = {
    //     disk_id,
    //     disk_type,
    //     disk_info: local_compress_pass
    // }
    let data = 'disk_id=' + disk_id + '&disk_type=' + disk_type + '&disk_info=' + local_compress_pass;
    // let data = 'disk_id=' + disk_id + '&disk_type=' + disk_type + '&disk_state=1' + '&disk_pass=' + local_pass + '&file_pass=' + local_compress_pass;

    // return $.post(API_DISK_URL + '/pass/send', data, callBack);
    req(API_DISK_URL, 'post', data, (res) => {
        GM_log('sent')
        // GM_log('send: ', res)
    }, null)
}

export function sendInvalidate(disk_type, disk_id) {
    if (disk_type === undefined || disk_id === undefined) return;
    // let data = 'disk_state=0&disk_id=' + disk_id + '&disk_type=' + disk_type;
    req(API_DISK_URL + '/invalid/' + disk_type + '/' + disk_id, 'get', null, (res) => {
        GM_log('sent invalid')
    })

    // return $.post(API_DISK_URL + '/pass/send', data, callBack);
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

export function getValue(key, defaultValue = '') {
    return GM_getValue(key, defaultValue);
}
export function getVlues() {
    return GM_listValues();
}
export function delValue(key) {
    GM_deleteValue(key);
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
    let linksArr = [];
    for (let i = 0; i < PARSE_PWD_REG.length; i++) {
        let res = matchAll(html, PARSE_PWD_REG[i]);
        for (let j = 0; j < res.length; j++) {
            if (res[j].length >= 3 && res[j][2] !== undefined) {
                let [disk_type, disk_id] = getDiskIdAndType(res[j][1]);
                setCompressValue(disk_type, disk_id, getCompressPass());//密码
                console.log('find pwd: ', disk_id, '===>>', res[j][2]);
                setPwdValue(disk_type, disk_id, res[j][2]);
            }

            linksArr.push({ link: res[j][1], pwd: res[j][2] || '' });
        }
    }
    appendLinksDom(linksArr);//添加所有链接的节点
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

    // console.log(html);


    while ((exec_res = reg.exec(html))) {
        if (i++ > 100) break;

        console.log('exec_res', exec_res);
        let h = html.substring(exec_res.index - 1, exec_res.index + exec_res[1].length + 1)
        // console.log('h', h);

        if (exec_res && exec_res[1]) {
            if (!/^[='"\/]/ig.test(exec_res[1]) && html.split(exec_res[1]).length - 1 < 2) {
                console.log('can do && no link');
                isMatch = true;

                if (exec_res[1].indexOf('http') === -1) {
                    newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" class="active-link" href="http://${exec_res[1]}">${exec_res[1]}</a>`);
                } else {
                    newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" class="active-link" href="${exec_res[1]}">${exec_res[1]}</a>`);
                }

                newHtml = newHtml.replace(/www(\.lanzous\.com)/ig, 'pan$1');//将www替换为pan
            }
        }



        // ===========以下为旧版本的写法
        // let start = html.substring(0, exec_res.index).slice(-8);
        // if (!/href=['"]?/ig.test(start) && !/['"]?>$/ig.test(start)) {

        //     if (exec_res && exec_res[1]) {
        //         isMatch = true;
        //         if (exec_res[1].indexOf('http') === -1) {
        //             newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" href="http://${exec_res[1]}" class="active-link">${exec_res[1]}</a>`);
        //         } else {
        //             newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" href="${exec_res[1]}" class="active-link">${exec_res[1]}</a>`);
        //         }

        //         newHtml = newHtml.replace(/www(\.lanzous\.com)/ig, 'pan$1');//将www替换为pan
        //     }
        // }

    }

    return [isMatch, newHtml];
}