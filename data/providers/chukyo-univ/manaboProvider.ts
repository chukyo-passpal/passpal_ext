/**
 * Manaboプロバイダー
 * Chrome拡張機能向けに実装
 * Cookie管理はChromeに委任
 */

import { MANABO_URLS } from "../../../utils/urls";
import { httpClient } from "../../clients/httpClient";
import { IntegratedAbstractChukyoProvider, type AbstractChukyoProvider } from "./abstractChukyoProvider";

type CUService = "manabo" | "albo" | "cubics";

export interface ManaboProvider extends AbstractChukyoProvider {
    /**
     * Manaboの指定パスにGETリクエストを送り、内容を取得します。
     */
    get(path: string): Promise<string>;

    /**
     * ManaboにPOSTリクエストを送り、応答本文を取得します。
     */
    post(path: string, contentType: string, body: string): Promise<string>;

    /**
     * 認証情報が有効かどうかを検証します。
     */
    authTest(studentId: string, cuIdPass: string): Promise<boolean>;
}

export class IntegratedManaboProvider extends IntegratedAbstractChukyoProvider implements ManaboProvider {
    protected baseUrl = MANABO_URLS.base;
    protected authEnterPath = "/auth/shibboleth/";
    protected authGoalPath = "/auth/shibboleth/";
    protected serviceName: CUService = "manabo";

    public async get(path: string): Promise<string> {
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
        return await response.text();
    }

    public async post(path: string, contentType: string, body: string): Promise<string> {
        // 認証を確保
        await this.ensureAuthenticated();

        const response = await httpClient(`${this.baseUrl}${path}`, {
            clientMode: "portal",
            method: "POST",
            credentials: "include", // Chromeが自動でCookieを付与
            body,
            headers: {
                "Content-Type": contentType,
                "Accept-Language": "ja",
            },
        });
        return await response.text();
    }

    public async authTest(studentId: string, cuIdPass: string): Promise<boolean> {
        await this.authentication({
            studentId,
            cuIdPass,
        });
        return true;
    }
}

const manaboProviderInstance = new IntegratedManaboProvider();
export default manaboProviderInstance;
