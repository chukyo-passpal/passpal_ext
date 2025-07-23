import type { OffscreenMessage, IframeMessage, MessageHandler, AuthResponse } from "../types/auth";

// このURLは公開サイトを指す必要があります
const _URL: string = "https://chukyo-passpal.app/extensions/auth";
const iframe: HTMLIFrameElement = document.createElement("iframe");
iframe.src = _URL;
document.documentElement.appendChild(iframe);

const handleChromeMessages: MessageHandler = (message: OffscreenMessage, _sender, sendResponse) => {
    // 拡張機能がメッセージを送信する理由は数多くあるため、
    // offscreenドキュメント宛てでないものは除外する必要があります。
    if (message.target !== "offscreen") {
        return false;
    }

    function handleIframeMessage({ data }: MessageEvent): void {
        try {
            if (typeof data === "string" && data.startsWith("!_{")) {
                // Firebaseライブラリの他の部分はpostMessageを使ってメッセージを送信します。
                // この文脈では関心がないので、早期にreturnします。
                return;
            }

            const parsedData: AuthResponse = typeof data === "string" ? JSON.parse(data) : data;
            self.removeEventListener("message", handleIframeMessage);

            sendResponse(parsedData);
        } catch (e: unknown) {
            const error = e as Error;
            console.log(`json parse failed - ${error.message}`);
        }
    }

    globalThis.addEventListener("message", handleIframeMessage, false);

    // iframeされたドキュメント内で認証フローを初期化します。
    // メッセージが正常に配信されるためには、2番目の引数（targetOrigin）を設定する必要があります。
    const initMessage: IframeMessage = {
        initAuth: true,
        loginHint: message.loginHint,
    };

    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(initMessage, new URL(_URL).origin);
    }

    return true;
};

chrome.runtime.onMessage.addListener(handleChromeMessages);
