import {
} from './config'

import style from './styles/styles.css'

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
    let leftBar = selector('.left-bar')
    if (leftBar) return leftBar;

    let divDom = document.createElement('div');
    divDom.classList.add('left-bar');
    document.body.appendChild(divDom);
    return divDom;
}


// 插入播放视频的dom
export function appendVipVideoDom(url) {


    let leftDivDom = appendLeftBarDom()

    leftDivDom.appendChild(aDom);
}
