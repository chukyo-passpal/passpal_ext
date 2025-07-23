// content.js

export default function manaboIconJump() {
    // ページ上のすべてのimg要素を取得
    const images = document.getElementsByTagName("img");

    // 取得したimg要素をループで確認
    for (let i = 0; i < images.length; i++) {
        // src属性が指定されたものと一致するか確認
        if (images[i].src === "https://manabo.cnc.chukyo-u.ac.jp/common/images/manabo_sm.png?2021071501") {
            // 一致した場合、クリックイベントを追加
            images[i].addEventListener("click", function () {
                // 指定されたURLに遷移
                window.location.href = "https://manabo.cnc.chukyo-u.ac.jp/auth/shibboleth/";
            });
            // 該当の画像が見つかったらループを終了
            break;
        }
    }
}

manaboIconJump();
