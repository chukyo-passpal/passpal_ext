/**
 * Albo認証リダイレクト処理
 */
import { MESSAGES, SELECTORS } from "./utils/constants";
import { RedirectManager } from "./utils/redirect";

window.addEventListener("load", async () => {
    // h1タグに「It works!」チェック
    const isHelloPage = document.querySelector(SELECTORS.ALBO.ERROR_TITLE)?.textContent.includes(MESSAGES.ALBO.HELLO_PAGE_TEXT) ?? false;
    // h1タグに「Internal Server Error」チェック
    const isErrorPage = document.querySelector(SELECTORS.ALBO.ERROR_TITLE)?.textContent.includes(MESSAGES.ALBO.INTERNAL_ERROR_TEXT) ?? false;
    // 「ログアウト」のメッセージがあるかチェック
    const messageExists = document.querySelector(SELECTORS.ALBO.LOGOUT_MESSAGE)?.textContent.includes(MESSAGES.ALBO.LOGOUT_TEXT) ?? false;

    if (isHelloPage || isErrorPage || messageExists) {
        // Alboのログイン画面へリダイレクト
        RedirectManager.redirectToAlboLogin();
    }
});
