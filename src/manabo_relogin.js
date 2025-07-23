// @description  manabaのパスワード入力ページからShibboleth認証ページへ自動でリダイレクトします。
// @author       You
// @match        https://manabo.cnc.chukyo-u.ac.jp/close*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ページの読み込みが完了した後に処理を実行
    window.addEventListener('load', function() {

            window.location.href = "https://manabo.cnc.chukyo-u.ac.jp/auth/shibboleth/";
    });
})();