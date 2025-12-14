import { FirebaseError } from "firebase/app";

import type { FirebaseAuthReponse } from "../types/firebaseTypes";
import { onMessage } from "../utils/messaging";

const AUTH_URL = "https://chukyo-passpal.app/extensions/auth";
const AUTH_ORIGIN = new URL(AUTH_URL).origin;
const IFRAME_TIMEOUT = 10000;
const IFRAME_DELAY = 100;

let iframe: HTMLIFrameElement | null = null;

async function createIframe(): Promise<void> {
    iframe = document.createElement("iframe");
    iframe.src = AUTH_URL;
    iframe.style.display = "none";
    document.documentElement.appendChild(iframe);

    return new Promise((resolve, reject) => {
        if (!iframe) return resolve();

        iframe.onload = () => resolve();
        iframe.onerror = () => reject(new FirebaseError("auth/iframe-load-error", "Failed to load auth iframe"));
        setTimeout(() => reject(new FirebaseError("auth/iframe-load-timeout", "Iframe load timeout")), IFRAME_TIMEOUT);
    });
}

function removeIframe(): void {
    iframe?.remove();
    iframe = null;
}

function isAuthMessage(event: MessageEvent): boolean {
    if (event.origin !== AUTH_ORIGIN) return false;
    if (typeof event.data === "string" && event.data.startsWith("!_{")) return false;
    return true;
}

async function waitForAuthResponse(loginHint?: string): Promise<FirebaseAuthReponse> {
    return new Promise((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
            if (!isAuthMessage(event)) return;
            const result = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
            if ((result.code || result.message) && !result.user)
                reject(new FirebaseError(result.code, result.message, result.customData));
            resolve(result as FirebaseAuthReponse);
        };

        window.addEventListener("message", handleMessage);

        setTimeout(() => iframe?.contentWindow?.postMessage({ initAuth: true, loginHint }, AUTH_ORIGIN), IFRAME_DELAY);
    });
}

onMessage("firebaseAuth", async ({ data }) => {
    try {
        // iframeが存在しない場合は作成
        if (!iframe || !document.documentElement.contains(iframe)) await createIframe();
        const result = await waitForAuthResponse(data.loginHint);
        return result;
    } catch (error) {
        console.error("Offscreen Auth Error", error);
        throw error;
    } finally {
        removeIframe();
    }
});
