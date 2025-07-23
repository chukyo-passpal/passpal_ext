// @name         manabo 自動ログインリダイレクト
// @description  manaboのログインページでパスワード入力欄を検出し、Shibboleth認証ページへ自動でリダイレクトします。
// @match        https://manabo.cnc.chukyo-u.ac.jp*

(async function() {
    'use strict';
    const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
    await sleep(1000);
    // ページ内に "#input-password" というIDを持つ要素が存在するかどうかを確認します。
    const passwordInput = document.querySelector("#input-password");

    if (passwordInput) {
        // Shibboleth認証のURLへページを遷移させます。
        window.location.href = "https://manabo.cnc.chukyo-u.ac.jp/auth/shibboleth/";
    }
})();