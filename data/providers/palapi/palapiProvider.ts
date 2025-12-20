/**
 * PalAPIプロバイダー
 * Chrome拡張機能向けに実装
 */

import { PALAPI_URLS } from "../../../utils/urls";
import { httpClient } from "../../clients/httpClient";

export interface PalAPIProvider {
    /**
     * PalAPIの指定パスにGETリクエストを送り、内容を取得します。
     */
    get(path: string): Promise<string>;

    /**
     * PalAPIにPOSTリクエストを送り、応答本文を取得します。
     */
    post(
        path: string,
        options?: {
            body?: string;
            contentType?: string;
            bearer?: string;
        }
    ): Promise<string>;
}

export class IntegratedPalAPIProvider implements PalAPIProvider {
    protected baseUrl = PALAPI_URLS.base;

    public async get(path: string): Promise<string> {
        const response = await httpClient(`${this.baseUrl}${path}`, {
            clientMode: "palapi",
            method: "GET",
        });
        return await response.text();
    }

    public async post(
        path: string,
        options?: {
            body?: string;
            contentType?: string;
            bearer?: string;
        }
    ): Promise<string> {
        const { body, contentType, bearer } = options || {};

        const headers: HeadersInit = {};

        if (bearer) headers["Authorization"] = `Bearer ${bearer}`;
        if (contentType) headers["Content-Type"] = contentType;

        const response = await httpClient(`${this.baseUrl}${path}`, {
            clientMode: "palapi",
            method: "POST",
            body,
            headers,
        });
        return await response.text();
    }
}

const palAPIProviderInstance = new IntegratedPalAPIProvider();
export default palAPIProviderInstance;
