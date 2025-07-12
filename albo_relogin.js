// @name         alboログアウト確認後、自動でリダイレクト
// @description  「ログアウトしました。」のメッセージを確認し、ログインページに移動します。
// @match        https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/*

(function() {
    'use strict';
    // 移動先のURL
    const redirectUrl = 'https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/UnLoginControl';

    // 「ログアウトしました。」のメッセージがあるかチェック
    const messageExists = document.querySelector('#contents_main .message.information .message_bg p')?.textContent.includes('ログアウトしました。');

    if (messageExists) {
        // 指定されたURLにページを移動させる
        window.location.href = redirectUrl;
    }
})();