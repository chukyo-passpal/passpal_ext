/**
 * Manabo認証リダイレクト処理
 */

import { SELECTORS, URLS } from "./utils/constants";
import { RedirectManager } from "./utils/redirect";
import { waitForElement } from "./utils/dom";

window.addEventListener("load", async () => {
    // ログアウト画面の時はSSO認証画面へ遷移する
    if (location.href.startsWith(URLS.MANABO_LOGOUTED)) {
        RedirectManager.redirectToManaboAuth();
    }

    // MaNaBo専用のパスワード入力画面だった場合、SSO認証画面へ遷移する
    const passInput = await waitForElement(SELECTORS.MANABO.PASSWORD_INPUT);
    if (passInput) {
        RedirectManager.redirectToManaboAuth();
    }
});
