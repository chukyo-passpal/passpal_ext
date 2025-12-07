import type { MessageHandler, OffscreenMessage, IframeMessage } from "../types/authMessage";
import type { FirebaseAuthResult, FirebaseError } from "../types/firebaseTypes";

const _URL: string = "https://chukyo-passpal.app/extensions/auth";
let iframe: HTMLIFrameElement;
let isIframeReady = false;

function createIframe(): Promise<void> {
    return new Promise((resolve) => {
        iframe = document.createElement("iframe");
        iframe.src = _URL;
        iframe.style.display = "none";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        iframe.onload = () => {
            console.log("Iframe loaded successfully");
            isIframeReady = true;
            resolve();
        };

        iframe.onerror = (error) => {
            console.error("Iframe failed to load:", error);
            isIframeReady = false;
            resolve(); // エラーでも続行
        };

        document.documentElement.appendChild(iframe);

        // 追加の読み込み確認
        setTimeout(() => {
            if (!isIframeReady) {
                console.log("Iframe loading timeout, assuming ready");
                isIframeReady = true;
                resolve();
            }
        }, 10000);
    });
}

const handleChromeMessages: MessageHandler = (message: OffscreenMessage, _sender, sendResponse) => {
    if (message.target !== "offscreen") {
        return false;
    }

    // iframeの準備ができていない場合は待つ
    if (!isIframeReady) {
        console.log("Iframe not ready, waiting...");
        setTimeout(() => {
            handleChromeMessages(message, _sender, sendResponse);
        }, 500);
        return true;
    }

    const messageListener = ({ data, origin }: MessageEvent): void => {
        console.log("Received message from iframe:", { data, origin });

        try {
            if (typeof data === "string" && data.startsWith("!_{")) {
                console.log("Ignoring Firebase internal message");
                return;
            }

            const parsedData: FirebaseAuthResult | FirebaseError = typeof data === "string" ? JSON.parse(data) : data;
            console.log("Parsed auth response:", parsedData);

            cleanup();
            sendResponse(parsedData);
        } catch (e: unknown) {
            const error = e as Error;
            console.error(`JSON parse failed - ${error.message}`, data);
            // パースエラーでも即座に終了せず、他のメッセージを待つ
        }
    };

    // タイムアウト設定（5分）
    const timeoutId = setTimeout(() => {
        console.log("Authentication timeout reached");
        cleanup();
        sendResponse({ error: "Authentication timeout - please try again" });
    }, 300000);

    function cleanup() {
        self.removeEventListener("message", messageListener);
        clearTimeout(timeoutId);
    }

    globalThis.addEventListener("message", messageListener, false);

    const initMessage: IframeMessage = {
        initAuth: true,
        loginHint: message.loginHint,
    };

    if (iframe && iframe.contentWindow) {
        console.log("Sending message to iframe");
        iframe.contentWindow.postMessage(initMessage, new URL(_URL).origin);
    } else {
        cleanup();
        sendResponse({ error: "Iframe not available" });
    }

    return true;
};

// 初期化
(async () => {
    console.log("Initializing offscreen document...");
    await createIframe();
    console.log("Offscreen document initialized and ready");
})();

chrome.runtime.onMessage.addListener(handleChromeMessages);
