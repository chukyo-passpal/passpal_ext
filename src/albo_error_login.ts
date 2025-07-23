// 500エラーページで自動リダイレクト
//  「500 Internal Server Error」のページを検出したら、指定のログインページにリダイレクトします。

export default function alboErrorLogin() {
    // 移動先のURL
    const redirectUrl = "https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/UnLoginControl";

    // h1タグに「Internal Server Error」チェック
    const isErrorPage = document.querySelector("h1")?.textContent.includes("Internal Server Error") ?? false;

    if (isErrorPage) {
        // 条件に一致した場合、指定されたURLにページを移動させる
        window.location.href = redirectUrl;
    }
}

alboErrorLogin();
