/**
 * Chrome拡張機能用Shibboleth認証クライアント
 * Content Scriptと連携して認証を行う
 * Cookie管理はChromeに完全に委任
 */

import { AuthProcessError, UnauthorizedError } from "../errors/AuthError";
import { TimeoutError } from "../errors/NetworkError";

export interface Credential {
    enterUrl: string;
    goalUrl: string;
    username: string;
    password: string;
}

const AUTH_TIMEOUT_MS = 60_000; // 60秒（ユーザー操作が必要な場合があるため長め）

/**
 * Chrome拡張機能用Shibboleth認証を実行
 * バックグラウンドスクリプトから呼び出される
 * Content Scriptが自動でログイン情報を入力する
 */
export async function chromeShibbolethAuth(credential: Credential): Promise<void> {
    const { enterUrl, goalUrl } = credential;

    return new Promise<void>((resolve, reject) => {
        let authTabId: number | null = null;
        const timeoutId = setTimeout(async () => {
            if (!resolved) {
                resolved = true;
                await cleanup();
                reject(new TimeoutError());
            }
        }, AUTH_TIMEOUT_MS);

        let resolved = false;

        const cleanup = async () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            chrome.webNavigation.onCompleted.removeListener(navigationListener);
            chrome.webNavigation.onErrorOccurred.removeListener(errorListener);
            chrome.runtime.onMessage.removeListener(messageListener);

            // 認証情報をクリア
            await chrome.storage.session.remove("shibbolethCredentials");

            if (authTabId !== null) {
                chrome.tabs.remove(authTabId).catch(() => {});
            }
        };

        const navigationListener = async (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
            if (details.tabId !== authTabId || details.frameId !== 0) return;
            if (resolved) return;

            const currentUrl = details.url;

            // 認証成功: goalUrlに到達
            if (currentUrl.startsWith(goalUrl)) {
                resolved = true;
                await cleanup();
                resolve();
                return;
            }
        };

        const errorListener = async (details: chrome.webNavigation.WebNavigationFramedErrorCallbackDetails) => {
            if (details.tabId !== authTabId || details.frameId !== 0) return;
            if (resolved) return;

            resolved = true;
            await cleanup();
            reject(new AuthProcessError());
        };

        // Content Scriptからのメッセージを受信
        const messageListener = async (
            message: { type: string; error?: string },
            sender: chrome.runtime.MessageSender
        ) => {
            if (sender.tab?.id !== authTabId) return;
            if (resolved) return;

            if (message.type === "SHIBBOLETH_AUTH_ERROR") {
                resolved = true;
                await cleanup();

                if (message.error === "UNAUTHORIZED") {
                    reject(new UnauthorizedError());
                } else {
                    reject(new AuthProcessError());
                }
            }
        };

        // リスナー登録
        chrome.webNavigation.onCompleted.addListener(navigationListener);
        chrome.webNavigation.onErrorOccurred.addListener(errorListener);
        chrome.runtime.onMessage.addListener(messageListener);

        // 認証用タブを開く
        chrome.tabs
            .create({ url: enterUrl, active: false })
            .then((tab) => {
                if (tab.id) {
                    authTabId = tab.id;
                } else {
                    cleanup();
                    reject(new AuthProcessError());
                }
            })
            .catch(async () => {
                await cleanup();
                reject(new AuthProcessError());
            });
    });
}
