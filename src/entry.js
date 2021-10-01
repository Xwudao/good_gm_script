let href = location.href; // 完整路径
let hash = location.hash;
let host = location.hostname.replace(/^www\./i, '').toLowerCase();
let config = { href, hash, host };

//引入自己的helper

import {
    baiduPwdPage, baiduIndexPage, OtherPage, lzyPage, tyyPage,
    tmallDetail, taobaoDetail, videoPage, alyPage
} from './helper'
import { exportStyle, } from './func';
import { } from './config';


exportStyle();//先导出样式
/* 
hash: ""
host: "detail.tmall.com"
href: "https://detail.tmall.com/item.htm?s
 */
let regular_express = {
    tmallDetail: /^detail\.tmall\.com$/ig,
    taobaoDetail: /^item\.taobao\.com$/ig,
    youkuVideo: /^https?:\/\/v\.youku\.com\/v_show\/.*/ig,
    qqVideo: /^https?:\/\/v\.qq\.com\/x\/cover\/.*/ig,
    iqyVideo: /^https?:\/\/\w+\.?iqiyi\.com\/v_.*/ig,
    mgVideo: /^https?:\/\/\w+\.?mgtv\.com\/b\//ig,
    leVideo: /^https?:\/\/\w+\.?le\.com\/ptv\/vplay\//ig,
    tudouVideo: /^https?:\/\/video\.tudou\.com\/v\//ig,
    souhuVideo: /^https?:\/\/tv\.sohu\.com\/v\//ig,
    pptvVideo: /^https?:\/\/v\.pptv\.com\/show\//ig,
    mgVideo: /^https?:\/\/\w+\.?miguvideo\.com\/mgs\//ig,


    bdyPwd: /^https?:\/\/pan\.baidu\.com\/share\/init\?surl=.*/ig,
    bdyPage: /^https?:\/\/pan\.baidu\.com\/s\/.*/ig,
    lzyPage: /^https?:\/\/(?:\w+)?\.?lanzou.?\.com\/.*/ig,
    tyyPage: /^https?:\/\/(?:\w+)?\.?189.?\.cn\/.*/ig,
    alyPage: /^https?:\/\/(?:\w+)?\.?aliyundrive\.com\/s\/.*/ig,
}


~(() => {
    console.log(href);
    // 天猫详情页
    if (regular_express.tmallDetail.test(config.host)) {
        console.log('Tmall Detail');
        tmallDetail(config);
        return;
    }

    // 淘宝详情页
    if (regular_express.taobaoDetail.test(config.host)) {
        console.log('taobao Detail');
        taobaoDetail(config);
        return;
    }

    //百度网盘输入密码页面
    if (regular_express.bdyPwd.test(href)) {
        console.log('BDY PWD Page');
        baiduPwdPage(config);
        return;
    }

    // 百度云
    if (regular_express.bdyPage.test(href)) {// 百度网盘正文页面
        console.log('BDY Index Page');
        baiduIndexPage(config);
        return;
    }

    // 蓝奏云
    if (regular_express.lzyPage.test(href)) {// 百度网盘正文页面
        console.log('LZY Index Page');
        lzyPage(config);
        return;
    }

    // 阿里云
    if (regular_express.alyPage.test(href)) {// 百度网盘正文页面
        console.log('ALY Index Page');
        alyPage(config);
        return;
    }
    // 天翼云
    if (regular_express.tyyPage.test(href)) {// 百度网盘正文页面
        console.log('TYY Index Page');
        tyyPage(config);
        return;
    }
    // 解析VIP 视频
    if (regular_express.youkuVideo.test(config.href)
        || regular_express.qqVideo.test(config.href)
        || regular_express.iqyVideo.test(config.href)
        || regular_express.mgVideo.test(config.href)
        || regular_express.leVideo.test(config.href)
        || regular_express.tudouVideo.test(config.href)
        || regular_express.souhuVideo.test(config.href)
        || regular_express.pptvVideo.test(config.href)
        || regular_express.mgVideo.test(config.href)
    ) {
        console.log('vipVideo Detail');
        videoPage(config);
        return;
    }


    console.log('Other Page');
    OtherPage(config);

})();
