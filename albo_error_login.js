// @name         500エラーページで自動リダイレクト
// @description  「500 Internal Server Error」のページを検出したら、指定のログインページにリダイレクトします。
// @match        https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/*

(function() {
    'use strict';

    // 移動先のURL）
    const redirectUrl = 'https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/UnLoginControl';

    // h1タグに「Internal Server Error」チェック
    const isErrorPage = document.querySelector('h1')?.textContent.includes('Internal Server Error') ?? false;

    if (isErrorPage) {
        // 条件に一致した場合、指定されたURLにページを移動させる
        window.location.href = redirectUrl;
    }
})();