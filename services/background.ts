import { auth } from "../firebase/firebase";
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
        throw error;
    } finally {
        closeOffscreenDocument();
    }
});

onMessage("checkFirebaseAuth", async () => {
    await auth.authStateReady();
    const user = auth.currentUser;
    return user ? true : false;
});
