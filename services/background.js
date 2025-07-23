const OFFSCREEN_DOCUMENT_PATH = "/pages/offscreen.html";

// 並行処理の問題を回避するためのグローバルプロミス
let creatingOffscreenDocument;
let creating;

// Chromeは単一のoffscreenDocumentのみを許可します。これはドキュメントが
// 既にアクティブかどうかを示すブール値を返すヘルパー関数です。
async function hasDocument() {
    // サービスワーカーによって制御されているすべてのウィンドウをチェックして、
    // その中の1つが指定されたパスのoffscreenドキュメントかどうかを確認します
    const matchedClients = await clients.matchAll();
    return matchedClients.some((c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH));
}

async function setupOffscreenDocument(path) {
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

async function closeOffscreenDocument() {
    if (!(await hasDocument())) {
        return;
    }
    await chrome.offscreen.closeDocument();
}

function getAuth(loginHint) {
    return new Promise(async (resolve, reject) => {
        const auth = await chrome.runtime.sendMessage({
            type: "firebase-auth",
            target: "offscreen",
            loginHint: loginHint,
        });
        auth?.name !== "FirebaseError" ? resolve(auth) : reject(auth);
    });
}

async function firebaseAuth(loginHint = "") {
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

    const auth = await getAuth(loginHint)
        .then((auth) => {
            console.log("User Authenticated", auth);
            return auth;
        })
        .catch((err) => {
            if (err.code === "auth/operation-not-allowed") {
                console.error(
                    "signInWithPopupを使用するには、Firebase" +
                        "コンソールでOAuthプロバイダーを有効にする必要があります。このサンプル" +
                        "はデフォルトでGoogleを使用します。"
                );
            } else {
                console.error(err);
                return err;
            }
        })
        .finally(closeOffscreenDocument);

    return auth;
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    // メッセージの種類によって処理を分岐
    switch (message.type) {
        case "sign-in":
            return firebaseAuth(message.loginHint);
        default:
            console.log("unknown message type", message.type);
    }
});
