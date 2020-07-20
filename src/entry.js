let href = location.href; // 完整路径
let hash = location.hash;
let host = location.hostname.replace(/^www\./i, '').toLowerCase();
let config = { href, hash, host };

//引入自己的helper

import { } from './helper'
import { exportStyle } from './func';



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
    iqyVideo: /^https?:\/\/\w+\.iqiyi\.com\/v_.*/ig,
    mgVideo: /^https?:\/\/\w+\.mgtv\.com\/b\//ig,
}
