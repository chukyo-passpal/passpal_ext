/**
 * Cubicsプロバイダー
 * Chrome拡張機能向けに実装
 * Cookie管理はChromeに委任
 */

import { CUBICS_URLS } from "../../../utils/urls";
import { httpClient } from "../../clients/httpClient";
import { ExpiredSessionError } from "../../errors/AuthError";
import { IntegratedAbstractChukyoProvider, type AbstractChukyoProvider } from "./abstractChukyoProvider";

type CUService = "manabo" | "albo" | "cubics";

export interface CubicsProvider extends AbstractChukyoProvider {
    /**
     * CubicsポータルにGETリクエストを送り、必要に応じて再認証を実行します。
     */
    get(path: string): Promise<string>;
}

export class IntegratedCubicsProvider extends IntegratedAbstractChukyoProvider implements CubicsProvider {
    protected baseUrl = CUBICS_URLS.base;
    protected authEnterPath = "/unias/UnSSOLoginControl2";
    protected authGoalPath = "/unias/UnSSOLoginControl2";
    protected serviceName: CUService = "cubics";

    protected retryAuthCount = 3;
    protected retryAuthDelayMs = 200;
    protected retryAuthDelayRandomMs = 300;

    public async get(path: string): Promise<string> {
        for (let attempt = 0; attempt <= this.retryAuthCount; attempt++) {
            // 認証を確保
            await this.ensureAuthenticated();

            const response = await httpClient(`${this.baseUrl}${path}`, {
                clientMode: "portal",
                method: "GET",
                credentials: "include", // Chromeが自動でCookieを付与
                headers: {
                    "Accept-Language": "ja",
                },
            });

            const responseText = await response.text();
            if (this.isSessionValid(response, responseText)) {
                return responseText;
            }

            // セッションが無効なら再認証を試みる
            console.warn(`Cubics session expired. Attempting re-fetch (${attempt + 1}/${this.retryAuthCount})`);
            this.clearAuthState();
            await this.waitForRetryDelay();
        }
        throw new ExpiredSessionError();
    }

    /**
     * 再認証試行間にランダムな遅延を挿入します。
     */
    private async waitForRetryDelay(): Promise<void> {
        const baseDelay = this.retryAuthDelayMs;
        const randomDelay = Math.floor(Math.random() * this.retryAuthDelayRandomMs);
        const totalDelay = baseDelay + randomDelay;
        return new Promise((resolve) => setTimeout(resolve, totalDelay));
    }

    /**
     * レスポンスからセッションが有効かどうかを判定します。
     */
    private isSessionValid(res: Response, responseText: string): boolean {
        const invalidTitles = ["<title>Missing cookie</title>", "<title>クッキーが見つかりません</title>"];
        // リダイレクト先のURLがベースURLと異なる場合、セッションが無効と判断
        if (!res.url.startsWith(this.baseUrl)) {
            return false;
        }
        // セッションが無効な場合に返されるタイトルをチェック
        for (const title of invalidTitles) {
            if (responseText.includes(title)) {
                return false;
            }
        }
        return true;
    }
}

const cubicsProviderInstance = new IntegratedCubicsProvider();
export default cubicsProviderInstance;
