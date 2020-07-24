
export const TMALL_TITLE_SELECTTOR = '#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-detail-hd > h1 > a'
export const TAOBAO_TITLE_SELECTTOR = [
    '#J_Title > h3', '#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-detail-hd > h1'
]

export const SEARCH_API_URL = 'https://shop.misiai.com/search/[kw]';
export const VIP_VIDEO_API_URL = 'http://jx.misiai.com/[url]';

export const API_DISK_URL = '//api1.lzpan.com/api';

export const API_PARSE_BAIDU_URL = 'http://pan.naifei.cc/?share=1[disk_id]&pwd=[pwd]'


export const KEY_LINKS_DIALOG = '_setting_link_dialog_'




export const NOTICE_TEXT_CLOSE_LINK_DIALOG = '已经关闭啦，再次开启请到脚本支持的网盘页面左侧的设置按钮中开启！';
export const DISK_INFO_START_WITH = '懒盘:';
export const BUTTON_TEXT_COUPON = '搜索优惠券';
export const BUTTON_TEXT_SETTING = '设置';
export const BUTTON_TEXT_HISTORY = '查看历史价格';
export const BUTTON_TEXT_VIP_VIDEO = '跳转解析平台';
export const BUTTON_TEXT_PARSE_BAIDU = '解析高速链接';
export const TYY_PRIVATE_TEXT = '私密分享'


export const SYS_ERROR_NOTICE = '抱歉，系统错误，获取密码失败'
export const QUERY_SUCCESS_NOTICE = '查询密码成功！'
export const PLEASE_INPUT_NOTICE = '查询密码失败，请手动输入！'

export const ACTIVE_LINK_REG = [//激活页面链接的正则表达式
    /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/s[hare]*\/[int?surl=]*[\w-_]{5,25})/ig,
    /((?:https?:\/\/)?(?:\w+\.)?lanzou.?.com\/[\w\-_]{6,13})/ig,
    /((?:https?:\/\/)?cloud\.?189?.cn\/t\/[\w\-_]+)/ig,
];

export const INVALIDATE_LINK_REG = [
    /(被取消了|分享文件已过期|已经被删除|分享内容可能因为|啊哦，你来晚了|取消分享了|外链不存在)/ig,
]

export const PARSE_PWD_REG = [
    /(https?:\/\/(?:pan|yun|eyun)\.baidu\.com\/s[hare]*\/[int?surl=]*[\w-_]{8,25})[&\w=]*[^\w]*(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{4})*/igm,
    /(https?:\/\/(?:\w+)?\.?lanzou.?\.com\/[\w-_]{6,13})\/?[&\w=]*[^\w]*(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{4})*/igm,
    /(https?:\/\/cloud.189.cn\/t\/[\w\-_]+)\/?[^\w]*[(（:：]*([\w]+)*[)）]*/igm,
]
export const URL_REG = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;

export const IS_DISK_URL = /(pan\.baidu|lanzou|189)/ig;


export const BAIDU_ELEMENT = {
    input: 'form input',
    notice: '.verify-form > div',
    click: '.input-area > div > a > span'
}
export const TY_ELEMENT = {
    input: '#code_txt',
    notice: 'body > div.content > div.error-content > div > div.file-info.get-file-box > div.code-panel > div.error-tips.visit_error',
    click: 'body > div.content div > div.file-info.get-file-box > div.code-panel > div.access-code-item > a'
}

export const LZ_PWD_EXITS_ELEMENT = [
    '#pwdload', '#passwddiv'
]
export const LZ_ELEMENT = [
    {//type1

        input: 'input#pwd',
        notice: '#pwderr',
        click: 'input#sub'
    },
    {//type2

        input: 'input#pwd',
        notice: '#info',
        click: '#passwddiv > div > div.passwddiv-input > div'
    }
]