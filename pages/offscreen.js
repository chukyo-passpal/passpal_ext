// このURLは公開サイトを指す必要があります
const _URL = "https://chukyo-passpal.app/extensions/auth";
const iframe = document.createElement("iframe");
iframe.src = _URL;
document.documentElement.appendChild(iframe);
chrome.runtime.onMessage.addListener(handleChromeMessages);

function handleChromeMessages(message, sender, sendResponse) {
    // 拡張機能がメッセージを送信する理由は数多くあるため、
    // offscreenドキュメント宛てでないものは除外する必要があります。
    if (message.target !== "offscreen") {
        return false;
    }

    function handleIframeMessage({ data }) {
        try {
            if (data.startsWith("!_{")) {
                // Firebaseライブラリの他の部分はpostMessageを使ってメッセージを送信します。
                // この文脈では関心がないので、早期にreturnします。
                return;
            }
            data = JSON.parse(data);
            self.removeEventListener("message", handleIframeMessage);

            sendResponse(data);
        } catch (e) {
            console.log(`json parse failed - ${e.message}`);
        }
    }

    globalThis.addEventListener("message", handleIframeMessage, false);

    // iframeされたドキュメント内で認証フローを初期化します。
    // メッセージが正常に配信されるためには、2番目の引数（targetOrigin）を設定する必要があります。
    iframe.contentWindow.postMessage({ initAuth: true, loginHint: message.loginHint }, new URL(_URL).origin);
    return true;
}
