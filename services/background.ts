import type { SignInMessage, FirebaseAuthMessage, AuthResponse, FirebaseError, MessageHandler } from "../types/auth";

const OFFSCREEN_DOCUMENT_PATH: string = "/pages/offscreen.html";

// 並行処理の問題を回避するためのグローバルプロミス
let creating: Promise<void> | null = null;

// Chromeは単一のoffscreenDocumentのみを許可します。これはドキュメントが
// 既にアクティブかどうかを示すブール値を返すヘルパー関数です。
async function hasDocument(): Promise<boolean> {
    // サービスワーカーによって制御されているすべてのウィンドウをチェックして、
    // その中の1つが指定されたパスのoffscreenドキュメントかどうかを確認します
    if (!("clients" in self)) {
        return false;
    }
    const matchedClients = await (self as any).clients.matchAll();
    return matchedClients.some((c: any) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH));
}

async function setupOffscreenDocument(path: string): Promise<void> {
    // ドキュメントがない場合、既にセットアップされているのでスキップできます
    if (!(await hasDocument())) {
        // offscreenドキュメントを作成
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
}

async function closeOffscreenDocument(): Promise<void> {
    if (!(await hasDocument())) {
        return;
    }
    await chrome.offscreen.closeDocument();
}

function getAuth(loginHint?: string): Promise<AuthResponse> {
    return new Promise(async (resolve, reject) => {
        const message: FirebaseAuthMessage = {
            type: "firebase-auth",
            target: "offscreen",
            loginHint: loginHint,
        };

        const auth = (await chrome.runtime.sendMessage(message)) as AuthResponse;

        if (auth && "name" in auth && auth.name === "FirebaseError") {
            reject(auth as FirebaseError);
        } else {
            resolve(auth);
        }
    });
}

async function firebaseAuth(loginHint: string = ""): Promise<AuthResponse | FirebaseError | void> {
    await closeOffscreenDocument();
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
    try {
        const auth = await getAuth(loginHint);
        console.log("User Authenticated", auth);
        await closeOffscreenDocument();
        return auth;
    } catch (error) {
        const err = error as FirebaseError;
        console.error("Authentication failed:", err);
        await closeOffscreenDocument();
    }
}

const messageHandler: MessageHandler = (message: SignInMessage, _sender, _sendResponse) => {
    // メッセージの種類によって処理を分岐
    switch (message.type) {
        case "sign-in":
            firebaseAuth(message.loginHint)
                .then((result) => {
                    console.log("Authentication result:", result);
                    _sendResponse(result);
                })
                .catch((error) => {
                    console.error("Authentication failed:", error);
                    _sendResponse(error);
                });
            return true; // 非同期レスポンスを示す
        default:
            console.log("unknown message type", (message as any).type);
            return false;
    }
};

chrome.runtime.onMessage.addListener(messageHandler);
