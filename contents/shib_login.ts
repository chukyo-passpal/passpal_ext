//  Shibbolethログインページで自動的にログインします。

import { SELECTORS } from "./utils/constants";
import { getSetting, isUserAuthenticated } from "./utils/settings";

window.addEventListener("load", async () => {
    const shibLoginEnabled = await getSetting("shibLoginEnabled");

    if (!shibLoginEnabled) {
        return;
    }

    // 認証状態を確認
    const authenticated = await isUserAuthenticated();
    if (!authenticated) {
        console.log("User not authenticated, skipping auto-login");
        return;
    }

    // 保存された認証情報を取得
    const loginCredentials = await getSetting("loginCredentials");
    if (!loginCredentials || !loginCredentials.studentId || !loginCredentials.password) {
        console.log("No login credentials found, skipping auto-login");
        return;
    }

    const USERNAME = loginCredentials.studentId;
    const PASSWORD = loginCredentials.password;

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
