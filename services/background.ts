import type { ChromeExtensionMessage, FirebaseAuthMessage, MessageSender, SendResponse } from "../types/authMessage";
import type { FirebaseAuthResult, FirebaseError } from "../types/firebaseTypes";

const OFFSCREEN_DOCUMENT_PATH: string = "/pages/offscreen.html";

interface ServiceWorkerScope {
    clients: {
        matchAll(): Promise<{ url: string }[]>;
    };
}

let creating: Promise<void> | null = null;

async function hasDocument(): Promise<boolean> {
    if (!("clients" in self)) {
        return false;
    }
    const matchedClients = await (self as unknown as ServiceWorkerScope).clients.matchAll();
    return matchedClients.some((c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH));
}

async function setupOffscreenDocument(path: string): Promise<void> {
    if (!(await hasDocument())) {
        if (creating) {
            await creating;
        } else {
            creating = chrome.offscreen.createDocument({
                url: path,
                reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
                justification: "authentication",
            });
            await creating;
            creating = null;
        }
    }

    // offscreenドキュメントの準備完了を待つ
    await waitForOffscreenReady();
}

async function waitForOffscreenReady(): Promise<void> {
    return new Promise((resolve) => {
        // シンプルに少し待つだけ
        setTimeout(resolve, 1000);
    });
}

function getAuth(loginHint?: string): Promise<FirebaseAuthResult | FirebaseError> {
    return new Promise((resolve, reject) => {
        const message: FirebaseAuthMessage = {
            type: "firebase-auth",
            target: "offscreen",
            loginHint: loginHint,
        };

        // タイムアウト設定（6分）
        const timeoutId = setTimeout(() => {
            reject(new Error("Authentication request timeout"));
        }, 360000);

        void (async () => {
            try {
                const auth = (await chrome.runtime.sendMessage(message)) as FirebaseAuthResult | FirebaseError;
                clearTimeout(timeoutId);

                if (auth && "name" in auth && auth.name === "FirebaseError") {
                    reject(auth as FirebaseError);
                } else {
                    resolve(auth);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                reject(error);
            }
        })();
    });
}

async function firebaseAuth(loginHint: string = ""): Promise<FirebaseAuthResult | FirebaseError> {
    try {
        // offscreenドキュメントを閉じずに再利用
        await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

        const auth = await getAuth(loginHint);
        console.log("User Authenticated", auth);

        // 成功時もoffscreenドキュメントを閉じない
        return auth;
    } catch (error) {
        const err = error as FirebaseError;
        console.error("Authentication failed:", err);
        // エラー時もoffscreenドキュメントを保持
        throw err;
    }
}

const messageHandler = (message: unknown, _sender: MessageSender, _sendResponse: SendResponse) => {
    const msg = message as ChromeExtensionMessage;
    console.log("Received message:", msg.type); // デバッグログ追加

    // 認証リクエスト
    if (msg.type === "sign-in") {
        console.log("Processing sign-in request");
        firebaseAuth(msg.loginHint)
            .then((result) => {
                console.log("Authentication result:", result);
                _sendResponse(result);
            })
            .catch((error) => {
                console.error("Authentication failed:", error);
                _sendResponse(error);
            });
        return true;
    }

    console.log("unknown message type", msg.type);
    return false;
};

chrome.runtime.onMessage.addListener(messageHandler);

// 拡張機能開始時にoffscreenドキュメントを準備
chrome.runtime.onStartup.addListener(() => {
    setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
});

chrome.runtime.onInstalled.addListener(() => {
    setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
});
