/**
 * Albo認証リダイレクト処理
 */
import { RedirectManager } from "./utils/redirect";

window.addEventListener("load", async () => {
    // h1タグに「It works!」チェック
    const isHelloPage = document.querySelector("h1")?.textContent.includes("It works!") ?? false;
    // h1タグに「Internal Server Error」チェック
    const isErrorPage = document.querySelector("h1")?.textContent.includes("Internal Server Error") ?? false;
    // 「ログアウト」のメッセージがあるかチェック
    const messageExists = document.querySelector("#contents_main .message.information .message_bg p")?.textContent.includes("ログアウト") ?? false;

    if (isHelloPage || isErrorPage || messageExists) {
        // Alboのログイン画面へリダイレクト
        RedirectManager.redirectToAlboLogin();
    }
});
