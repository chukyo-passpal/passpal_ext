import { onMessage, sendMessage } from "../utils/messaging";

const OFFSCREEN_DOCUMENT_PATH: string = "/pages/offscreen.html";

declare const self: ServiceWorkerGlobalScope;

let creating: Promise<void> | null = null;

async function hasDocument(): Promise<boolean> {
    const matchedClients = await self.clients.matchAll();
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
}

async function closeOffscreenDocument() {
    if (!(await hasDocument())) {
        return;
    }
    await chrome.offscreen.closeDocument();
}

onMessage("signIn", async ({ data }) => {
    try {
        await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

        //offscreenへ認証実行を依頼
        const user = await sendMessage("firebaseAuth", {
            loginHint: data.loginHint,
        });

        // 成功したらoffscreenを閉じる
        await closeOffscreenDocument();

        return user;
    } catch (error) {
        console.error("SignIn Error", error);
        // Chrome extensionのメッセージングでエラーを正しく伝播させるため、
        // エラーオブジェクトを明示的にシリアライズして投げる
        if (error && typeof error === "object" && "code" in error) {
            throw {
                code: (error as { code: string; message: string }).code,
                message: (error as { code: string; message: string }).message,
                name: "FirebaseError",
            };
        }
        throw {
            code: "auth/unknown-error",
            message: "予期しないエラーが発生しました",
            name: "FirebaseError",
        };
    } finally {
        closeOffscreenDocument();
    }
});
