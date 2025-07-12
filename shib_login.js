// @description  Shibbolethログインページで自動的にログインします。
// @match        https://shib.chukyo-u.ac.jp/cloudlink/module.php/core/loginuserpass.php*

(function() {
    'use strict';
    // ここにあなたのユーザー名とパスワードを入力してください
    const USERNAME = "T324036"; // あなたのユーザー名に書き換えてください
    const PASSWORD = "test"; // あなたのパスワードに書き換えてください

    /**
     * ログイン処理を実行します。
     */
    function autoLogin() {
        // エラーメッセージが表示されているか確認
        // エラーメッセージはページ上のどこかに表示されると想定
        if (document.querySelector(".c-message")!==null) {
            return; // エラーがあれば処理を中断
        }

        // フォームの要素を取得
        const usernameInput = document.querySelector("#username");
        const passwordInput = document.querySelector("#password");
        const loginButton = document.querySelector("#login");

        // 必要な要素がすべて揃っているか確認
        if (usernameInput && passwordInput && loginButton) {

            // ユーザー名とパスワードを入力
            usernameInput.value = USERNAME;
            passwordInput.value = PASSWORD;

            // ログインボタンをクリック
            loginButton.click();
        }
    }

    // ページの読み込みが完了したら実行
    autoLogin();

})();
