//  Shibbolethログインページで自動的にログインします。

import { SELECTORS } from "./utils/constants";
import { getSetting } from "./utils/settings";

window.addEventListener("load", async () => {
    const shibLoginEnabled = await getSetting('shibLoginEnabled');
    
    if (!shibLoginEnabled) {
        return;
    }

    // TODO: ユーザー名とパスワードを設定する
    const USERNAME = "T324036"; // あなたのユーザー名に書き換えてください
    const PASSWORD = "ZjQY2g3F"; // あなたのパスワードに書き換えてください

    const errorMessage = document.querySelector(SELECTORS.SHIBBOLETH.ERROR_MESSAGE);
    if (errorMessage) {
        // エラーメッセージが表示されている場合は処理を中断
        return;
    }

    // フォームの要素を取得
    const usernameInput = document.querySelector(SELECTORS.SHIBBOLETH.USERNAME) as HTMLInputElement | null;
    const passwordInput = document.querySelector(SELECTORS.SHIBBOLETH.PASSWORD) as HTMLInputElement | null;
    const loginButton = document.querySelector(SELECTORS.SHIBBOLETH.LOGIN_BUTTON) as HTMLButtonElement | null;

    // 必要な要素がすべて揃っているか確認
    if (!usernameInput || !passwordInput || !loginButton) {
        console.error("必要な要素が見つかりません。");
        return;
    }

    // ユーザー名とパスワードを入力
    usernameInput.value = USERNAME;
    passwordInput.value = PASSWORD;

    // ログインボタンをクリック
    loginButton.click();
});
