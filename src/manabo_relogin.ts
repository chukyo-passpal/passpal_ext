//   manabaのパスワード入力ページからShibboleth認証ページへ自動でリダイレクトします。

export default function manaboRelogin() {
    // ページの読み込みが完了した後に処理を実行
    window.addEventListener("load", function () {
        window.location.href = "https://manabo.cnc.chukyo-u.ac.jp/auth/shibboleth/";
    });
}

manaboRelogin();
